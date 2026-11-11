(function(){
const H=(() => {
function utf8(s) {
 const out=[];
 for(const c of s) {
  let p=c.codePointAt(0); if(p>=0xd800&&p<=0xdfff)p=0xfffd;
  if(p<0x80)out.push(p);
  else if(p<0x800)out.push(0xc0|(p>>>6),0x80|(p&63));
  else if(p<0x10000)out.push(0xe0|(p>>>12),0x80|((p>>>6)&63),0x80|(p&63));
  else out.push(0xf0|(p>>>18),0x80|((p>>>12)&63),0x80|((p>>>6)&63),0x80|(p&63));
 }
 return new Uint8Array(out);
}
function bytes(v){return typeof v==="string"?utf8(v):new Uint8Array(v);}
function padded(v){
 const input=bytes(v),p=new Uint8Array(Math.ceil((input.length+9)/64)*64);
 p.set(input);p[input.length]=0x80;
 let bits=BigInt(input.length)*8n;
 for(let i=0;i<8;i++){p[p.length-1-i]=Number(bits&255n);bits>>=8n;}
 return p;
}
const hex=w=>(w>>>0).toString(16).padStart(8,"0");
const rol=(x,n)=>(x<<n)|(x>>>(32-n));
const ror=(x,n)=>(x>>>n)|(x<<(32-n));
function sha1(v){
 const p=padded(v),w=new Uint32Array(80);
 let a0=0x67452301,b0=0xefcdab89,c0=0x98badcfe,d0=0x10325476,e0=0xc3d2e1f0;
 for(let off=0;off<p.length;off+=64){
  for(let i=0;i<16;i++){const q=off+i*4;w[i]=((p[q]<<24)|(p[q+1]<<16)|(p[q+2]<<8)|p[q+3])>>>0;}
  for(let i=16;i<80;i++)w[i]=rol(w[i-3]^w[i-8]^w[i-14]^w[i-16],1)>>>0;
  let a=a0,b=b0,c=c0,d=d0,e=e0;
  for(let i=0;i<80;i++){
   let f,k;
   if(i<20){f=(b&c)|((~b)&d);k=0x5a827999;}
   else if(i<40){f=b^c^d;k=0x6ed9eba1;}
   else if(i<60){f=(b&c)|(b&d)|(c&d);k=0x8f1bbcdc;}
   else{f=b^c^d;k=0xca62c1d6;}
   const t=(rol(a,5)+f+e+k+w[i])>>>0;
   e=d;d=c;c=rol(b,30)>>>0;b=a;a=t;
  }
  a0=(a0+a)>>>0;b0=(b0+b)>>>0;c0=(c0+c)>>>0;d0=(d0+d)>>>0;e0=(e0+e)>>>0;
 }
 return [a0,b0,c0,d0,e0].map(hex).join("");
}
const K=new Uint32Array([0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2]);
function sha256(v){
 const p=padded(v),w=new Uint32Array(64);
 let state=new Uint32Array([0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19]);
 for(let off=0;off<p.length;off+=64){
  for(let i=0;i<16;i++){const q=off+i*4;w[i]=((p[q]<<24)|(p[q+1]<<16)|(p[q+2]<<8)|p[q+3])>>>0;}
  for(let i=16;i<64;i++){const x=w[i-15],y=w[i-2];w[i]=(w[i-16]+(ror(x,7)^ror(x,18)^(x>>>3))+w[i-7]+(ror(y,17)^ror(y,19)^(y>>>10)))>>>0;}
  let [a,b,c,d,e,f,g,h]=state;
  for(let i=0;i<64;i++){
   const t1=(h+(ror(e,6)^ror(e,11)^ror(e,25))+((e&f)^((~e)&g))+K[i]+w[i])>>>0;
   const t2=((ror(a,2)^ror(a,13)^ror(a,22))+((a&b)^(a&c)^(b&c)))>>>0;
   h=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0;
  }
  const next=[a,b,c,d,e,f,g,h];for(let i=0;i<8;i++)state[i]=(state[i]+next[i])>>>0;
 }
 return Array.from(state).map(hex).join("");
}
function blob(s){const b=utf8(s),head=utf8("blob "+b.length+"\0"),all=new Uint8Array(head.length+b.length);all.set(head);all.set(b,head.length);return sha1(all);}
return {utf8,sha1,sha256,blob};
})();
const IDS={"native":"14c1ce085e65b7b7f638559f7a7ea159e404173c","verifier":"9bb6dab3c9e378c00050ca3a2472c61eafab7b2b","nativePreimage":"ecd9f2235d17c4d3bf6a20143c385d72d0dfea63","verifierPreimage":"f4e630f147d8bb7f5370531e778ed60acf03a802","manifest":"2e786f2056d756f1a8a8793e3b6487531ad89fda"};

function requireTrue(value,message){if(!value)throw new Error(message);}
function same(a,b,message){if(a!==b)throw new Error(message+': '+String(a)+' !== '+String(b));}
function deep(a,b,message){same(JSON.stringify(a),JSON.stringify(b),message);}
function contains(region,frame){
 return frame.x>=region.x && frame.y>=region.y &&
  frame.x+frame.width<=region.x+region.width && frame.y+frame.height<=region.y+region.height;
}
function orderedEdges(above,flipped,cached){
 const preferred=above?(flipped?'min-y':'max-y'):(flipped?'max-y':'min-y');
 const opposite=preferred==='min-y'?'max-y':'min-y';
 const order=[preferred,opposite,'max-x','min-x'];
 if(cached&&order.includes(cached))return [cached,...order.filter(x=>x!==cached)];
 return order;
}
const CACHE_FIELDS=['owner','positioningView','content','popover','lifetime','scope','presentation','above','preferred','anchor','region','size'];
function cacheMatches(a,b){
 return !!a.valid && !!a.scope && !!a.presentation && CACHE_FIELDS.every(k=>JSON.stringify(a[k])===JSON.stringify(b[k]));
}
// This is an independent policy model, not compiled Objective-C/AppKit.
function placementModel(options){
 const result={calls:[],close:0,reject:0,coordinateCalls:0,revealed:false,initialHide:options.alreadyShown?0:1,openerCaptures:options.alreadyShown?0:1,stale:false,last:null};
 const edges=orderedEdges(options.above??true,options.flipped??true,options.cached);
 for(let i=0;i<edges.length;i++){
  if(options.staleBefore===i){result.stale=true;return result;}
  const edge=edges[i]; result.calls.push(edge);
  const frame=options.frames[edge];
  result.last={edge,attempt:i+1};
  if(options.staleAfter===i){result.stale=true;return result;}
  if(frame===null)return result;
  if(contains(options.region,frame)){
   result.coordinateCalls++;
   result.revealed=options.coordinatesReady!==false&&!options.staleAtCoordinates;
   result.last.contained=true;
   return result;
  }
  result.last.contained=false;
 }
 result.close++; result.reject++; return result;
}
function animationModel({body,restore,policyChanged=false}){
 let bodyCompleted=false;
 try { const value=body(); bodyCompleted=true; return value; }
 finally {
  if(!policyChanged){
   if(bodyCompleted)restore();
   else {try{restore();}catch{}}
  }
 }
}
function extractRuntime(source,options={}){
 const begin=source.indexOf('function projectPopoverPresentation(');
 const last=source.indexOf('\nasync function ',source.indexOf("async function shownPopover(")+10);
 requireTrue(begin>=0&&last>begin,'runtime extraction anchors');
 const block=source.slice(begin,last);
 const logs=[],writes=[];let calls=0,milliseconds=0;
 const originalTimeout=options.originalTimeout||new Error('original-timeout-object');
 const fsError=options.fsError;
 const logError=options.logError;
 const write=(path,data,config)=>{
  if(fsError)throw fsError;
  if(config?.flag==='wx'&&writes.some(x=>x.path===path)){const e=new Error('exists');e.code='EEXIST';throw e;}
  writes.push({path,data,config});
 };
 const waitFor=async check=>{
  for(let i=0;i<400;i++){const value=await check();if(value)return value;milliseconds+=50;}
  throw originalTimeout;
 };
 const popover=async owner=>{calls++;return options.response?options.response(calls,owner):response();};
 const assertion={equal:(a,b)=>same(a,b,'native assertion'),ok:(x)=>requireTrue(x,'native assertion')};
 const api=new Function('Buffer','writeFileSync','join','output','revision','console','waitFor','popover','assert','popovers',
  block+'\nreturn {projectPopoverPresentation,projectPopoverResponse,createPopoverObservation,capturePopoverResponse,popoverObservationSummary,reportPopoverFailure,shownPopover};')(
  {byteLength:value=>H.utf8(String(value)).length},write,(...p)=>p.join('/'),'/fixture/evidence','f'.repeat(40),
  {info:value=>{if(logError)throw logError;logs.push(value);}},waitFor,popover,assertion,[]);
 return {...api,logs,writes,originalTimeout,stats:()=>({calls,milliseconds})};
}
function presentation(overrides={}){
 const current={
  controlledVisible:false,closing:false,silentClose:false,hasOwner:true,ownerMatchesCommand:true,
  componentWindowMatchesCommand:true,ownerVisible:true,ownerMiniaturized:false,hasPositioningView:true,
  hasContent:true,hasChildren:true,hasContentWindow:true,hasFabricState:true,scopeTokenPresent:true,
  presentationTokenPresent:true,presentedTokenMatches:false,dismissedTokenMatches:false,rejectedTokenMatches:false,
  preferredEdge:'above',anchor:{x:28,y:359,width:160,height:36},contentSize:{x:0,y:0,width:320,height:300}
 };
 const context={status:'observed',sameGeneration:false,sameLifetime:true,sameIdentity:true,sameScopeToken:false,samePresentationToken:false,sameParameters:false};
 return {schemaVersion:1,status:'observed',current,
  lastBranch:{...context,branch:'content-prerequisites'},
  lastShow:{...context,stage:'returned',attempt:3,edge:'max-x',shownAfterCall:true,contentWindowPresent:true,contained:false,coordinatesReady:null,
   anchor:{x:28,y:359,width:160,height:36},region:{x:0,y:0,width:680,height:592},actualFrame:{x:-65,y:33,width:346,height:326}},
  secret:'PRIVATE_CANARY',...overrides};
}
function response(p=presentation()){
 return {nativePopover:true,shown:false,contentVisible:false,contentIdentity:'fixture-retained-view',
  region:{x:0,y:0,width:680,height:592},presentationObservation:p,secret:'PRIVATE_CANARY'};
}
function readEnvelope(runtime){
 same(runtime.logs.length,1,'one console envelope');
 const value=runtime.logs[0]+'\n';
 requireTrue(value.startsWith('NYCTRON_POPOVER_SHOW_EVIDENCE_BEGIN\n')&&value.endsWith('\nNYCTRON_POPOVER_SHOW_EVIDENCE_END\n'),'complete markers');
 const parsed=JSON.parse(value.split('\n')[1]);
 return {value,parsed,bytes:H.utf8(value).length};
}
return async function reviewPopoverEdgeFallback(input){
 const {native,verifier,nativePreimage,verifierPreimage}=input;
 const manifest=typeof input.manifest==='string'?JSON.parse(input.manifest):input.manifest;
 same(H.blob(native),IDS.native,'native candidate identity');
 same(H.blob(verifier),IDS.verifier,'verifier candidate identity');
 same(H.blob(nativePreimage),IDS.nativePreimage,'native preimage identity');
 same(H.blob(verifierPreimage),IDS.verifierPreimage,'verifier preimage identity');
 if(typeof input.manifest==='string')same(H.blob(input.manifest),IDS.manifest,'manifest identity');
 const groups=[];let assertions=0;
 const check=(value,message)=>{assertions++;requireTrue(value,message);};
 const eq=(a,b,message)=>{assertions++;same(a,b,message);};
 const equal=(a,b,message)=>{assertions++;deep(a,b,message);};
 const group=async(name,fn)=>{await fn();groups.push(name);};

 await group('exact source identities, ten inverses and preserved strict tail',()=>{
  eq(manifest.transforms.length,10,'ten transforms');
  for(const pair of [[nativePreimage,native,'packages/macos-appkit/spark/macos/NYCTronPopover.mm'],[verifierPreimage,verifier,'examples/macos-appkit/spark/verify-native.mjs']]){
   let result=pair[0];const edits=manifest.transforms.filter(x=>x.path===pair[2]);
   for(const edit of edits){eq(result.split(edit.before).length,2,'unique forward '+edit.id);result=result.replace(edit.before,edit.after);}
   eq(result,pair[1],'complete forward');
   for(const edit of [...edits].reverse()){eq(result.split(edit.after).length,2,'unique inverse '+edit.id);result=result.replace(edit.after,edit.before);}
   eq(result,pair[0],'complete inverse');
  }
  const tail='async function shownPopover(';
  eq(verifier.slice(verifier.indexOf(tail)),verifierPreimage.slice(verifierPreimage.indexOf(tail)),'entire polling/report/acceptance runtime suffix unchanged');
  const callbacks='- (void)observePopoverNotifications';
  const recycle='- (void)prepareForRecycle';
  eq(native.slice(native.indexOf(callbacks),native.indexOf(recycle)),nativePreimage.slice(nativePreimage.indexOf(callbacks),nativePreimage.indexOf(recycle)),'observers and dismissal/focus callbacks unchanged');
  for(const phrase of ['NSRectEdge edges[4] = { preferred, opposite, NSMaxXEdge, NSMinXEdge };','index < 4','[content layoutSubtreeIfNeeded]','contained = NSContainsRect(region, actual);','if (coordinatesReady && current()) content.hidden = NO;','if (stale || !current() || !measured) return;']){
   check(native.includes(phrase),'required native boundary '+phrase);
  }
  const stripped=verifier.replace(/^import[\s\S]*?;\n/gm,'').replaceAll('import.meta.url',JSON.stringify('file:///fixture/verify-native.mjs'));
  const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
  new AsyncFunction(stripped);
 });

 await group('bounded preferred and cached edge policy, observed left overflow and synthetic alternatives',()=>{
  equal(orderedEdges(true,true),['min-y','max-y','max-x','min-x'],'above flipped order');
  equal(orderedEdges(true,false),['max-y','min-y','max-x','min-x'],'above unflipped order');
  equal(orderedEdges(false,true),['max-y','min-y','max-x','min-x'],'below flipped order');
  equal(orderedEdges(false,false),['min-y','max-y','max-x','min-x'],'below unflipped order');
  equal(orderedEdges(true,true,'max-x'),['max-x','min-y','max-y','min-x'],'cache preserves remaining preference');
  for(const cached of ['min-x','max-x','min-y','max-y',null])eq(new Set(orderedEdges(true,true,cached)).size,4,'unique bounded edges');
  const region={x:0,y:0,width:680,height:592};
  const actualObserved={x:-65,y:33,width:346,height:326};
  check(!contains(region,actualObserved),'actual fc901 frame fails containment');
  eq(region.x-actualObserved.x,65,'actual left overflow');
  const model=placementModel({region,frames:{'min-y':actualObserved,'max-y':{x:-65,y:395,width:346,height:326},'max-x':{x:188,y:214,width:346,height:326},'min-x':{x:-318,y:214,width:346,height:326}}});
  equal(model.calls,['min-y','max-y','max-x'],'synthetic right candidate selected third');
  eq(model.last.attempt,3,'actual last modeled call');
  eq(model.coordinateCalls,1,'coordinates checked only for contained candidate');
  eq(model.close,0,'no close between candidate edges');
  eq(model.reject,0,'no false rejection');
  eq(model.revealed,true,'contained and ready candidate reveals');
 });

 await group('single terminal rejection, unavailable show and retained composition',()=>{
  const region={x:0,y:0,width:50,height:50},outside={x:-1,y:0,width:60,height:60};
  const frames=Object.fromEntries(['min-y','max-y','max-x','min-x'].map(e=>[e,outside]));
  const failed=placementModel({region,frames});
  eq(failed.calls.length,4,'at most four calls');eq(failed.close,1,'one final close');eq(failed.reject,1,'one final rejection');
  eq(failed.coordinateCalls,0,'no coordinate-ready inference for rejected frame');eq(failed.revealed,false,'no reveal on reject');
  const unavailable=placementModel({region,frames:{'min-y':null}});
  eq(unavailable.calls.length,1,'unavailable window stops probing');eq(unavailable.reject,0,'unavailable does not become containment rejection');
  const visible=placementModel({region,frames:{'min-y':{x:1,y:1,width:20,height:20}},alreadyShown:true});
  eq(visible.initialHide,0,'shown content not re-hidden');eq(visible.openerCaptures,0,'shown content does not replace opener');
  const pending=placementModel({region,frames:{'min-y':{x:1,y:1,width:20,height:20}},coordinatesReady:false});
  eq(pending.revealed,false,'coordinates pending remains hidden');eq(pending.reject,0,'pending is not rejection');
  const method=native.slice(native.indexOf('- (void)synchronizePresentation {'),native.indexOf('- (void)viewDidMoveToWindow'));
  eq((method.match(/\[self closeSilently\]/g)||[]).length,3,'only existing prerequisite/owner close plus one terminal placement close');
  check(!method.includes('firstResponder =')&&!method.includes('makeFirstResponder')&&!method.includes('removeFromSuperview'),'no forced responder or child replacement');
 });

 await group('cache scope invalidation and reentrant operation ownership models',()=>{
  const key={valid:true,owner:1,positioningView:2,content:3,popover:4,lifetime:5,scope:'scope',presentation:'presentation',above:true,preferred:'min-y',anchor:[1,2,3,4],region:[0,0,680,592],size:[320,300]};
  check(cacheMatches(key,key),'exact scoped cache accepted');
  for(const field of CACHE_FIELDS){
   const altered={...key,[field]:typeof key[field]==='boolean'?!key[field]:Array.isArray(key[field])?[9,...key[field]]:'different'};
   check(!cacheMatches(key,altered),'cache invalidated by '+field);
  }
  check(!cacheMatches({...key,scope:''},key),'unknown scope not cached');
  check(!cacheMatches({...key,presentation:''},key),'unknown presentation not cached');
  const region={x:0,y:0,width:100,height:100},frames={'min-y':{x:1,y:1,width:20,height:20}};
  for(const options of [{staleBefore:0},{staleAfter:0},{staleAtCoordinates:true}]){
   const result=placementModel({region,frames,...options});
   eq(result.revealed,false,'stale work cannot reveal');eq(result.reject,0,'stale work cannot reject newer state');
  }
  for(const phrase of ['_placementInvocation == invocation','_placementLifetime == lifetime','_generation == generation','_owner == owner','owner.contentView == positioningView','_content == content && _popover == popover','mark.sequence == _presentationObservationSequence','_presentationShow.mark.sequence == observation.sequence']){
   check(native.includes(phrase),'source ownership guard '+phrase);
  }
  check(native.includes('_placementInvocation = nil; _placementLifetime = nil; _animationPolicyIdentity = nil; _placementCache = {};'),'recycle invalidates private lifetimes');
 });

 await group('animation restoration preserves original errors and newer policy',()=>{
  const original=new Error('original native failure'),secondary=new Error('restore failure');let caught;
  try{animationModel({body:()=>{throw original;},restore:()=>{throw secondary;}});}catch(e){caught=e;}
  eq(caught,original,'restoration cannot replace original failure');
  caught=null;try{animationModel({body:()=>true,restore:()=>{throw secondary;}});}catch(e){caught=e;}
  eq(caught,secondary,'normal restoration failure is not swallowed');
  let restored=0;animationModel({body:()=>true,restore:()=>restored++,policyChanged:true});eq(restored,0,'new policy is not overwritten');
  let value=true;
  animationModel({body:()=>{const prior=value;value=false;animationModel({body:()=>true,restore:()=>{value=false;}});eq(value,false,'nested restore returns outer override');return prior;},restore:()=>{value=true;}});
  eq(value,true,'outer restore recovers original policy');
  check(native.includes('@finally {')&&native.includes('_animationPolicyIdentity == animationPolicy'),'finally and policy guard');
  check(native.includes('NYCTronRestorePopoverAnimation(popover, originalAnimates, !completed);'),'unwinding flag reaches restoration');
  check(native.includes('if (!preserveFailure) { popover.animates = value; return; }'),'normal restoration error remains observable');
  check(native.includes("#if __has_feature(cxx_exceptions)\n  try {\n#endif\n    @try { popover.animates = value; }\n    @catch (NSException *exception) { (void)exception; }\n#if __has_feature(cxx_exceptions)\n  } catch (...) {}\n#endif\n"),'Objective-C cleanup remains unconditional; C++ cleanup is guarded by the compiler feature');
 });

 await group('actual typed edge projection, historical validity and privacy',()=>{
  const api=extractRuntime(verifier);
  const p=presentation();
  const projected=api.projectPopoverPresentation(p);
  eq(projected.lastShow.attempt,3,'actual projection attempt');eq(projected.lastShow.edge,'max-x','actual projection edge');
  eq(projected.lastShow.sameGeneration,false,'historical generation remains false');eq(projected.lastShow.contained,false,'historical rejection remains available');
  for(const attempt of [1,4,0,5,-1,2.5,NaN,Infinity,'1',null,undefined]){
   const next=presentation();next.lastShow.attempt=attempt;
   eq(api.projectPopoverPresentation(next).lastShow.attempt,Number.isSafeInteger(attempt)&&attempt>=1&&attempt<=4?attempt:null,'bounded typed attempt');
  }
  for(const edge of ['min-x','max-x','min-y','max-y','above','PRIVATE_CANARY',null,0]){
   const next=presentation();next.lastShow.edge=edge;
   eq(api.projectPopoverPresentation(next).lastShow.edge,['min-x','max-x','min-y','max-y'].includes(edge)?edge:null,'closed edge labels');
  }
  let getterCalls=0;const accessor=presentation();
  Object.defineProperty(accessor.lastShow,'attempt',{get(){getterCalls++;throw new Error('must not invoke');}});
  Object.defineProperty(accessor.lastShow,'edge',{get(){getterCalls++;throw new Error('must not invoke');}});
  const unknown=api.projectPopoverPresentation(accessor);
  eq(getterCalls,0,'own-data projection does not invoke accessors');eq(unknown.lastShow.attempt,null,'getter attempt unknown');eq(unknown.lastShow.edge,null,'getter edge unknown');
  for(const flag of ['sameLifetime','sameIdentity']){
   const invalid=presentation();invalid.lastShow[flag]=false;
   const result=api.projectPopoverPresentation(invalid);eq(result.lastShow.attempt,null,'stale attempt masked');eq(result.lastShow.edge,null,'stale edge masked');
  }
  check(!JSON.stringify(projected).includes('PRIVATE_CANARY'),'unlisted values omitted');
 });

 let ordinaryMetrics,stressMetrics;
 await group('actual complete envelope budgets and exclusive original record',()=>{
  const api=extractRuntime(verifier),obs=api.createPopoverObservation('document-1');
  const first=presentation();first.current.controlledVisible=true;first.lastShow={status:'unavailable'};
  api.capturePopoverResponse(obs,response(first));
  api.capturePopoverResponse(obs,response());
  for(let i=2;i<375;i++)api.capturePopoverResponse(obs,response());
  api.reportPopoverFailure(obs);
  const ordinary=readEnvelope(api);ordinaryMetrics={bytes:ordinary.bytes,records:ordinary.parsed.selectedRecords};
  check(ordinary.bytes<=8192,'ordinary envelope bounded');eq(ordinary.parsed.returnedResponses,375,'actual returned count');
  eq(ordinary.parsed.omittedResponses,375-ordinary.parsed.records.length,'ordinary omitted count');
  eq(api.writes.length,1,'one original file');eq(api.writes[0].config.flag,'wx','exclusive original');
  check(!ordinary.value.includes('PRIVATE_CANARY'),'console no arbitrary payload');
  api.reportPopoverFailure(obs);
  eq(api.writes.length,1,'duplicate cannot overwrite original');
  const duplicate=JSON.parse(api.logs[1].split('\n')[1]);eq(duplicate.original.writeErrorCode,'EEXIST','duplicate explicit failure');

  const stress=extractRuntime(verifier),many=stress.createPopoverObservation('document-1');
  for(let i=0;i<40;i++){
   const p=presentation();p.current.controlledVisible=i%2===0;
   const huge={x:-Number.MAX_VALUE,y:-Number.MAX_VALUE,width:Number.MAX_VALUE,height:Number.MAX_VALUE};
   p.current.anchor={...huge};p.current.contentSize={...huge};p.lastShow.anchor={...huge};p.lastShow.region={...huge};p.lastShow.actualFrame={...huge};
   p.lastShow.attempt=4;p.lastShow.edge=i%2?'min-x':'max-x';
   const item=response(p);item.region={...huge};item.frame={...huge};
   stress.capturePopoverResponse(many,item);
  }
  stress.reportPopoverFailure(many);
  const out=readEnvelope(stress);stressMetrics={bytes:out.bytes,records:out.parsed.selectedRecords,byteBudgetOmissions:out.parsed.recordsOmittedForByteLimit};
  check(out.bytes<=8192,'stress complete envelope bounded');check(out.parsed.recordsOmittedForByteLimit>0,'stress exercises trimming');
  eq(out.parsed.selectedRecords,out.parsed.records.length,'selected count after trim');
  eq(out.parsed.omittedResponses,40-out.parsed.records.length,'omission count after trim');
  eq(out.parsed.omittedStateChanges,39-out.parsed.records.filter(x=>x.stateChange).length,'state-change omissions after trim');
  eq(out.parsed.records[0].response,1,'first record preserved');eq(out.parsed.records.at(-1).response,40,'last record preserved');
 });

 let polling;
 await group('unchanged strict polling, request count, timeout identity and secondary reporters',async()=>{
  const original=new Error('original strict wait error');
  const api=extractRuntime(verifier,{originalTimeout:original,response:()=>response()});
  let caught;try{await api.shownPopover('document-1');}catch(e){caught=e;}
  eq(caught,original,'same timeout Error object');equal(api.stats(),{calls:400,milliseconds:20000},'same request count and mock deadline');
  polling=api.stats();
  const projected=readEnvelope(api);eq(projected.parsed.returnedResponses,400,'every existing response counted');
  const fsFailure={code:'EACCES',message:'PRIVATE_CANARY'};
  const failedWrite=extractRuntime(verifier,{originalTimeout:original,fsError:fsFailure,response:()=>response()});
  caught=null;try{await failedWrite.shownPopover('document-1');}catch(e){caught=e;}
  eq(caught,original,'write failure preserves primary Error');eq(JSON.parse(failedWrite.logs[0].split('\n')[1]).original.writeErrorCode,'EACCES','allowlisted file error');
  check(!failedWrite.logs[0].includes('PRIVATE_CANARY'),'write message omitted');
  const logFailure=extractRuntime(verifier,{originalTimeout:original,logError:new Error('console failure'),response:()=>response()});
  caught=null;try{await logFailure.shownPopover('document-1');}catch(e){caught=e;}
  eq(caught,original,'console failure preserves primary Error');equal(logFailure.stats(),polling,'no diagnostic RPC');
 });
 return {status:'passed',groups,designCount:groups.length,assertions,polling,ordinaryEnvelope:ordinaryMetrics,stressEnvelope:stressMetrics,
  scope:'V8 source checks, extracted JavaScript with mocked IO, and explicitly non-native placement/ownership/exception policy models; no Node filesystem, Objective-C compilation, AppKit or native placement execution.'};
};

})()
