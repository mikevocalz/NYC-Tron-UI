import { readFile, writeFile, mkdir, lstat, realpath, cp } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const pinnedDriverSha256 = 'c2d7bf074d6d2c2c92806d7fe9e85b79fa2fa2ff4a75acd548e3cdc474cc99fc';
export const driverRelativePath = 'node_modules/@legendapp/spark/vendor/node_modules/@legendapp/spark-desktop-app/macos/SparkTestDriver.mm';
const directory = dirname(fileURLToPath(import.meta.url));
const hash = value => createHash('sha256').update(value).digest('hex');
const replaceOnce = (source, before, after) => {
  if (source.split(before).length !== 2) throw new Error('Pinned Spark driver patch context changed');
  return source.replace(before, after);
};
export async function patchDriverTransport(consumer, sourceRevision) {
  const manifest = JSON.parse(await readFile(join(consumer, 'package.json'), 'utf8'));
  const config = JSON.parse(await readFile(join(consumer, 'desktop.config.json'), 'utf8'));
  const sdk = JSON.parse(await readFile(join(consumer, 'node_modules/@legendapp/spark/package.json'), 'utf8'));
  if (manifest.name !== 'nyc-tron-appkit-reference' || !manifest.private || config.macos?.testDriverInRelease !== true || sdk.version !== '0.0.2') throw new Error('Transport diagnostics require the private Spark 0.0.2 native acceptance consumer');
  if (!/^[a-f0-9]{40}$/.test(sourceRevision)) throw new Error('Transport patch requires an exact source revision');
  const target = join(consumer, driverRelativePath);
  if ((await lstat(target)).isSymbolicLink()) throw new Error('Cannot patch a linked Spark test driver');
  if (!(await realpath(target)).startsWith((await realpath(consumer)) + sep)) throw new Error('Spark test driver resolves outside the private consumer');
  const originalBytes = await readFile(target);
  if (hash(originalBytes) !== pinnedDriverSha256) throw new Error('Pinned Spark test driver preimage SHA-256 changed; preparation stopped without patching');
  const original = originalBytes.toString('utf8');
  const begin = original.indexOf('static BOOL SparkSend(int fd, NSDictionary *message) {');
  const end = original.indexOf('\nstatic NSDictionary *SparkFailure', begin);
  if (begin < 0 || end < 0) throw new Error('Missing pinned Spark send function');
  const fragment = await readFile(join(directory, 'driver-transport.inc.mm'), 'utf8');
  let patched = original.slice(0, begin) + fragment.trimEnd() + original.slice(end);
  patched = replaceOnce(patched, 'SparkSend(fd, SparkFailure(@"E_AUTH", @"Authentication failed"));', 'SparkSend(fd, SparkFailure(@"E_AUTH", @"Authentication failed"), nil);');
  patched = replaceOnce(patched, 'SparkSend(fd, @{ @"ok": @YES, @"protocol": @1 })', 'SparkSend(fd, @{ @"ok": @YES, @"protocol": @1 }, nil)');
  patched = replaceOnce(patched, 'NSDictionary *request = SparkParse(line);', 'NSDictionary *request = SparkParse(line);\n    SparkTransportRequestSequence.fetch_add(1);\n    SparkTransportTrace(@"request-received", request ?: @{}, @{ @"parsed": @(request != nil) });');
  patched = replaceOnce(patched, 'SparkSend(fd, @{ @"id": identifier, @"ok": @YES });', 'SparkSend(fd, @{ @"id": identifier, @"ok": @YES }, request);');
  patched = replaceOnce(patched, 'SparkExecute(request, ^(NSDictionary *result) { reply = result; dispatch_semaphore_signal(done); });', 'SparkTransportTrace(@"main-dispatched", request, @{});\n      SparkExecute(request, ^(NSDictionary *result) {\n        SparkTransportTrace(@"main-replied", request, @{ @"dictionary": @([result isKindOfClass:NSDictionary.class]), @"nilResponse": @(result == nil) });\n        reply = result; dispatch_semaphore_signal(done);\n      });');
  patched = replaceOnce(patched, 'SparkSend(fd, message)', 'SparkSend(fd, message, request)');
  const proof = join(consumer, 'acceptance-transport');
  await mkdir(proof); // Fresh preparation only; an existing receipt is not reused.
  const beforeFile = 'SparkTestDriver.original.mm', afterFile = 'SparkTestDriver.patched.mm';
  await writeFile(join(proof, beforeFile), originalBytes);
  await writeFile(join(proof, afterFile), patched);
  const originalFunction = original.slice(begin, end);
  const originalProbeFunction = originalFunction.replace('SparkSend(', 'SparkSendOriginal(');
  await writeFile(join(proof, 'SparkSend.original.inc.mm'), originalProbeFunction);
  await writeFile(join(proof, 'SparkSend.patched.inc.mm'), fragment);
  await cp(join(directory, 'driver-transport-probe.mm'), join(proof, 'probe.mm'));
  await cp(join(consumer, 'node_modules/@legendapp/spark/LICENSE'), join(proof, 'SPARK-LICENSE'));
  const inputs = [];
  for (const file of ['patch-driver-transport.mjs', 'driver-transport.inc.mm', 'driver-transport-probe.mm', 'probe-driver-transport.mjs']) inputs.push({ path: `tooling/macos-appkit/${file}`, sha256: hash(await readFile(join(directory, file))) });
  const receipt = {
    schemaVersion: 1, scope: 'private-native-acceptance-consumer-only', patch: 'nyc-tron-spark-0.0.2-response-transport-v1', sourceRevision,
    packageName: '@legendapp/spark', version: sdk.version, file: driverRelativePath,
    before: { file: beforeFile, sha256: pinnedDriverSha256 }, after: { file: afterFile, sha256: hash(patched) },
    extractedFunctions: { original: { file: 'SparkSend.original.inc.mm', sha256: hash(originalProbeFunction), sourceFunctionSha256: hash(originalFunction) }, patched: { file: 'SparkSend.patched.inc.mm', sha256: hash(fragment) } },
    inputs, patchSha256: hash(JSON.stringify(inputs)),
    boundaries: ['No modification to the shipped NYC-Tron adapter, core archive or Spark distribution archive.', 'No command retry, deadline change, geometry normalization or synthesized successful response.', 'Trace contains fixed command labels, local sequence, stage, byte counts and fixed field-path classifications; no credentials, raw protocol IDs or payload values.'],
  };
  await writeFile(target, patched);
  if (hash(await readFile(target)) !== receipt.after.sha256) throw new Error('Patched Spark driver bytes changed during preparation');
  await writeFile(join(proof, 'patch-receipt.json'), JSON.stringify(receipt, null, 2) + '\n');
  return receipt;
}
