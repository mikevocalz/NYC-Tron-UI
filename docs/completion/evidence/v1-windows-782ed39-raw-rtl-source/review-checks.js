function reviewRawRtlWitness(input) {
  "use strict";
  const { source, preimage, manifest } = input;
  const groups = [];
  function assert(value, message) { if (!value) throw new Error(message); }
  function unique(text, from, to, label) {
    assert(from.length > 0 && text.split(from).length === 2, "unique edit: " + label);
    return text.replace(from, () => to);
  }
  let rebuilt = preimage;
  for (const edit of manifest.edits) rebuilt = unique(rebuilt, edit.before, edit.after, edit.id);
  assert(rebuilt === source, "complete forward composition");
  for (const edit of [...manifest.edits].reverse()) rebuilt = unique(rebuilt, edit.after, edit.before, edit.id);
  assert(rebuilt === preimage, "complete inverse");
  const actionLines = text => text.split("\n").filter(line =>
    /^\s*(?:Invoke-Button |\[System\.Windows\.Forms\.SendKeys\]::SendWait|\$windowPattern\.SetWindowVisualState|\[NativeWindow\]::SetForegroundWindow|\[NavigationAccessibilityNative\]::SetContrast|\$workspace\.SetFocus|\$settings\.SetFocus)/.test(line));
  assert(JSON.stringify(actionLines(source)) === JSON.stringify(actionLines(preimage)), "native action order");
  const checkpoints = text => text.match(/^\s+Write-NavigationCheckpoint "[^"]+"/gm) || [];
  assert(checkpoints(source).length === 20 && JSON.stringify(checkpoints(source)) === JSON.stringify(checkpoints(preimage)), "20 fixed checkpoints");
  const tail = '} catch {\n  $failure = $_.Exception.Message\n';
  const finalEdit = manifest.edits.find(x => x.id === "emit-secondary-captured-witness-envelope");
  const resultEdit = manifest.edits.find(x => x.id === "retain-bounded-witness-with-original-result");
  let afterTail = source.slice(source.indexOf(tail));
  afterTail = unique(afterTail, finalEdit.after, finalEdit.before, "finally reporter inverse");
  afterTail = unique(afterTail, resultEdit.after, resultEdit.before, "result inverse");
  assert(afterTail === preimage.slice(preimage.indexOf(tail)), "original catch/finally preserved");
  const later = '  $stage = "native-pane-collapse-and-restore"\n';
  let laterAfter = source.slice(source.indexOf(later));
  laterAfter = unique(laterAfter, finalEdit.after, finalEdit.before, "later reporter inverse");
  laterAfter = unique(laterAfter, resultEdit.after, resultEdit.before, "later result inverse");
  assert(laterAfter === preimage.slice(preimage.indexOf(later)), "later drawer/contrast unchanged");
  const physicalLeft = '  if ($paneRect.Right -gt $hostRect.Left+$hostRect.Width/2) { throw "RTL moved the Windows drawer away from the physical left" }';
  assert(source.includes(physicalLeft) && preimage.includes(physicalLeft), "physical-left predicate preserved");
  groups.push({ name: "exact-source-and-preservation", passed: true, edits: manifest.edits.length, checkpointCalls: 20 });

  const helperBegin = source.indexOf("# Read only the retained owner's Raw UIA subtree.");
  const helperEnd = source.indexOf("try {\n  $windowPattern.SetWindowVisualState", helperBegin);
  const helper = source.slice(helperBegin, helperEnd);
  const poll = manifest.edits.find(x => x.id === "poll-retained-icon-physical-geometry").after;
  for (const fragment of [
    "$nodes.Count -ge 512", "$entry.depth -ge 24", "$depth -le 24",
    '$values.Count -eq 0 -or $values.Count -gt 32', "$value -isnot [int]",
    '"duplicate-runtime-id"', '"tree-node-limit"', '"tree-depth-limit"',
    '"toggle-peer-ambiguous"', '"icon-peer-unavailable"', '"icon-peer-ambiguous"',
    '"named-navigation-ancestor-ambiguous"', "GetWindowThreadProcessId", "IsWindow($handle)",
    "$observedHandle -ne $handle", "$current.ProcessId -ne $observedProcessId",
    "$expected.roles[$role].key", "Assert-RawAncestry $binding.roles.icon.element",
    "Assert-RawAncestry $binding.roles.toggle.element", "Assert-RawAncestry $binding.roles.navigation.element",
    "$rect.IsEmpty", "$current.IsOffscreen", "[double]::IsNaN", "[double]::IsInfinity",
    "Same-RawRect $ltrSnapshot[$role] $rtlSnapshot[$role]",
    "$ltrSnapshot.icon.right -le", "$rtlSnapshot.icon.x -ge"
  ]) assert(helper.includes(fragment), "source contract missing: " + fragment);
  assert(helper.indexOf("$counts.complete = $true") < helper.indexOf("$toggleIndices = @()"), "complete walk precedes selection");
  assert(helper.indexOf("$nodes.Count -ge 512") < helper.indexOf("$nodes.Add(@{ element=$child"), "cap before enqueue");
  assert(!helper.includes("RootElement") && !helper.includes("FromPoint") && !helper.includes("FindFirst("), "no broad/fallback discovery");
  assert(!/\.SetFocus\(|\.Width\s*\(|\.HorizontalAlignment\s*\(/.test(helper), "no production layout/input write");
  assert(poll.includes(".AddSeconds(10)") && poll.includes("Start-Sleep -Milliseconds 100"), "same poll settings");
  assert(poll.includes('if ($rtlMirrored) {\n    Bind-RawRtlWitness $rawBinding "final" | Out-Null'), "timeout not masked by final discovery");
  assert(!poll.includes("Find-Id") && !poll.includes("$rawBinding ="), "retained refs, no replacement fallback");
  assert(source.includes("$paneRect = $rtlSnapshot.navigation") && source.includes("$hostRect = $rtlSnapshot.owner"), "one validated frame");
  groups.push({ name: "bounded-source-contracts", passed: true, scope: "static inspection of exact PowerShell source" });

  // Independent data-model checks of the documented selection invariants.
  // This is not a PowerShell interpreter or a UIA provider.
  const clone = value => JSON.parse(JSON.stringify(value));
  function idKey(value) {
    if (!Array.isArray(value) || value.length === 0 || value.length > 32 ||
        value.some(x => !Number.isInteger(x) || x < -2147483648 || x > 2147483647)) throw Error("runtime-id");
    return value.join(",");
  }
  function bind(root, owner, expected = null) {
    if (owner.hwnd === 0 || owner.hwnd !== owner.uiaHwnd || owner.pid <= 0 || owner.pid !== owner.nativePid ||
        owner.pid !== root.pid || owner.thread <= 0 || !owner.isWindow) throw Error("owner");
    const queue = [{ node: root, parent: -1, depth: 0, key: idKey(root.id) }];
    const seen = new Set([queue[0].key]);
    for (let i = 0; i < queue.length; i++) {
      const row = queue[i];
      if (row.node.pid !== owner.pid) throw Error("foreign-process");
      if (row.depth >= 24 && row.node.children.length) throw Error("depth-limit");
      for (const node of row.node.children) {
        if (queue.length >= 512) throw Error("node-limit");
        const key = idKey(node.id);
        if (seen.has(key)) throw Error("duplicate-id");
        seen.add(key);
        queue.push({ node, parent: i, depth: row.depth + 1, key });
      }
    }
    const toggles = queue.map((row,i) => i > 0 && row.node.autoId === "TogglePaneButton" ? i : -1).filter(i => i >= 0);
    if (toggles.length !== 1) throw Error(toggles.length ? "toggle-ambiguous" : "toggle-missing");
    const ti = toggles[0], ancestors = [];
    for (let p = queue[ti].parent; p > 0; p = queue[p].parent) if (queue[p].node.name === "NYC-Tron") ancestors.push(p);
    if (ancestors.length !== 1) throw Error(ancestors.length ? "nav-ambiguous" : "nav-missing");
    const icons = [];
    for (let i=1;i<queue.length;i++) if (queue[i].node.autoId === "Icon") {
      for (let p=queue[i].parent;p>0;p=queue[p].parent) if (p===ti) { icons.push(i); break; }
    }
    if (icons.length !== 1) throw Error(icons.length ? "icon-ambiguous" : "icon-missing");
    const result = { owner: queue[0].key, navigation: queue[ancestors[0]].key, toggle: queue[ti].key, icon: queue[icons[0]].key };
    if (expected) for (const role of Object.keys(result)) if (result[role] !== expected[role]) throw Error("identity-changed");
    return result;
  }
  const node = (id, autoId="", name="", children=[]) => ({ id:[id], pid:42, autoId, name, children });
  const fixture = () => node(1,"","window",[node(2,"","NYC-Tron",[node(3,"TogglePaneButton","",[node(4,"Icon")]),node(5,"","NYC-Tron")])]);
  const owner = { hwnd:1234,uiaHwnd:1234,pid:42,nativePid:42,thread:99,isWindow:true };
  const baseline = bind(fixture(), owner);
  assert(baseline.navigation === "2", "same-name descendant does not replace the actual ancestor");
  const rejects = [];
  function rejected(name, edit, expectedError, ownerEdit) {
    const tree=fixture(), owned={...owner}; edit(tree); if(ownerEdit) ownerEdit(owned);
    let error;try { bind(tree, owned); } catch(e) { error=e.message; }
    assert(error===expectedError, name + " rejected as " + error);
    rejects.push(name);
  }
  rejected("missing-icon", t=>t.children[0].children[0].children=[], "icon-missing");
  rejected("name-is-not-automation-id", t=>{const i=t.children[0].children[0].children[0];i.autoId="";i.name="Icon";}, "icon-missing");
  rejected("icon-outside-toggle", t=>{const nav=t.children[0],toggle=nav.children[0];nav.children.push(toggle.children.pop());}, "icon-missing");
  rejected("ambiguous-icon", t=>t.children[0].children[0].children.push(node(6,"Icon")), "icon-ambiguous");
  rejected("ambiguous-toggle", t=>t.children.push(node(6,"TogglePaneButton")), "toggle-ambiguous");
  rejected("missing-navigation-ancestor", t=>t.children[0].name="", "nav-missing");
  rejected("ambiguous-navigation-ancestor", t=>{const nav=t.children[0];t.children=[node(6,"","NYC-Tron",[nav])];}, "nav-ambiguous");
  rejected("duplicate-id", t=>t.children[0].children[1].id=[4], "duplicate-id");
  rejected("empty-id", t=>t.children[0].id=[], "runtime-id");
  rejected("fractional-id", t=>t.children[0].id=[1.5], "runtime-id");
  rejected("over-limit-id", t=>t.children[0].id=Array(33).fill(3), "runtime-id");
  rejected("foreign-process", t=>t.children[0].children[1].pid=43, "foreign-process");
  rejected("wrong-native-pid", ()=>{}, "owner", o=>o.nativePid=43);
  rejected("wrong-hwnd", ()=>{}, "owner", o=>o.uiaHwnd=1235);
  rejected("destroyed-owner", ()=>{}, "owner", o=>o.isWindow=false);
  rejected("complete-search-node-limit", t=>{for(let i=6;i<=513;i++)t.children.push(node(i));}, "node-limit");
  rejected("complete-search-depth-limit", t=>{let p=t;for(let i=6;i<=30;i++){const n=node(i);p.children.push(n);p=n;}}, "depth-limit");
  const changed=fixture();changed.children[0].children[0].children[0].id=[60];
  let identityError;try{bind(changed,owner,baseline);}catch(e){identityError=e.message;}assert(identityError==="identity-changed","retained identity change");
  const cyclic=fixture();cyclic.children[0].children[0].children.push(cyclic);
  let cycleError;try{bind(cyclic,owner);}catch(e){cycleError=e.message;}assert(cycleError==="duplicate-id","cycle is duplicate identity");
  groups.push({ name:"missing-ambiguous-and-owned-tree-model", passed:true, rejectionCases:rejects.length+2, positiveCases:1 });

  function rect(x,y,width,height) { return { x,y,left:x,top:y,width,height,right:x+width,bottom:y+height,offscreen:false,isEmpty:false }; }
  function valid(r) {
    return r && !r.isEmpty && !r.offscreen && r.width>0 && r.height>0 &&
      ["x","y","width","height","right","bottom"].every(k=>Number.isFinite(r[k]));
  }
  function same(a,b) { return ["x","y","width","height","right","bottom"].every(k=>a[k]===b[k]); }
  function contains(a,b) { return b.x>=a.x && b.y>=a.y && b.right<=a.right && b.bottom<=a.bottom; }
  function frame(side) { return {stable:true,owner:rect(0,0,1000,700),navigation:rect(0,20,320,650),toggle:rect(0,20,320,48),icon:rect(side==="left"?16:288,36,16,16)}; }
  function captureValid(s) { return ["owner","navigation","toggle","icon"].every(k=>valid(s[k])) && contains(s.owner,s.navigation) && contains(s.navigation,s.toggle) && contains(s.toggle,s.icon); }
  function mirror(l,r) {
    return captureValid(l)&&captureValid(r)&&l.stable&&r.stable&&["owner","navigation","toggle"].every(k=>same(l[k],r[k]))&&
      l.icon.width===r.icon.width&&l.icon.height===r.icon.height&&l.icon.y===r.icon.y&&
      l.icon.right<=l.toggle.x+l.toggle.width/2&&r.icon.x>=r.toggle.x+r.toggle.width/2;
  }
  assert(mirror(frame("left"),frame("right")), "fixed full-width button with physically mirrored icon");
  let geometryCases=1;
  for (const [name,mutate] of [
    ["Rect.Empty", s=>s.icon={x:Infinity,y:Infinity,width:-Infinity,height:-Infinity,right:-Infinity,bottom:-Infinity,isEmpty:true,offscreen:false}],
    ["zero",s=>s.icon.width=0],["negative",s=>s.icon.height=-1],["NaN",s=>s.icon.x=NaN],
    ["infinity",s=>s.icon.bottom=Infinity],["offscreen",s=>s.icon.offscreen=true],
    ["outside-toggle",s=>s.icon=rect(400,36,16,16)],
    ["owner-moved",s=>s.owner=rect(1,0,1000,700)],
    ["toggle-width-mutated",s=>s.toggle=rect(272,20,48,48)],
    ["icon-size-mutated",s=>s.icon=rect(288,36,15,16)],
    ["icon-y-mutated",s=>s.icon=rect(288,37,16,16)],
    ["unstable-snapshot",s=>s.stable=false],
    ["still-left",s=>s.icon=rect(16,36,16,16)],
    ["straddles-middle",s=>s.icon=rect(152,36,16,16)]
  ]) {const right=frame("right");mutate(right);assert(!mirror(frame("left"),right),name);geometryCases++;}
  const negativeLeft=frame("left"),negativeRight=frame("right");
  for(const s of [negativeLeft,negativeRight])for(const k of ["owner","navigation","toggle","icon"]){s[k].x-=1200;s[k].left-=1200;s[k].right-=1200;}
  assert(mirror(negativeLeft,negativeRight),"negative physical screen origin");geometryCases++;
  assert(!mirror(frame("right"),frame("right")),"LTR must be left");geometryCases++;
  groups.push({name:"finite-physical-geometry-model",passed:true,cases:geometryCases});

  const reporter=source.slice(source.indexOf("function Write-RawRtlWitnessSummary {"),helperBegin);
  assert(!/\.Current\b|GetRuntimeId\(|GetParent\(|GetFirstChild\(|GetNextSibling\(|NativeWindow|Set-Content/.test(reporter),"reporter has no provider or file IO");
  assert(!/^\s*\$(?:result|failure|rtlWitness)\s*=/m.test(reporter),"reporter does not replace primary state");
  assert(reporter.includes("} catch {}") && reporter.includes("GetByteCount($envelope + [Environment]::NewLine) -gt 8192") && reporter.includes("-le 8192) { Write-Host $envelope }"),"contained exact-byte cap");
  assert(reporter.includes('summaryStatus="output-limit"'),"bounded overflow report");
  const enums = {
    status:["not-started","binding-ltr","waiting-for-right","geometry-observed","failed"],
    phase:["ltr","rtl","rtl-final"],
    role:["tree","owner","navigation","toggle","icon","geometry"],
    code:[...helper.matchAll(/Fail-RawRtlWitness "([^"]+)"/g)].map(m=>m[1]).concat(["provider-read-failed","ltr-icon-not-stably-left","rtl-icon-not-stably-right"])
  };
  const enumValue=(v,list)=>typeof v==="string"&&list.includes(v)?v:null;
  const number=v=>typeof v==="number"&&Number.isFinite(v)?v:null;
  const count=(v,max)=>Number.isInteger(v)&&v>=0&&v<=max?v:null;
  const rid=v=>Array.isArray(v)&&v.length>0&&v.length<=32&&v.every(n=>Number.isInteger(n)&&n>=-2147483648&&n<=2147483647)?v:null;
  const object=v=>v!==null&&typeof v==="object"&&!Array.isArray(v);
  const projectRect=v=>object(v)?Object.fromEntries(["x","y","left","top","width","height","right","bottom"].map(k=>[k,number(v[k])])):null;
  const projectSnapshot=v=>object(v)?{phase:enumValue(v.phase,enums.phase),stable:typeof v.stable==="boolean"?v.stable:null,...Object.fromEntries(["owner","navigation","toggle","icon"].map(k=>[k,projectRect(v[k])]))}:null;
  const projectCounts=v=>object(v)?{complete:typeof v.complete==="boolean"?v.complete:null,...Object.fromEntries(["nodesDiscovered","nodesRead","toggles","icons","namedAncestors"].map(k=>[k,count(v[k],512)])),maxDepth:count(v.maxDepth,24)}:null;
  function project(state,revision) {
    const binding=object(state.binding)?{processId:count(state.binding.processId,2147483647),hwnd:number(state.binding.hwnd),...Object.fromEntries(["ownerRuntimeId","navigationRuntimeId","toggleRuntimeId","iconRuntimeId"].map(k=>[k,rid(state.binding[k])]))}:null;
    return {schemaVersion:1,summaryStatus:"captured-state",sourceRevision:typeof revision==="string"&&/^[a-f0-9]{40}$/.test(revision)?revision:null,method:"uia-raw-icon-physical-screen",status:enumValue(state.status,enums.status),failure:object(state.failure)?{code:enumValue(state.failure.code,enums.code),role:enumValue(state.failure.role,enums.role)}:null,binding,pollAttempts:count(state.pollAttempts,2147483647),limits:{nodes:512,depth:24,runtimeIdIntegers:32,outputUtf8Bytes:8192,pollSeconds:10,pollSleepMilliseconds:100},deadlineScope:"retry-window; synchronous UIA calls are not cancellable by it",byteScope:"UTF-8 envelope including its trailing newline; excludes runner timestamps",discovery:{initial:projectCounts(state.discovery?.initial),final:projectCounts(state.discovery?.final)},ltr:projectSnapshot(state.ltr),latest:projectSnapshot(state.latest)};
  }
  const envelope=json=>"NYCTRON_RTL_WITNESS_BEGIN\r\n"+json+"\r\nNYCTRON_RTL_WITNESS_END\r\n";
  function report(state,revision,{serialize=JSON.stringify,emit=()=>{}}={}) {
    try {
      const projected=project(state,revision);
      let value=envelope(serialize(projected));
      // All projected strings are fixed ASCII labels or a lowercase hex SHA.
      if(value.length>8192)value=envelope(JSON.stringify({schemaVersion:1,summaryStatus:"output-limit",sourceRevision:projected.sourceRevision,outputByteLimit:8192}));
      if(value.length<=8192){emit(value);return value;}return null;
    }catch{return null;}
  }
  const state={status:"geometry-observed",failure:null,pollAttempts:3,binding:{processId:42,hwnd:1234,ownerRuntimeId:[1],navigationRuntimeId:[2],toggleRuntimeId:[3],iconRuntimeId:[4]},discovery:{initial:{nodesDiscovered:5,nodesRead:5,maxDepth:3,toggles:1,icons:1,namedAncestors:1,complete:true},final:{nodesDiscovered:5,nodesRead:5,maxDepth:3,toggles:1,icons:1,namedAncestors:1,complete:true}},ltr:{phase:"ltr",...frame("left")},latest:{phase:"rtl-final",...frame("right")}};
  const ordinary=report(state,"a".repeat(40));assert(ordinary&&ordinary.length<=8192,"ordinary envelope");
  const maximum=clone(state);maximum.pollAttempts=2147483647;
  for(const key of ["ownerRuntimeId","navigationRuntimeId","toggleRuntimeId","iconRuntimeId"])maximum.binding[key]=Array(32).fill(-2147483648);
  for(const phase of ["ltr","latest"])for(const role of ["owner","navigation","toggle","icon"])for(const key of ["x","y","left","top","width","height","right","bottom"])maximum[phase][role][key]=-Number.MAX_VALUE;
  const maxEnvelope=report(maximum,"f".repeat(40));assert(maxEnvelope&&maxEnvelope.length<=8192,"max-width typed envelope");
  const secret="DO_NOT_RETAIN_PROVIDER_TEXT";const hostile=clone(state);hostile.status=secret;hostile.failure={code:secret,role:secret,details:secret};hostile.binding.iconRuntimeId=[secret];hostile.discovery.initial.extra=secret;hostile.latest.phase=secret;hostile.latest.icon.extra=secret;hostile.latest.icon.x=NaN;
  const privateEnvelope=report(hostile,secret);assert(privateEnvelope&&!privateEnvelope.includes(secret),"no arbitrary strings");
  const unknown=project(hostile,secret);assert(unknown.status===null&&unknown.failure.code===null&&unknown.binding.iconRuntimeId===null&&unknown.latest.phase===null&&unknown.latest.icon.x===null,"unknowns remain null");
  assert(report(state,"a".repeat(40),{serialize:()=>"x".repeat(9000)}).includes('"summaryStatus":"output-limit"'),"overflow bounded");
  const primary=new Error("original");const outcome={error:primary,status:"failed"};
  assert(report(state,"a".repeat(40),{serialize:()=>{throw Error("format");}})===null,"format failure secondary");
  assert(report(state,"a".repeat(40),{emit:()=>{throw Error("write");}})===null,"write failure secondary");
  assert(outcome.error===primary&&outcome.status==="failed","primary error unchanged");
  groups.push({name:"typed-secondary-projection-model-and-source",passed:true,ordinaryEnvelopeBytes:ordinary.length,maximumWidthEnvelopeBytes:maxEnvelope.length,capBytes:8192});
  return {schemaVersion:1,groups,scope:"Exact source/inverse review and independent V8 data-model checks only. No PowerShell parsing, .NET/UIA/provider calls, filesystem IO or native execution.",powershellParserExecuted:false,powershellRuntimeExecuted:false,nativeExecuted:false};
}
