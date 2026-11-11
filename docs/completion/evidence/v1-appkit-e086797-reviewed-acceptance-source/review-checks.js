/* Focused reproducible close-completion source review.
 * Evaluate this complete script in a fresh V8 isolate to obtain an async function.
 * Await it with {native, verifier, nativePreimage, verifierPreimage}, each the
 * exact decoded UTF-8 blob string pinned below. The two final files include the
 * previously reviewed tooltip correction. README ce95 is unchanged separately.
 * Source invariants are static checks; command/time mocks exercise actual
 * extracted JavaScript. No native observer, Node filesystem or AppKit executes.
 */
(function () {
"use strict";
const utf8 = s=>{const out=[];for(const c of s){const n=c.codePointAt(0);if(n<128)out.push(n);else if(n<2048)out.push(192|(n>>6),128|(n&63));else if(n<65536)out.push(224|(n>>12),128|((n>>6)&63),128|(n&63));else out.push(240|(n>>18),128|((n>>12)&63),128|((n>>6)&63),128|(n&63));}return out;};
const git = function gitBlobSha(text) {
function utf8(value){const out=[];for(const ch of value){const c=ch.codePointAt(0);if(c<128)out.push(c);else if(c<2048)out.push(192|(c>>6),128|(c&63));else if(c<65536)out.push(224|(c>>12),128|((c>>6)&63),128|(c&63));else out.push(240|(c>>18),128|((c>>12)&63),128|((c>>6)&63),128|(c&63));}return out;}
const body=utf8(text), bytes=utf8("blob "+body.length+"\0").concat(body);
const len=bytes.length*8;bytes.push(128);while(bytes.length%64!==56)bytes.push(0);const high=Math.floor(len/4294967296),low=len>>>0;for(let n=3;n>=0;n--)bytes.push((high>>>(n*8))&255);for(let n=3;n>=0;n--)bytes.push((low>>>(n*8))&255);
let h0=0x67452301,h1=0xefcdab89,h2=0x98badcfe,h3=0x10325476,h4=0xc3d2e1f0;
const rol=(v,n)=>((v<<n)|(v>>>(32-n)))>>>0;
for(let o=0;o<bytes.length;o+=64){const w=new Uint32Array(80);for(let j=0;j<16;j++)w[j]=((bytes[o+j*4]<<24)|(bytes[o+j*4+1]<<16)|(bytes[o+j*4+2]<<8)|bytes[o+j*4+3])>>>0;for(let j=16;j<80;j++)w[j]=rol(w[j-3]^w[j-8]^w[j-14]^w[j-16],1);let a=h0,b=h1,c=h2,d=h3,e=h4;for(let j=0;j<80;j++){let f,k;if(j<20){f=(b&c)|((~b)&d);k=0x5a827999;}else if(j<40){f=b^c^d;k=0x6ed9eba1;}else if(j<60){f=(b&c)|(b&d)|(c&d);k=0x8f1bbcdc;}else{f=b^c^d;k=0xca62c1d6;}const temp=(rol(a,5)+f+e+k+w[j])>>>0;e=d;d=c;c=rol(b,30);b=a;a=temp;}h0=(h0+a)>>>0;h1=(h1+b)>>>0;h2=(h2+c)>>>0;h3=(h3+d)>>>0;h4=(h4+e)>>>0;}
return [h0,h1,h2,h3,h4].map(v=>v.toString(16).padStart(8,"0")).join("");
};
const sha = function sha256Bytes(input) {
  const bytes=Array.from(input);
  const byteLength=bytes.length, bitLength=byteLength*8;
  bytes.push(0x80);while(bytes.length%64!==56)bytes.push(0);
  const hi=Math.floor(bitLength/4294967296),lo=bitLength>>>0;
  for(let i=3;i>=0;i--)bytes.push((hi>>>(i*8))&255);
  for(let i=3;i>=0;i--)bytes.push((lo>>>(i*8))&255);
  const k=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
  const h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64);
  const rr=(x,n)=>(x>>>n)|(x<<(32-n));
  for(let o=0;o<bytes.length;o+=64){
    for(let j=0;j<16;j++)w[j]=((bytes[o+j*4]<<24)|(bytes[o+j*4+1]<<16)|(bytes[o+j*4+2]<<8)|bytes[o+j*4+3])>>>0;
    for(let j=16;j<64;j++){const s0=rr(w[j-15],7)^rr(w[j-15],18)^(w[j-15]>>>3),s1=rr(w[j-2],17)^rr(w[j-2],19)^(w[j-2]>>>10);w[j]=(w[j-16]+s0+w[j-7]+s1)>>>0;}
    let [a,b,c,d,e,f,g,hh]=h;
    for(let j=0;j<64;j++){const s1=rr(e,6)^rr(e,11)^rr(e,25),ch=(e&f)^(~e&g),t1=(hh+s1+ch+k[j]+w[j])>>>0,s0=rr(a,2)^rr(a,13)^rr(a,22),maj=(a&b)^(a&c)^(b&c),t2=(s0+maj)>>>0;hh=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0;}
    const v=[a,b,c,d,e,f,g,hh];for(let j=0;j<8;j++)h[j]=(h[j]+v[j])>>>0;
  }
  return {bytes:byteLength,sha256:h.map(x=>x.toString(16).padStart(8,"0")).join("")};
};
const data = {
  "manifests": [
    {
      "key": "native",
      "path": "examples/macos-appkit/spark/acceptance-driver/NYCTronAcceptanceDriver.mm",
      "preimage": "6f119bca252082f18f573370e853bf2e86128934",
      "gitBlob": "06c9494f7448efdc3af93216806411f67191956f",
      "bytes": 75363,
      "sha256": "fb067201b7af0c2dd641b48eea3e324ebce919f0e24a178c706f4c1b41ea3224"
    },
    {
      "key": "verifier",
      "path": "examples/macos-appkit/spark/verify-native.mjs",
      "preimage": "f21e9349b35922ad689a2f6320ed651b5557de64",
      "gitBlob": "d21bf8d24520183a61bf6b82879d78bd6a9d322f",
      "bytes": 114435,
      "sha256": "71714864b1f10d975b640b6bfa09b203509f419d1441469700e32b9074be98ae"
    }
  ],
  "tooltipEdits": {
    "native": [
      {
        "label": "shared private budgets",
        "old": "struct HelpTagDiagnosticBudget { NSUInteger currentDetails = 0, legacyNodes = 0; };",
        "replacement": "struct HelpTagDiagnosticBudget { NSUInteger currentDetails = 0, legacyNodes = 0, privateNodes = 0, privateDetails = 0; };"
      },
      {
        "label": "selected-window private collector",
        "old": "static NSArray<NSString *> *HelpTagStrings(id root, BOOL *truncated, HelpTagDiagnosticBudget *budget, NSDictionary *__autoreleasing *diagnostic) {",
        "replacement": "static BOOL HelpTagFiniteNonemptyRect(NSRect rect) {\n  return isfinite(rect.origin.x) && isfinite(rect.origin.y) && isfinite(rect.size.width) && isfinite(rect.size.height) &&\n    rect.size.width > 0 && rect.size.height > 0;\n}\nstatic NSDictionary *PrivateHelpTagViewState(NSView *view, NSWindow *selectedWindow, BOOL *eligible) {\n  *eligible = NO;\n  NSMutableDictionary *state = [@{ @\"hasWindow\": NSNull.null, @\"sameWindow\": NSNull.null, @\"inContentSubtree\": NSNull.null,\n    @\"windowOnscreen\": NSNull.null, @\"viewVisible\": NSNull.null, @\"boundsNonempty\": NSNull.null,\n    @\"visibleIntersectionNonempty\": NSNull.null, @\"frameNonempty\": NSNull.null,\n    @\"sourceWindowNumber\": NSNull.null, @\"frameInSelectedWindow\": NSNull.null } mutableCopy];\n  NSWindow *actualWindow = view.window;\n  state[@\"hasWindow\"] = @(actualWindow != nil);\n  if (!actualWindow || !selectedWindow) return state;\n  state[@\"sameWindow\"] = @(actualWindow == selectedWindow);\n  if (actualWindow != selectedWindow) return state;\n  state[@\"sourceWindowNumber\"] = @(actualWindow.windowNumber);\n  NSView *content = selectedWindow.contentView;\n  BOOL inContent = content && (view == content || [view isDescendantOf:content]);\n  BOOL onscreen = selectedWindow.visible && !selectedWindow.miniaturized && selectedWindow.alphaValue > 0 &&\n    (selectedWindow.occlusionState & NSWindowOcclusionStateVisible);\n  state[@\"inContentSubtree\"] = @(inContent); state[@\"windowOnscreen\"] = @(onscreen);\n  if (!inContent || !onscreen) return state;\n  BOOL visible = ![view isHiddenOrHasHiddenAncestor];\n  state[@\"viewVisible\"] = @(visible);\n  if (!visible) return state;\n  NSRect bounds = view.bounds, visibleRect = view.visibleRect;\n  BOOL boundsNonempty = HelpTagFiniteNonemptyRect(bounds);\n  state[@\"boundsNonempty\"] = @(boundsNonempty);\n  if (!boundsNonempty || !HelpTagFiniteNonemptyRect(visibleRect)) {\n    state[@\"visibleIntersectionNonempty\"] = @NO; return state;\n  }\n  NSRect intersection = NSIntersectionRect(bounds, visibleRect);\n  BOOL intersectionNonempty = HelpTagFiniteNonemptyRect(intersection);\n  state[@\"visibleIntersectionNonempty\"] = @(intersectionNonempty);\n  if (!intersectionNonempty) return state;\n  NSRect frame = [view convertRect:intersection toView:nil];\n  BOOL frameNonempty = HelpTagFiniteNonemptyRect(frame);\n  state[@\"frameNonempty\"] = @(frameNonempty);\n  if (frameNonempty) state[@\"frameInSelectedWindow\"] = RectDictionary(frame);\n  *eligible = frameNonempty;\n  return state;\n}\nstatic NSDictionary *PrivateHelpTagStrings(NSArray *nodes, NSWindow *selectedWindow,\n    NSMutableOrderedSet<NSString *> *strings, HelpTagDiagnosticBudget *budget) {\n  // This is an OS-private storage observation on the selected visible panel.\n  // The retained 79a evidence establishes nil results only for its tested\n  // getters; the separately reported AX attribute enumeration is uninspected.\n  // No public-AX text or independently verified pixel-content claim follows.\n  const NSUInteger beforeCount = strings.count;\n  NSUInteger considered = 0, classMatches = 0, eligibleViews = 0, postReadEligibleViews = 0;\n  NSUInteger attempted = 0, returned = 0, nilReads = 0, stringValues = 0, attributedValues = 0, otherValues = 0;\n  NSUInteger normalizedNil = 0, empty = 0, nonempty = 0, acceptedValues = 0, unavailable = 0, ineligible = 0, exceptions = 0;\n  @try {\n    NSMutableArray *rows = [NSMutableArray new];\n    for (id node in nodes) {\n      if (budget->privateNodes >= 8) break;\n      budget->privateNodes++; NSUInteger index = considered++;\n      NSMutableDictionary *row = [@{ @\"node\": @(index), @\"read\": @\"unavailable\", @\"stage\": @\"class\",\n        @\"classMatch\": NSNull.null, @\"ivarPresent\": NSNull.null, @\"objectEncoding\": NSNull.null,\n        @\"kind\": NSNull.null, @\"normalized\": NSNull.null, @\"length\": NSNull.null, @\"nonempty\": NSNull.null,\n        @\"exactExpected\": NSNull.null, @\"accepted\": @NO, @\"uniqueAdded\": @NO,\n        @\"before\": NSNull.null, @\"after\": NSNull.null } mutableCopy];\n      NSString *stage = @\"class\";\n      @try {\n        do {\n          Class drawClass = object_getClass(node);\n          BOOL classMatch = [node isKindOfClass:NSView.class] &&\n            [NSStringFromClass(drawClass) isEqualToString:@\"NSCustomToolTipDrawView\"];\n          row[@\"classMatch\"] = @(classMatch);\n          if (!classMatch) break;\n          classMatches++;\n          NSView *view = (NSView *)node;\n          stage = @\"eligibility\";\n          BOOL eligible = NO;\n          row[@\"before\"] = PrivateHelpTagViewState(view, selectedWindow, &eligible);\n          if (!eligible) { row[@\"read\"] = @\"ineligible\"; break; }\n          eligibleViews++;\n          stage = @\"ivar\";\n          Ivar drawText = class_getInstanceVariable(drawClass, \"_attributedString\");\n          row[@\"ivarPresent\"] = @(drawText != NULL);\n          const char *encoding = drawText ? ivar_getTypeEncoding(drawText) : NULL;\n          if (encoding) row[@\"objectEncoding\"] = @(encoding[0] == '@');\n          if (!encoding || encoding[0] != '@') break;\n          stage = @\"read\"; attempted++;\n          id drawn = object_getIvar(node, drawText);\n          returned++;\n          NSString *text = nil; NSUInteger length = 0;\n          row[@\"read\"] = drawn ? @\"captured\" : @\"nil\";\n          if (!drawn) nilReads++;\n          else {\n            stage = @\"normalize\";\n            BOOL attributed = [drawn isKindOfClass:NSAttributedString.class];\n            BOOL plain = !attributed && [drawn isKindOfClass:NSString.class];\n            row[@\"kind\"] = attributed ? @\"attributed-string\" : plain ? @\"string\" : @\"other\";\n            if (attributed) attributedValues++; else if (plain) stringValues++; else otherValues++;\n            text = attributed ? [drawn string] : plain ? drawn : nil;\n            row[@\"normalized\"] = @(text != nil);\n            if (!text) normalizedNil++;\n            else {\n              length = text.length;\n              row[@\"length\"] = @(length); row[@\"nonempty\"] = @(length > 0);\n              row[@\"exactExpected\"] = @((length == 37) && [text isEqualToString:@\"Save this document's local checkpoint\"]);\n              if (length) nonempty++; else empty++;\n            }\n          }\n          stage = @\"recheck\";\n          BOOL eligibleAfter = NO;\n          row[@\"after\"] = PrivateHelpTagViewState(view, selectedWindow, &eligibleAfter);\n          if (!eligibleAfter) { row[@\"read\"] = @\"ineligible\"; break; }\n          postReadEligibleViews++;\n          if (text && length) {\n            stage = @\"retain\";\n            NSUInteger prior = strings.count;\n            [strings addObject:text];\n            acceptedValues++; row[@\"accepted\"] = @YES; row[@\"uniqueAdded\"] = @(strings.count > prior);\n          }\n          stage = @\"complete\";\n        } while (NO);\n      } @catch (__unused NSException *exception) {\n        exceptions++; row[@\"read\"] = @\"exception\";\n      }\n      row[@\"stage\"] = stage;\n      if ([row[@\"read\"] isEqual:@\"unavailable\"]) unavailable++;\n      else if ([row[@\"read\"] isEqual:@\"ineligible\"]) ineligible++;\n      if (budget->privateDetails < 4) { [rows addObject:row]; budget->privateDetails++; }\n    }\n    return @{ @\"schemaVersion\": @1, @\"status\": @\"observed\", @\"source\": @\"private-appkit-draw-view\",\n      @\"nodeLimit\": @8, @\"detailLimit\": @4, @\"nodesConsidered\": @(considered), @\"nodesOmitted\": @(nodes.count - considered),\n      @\"classMatches\": @(classMatches), @\"eligibleViews\": @(eligibleViews), @\"postReadEligibleViews\": @(postReadEligibleViews),\n      @\"readAttempts\": @(attempted), @\"returned\": @(returned), @\"nil\": @(nilReads), @\"string\": @(stringValues),\n      @\"attributedString\": @(attributedValues), @\"other\": @(otherValues), @\"normalizedNil\": @(normalizedNil),\n      @\"empty\": @(empty), @\"nonempty\": @(nonempty), @\"acceptedValues\": @(acceptedValues),\n      @\"uniqueStringsAdded\": @(strings.count - beforeCount), @\"unavailable\": @(unavailable), @\"ineligible\": @(ineligible),\n      @\"exceptions\": @(exceptions), @\"detailsOmitted\": @(considered - rows.count), @\"rows\": rows };\n  } @catch (__unused NSException *exception) {\n    // Added observations cannot replace the original public collector's result\n    // or exception behavior. Missing private diagnostics remain unknown.\n    return nil;\n  }\n}\nstatic NSArray<NSString *> *HelpTagStrings(id root, NSWindow *selectedWindow, BOOL *truncated, HelpTagDiagnosticBudget *budget, NSDictionary *__autoreleasing *diagnostic) {"
      },
      {
        "label": "remove interleaved private read",
        "old": "    // The system tooltip panel exposes no text through any accessibility\n    // attribute: its AXHelpTag element has only role, frame, position, size and\n    // parent (checked with AXUIElementCopyAttributeNames). The text lives in the\n    // private NSCustomToolTipDrawView, which this in-process driver reads from its\n    // _attributedString ivar. This is a private-layout read, not public API; if\n    // AppKit renames it no string is collected and the exact-match check fails.\n    if ([node isKindOfClass:NSView.class] && [NSStringFromClass([node class]) isEqualToString:@\"NSCustomToolTipDrawView\"]) {\n      Ivar drawText = class_getInstanceVariable(object_getClass(node), \"_attributedString\");\n      const char *encoding = drawText ? ivar_getTypeEncoding(drawText) : NULL;\n      if (encoding && encoding[0] == '@') {\n        id drawn = object_getIvar(node, drawText);\n        NSString *drawnText = [drawn isKindOfClass:NSAttributedString.class] ? [drawn string] : ([drawn isKindOfClass:NSString.class] ? drawn : nil);\n        if (drawnText.length) [strings addObject:drawnText];\n      }\n    }\n",
        "replacement": ""
      },
      {
        "label": "public count before private pass",
        "old": "  NSArray<NSString *> *result = strings.array;\n  // Every original read",
        "replacement": "  const NSUInteger publicRetainedStrings = strings.count;\n  NSDictionary *privateDiagnostic = PrivateHelpTagStrings(nodes, selectedWindow, strings, budget);\n  NSArray<NSString *> *result = strings.array;\n  // Every original read"
      },
      {
        "label": "separate aggregate provenance",
        "old": "    *diagnostic = @{ @\"schemaVersion\": @1, @\"status\": @\"observed\", @\"nodes\": @(nodeIndex),",
        "replacement": "    *diagnostic = @{ @\"schemaVersion\": @1, @\"status\": @\"observed\", @\"nodes\": @(nodeIndex),\n      @\"combinedRetainedStrings\": @(result.count), @\"private\": privateDiagnostic ?: NSNull.null,"
      },
      {
        "label": "public retained count",
        "old": "@\"empty\": @(empty), @\"nonempty\": @(nonempty), @\"retainedStrings\": @(result.count), @\"detailLimit\": @16,",
        "replacement": "@\"empty\": @(empty), @\"nonempty\": @(nonempty), @\"retainedStrings\": @(publicRetainedStrings), @\"detailLimit\": @16,"
      },
      {
        "label": "selected window argument",
        "old": "HelpTagStrings(node, &truncated, &diagnosticBudget, &textDiagnostic)",
        "replacement": "HelpTagStrings(node, window, &truncated, &diagnosticBudget, &textDiagnostic)"
      }
    ],
    "verifier": [
      {
        "label": "typed private provenance",
        "old": "    return { schemaVersion: 1, status: 'observed', nodes: countValue(value.nodes),\n      current: { ...counts(value.current, ['fieldSlots', 'calls', 'unavailable', 'nil', 'captured', 'string', 'attributedString', 'other', 'normalizedNil', 'empty', 'nonempty', 'retainedStrings', 'detailLimit', 'detailsOmitted']),\n        rows: rows(value.current?.rows, false) },\n      legacy: { ...counts(value.legacy, ['nodeLimit', 'nodesConsidered', 'supportedReadsAttempted', 'returned', 'thrown', 'selectorExceptions', 'metadataExceptions', 'nodesOmitted']),\n        diagnosticOnly: boolean(value.legacy?.diagnosticOnly), rows: rows(value.legacy?.rows, true) } };\n",
        "replacement": "    const privateValue = isRecord(value.private) && value.private.schemaVersion === 1 && value.private.status === 'observed' &&\n      value.private.source === 'private-appkit-draw-view' ? value.private : null;\n    const privateView = value => isRecord(value) ? {\n      hasWindow: boolean(value.hasWindow), sameWindow: boolean(value.sameWindow), inContentSubtree: boolean(value.inContentSubtree),\n      windowOnscreen: boolean(value.windowOnscreen), viewVisible: boolean(value.viewVisible), boundsNonempty: boolean(value.boundsNonempty),\n      visibleIntersectionNonempty: boolean(value.visibleIntersectionNonempty), frameNonempty: boolean(value.frameNonempty),\n      sourceWindowNumber: countValue(value.sourceWindowNumber), frameInSelectedWindow: frame(value.frameInSelectedWindow)\n    } : null;\n    const privateRows = value => {\n      if (!Array.isArray(value)) return { total: null, omitted: null, records: null };\n      const selected = value.slice(0, budget.private); budget.private -= selected.length;\n      return { total: value.length, omitted: value.length - selected.length, records: selected.map(row => {\n        if (!isRecord(row)) return null;\n        const read = allowed(row.read, ['unavailable', 'ineligible', 'nil', 'captured', 'exception']);\n        const normalized = read === 'captured' ? boolean(row.normalized) : null;\n        return { node: countValue(row.node), read, stage: allowed(row.stage, ['class', 'eligibility', 'ivar', 'read', 'normalize', 'recheck', 'retain', 'complete']),\n          classMatch: boolean(row.classMatch), ivarPresent: boolean(row.ivarPresent), objectEncoding: boolean(row.objectEncoding),\n          kind: read === 'captured' ? allowed(row.kind, ['string', 'attributed-string', 'other']) : null,\n          normalized, length: normalized === true ? countValue(row.length) : null,\n          nonempty: normalized === true ? boolean(row.nonempty) : null,\n          exactExpected: normalized === true ? boolean(row.exactExpected) : null,\n          accepted: boolean(row.accepted), uniqueAdded: boolean(row.uniqueAdded),\n          before: privateView(row.before), after: privateView(row.after) };\n      }) };\n    };\n    return { schemaVersion: 1, status: 'observed', nodes: countValue(value.nodes), combinedRetainedStrings: countValue(value.combinedRetainedStrings),\n      current: { ...counts(value.current, ['fieldSlots', 'calls', 'unavailable', 'nil', 'captured', 'string', 'attributedString', 'other', 'normalizedNil', 'empty', 'nonempty', 'retainedStrings', 'detailLimit', 'detailsOmitted']),\n        rows: rows(value.current?.rows, false) },\n      legacy: { ...counts(value.legacy, ['nodeLimit', 'nodesConsidered', 'supportedReadsAttempted', 'returned', 'thrown', 'selectorExceptions', 'metadataExceptions', 'nodesOmitted']),\n        diagnosticOnly: boolean(value.legacy?.diagnosticOnly), rows: rows(value.legacy?.rows, true) },\n      private: { schemaVersion: privateValue ? 1 : null, status: privateValue ? 'observed' : null, source: privateValue ? 'private-appkit-draw-view' : null,\n        ...counts(privateValue, ['nodeLimit', 'detailLimit', 'nodesConsidered', 'nodesOmitted', 'classMatches', 'eligibleViews', 'postReadEligibleViews',\n          'readAttempts', 'returned', 'nil', 'string', 'attributedString', 'other', 'normalizedNil', 'empty', 'nonempty',\n          'acceptedValues', 'uniqueStringsAdded', 'unavailable', 'ineligible', 'exceptions', 'detailsOmitted']),\n        rows: privateRows(privateValue?.rows) } };\n"
      },
      {
        "label": "private row cap",
        "old": "    const detailBudget = { current: 16, legacy: 8 };",
        "replacement": "    const detailBudget = { current: 16, legacy: 8, private: 4 };"
      },
      {
        "label": "shown and final observations",
        "old": "    baseline: observation(evidence?.baseline, false), observationSource: latest, observation: observation(latest ? evidence[latest] : null, true)",
        "replacement": "    baseline: observation(evidence?.baseline, false), shownObservation: observation(evidence?.shown?.observation, true),\n    observationSource: latest, observation: observation(latest ? evidence[latest] : null, true)"
      },
      {
        "label": "single bounded envelope trims both snapshots",
        "old": "    if (Buffer.byteLength(message, 'utf8') > logByteLimit && report.summary?.observation) {\n      // Drop only new detail rows first. Keep their omission counts, aggregate\n      // observations and the original latest tooltip predicates visible.\n      for (const tag of report.summary.observation.helpTags.records ?? []) {\n        for (const kind of ['current', 'legacy']) {\n          const rows = tag.textReadDiagnostic?.[kind]?.rows;\n          if (Array.isArray(rows?.records) && rows.records.length) {\n            rows.omitted += rows.records.length; rows.records = [];\n            report.diagnosticRowsOmittedForByteLimit = true;\n          }\n        }\n      }\n      message = begin + '\\n' + JSON.stringify(report) + '\\n' + end + '\\n';\n    }\n",
        "replacement": "    if (Buffer.byteLength(message, 'utf8') > logByteLimit && (report.summary?.observation || report.summary?.shownObservation)) {\n      // Drop detail rows from both snapshots first; preserve their omission\n      // counts, public/private totals and shown/final tooltip predicates.\n      for (const snapshot of [report.summary.shownObservation, report.summary.observation]) {\n        for (const tag of snapshot?.helpTags.records ?? []) {\n          for (const kind of ['current', 'legacy', 'private']) {\n            const rows = tag.textReadDiagnostic?.[kind]?.rows;\n            if (Array.isArray(rows?.records) && rows.records.length) {\n              rows.omitted += rows.records.length; rows.records = [];\n              report.diagnosticRowsOmittedForByteLimit = true;\n            }\n          }\n        }\n      }\n      message = begin + '\\n' + JSON.stringify(report) + '\\n' + end + '\\n';\n    }\n"
      },
      {
        "label": "qualified evidence boundary",
        "old": "    boundary: 'CGEvent-posted mouse movement followed by NSApp.windows and NSAccessibility help-tag discovery, with the presented text read in process from the private NSCustomToolTipDrawView of the tooltip panel _attributedString (no public accessibility attribute carries it); no physical mouse hardware or human gesture.',",
        "replacement": "    boundary: 'CGEvent-posted mouse movement followed by NSApp.windows and NSAccessibility help-tag discovery, with public text collection and separately counted private draw-view storage reads bound to the selected visible panel; private layout is host/version dependent and does not establish public AX text or independently verified pixels; no physical mouse hardware or human gesture.',"
      }
    ]
  },
  "witnessEdits": {
    "native": [
      {
        "label": "private close observation helper",
        "old": "static NSMenu *TrackedContextMenu;\n",
        "replacement": "\n// Private acceptance observation only. No delegate or focus behavior is changed.\n@interface NYCTronAcceptancePopoverCloseObservation : NSObject {\n@public\n  NSUInteger sequence, willCloseCount, didCloseCount;\n  __weak NSWindow *owner;\n  __weak NYCTronPopoverComponentView *component;\n  __weak NSPopover *popover;\n  id willObserver, didObserver;\n  NSNumber *willCloseOnMain, *didCloseOnMain;\n  BOOL armedWhileShown, postDidCloseMainTurnObserved, expired, released;\n  BOOL unavailable, threadViolation, identityEnded, overflowed;\n}\n- (void)removeObservers;\n- (void)releaseObservation;\n- (BOOL)matchesLiveObjects;\n- (void)observe:(NSNotification *)notification didClose:(BOOL)didClose;\n@end\nstatic NYCTronAcceptancePopoverCloseObservation *PopoverCloseObservation;\nstatic NSUInteger PopoverCloseArms;\n@implementation NYCTronAcceptancePopoverCloseObservation\n- (void)removeObservers {\n  if (willObserver) { [NSNotificationCenter.defaultCenter removeObserver:willObserver]; willObserver = nil; }\n  if (didObserver) { [NSNotificationCenter.defaultCenter removeObserver:didObserver]; didObserver = nil; }\n}\n- (void)releaseObservation { released = YES; [self removeObservers]; }\n- (BOOL)matchesLiveObjects {\n  NSWindow *currentOwner = owner;\n  NYCTronPopoverComponentView *currentComponent = component;\n  NSPopover *currentPopover = popover;\n  return currentOwner && currentComponent && currentPopover &&\n    currentComponent.window == currentOwner && currentComponent.nativePopover == currentPopover;\n}\n- (void)observe:(NSNotification *)notification didClose:(BOOL)didClose {\n  __weak NYCTronAcceptancePopoverCloseObservation *weakObservation = self;\n  const NSUInteger observedSequence = sequence;\n  if (!NSThread.isMainThread) {\n    dispatch_async(dispatch_get_main_queue(), ^{\n      NYCTronAcceptancePopoverCloseObservation *value = weakObservation;\n      if (value && value == PopoverCloseObservation && value->sequence == observedSequence && !value->released) {\n        value->threadViolation = YES;\n        if (didClose) value->didCloseOnMain = @NO; else value->willCloseOnMain = @NO;\n        [value removeObservers];\n      }\n    });\n    return;\n  }\n  if (self != PopoverCloseObservation || released || expired || unavailable || threadViolation) return;\n  @try {\n    if (notification.object != popover || ![self matchesLiveObjects]) {\n      identityEnded = YES; [self removeObservers]; return;\n    }\n    if (!didClose) {\n      willCloseOnMain = @YES;\n      if (willCloseCount < 8) willCloseCount++; else overflowed = YES;\n      return;\n    }\n    didCloseOnMain = @YES;\n    if (didCloseCount < 8) didCloseCount++; else overflowed = YES;\n    [self removeObservers];\n    // Observer entry does not establish the delegate's focus result. Require\n    // a later owned main-queue turn, then keep the exact focus checks.\n    dispatch_async(dispatch_get_main_queue(), ^{\n      NYCTronAcceptancePopoverCloseObservation *value = weakObservation;\n      if (!value || value != PopoverCloseObservation || value->sequence != observedSequence ||\n          value->released || value->expired || value->unavailable || value->threadViolation) return;\n      @try {\n        if ([value matchesLiveObjects] && !value->popover.shown) value->postDidCloseMainTurnObserved = YES;\n        else value->identityEnded = YES;\n      } @catch (__unused NSException *exception) { value->unavailable = YES; }\n    });\n  } @catch (__unused NSException *exception) {\n    unavailable = YES; [self removeObservers];\n  }\n}\n- (void)dealloc { [self removeObservers]; }\n@end\nstatic void ArmPopoverCloseObservation(NSWindow *owner, NYCTronPopoverComponentView *component, NSPopover *popover) {\n  [PopoverCloseObservation releaseObservation]; PopoverCloseObservation = nil;\n  // The verifier arms only its Escape and newer-window-focus scenarios.\n  if (PopoverCloseArms >= 2) return;\n  NYCTronAcceptancePopoverCloseObservation *value = [NYCTronAcceptancePopoverCloseObservation new];\n  value->sequence = ++PopoverCloseArms; value->owner = owner; value->component = component; value->popover = popover;\n  PopoverCloseObservation = value;\n  @try {\n    NSView *content = popover.contentViewController.view;\n    if (![value matchesLiveObjects] || !popover.shown || !content || content.hidden) {\n      value->unavailable = YES; return;\n    }\n    value->armedWhileShown = YES;\n    __weak NYCTronAcceptancePopoverCloseObservation *weakObservation = value;\n    value->willObserver = [NSNotificationCenter.defaultCenter addObserverForName:NSPopoverWillCloseNotification object:popover queue:nil usingBlock:^(NSNotification *notification) {\n      [weakObservation observe:notification didClose:NO];\n    }];\n    value->didObserver = [NSNotificationCenter.defaultCenter addObserverForName:NSPopoverDidCloseNotification object:popover queue:nil usingBlock:^(NSNotification *notification) {\n      [weakObservation observe:notification didClose:YES];\n    }];\n    if (!value->willObserver || !value->didObserver) { value->unavailable = YES; [value removeObservers]; return; }\n    const NSUInteger observedSequence = value->sequence;\n    // Cleanup only: this expiry never supplies completion or extends a wait.\n    // No native object is retained by this delayed block.\n    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, 60 * NSEC_PER_SEC), dispatch_get_main_queue(), ^{\n      NYCTronAcceptancePopoverCloseObservation *current = weakObservation;\n      if (current && current == PopoverCloseObservation && current->sequence == observedSequence &&\n          !current->released && !current->postDidCloseMainTurnObserved) {\n        current->expired = YES; [current removeObservers];\n      }\n    });\n  } @catch (__unused NSException *exception) { value->unavailable = YES; [value removeObservers]; }\n}\nstatic NSDictionary *PopoverCloseObservationState(NSWindow *owner, NYCTronPopoverComponentView *component, NSPopover *popover) {\n  @try {\n    NYCTronAcceptancePopoverCloseObservation *value = PopoverCloseObservation;\n    if (!value) return @{ @\"schemaVersion\": @1, @\"status\": @\"unavailable\", @\"sequence\": NSNull.null };\n    NSWindow *observedOwner = value->owner;\n    NYCTronPopoverComponentView *observedComponent = value->component;\n    NSPopover *observedPopover = value->popover;\n    id identity = observedOwner && observedComponent && observedPopover ?\n      @(observedOwner == owner && observedComponent == component && observedPopover == popover && [value matchesLiveObjects]) : NSNull.null;\n    NSString *status = value->unavailable || value->threadViolation || value->identityEnded ? @\"unavailable\" :\n      value->expired ? @\"expired\" : value->released ? @\"released\" :\n      value->postDidCloseMainTurnObserved ? @\"completed\" : @\"armed\";\n    return @{ @\"schemaVersion\": @1, @\"status\": status, @\"sequence\": @(value->sequence),\n      @\"identityMatches\": identity, @\"armedWhileShown\": @(value->armedWhileShown),\n      @\"willCloseCount\": @(value->willCloseCount), @\"didCloseCount\": @(value->didCloseCount),\n      @\"willCloseOnMain\": value->willCloseOnMain ?: NSNull.null, @\"didCloseOnMain\": value->didCloseOnMain ?: NSNull.null,\n      @\"postDidCloseMainTurnObserved\": @(value->postDidCloseMainTurnObserved),\n      @\"expired\": @(value->expired), @\"released\": @(value->released),\n      @\"threadViolation\": @(value->threadViolation), @\"overflowed\": @(value->overflowed) };\n  } @catch (__unused NSException *exception) {\n    return @{ @\"schemaVersion\": @1, @\"status\": @\"unavailable\", @\"sequence\": NSNull.null };\n  }\n}\n\nstatic NSMenu *TrackedContextMenu;\n"
      },
      {
        "label": "arm before any close action",
        "old": "      NSView *content = popover.contentViewController.view;\n      NSMutableDictionary *closeTrace = nil;\n",
        "replacement": "      NSView *content = popover.contentViewController.view;\n      if ([request[@\"action\"] isEqual:@\"arm-close-observation\"]) ArmPopoverCloseObservation(owner, component, popover);\n      NSMutableDictionary *closeTrace = nil;\n"
      },
      {
        "label": "fixed close observation response",
        "old": "      if (closeTrace) result[@\"closeTrace\"] = closeTrace;\n",
        "replacement": "      if (closeTrace) result[@\"closeTrace\"] = closeTrace;\n      result[@\"closeObservation\"] = PopoverCloseObservationState(owner, component, popover);\n"
      }
    ],
    "verifier": [
      {
        "label": "arm and completion helpers",
        "old": "async function shownPopover(window = 'main') {\n",
        "replacement": "async function armPopoverCloseObservation(window, shown) {\n  const armed = await popover(window, 'arm-close-observation');\n  assert.equal(armed.nativePopover, true);\n  assert.equal(armed.shown, true);\n  assert.equal(armed.contentVisible, true);\n  assert.ok(typeof shown?.contentIdentity === 'string' && shown.contentIdentity.length > 0 &&\n    typeof armed.contentIdentity === 'string' && armed.contentIdentity.length > 0, 'Close observation requires nonempty native content identities');\n  assert.equal(armed.contentIdentity, shown.contentIdentity, 'Close observation must bind the same shown popover content');\n  const observation = armed.closeObservation;\n  assert.equal(observation?.schemaVersion, 1);\n  assert.equal(observation.status, 'armed');\n  assert.equal(observation.identityMatches, true);\n  assert.equal(observation.armedWhileShown, true);\n  assert.ok(Number.isSafeInteger(observation.sequence) && observation.sequence >= 1 && observation.sequence <= 2);\n  return { sequence: observation.sequence, contentIdentity: armed.contentIdentity };\n}\nfunction popoverCloseCompleted(current, armed) {\n  const observation = current?.closeObservation;\n  return typeof armed?.contentIdentity === 'string' && armed.contentIdentity.length > 0 &&\n    typeof current?.contentIdentity === 'string' && current.contentIdentity.length > 0 &&\n    Number.isSafeInteger(armed.sequence) && armed.sequence >= 1 && armed.sequence <= 2 &&\n    current?.nativePopover === true && current.shown === false &&\n    current.contentIdentity === armed.contentIdentity &&\n    observation?.schemaVersion === 1 && observation.status === 'completed' &&\n    observation.sequence === armed.sequence && observation.identityMatches === true &&\n    observation.armedWhileShown === true && Number.isSafeInteger(observation.didCloseCount) &&\n    observation.didCloseCount > 0 && observation.didCloseCount <= 8 && observation.didCloseOnMain === true &&\n    observation.postDidCloseMainTurnObserved === true && observation.expired === false &&\n    observation.released === false && observation.threadViolation === false && observation.overflowed === false;\n}\nasync function shownPopover(window = 'main') {\n"
      },
      {
        "label": "arm first shown presentation before Escape",
        "old": "  await popover('main', 'escape'); await status('Native inspector dismissed');\n  await waitFor(async () => !(await popover()).shown, 'native Escape dismissal');\n",
        "replacement": "  const escapeCloseObservation = await armPopoverCloseObservation('main', resizedPopover);\n  await popover('main', 'escape'); await status('Native inspector dismissed');\n  await waitFor(async () => popoverCloseCompleted(await popover(), escapeCloseObservation), 'native Escape dismissal');\n"
      },
      {
        "label": "arm main before focus change and wait matching close completion",
        "old": "  await control('inspect-main', 'press'); await shownPopover();\n  await show('document-1');\n  await popover('main', 'close'); await status('Native inspector dismissed');\n  await waitFor(async () => !(await popover()).shown, 'popover close after another window gained focus');\n",
        "replacement": "  await control('inspect-main', 'press'); const newerFocusPopover = await shownPopover();\n  const newerFocusCloseObservation = await armPopoverCloseObservation('main', newerFocusPopover);\n  await show('document-1');\n  await popover('main', 'close'); await status('Native inspector dismissed');\n  await waitFor(async () => popoverCloseCompleted(await popover(), newerFocusCloseObservation), 'popover close after another window gained focus');\n"
      }
    ]
  },
  "inherited": {
    "native": "b4263f9708c658012fce89a267a326e8d11692d2",
    "verifier": "94a5582ed63893b00b165d9ae93e580fb9e52bc9"
  }
};
async function runCloseWitnessReview(inputs, support) {
  const {utf8,git,sha,manifests,tooltipEdits,witnessEdits,inherited} = support;
  const groups=[],metrics={};
  const check=(condition,message)=>{if(!condition)throw new Error(message);};
  const equal=(a,b,message)=>check(JSON.stringify(a)===JSON.stringify(b),message);
  const clone=value=>JSON.parse(JSON.stringify(value));
  const assertion={equal:(a,b,message)=>check(a===b,message||"strict equality"),ok:(value,message)=>check(Boolean(value),message||"assertion")};
  async function group(name,work){await work();groups.push({name,status:"passed"});}
  function apply(source,edits){for(const edit of edits){check(source.split(edit.old).length===2,"nonunique edit "+edit.label);source=source.replace(edit.old,()=>edit.replacement);}return source;}
  function inverse(source,preimage,edits){
    for(const edit of [...edits].reverse()){
      if(edit.replacement){check(source.split(edit.replacement).length===2,"nonunique inverse "+edit.label);source=source.replace(edit.replacement,()=>edit.old);}
      else {const at=preimage.indexOf(edit.old),left=preimage.slice(at-90,at),right=preimage.slice(at+edit.old.length,at+edit.old.length+90);check(source.split(left+right).length===2,"removed span inverse");source=source.replace(left+right,()=>left+edit.old+right);}
    }
    check(source===preimage,"full inverse mismatch");
  }
  const span=(source,start,end)=>{const a=source.indexOf(start),b=source.indexOf(end,a+start.length);check(a>=0&&b>a,"source boundaries");return source.slice(a,b);};
  await group("exact source identities, full inverses and preserved inherited regions",()=>{
    for(const m of manifests){
      check(git(inputs[m.key])===m.gitBlob&&utf8(inputs[m.key]).length===m.bytes&&sha(utf8(inputs[m.key])).sha256===m.sha256,"final identity "+m.key);
      check(git(inputs[m.key+"Preimage"])===m.preimage,"preimage identity "+m.key);
      inverse(inputs[m.key],inputs[m.key+"Preimage"],[...tooltipEdits[m.key],...witnessEdits[m.key]]);
      const composed=apply(inputs[m.key+"Preimage"],tooltipEdits[m.key]);
      check(git(composed)===inherited[m.key],"reviewed inherited transform mismatch");
    }
    const closeStart="      NSMutableDictionary *closeTrace = nil;\n",closeEnd="      NSMutableArray *classes = [NSMutableArray new]; Classes(content, classes);\n";
    check(span(inputs.native,closeStart,closeEnd)===span(inputs.nativePreimage,closeStart,closeEnd),"existing closeTrace changed");
    const activation='SparkTestDriverRegisterCommand(@"tron.window"';
    check(inputs.native.slice(inputs.native.indexOf(activation))===inputs.nativePreimage.slice(inputs.nativePreimage.indexOf(activation)),"activation region changed");
    const oldWait=span(inputs.verifierPreimage,"async function waitFor(","const inspect ="),newWait=span(inputs.verifier,"async function waitFor(","const inspect =");
    check(oldWait===newWait&&newWait.includes("timeoutMs = 20000"),"original wait deadline changed");
    new (Object.getPrototypeOf(async function(){}).constructor)(inputs.verifier.replace(/^import[\s\S]*?;\n/gm,"").replaceAll("import.meta.url","'file:///review/verify-native.mjs'"));
  });
  const nativeHelper=span(inputs.native,"// Private acceptance observation only.","static NSMenu *TrackedContextMenu;");
  await group("native ownership, generation, observer cleanup and ordering source invariants",()=>{
    for(const term of ["__weak NSWindow *owner","__weak NYCTronPopoverComponentView *component","__weak NSPopover *popover","PopoverCloseArms >= 2","value->sequence = ++PopoverCloseArms","notification.object != popover","currentComponent.window == currentOwner","currentComponent.nativePopover == currentPopover","willCloseCount < 8","didCloseCount < 8","60 * NSEC_PER_SEC","current->sequence == observedSequence","value->sequence != observedSequence","- (void)dealloc { [self removeObservers]; }"])check(nativeHelper.includes(term),"missing invariant "+term);
    check((nativeHelper.match(/addObserverForName:/g)||[]).length===2,"observer count");
    check((nativeHelper.match(/object:popover queue:nil/g)||[]).length===2,"exact object and posting-thread binding");
    check(nativeHelper.includes("NSPopoverWillCloseNotification")&&nativeHelper.includes("NSPopoverDidCloseNotification"),"wrong notifications");
    check(!/NSLog|NSStringFromClass|makeFirstResponder|\.delegate\s*=|dispatch_sync/.test(nativeHelper),"observer changed native behavior or emitted arbitrary data");
    const did=nativeHelper.indexOf("didCloseOnMain = @YES;"),remove=nativeHelper.indexOf("[self removeObservers];",did),post=nativeHelper.indexOf("dispatch_async(dispatch_get_main_queue()",remove),mark=nativeHelper.indexOf("postDidCloseMainTurnObserved = YES",post);
    check(did<remove&&remove<post&&post<mark,"did-close entry substituted for later turn");
    check(nativeHelper.includes('!popover.shown || !content || content.hidden')&&nativeHelper.includes("value->expired")&&nativeHelper.includes("value->released")&&nativeHelper.includes("value->threadViolation"),"arm/late-turn guards absent");
    check(nativeHelper.includes("[PopoverCloseObservation releaseObservation]; PopoverCloseObservation = nil;"),"old observation not released before new arm");
    check(nativeHelper.includes("current->expired = YES; [current removeObservers];"),"expiry did not remove observers");
  });
  const helpers=span(inputs.verifier,"async function armPopoverCloseObservation(","async function shownPopover(");
  const waitCode=span(inputs.verifier,"async function waitFor(","const inspect =");
  const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
  const makeHelpers=popover=>new Function("popover","assert",helpers+"\nreturn {arm:armPopoverCloseObservation,completed:popoverCloseCompleted};")(popover,assertion);
  const armResponse=(sequence=1)=>({nativePopover:true,shown:true,contentVisible:true,contentIdentity:"fixture-content",
    closeObservation:{schemaVersion:1,status:"armed",sequence,identityMatches:true,armedWhileShown:true,willCloseCount:0,didCloseCount:0,willCloseOnMain:null,didCloseOnMain:null,postDidCloseMainTurnObserved:false,expired:false,released:false,threadViolation:false,overflowed:false}});
  function completedResponse(sequence=1){const r=armResponse(sequence);r.shown=false;Object.assign(r.closeObservation,{status:"completed",willCloseCount:1,didCloseCount:1,willCloseOnMain:true,didCloseOnMain:true,postDidCloseMainTurnObserved:true});return r;}
  const armed={sequence:1,contentIdentity:"fixture-content"};
  await group("arming uses one request and rejects changed or unavailable native identity",async()=>{
    const calls=[];const api=makeHelpers(async(window,action)=>{calls.push([window,action]);return armResponse();});
    equal(await api.arm("main",{contentIdentity:"fixture-content"}),armed,"arm response");
    equal(calls,[["main","arm-close-observation"]],"arm repeated or acted on native close");
    for(const [path,value] of [["shown",false],["contentVisible",false],["contentIdentity","replacement"],["schemaVersion",2],["status","expired"],["identityMatches",null],["armedWhileShown",false],["sequence",0],["sequence",3],["sequence","1"]]){
      const response=armResponse();if(path in response)response[path]=value;else response.closeObservation[path]=value;
      let rejected=false;try{await makeHelpers(async()=>response).arm("main",{contentIdentity:"fixture-content"});}catch{rejected=true;}check(rejected,"invalid arm accepted "+path);
    }
    for(const value of [undefined,null,"",0,42]){
      const response=armResponse();response.contentIdentity=value;
      let rejected=false;try{await makeHelpers(async()=>response).arm("main",{contentIdentity:value});}catch{rejected=true;}
      check(rejected,"matching missing/invalid arm content identities accepted");
    }
  });
  await group("completion requires same presentation and a later main turn, with strict unknowns",()=>{
    const api=makeHelpers(async()=>{});check(api.completed(completedResponse(),armed),"valid completion rejected");
    for(const [key,value] of [["schemaVersion",null],["status","armed"],["sequence",2],["identityMatches",false],["identityMatches",null],["armedWhileShown","true"],["didCloseCount",0],["didCloseCount",-1],["didCloseCount",9],["didCloseCount","1"],["didCloseCount",Infinity],["didCloseCount",NaN],["didCloseOnMain",false],["didCloseOnMain",null],["postDidCloseMainTurnObserved",false],["postDidCloseMainTurnObserved",1],["expired",true],["expired",null],["released",true],["threadViolation",true],["overflowed",true]]){
      const response=completedResponse();response.closeObservation[key]=value;check(api.completed(response,armed)===false,"invalid completion accepted "+key);
    }
    for(const response of [null,{}, {...completedResponse(),shown:true},{...completedResponse(),contentIdentity:"replacement"},{...completedResponse(),closeObservation:null}])check(api.completed(response,armed)===false,"unknown/changed object accepted");
    for(const badArm of [null,{}, {sequence:0,contentIdentity:"fixture-content"},{sequence:3,contentIdentity:"fixture-content"},{sequence:"1",contentIdentity:"fixture-content"}])check(api.completed(completedResponse(),badArm)===false,"invalid expected generation accepted");
    const missing=completedResponse();delete missing.contentIdentity;check(api.completed(missing,{sequence:1})===false,"missing content identity accepted");
    for(const value of [undefined,null,"",0,42]){
      const response=completedResponse();response.contentIdentity=value;
      check(api.completed(response,{sequence:1,contentIdentity:value})===false,"matching missing/invalid completion identities accepted");
    }
  });
  const escapeStart="  const escapeCloseObservation = await armPopoverCloseObservation(",escapeEnd="  await control('inspect-main', 'press');\n";
  const escape=span(inputs.verifier,escapeStart,escapeEnd);
  const newer=span(inputs.verifier,"  await show();\n  await control('inspect-main', 'press'); const newerFocusPopover","  checks.push('native-popover-dismissal-preserves-newer-window-focus');");
  function makeWait(trace){
    let now=0;
    const wait=new Function("assertRunning","pause","Date",waitCode+"\nreturn waitFor;")(()=>trace.push("running"),async ms=>{now+=ms;trace.push(["pause",ms]);},{now:()=>now});
    return{wait,now:()=>now};
  }
  async function runEscape(options={}){
    const trace=[],timing=makeWait(trace);let polls=0;
    const responses=options.responses||[Object.assign(armResponse(),{shown:false}),(()=>{const r=completedResponse();r.closeObservation.postDidCloseMainTurnObserved=false;return r;})(),completedResponse()];
    const popover=async(window="main",action)=>{
      trace.push(["popover",window,action||"inspect"]);
      if(action==="arm-close-observation")return armResponse();
      if(action==="escape")return{...armResponse(),shown:false,closeTrace:{shownBefore:true,shownAfter:false,performed:true}};
      const next=responses[Math.min(polls++,responses.length-1)];return clone(next);
    };
    const api=makeHelpers(popover);
    const deps={armPopoverCloseObservation:api.arm,popover,status:async text=>{trace.push(["status",text]);if(options.statusError)throw options.statusError;},waitFor:timing.wait,popoverCloseCompleted:api.completed,inspect:async()=>{trace.push("focus-inspect");return{firstResponderIdentity:options.focus??"original-opener"};},assert:assertion,resizedPopover:{contentIdentity:"fixture-content"},opener:"original-opener"};
    const code="const {armPopoverCloseObservation,popover,status,waitFor,popoverCloseCompleted,inspect,assert,resizedPopover,opener}=deps;\n"+escape;
    let error;try{await new AsyncFunction("deps",code)(deps);}catch(caught){error=caught;}
    return{trace,polls,elapsed:timing.now(),error};
  }
  await group("Escape sequence keeps invocation once and waits past entry-only snapshots",async()=>{
    const result=await runEscape();check(!result.error,"valid Escape failed");
    check(result.polls===3&&result.elapsed===100,"completed before later main-turn witness");
    check(result.trace.filter(x=>Array.isArray(x)&&x[0]==="popover"&&x[2]==="escape").length===1,"Escape invoked more than once");
    check(result.trace.filter(x=>Array.isArray(x)&&x[0]==="status").length===1,"status wait repeated");
    check(result.trace.at(-1)==="focus-inspect","focus inspected before completed close");
    metrics.escapePolls=result.polls;metrics.escapeMockElapsedMs=result.elapsed;
  });
  await group("original status rejection remains identical with no later diagnostic or focus request",async()=>{
    const primary=new Error("original Native inspector dismissed timeout"),result=await runEscape({statusError:primary});
    check(result.error===primary,"original error identity changed");check(result.polls===0&&!result.trace.includes("focus-inspect"),"request continued after original status failure");
    equal(result.trace.filter(x=>Array.isArray(x)&&x[0]==="popover").map(x=>x[2]),["arm-close-observation","escape"],"postfailure request/report added");
  });
  await group("newer-window witness is armed before transient auto-close and preserves exact key assertions",async()=>{
    const trace=[],timing=makeWait(trace);let closed=false,armedBeforeFocus=false,focusReads=0;
    const popover=async(window="main",action)=>{
      trace.push(["popover",window,action||"inspect"]);
      if(action==="arm-close-observation"){check(!closed,"armed after auto-close");armedBeforeFocus=true;return armResponse(2);}
      if(action==="close"){check(closed&&armedBeforeFocus,"expected transient auto-close before explicit command");return completedResponse(2);}
      return closed?completedResponse(2):armResponse(2);
    };
    const api=makeHelpers(popover),deps={show:async(window="main")=>{trace.push(["show",window]);if(window==="document-1"){check(armedBeforeFocus,"focus changed before arm");closed=true;}},control:async()=>trace.push("control"),shownPopover:async()=>armResponse(2),armPopoverCloseObservation:api.arm,popover,status:async()=>trace.push("status"),waitFor:timing.wait,popoverCloseCompleted:api.completed,inspect:async(testID,window="main")=>{focusReads++;trace.push(["focus",window]);return{key:window==="document-1"};},assert:assertion};
    await new AsyncFunction("deps","const {show,control,shownPopover,armPopoverCloseObservation,popover,status,waitFor,popoverCloseCompleted,inspect,assert}=deps;\n"+newer)(deps);
    check(focusReads===2,"original key checks omitted");
    equal(trace.filter(x=>Array.isArray(x)&&x[0]==="focus"),[["focus","document-1"],["focus","main"]],"focus conditions/order changed");
    check(trace.filter(x=>Array.isArray(x)&&x[0]==="popover"&&x[2]==="close").length===1,"explicit close repeated");
  });
  await group("existing close timeout and exact focus failure remain required",async()=>{
    const entry=completedResponse();entry.closeObservation.postDidCloseMainTurnObserved=false;
    const timeout=await runEscape({responses:[entry]});
    check(timeout.error?.message==="Timed out waiting for native Escape dismissal"&&timeout.elapsed===20000,"original bounded wait changed");
    check(!timeout.trace.includes("focus-inspect"),"focus asserted without close completion");
    const wrong=await runEscape({responses:[completedResponse()],focus:"different-responder"});
    check(wrong.error?.message==="Closing NSPopover did not restore its original native responder","exact focus condition relaxed");
    metrics.noCompletionMockDeadlineMs=timeout.elapsed;
  });
  return {status:"passed",groups,metrics,scope:"Eight V8/extracted-source/mock-command designs. Native observer lifecycle is statically reviewed only; no Objective-C++, Node IO, AppKit or native runtime execution."};
}
return async function reviewCloseCompletion(inputs) {
  return runCloseWitnessReview(inputs, {utf8, git, sha, ...data});
};
})()
