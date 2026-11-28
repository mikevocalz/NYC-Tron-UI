import test from 'node:test';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import { chmodSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { collectStartupDiagnostics, preflight, PREFLIGHT_DIAGNOSTIC_DELAY_MS } from './maestro-preflight.mjs';
import { maestroEnvironment, verifyMaestroVersion, diagnosticWatchdogAllowed, stopDiagnosticWatchdog } from './maestro-version.mjs';
import { maestroSessionLimits } from '../native/ui-transport.mjs';

test('shared bounded driver startup setting is used and recorded by exact version verification', () => {
  const output=mkdtempSync(join(tmpdir(),'tron-startup-env-'));
  const maestro=join(output,'cli');
  writeFileSync(maestro,`#!${process.execPath}\nif(process.env.MAESTRO_DRIVER_STARTUP_TIMEOUT!=='180000')process.exit(8);console.log('2.12.1');`);chmodSync(maestro,0o755);
  try {
    assert.equal(maestroEnvironment().MAESTRO_DRIVER_STARTUP_TIMEOUT,String(maestroSessionLimits.driverStartupMs));
    verifyMaestroVersion({maestro,output});
    assert.equal(JSON.parse(readFileSync(join(output,'maestro-version.json'))).settings.MAESTRO_DRIVER_STARTUP_TIMEOUT,'180000');
  } finally {rmSync(output,{recursive:true,force:true});}
});

test('diagnostics expose safe process columns and only the owned Maestro JVM threads', () => {
  const output=mkdtempSync(join(tmpdir(),'tron-startup-diagnostics-')), calls=[];
  try {
    collectStartupDiagnostics({output,parentPid:100,javaHome:'/pinned-java',run:(file,args,options)=>{
      calls.push({file,args,options});
      if(file==='ps')return {status:0,stdout:'PID PPID %CPU %MEM RSS COMM\n101 100 1 1 100 sh\n102 101 1 1 100 java\n200 1 1 1 100 java\n'};
      if(args[0]==='-l')return {status:0,stdout:'102 maestro.cli.AppKt --version\n200 maestro.cli.AppKt SECRET-FOREIGN-ARGS\n300 unrelated.Main SECRET-OTHER-ARGS\n'};
      return {status:0,stdout:'owned Maestro thread stack'};
    }});
    assert.deepEqual(calls.map(c=>[c.file,c.args]),[['ps',['-axo','pid,ppid,pcpu,pmem,rss,comm']],['/pinned-java/bin/jcmd',['-l']],['/pinned-java/bin/jcmd',['102','Thread.print']]]);
    for(const c of calls){assert.equal(c.options.timeout,5000);assert.equal(c.options.killSignal,'SIGKILL');assert.equal(c.options.maxBuffer,65536);}
    const saved=readFileSync(join(output,'jvm-discovery.json'),'utf8');assert.doesNotMatch(saved,/SECRET|--version/);assert.deepEqual(JSON.parse(saved).ownedMaestroPids,[102]);
  } finally {rmSync(output,{recursive:true,force:true});}
});

test('unusable process evidence prevents JVM inspection; retained output is bounded', () => {
  const output=mkdtempSync(join(tmpdir(),'tron-startup-failed-'));let calls=0;
  try {
    collectStartupDiagnostics({output,parentPid:100,javaHome:'/pinned-java',run:()=>{calls++;return {status:null,error:{code:'ETIMEDOUT'},stdout:'x'.repeat(90000)};}});
    assert.equal(calls,1);assert.ok(readFileSync(join(output,'host-processes.json')).length<34000);assert.ok(!existsSync(join(output,'maestro-threads.json')));
  } finally {rmSync(output,{recursive:true,force:true});}
});

test('early successful preflight owns fresh output and terminates its pending watchdog', async () => {
  const root=mkdtempSync(join(tmpdir(),'tron-preflight-')), output=join(root,'proof'), maestro=join(root,'cli');
  const saved=Object.fromEntries(['GITHUB_ACTIONS','RUNNER_TEMP','JAVA_HOME'].map(k=>[k,process.env[k]]));
  Object.assign(process.env,{GITHUB_ACTIONS:'true',RUNNER_TEMP:root,JAVA_HOME:'/pinned-java'});
  writeFileSync(maestro,`#!${process.execPath}\nconsole.log('2.12.1');`);chmodSync(maestro,0o755);
  try {
    assert.equal((await preflight({maestro,output})).status,0);
    assert.ok(existsSync(join(output,'maestro-version.json')));
    assert.ok(!existsSync(join(output,'host-processes.json')));
    await assert.rejects(preflight({maestro,output}),/EEXIST/);
    await assert.rejects(preflight({maestro,output:root+'-foreign'}),/task-owned/);
    writeFileSync(maestro,`#!${process.execPath}\nconsole.log('2.12.10');`);chmodSync(maestro,0o755);
    const failedOutput=join(root,'failed-proof');
    await assert.rejects(preflight({maestro,output:failedOutput}),/exact pinned/);
    const failed=JSON.parse(readFileSync(join(failedOutput,'maestro-version.json')));
    assert.equal(failed.stdout,'2.12.10\n');assert.equal(failed.timeoutMs,60000);
  } finally {
    for(const [k,v] of Object.entries(saved))if(v===undefined)delete process.env[k];else process.env[k]=v;
    rmSync(root,{recursive:true,force:true});
  }
});

test('workflow preflight precedes expensive build and boot while native-proof remains strict', () => {
  assert.equal(PREFLIGHT_DIAGNOSTIC_DELAY_MS,40000);
  const workflow=readFileSync(new URL('../../.github/workflows/kitchen-sink.yml',import.meta.url),'utf8').replace(/\r\n/g,'\n').split('\n  ios:')[1];
  assert.ok(workflow.indexOf('install-maestro.mjs')<workflow.indexOf('maestro-preflight.mjs'));
  assert.ok(workflow.indexOf('maestro-preflight.mjs')<workflow.indexOf('Generate and compile'));
  assert.ok(workflow.indexOf('maestro-preflight.mjs')<workflow.indexOf('prepare-ios.mjs'));
  assert.match(workflow,/if: always\(\)\n        with:\n          name: kitchen-maestro-preflight/);
  const native=readFileSync(new URL('./native-proof.mjs',import.meta.url),'utf8');
  assert.match(native,/verifyMaestroVersion\(\{ maestro, output \}\)/);
  assert.match(native,/timeout: 600000/);
});

test('both early and postboot probes share one guarded watcher and unchanged strict cap', () => {
 const allowed={output:'/owned/proof',platform:'darwin',env:{GITHUB_ACTIONS:'true',RUNNER_TEMP:'/owned',JAVA_HOME:'/pinned'}};
 assert.equal(diagnosticWatchdogAllowed(allowed),true);
 for(const changed of [{platform:'linux'},{output:'/owned-foreign/proof'},{env:{...allowed.env,GITHUB_ACTIONS:'false'}},{env:{...allowed.env,JAVA_HOME:''}}]) assert.equal(diagnosticWatchdogAllowed({...allowed,...changed}),false);
 const source=readFileSync(new URL('./maestro-version.mjs',import.meta.url),'utf8');
 assert.match(source,/const watchdog = startDiagnosticWatchdog\(output\)/);
 assert.match(source,/finally \{ stopDiagnosticWatchdog\(watchdog\); \}/);
 assert.match(source,/timeoutMs = 60000/);
 const wrapper=readFileSync(new URL('./maestro-preflight.mjs',import.meta.url),'utf8');
 assert.doesNotMatch(wrapper,/const watchdog = spawn/);
 assert.match(wrapper,/diagnosticWatchdogAllowed\(\{ output \}\)/);
});

test('cleanup kills an in-flight owned diagnostic child with its watchdog group', async () => {
 const root=mkdtempSync(join(tmpdir(),'tron-watchdog-group-')), heartbeat=join(root,'heartbeat');
 const childScript=`const fs=require('node:fs');setInterval(()=>fs.appendFileSync(${JSON.stringify(heartbeat)},'x'),20);`;
 const parentScript=`require('node:child_process').spawn(process.execPath,['-e',${JSON.stringify(childScript)}],{stdio:'ignore'});setInterval(()=>{},1000);`;
 const watchdog=spawn(process.execPath,['-e',parentScript],{detached:true,stdio:'ignore'});
 const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 try {
  const deadline=Date.now()+3000;
  while((!existsSync(heartbeat)||readFileSync(heartbeat).length<3)&&Date.now()<deadline)await sleep(20);
  assert.ok(existsSync(heartbeat)&&readFileSync(heartbeat).length>=3,'owned diagnostic child really ran before cleanup');
  stopDiagnosticWatchdog(watchdog);
  await sleep(100);const stopped=readFileSync(heartbeat).length;
  await sleep(100);assert.equal(readFileSync(heartbeat).length,stopped,'diagnostic grandchild cannot outlive watchdog cleanup');
 } finally {stopDiagnosticWatchdog(watchdog);rmSync(root,{recursive:true,force:true});}
});

test('cleanup tolerates a watchdog group that already exited and only fails on real errors', () => {
 const fail=code=>()=>{const error=new Error(code);error.code=code;throw error;};
 // macOS returns EPERM from killpg when only the exited (unreaped) leader is left.
 assert.doesNotThrow(()=>stopDiagnosticWatchdog({pid:4242},fail('EPERM')));
 assert.doesNotThrow(()=>stopDiagnosticWatchdog({pid:4242},fail('ESRCH')));
 assert.throws(()=>stopDiagnosticWatchdog({pid:4242},fail('EINVAL')),/EINVAL/);
 const calls=[];stopDiagnosticWatchdog({pid:4242},(pid,signal)=>calls.push([pid,signal]));
 assert.deepEqual(calls,[[-4242,'SIGKILL']]);
 assert.doesNotThrow(()=>stopDiagnosticWatchdog(undefined,fail('EINVAL')));
});

test('invalid watchdog owner cannot inspect processes or broaden ancestry to PID1', () => {
 const output=mkdtempSync(join(tmpdir(),'tron-invalid-watchdog-'));
 try {
  for(const parentPid of [1,0,-1,NaN,1.5]) {
   let called=false;
   assert.throws(()=>collectStartupDiagnostics({output,parentPid,javaHome:'/pinned',run:()=>{called=true;throw new Error('must not inspect');}}),/Invalid owned/);
   assert.equal(called,false);
  }
  assert.ok(!existsSync(join(output,'host-processes.json')));
  const worker=readFileSync(new URL('./maestro-preflight.mjs',import.meta.url),'utf8');
  assert.match(worker,/Number\(value\) <= 1/);
 } finally {rmSync(output,{recursive:true,force:true});}
});
