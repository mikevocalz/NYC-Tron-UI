/* Reproducible source and V8 mock review for the private help-tag provenance correction.
 * Evaluate this complete file in a fresh JavaScript isolate; its result is a function.
 * Invoke it with {native, verifier, readme, nativePreimage, verifierPreimage, readmePreimage},
 * each an exact decoded UTF-8 Git blob string pinned in manifests below.
 * No Node, filesystem, Objective-C++, AppKit, or native execution is performed.
 * The historical shape is synthetic. These tests do not establish a runtime tooltip result.
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
const manifests = [
  {
    "key": "native",
    "path": "examples/macos-appkit/spark/acceptance-driver/NYCTronAcceptanceDriver.mm",
    "preimage": "b87bf12633490c1e0f4c17ee081fcd8fcc165919",
    "gitBlob": "7dc176162c59c879a90fb12d9ebdf070eae62125",
    "bytes": 66766,
    "sha256": "79cea13e4598c8571888275c92fe69772ecb60f68193a9de69935db222eafcf7"
  },
  {
    "key": "verifier",
    "path": "examples/macos-appkit/spark/verify-native.mjs",
    "preimage": "f21e9349b35922ad689a2f6320ed651b5557de64",
    "gitBlob": "94a5582ed63893b00b165d9ae93e580fb9e52bc9",
    "bytes": 112019,
    "sha256": "7e490e8c57774261924c07b825548e846670799564dcb8a2619eb6cdc0d588ba"
  },
  {
    "key": "readme",
    "path": "packages/macos-appkit/spark/README.md",
    "preimage": "5978122a5d665c27ffeffe865e0fbae61b64a7ab",
    "gitBlob": "ce95b08424288985ed6cb1e1b2169f67056941cc",
    "bytes": 19469,
    "sha256": "75beb83db383c90dea906e43c7b5a0618c6504453e472c10f15fb51335145094"
  }
];
const edits = {
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
  ],
  "readme": [
    {
      "label": "qualify private source and document eligibility/counts",
      "old": "must find a newly visible `AXHelpTag` with a native frame. The `AXHelpTag`\nelement exposes no text attribute (only role, frame, position, size and\nparent), so the in-process driver reads the presented text from the private\n`_attributedString` ivar of the panel's `NSCustomToolTipDrawView` and requires\nit to equal the expected tooltip string. That ivar is private AppKit layout:\na rename leaves the text unread and fails the run. The check must also observe\n",
      "replacement": "must find a newly visible `AXHelpTag` with a native frame and the exact expected\ntext. On the retained 79a host observation, the tested public value/label/title\ngetters and diagnostic legacy value reads returned nil. The separately reported\nstandalone attribute enumeration has not been independently inspected here;\nthis does not establish that every host/version lacks a public text attribute.\n\nThe private acceptance driver also reads `_attributedString` from the exact\n`NSCustomToolTipDrawView` class. It admits private text only from the selected\nonscreen help-tag window's content subtree, with same-window identity, visible\nfinite nonempty clipped geometry, and a post-read eligibility recheck. Public\nretained strings, private unique additions and the combined total are recorded\nseparately. Private inspection considers at most eight nodes and retains at\nmost four detail rows per observation; omitted or unavailable data stays\nexplicit. This is a host/version-dependent private-layout observation, not a\npublic AX/VoiceOver text result or independent pixel-content verification.\nAn absent or ineligible private source contributes no string. The strict\nexpected-text comparison remains required.\n\nThe bounded console projection retains the shown observation as well as the\nlast/final observation, with separate private provenance and a shared 16 KiB\noutput cap. Full original JSON remains separate evidence. The check must observe\n"
    }
  ]
};
const oldPrivate = "    // The system tooltip panel exposes no text through any accessibility\n    // attribute: its AXHelpTag element has only role, frame, position, size and\n    // parent (checked with AXUIElementCopyAttributeNames). The text lives in the\n    // private NSCustomToolTipDrawView, which this in-process driver reads from its\n    // _attributedString ivar. This is a private-layout read, not public API; if\n    // AppKit renames it no string is collected and the exact-match check fails.\n    if ([node isKindOfClass:NSView.class] && [NSStringFromClass([node class]) isEqualToString:@\"NSCustomToolTipDrawView\"]) {\n      Ivar drawText = class_getInstanceVariable(object_getClass(node), \"_attributedString\");\n      const char *encoding = drawText ? ivar_getTypeEncoding(drawText) : NULL;\n      if (encoding && encoding[0] == '@') {\n        id drawn = object_getIvar(node, drawText);\n        NSString *drawnText = [drawn isKindOfClass:NSAttributedString.class] ? [drawn string] : ([drawn isKindOfClass:NSString.class] ? drawn : nil);\n        if (drawnText.length) [strings addObject:drawnText];\n      }\n    }\n";
function runTooltipPrivateReview(inputs, support) {
  const {utf8, git, sha, manifests, edits, oldPrivate} = support;
  const groups=[],metrics={};
  const assert=(v,m)=>{if(!v)throw new Error(m);};
  const equal=(a,b,m)=>assert(JSON.stringify(a)===JSON.stringify(b),m);
  const clone=x=>JSON.parse(JSON.stringify(x));
  function group(name,fn){fn();groups.push({name,status:"passed"});}
  function inverse(source,preimage,changes){
    let restored=source;
    for(const e of [...changes].reverse()){
      if(e.replacement){assert(restored.split(e.replacement).length===2,"inverse replacement uniqueness "+e.label);restored=restored.replace(e.replacement,()=>e.old);}
      else {const at=preimage.indexOf(e.old),left=preimage.slice(at-90,at),right=preimage.slice(at+e.old.length,at+e.old.length+90),anchor=left+right;
        assert(restored.split(anchor).length===2,"removed span inverse uniqueness");restored=restored.replace(anchor,()=>left+e.old+right);}
    }
    assert(restored===preimage,"full inverse mismatch");
  }
  group("exact three-file identities, inverses and unchanged public collection",()=>{
    for(const m of manifests){
      const s=inputs[m.key],p=inputs[m.key+"Preimage"];
      assert(git(s)===m.gitBlob&&utf8(s).length===m.bytes&&sha(utf8(s)).sha256===m.sha256,"candidate identity "+m.key);
      assert(git(p)===m.preimage,"preimage identity "+m.key);
      inverse(s,p,edits[m.key]);
    }
    const start='  NSMutableOrderedSet<NSString *> *strings = [NSMutableOrderedSet new];';
    const publicOld=inputs.nativePreimage.slice(inputs.nativePreimage.indexOf(start),inputs.nativePreimage.indexOf("  NSArray<NSString *> *result = strings.array;")).replace(oldPrivate,"");
    const publicNew=inputs.native.slice(inputs.native.indexOf(start),inputs.native.indexOf("  const NSUInteger publicRetainedStrings = strings.count;"));
    assert(publicOld===publicNew,"public getter/normalization/ordering changed");
    const nStart="static NSArray *AccessibilityNodes(",nEnd="// Read metadata stays separate";
    assert(inputs.native.slice(inputs.native.indexOf(nStart),inputs.native.indexOf(nEnd))===inputs.nativePreimage.slice(inputs.nativePreimage.indexOf(nStart),inputs.nativePreimage.indexOf(nEnd)),"traversal changed");
    new (Object.getPrototypeOf(async function(){}).constructor)(inputs.verifier.replace(/^import[\s\S]*?;\n/gm,"").replaceAll("import.meta.url","'file:///review/verify-native.mjs'"));
  });
  group("native source placement, runtime identity and guarded eligibility invariants",()=>{
    const n=inputs.native,at=n.indexOf("static NSDictionary *PrivateHelpTagStrings("),end=n.indexOf("static NSArray<NSString *> *HelpTagStrings(",at),p=n.slice(at,end);
    assert(p.includes("Class drawClass = object_getClass(node);")&&p.includes("NSStringFromClass(drawClass)")&&p.includes('class_getInstanceVariable(drawClass, "_attributedString")'),"runtime class/ivar identity drift");
    assert(!p.includes("NSStringFromClass([node class])"),"masqueradable class selector returned");
    const before=p.indexOf('row[@"before"] = PrivateHelpTagViewState'),read=p.indexOf("id drawn = object_getIvar"),after=p.indexOf('row[@"after"] = PrivateHelpTagViewState'),retain=p.indexOf("[strings addObject:text]");
    assert(before>=0&&before<read&&read<after&&after<retain,"private read/recheck/admission order");
    assert(p.includes("if (!eligible)")&&p.includes("if (!eligibleAfter)")&&p.includes("budget->privateNodes >= 8")&&p.includes("budget->privateDetails < 4"),"eligibility/budgets missing");
    const state=n.slice(n.indexOf("static NSDictionary *PrivateHelpTagViewState("),at);
    for(const required of ["actualWindow == selectedWindow","actualWindow != selectedWindow","view == content || [view isDescendantOf:content]","isHiddenOrHasHiddenAncestor","NSIntersectionRect(bounds, visibleRect)","[view convertRect:intersection toView:nil]","HelpTagFiniteNonemptyRect(frame)"])assert(state.includes(required),"missing native eligibility term");
    assert(n.indexOf("const NSUInteger publicRetainedStrings = strings.count;")<n.indexOf("NSDictionary *privateDiagnostic = PrivateHelpTagStrings"),"public count is late");
    assert(n.includes('@"retainedStrings": @(publicRetainedStrings)')&&n.includes('@"combinedRetainedStrings": @(result.count)')&&n.includes('@"uniqueStringsAdded": @(strings.count - beforeCount)'),"counter provenance drift");
  });
  const selector=inputs.verifier.slice(inputs.verifier.indexOf("function tooltipFailureSummary("),inputs.verifier.indexOf("function reportTooltipFailure("));
  const reporter=inputs.verifier.slice(inputs.verifier.indexOf("function reportTooltipFailure("),inputs.verifier.indexOf("function startupProject("));
  const summarize=new Function(selector+"\nreturn tooltipFailureSummary;")();
  const expected="Save this document's local checkpoint";
  const rect={x:329,y:347,width:213,height:18};
  const view={hasWindow:true,sameWindow:true,inContentSubtree:true,windowOnscreen:true,viewVisible:true,boundsNonempty:true,visibleIntersectionNonempty:true,frameNonempty:true,sourceWindowNumber:41,frameInSelectedWindow:{x:0,y:0,width:213,height:18}};
  function privateRow(){return {node:2,read:"captured",stage:"complete",classMatch:true,ivarPresent:true,objectEncoding:true,kind:"attributed-string",normalized:true,length:37,nonempty:true,exactExpected:true,accepted:true,uniqueAdded:true,before:clone(view),after:clone(view)};}
  function diagnostic(){
    const currentRows=Array.from({length:12},(_,i)=>({node:Math.floor(i/4),field:["value","label","title","text-field-value"][i%4],calls:i%4===3?0:1,read:i%4===3?"unavailable":"nil",kind:"none",normalized:false,length:null,nonempty:null,exactExpected:null,metadataStatus:"observed"}));
    const legacyRows=Array.from({length:3},(_,node)=>({node,read:"nil",kind:"none",normalized:null,length:null,nonempty:null,exactExpected:null,metadataStatus:"observed"}));
    return {schemaVersion:1,status:"observed",nodes:3,combinedRetainedStrings:1,
      current:{fieldSlots:12,calls:9,unavailable:3,nil:9,captured:0,string:0,attributedString:0,other:0,normalizedNil:0,empty:0,nonempty:0,retainedStrings:0,detailLimit:16,detailsOmitted:0,rows:currentRows},
      legacy:{diagnosticOnly:true,nodeLimit:8,nodesConsidered:3,supportedReadsAttempted:3,returned:3,thrown:0,selectorExceptions:0,metadataExceptions:0,nodesOmitted:0,rows:legacyRows},
      private:{schemaVersion:1,status:"observed",source:"private-appkit-draw-view",nodeLimit:8,detailLimit:4,nodesConsidered:3,nodesOmitted:0,classMatches:1,eligibleViews:1,postReadEligibleViews:1,readAttempts:1,returned:1,nil:0,string:0,attributedString:1,other:0,normalizedNil:0,empty:0,nonempty:1,acceptedValues:1,uniqueStringsAdded:1,unavailable:2,ineligible:0,exceptions:0,detailsOmitted:0,rows:[{node:0,read:"unavailable",stage:"class",classMatch:false,accepted:false,uniqueAdded:false},{node:1,read:"unavailable",stage:"class",classMatch:false,accepted:false,uniqueAdded:false},privateRow()]}};
  }
  function tag(){return {windowNumber:41,role:"AXHelpTag",frame:clone(rect),windowFrame:clone(rect),strings:[expected],textReadDiagnostic:diagnostic()};}
  function observation(shown){
    return {phase:shown?"hover":"outside-after-hover",postEventsAllowed:true,accessibilityTrusted:true,ownerVisible:true,ownerKey:true,applicationActive:true,traversalTruncated:false,cursorInsideTrigger:shown,pointerRunning:false,triggerFrame:{x:249,y:366,width:160,height:36},cursor:shown?{x:329,y:384}:{x:529,y:514},helpTags:shown?[tag()]:[],windows:[{number:41,visible:shown,onscreen:shown,frame:clone(rect),roles:["AXHelpTag","AXUnknown"],class:"PRIVATE_SECRET"}]};
  }
  function fixture(){return {schemaVersion:1,status:"passed",permission:{postEventsAllowed:true,accessibilityTrusted:true},initial:observation(false),baseline:observation(false),shown:{observation:observation(true)},lastObservation:observation(false),error:"PRIVATE_SECRET /Users/fixture/private",boundary:"PRIVATE_SECRET",capture:{path:"PRIVATE_SECRET"},privateSecret:"PRIVATE_SECRET"};}
  const extract=(summary,which="shownObservation",index=0)=>summary[which].helpTags.records[index].textReadDiagnostic;
  group("separate public/private counts, duplicates and unchanged exact-text predicate",()=>{
    const input=fixture(),s=summarize(input),d=extract(s);
    equal([d.current.retainedStrings,d.private.uniqueStringsAdded,d.combinedRetainedStrings],[0,1,1],"private-only count attribution");
    assert(s.shownObservation.helpTags.records[0].matchesShownTagPredicate===true,"combined exact text lost");
    input.shown.observation.helpTags[0].strings=[];
    assert(summarize(input).shownObservation.helpTags.records[0].matchesShownTagPredicate===false,"diagnostic exact-match promoted missing acceptance string");
    const mixed=fixture(),md=mixed.shown.observation.helpTags[0].textReadDiagnostic;
    md.current.retainedStrings=1;md.private.uniqueStringsAdded=0;md.combinedRetainedStrings=1;
    const result=extract(summarize(mixed));
    equal([result.current.retainedStrings,result.private.uniqueStringsAdded,result.combinedRetainedStrings],[1,0,1],"duplicate source counted twice");
  });
  group("shown provenance and final disappearance remain independent",()=>{
    const s=summarize(fixture());
    assert(s.shownObservation.helpTags.total===1&&s.shownObservation.cursorInsideTrigger===true,"shown observation absent");
    assert(s.observationSource==="lastObservation"&&s.observation.helpTags.total===0&&s.observation.cursorInsideTrigger===false,"final observation overwritten");
    const missing=fixture();delete missing.shown;
    assert(summarize(missing).shownObservation===null,"missing shown observation became empty success");
    const fall=fixture();delete fall.lastObservation;assert(summarize(fall).observationSource==="initial","original latest fallback changed");
  });
  group("missing, failed and malformed private metadata stays typed and private",()=>{
    const input=fixture();delete input.shown.observation.helpTags[0].textReadDiagnostic.private;
    const missing=extract(summarize(input)).private;
    assert(missing.schemaVersion===null&&missing.nodesConsidered===null&&missing.uniqueStringsAdded===null&&missing.rows.records===null,"missing private metadata coerced to zero");
    const bad=fixture(),pd=bad.shown.observation.helpTags[0].textReadDiagnostic.private;
    pd.readAttempts="1";pd.uniqueStringsAdded=-1;pd.exceptions=Infinity;pd.token="PRIVATE_SECRET";
    pd.rows=[...["unavailable","ineligible","nil","exception"].map(read=>({...privateRow(),read,normalized:true,exactExpected:true,stage:"PRIVATE_SECRET",accepted:"true",before:{...view,frameInSelectedWindow:{x:NaN,y:0,width:Infinity,height:18},sourceWindowNumber:"41",secret:"PRIVATE_SECRET"}}))];
    const ds=extract(summarize(bad)).private;
    assert(ds.readAttempts===null&&ds.uniqueStringsAdded===null&&ds.exceptions===null,"malformed counters accepted");
    for(const row of ds.rows.records){
      assert(row.normalized===null&&row.length===null&&row.exactExpected===null&&row.accepted===null&&row.stage==="other","failed read metadata promoted");
      assert(row.before.sourceWindowNumber===null&&row.before.frameInSelectedWindow.x===null&&row.before.frameInSelectedWindow.width===null,"invalid geometry/identity coerced");
    }
    assert(!JSON.stringify(summarize(bad)).includes("PRIVATE_SECRET"),"arbitrary private metadata escaped");
    pd.schemaVersion=2;
    assert(extract(summarize(bad)).private.returned===null,"unrecognized private schema accepted");
  });
  group("private rows share the four-row cap within each observation",()=>{
    const input=fixture();input.shown.observation.helpTags=Array.from({length:8},()=>tag());
    for(const t of input.shown.observation.helpTags)t.textReadDiagnostic.private.rows=Array.from({length:4},()=>privateRow());
    const records=summarize(input).shownObservation.helpTags.records;
    equal(records.map(t=>t.textReadDiagnostic.private.rows.records.length),[4,0,0,0,0,0,0,0],"private detail cap not shared");
    assert(records.reduce((n,t)=>n+t.textReadDiagnostic.private.rows.omitted,0)===28,"omitted private rows lost");
    const changed=fixture(),row=changed.shown.observation.helpTags[0].textReadDiagnostic.private.rows[2];
    row.read="ineligible";row.accepted=false;row.uniqueAdded=false;row.after.sameWindow=false;row.after.frameInSelectedWindow=null;
    const out=extract(summarize(changed)).private.rows.records[2];
    assert(out.accepted===false&&out.after.sameWindow===false&&out.after.frameInSelectedWindow===null,"post-read refusal was hidden");
  });
  function makeReport(input,options={}){
    const original=options.original??(" \n"+JSON.stringify(input,null,2)+"\n");
    const fileBytes=Uint8Array.from(utf8(original)),messages=[],hashInputs=[];
    let cursor=0,closed=false,reads=0;
    class B extends Uint8Array {
      static alloc(n){return new B(n);}
      static byteLength(s){return utf8(s).length;}
      toString(){return decodeURIComponent(Array.from(this,x=>"%"+x.toString(16).padStart(2,"0")).join(""));}
    }
    const deps={Buffer:B,output:"/fixed-evidence",revision:"a".repeat(40),child:{pid:77},join:(a,b)=>a+"/"+b,
      lstatSync:path=>({isFile:()=>true}),
      openSync:(path,mode)=>{assert(path==="/fixed-evidence/tooltip-hover.json"&&mode==="r","wrong source read");return 9;},
      readSync:(fd,buffer,offset,length)=>{if(options.readError)throw new Error("PRIVATE_SECRET");reads++;const n=Math.min(length,127,fileBytes.length-cursor);if(n<=0)return 0;buffer.set(fileBytes.subarray(cursor,cursor+n),offset);cursor+=n;return n;},
      closeSync:fd=>{closed=true;if(options.closeError)throw new Error("PRIVATE_SECRET");},
      hash:bytes=>{assert(closed,"hash before successful source close");hashInputs.push(Array.from(bytes));return sha(bytes).sha256;},
      console:{info:message=>{if(options.consoleError)throw new Error("PRIVATE_SECRET");messages.push(message);}}
    };
    const fn=new Function("deps",`const {Buffer,output,revision,child,join,lstatSync,openSync,readSync,closeSync,hash,console}=deps;\n${selector}\n${reporter}\nreturn reportTooltipFailure;`)(deps);
    fn();
    const message=messages[0],lines=message?.split("\n");
    return{original,fileBytes,hashInputs,messages,reads,closed,bytes:message?utf8(message+"\n").length:0,
      report:lines?JSON.parse(lines[1]):null,lines};
  }
  group("bounded report binds exact original bytes and keeps shown plus final metadata",()=>{
    const run=makeReport(fixture());
    assert(run.lines.length===3&&run.lines[0]==="NYCTRON_TOOLTIP_EVIDENCE_BEGIN"&&run.lines[2]==="NYCTRON_TOOLTIP_EVIDENCE_END","invalid complete envelope");
    assert(run.report.status==="summary"&&run.bytes<=16384&&run.report.original.bytes===run.fileBytes.length,"report scope/limit");
    equal(run.hashInputs[0],Array.from(run.fileBytes),"hash not based on original file bytes");
    assert(run.report.original.sha256===sha(run.fileBytes).sha256,"original digest mismatch");
    assert(run.report.summary.shownObservation.helpTags.records[0].textReadDiagnostic.current.retainedStrings===0&&run.report.summary.observation.helpTags.total===0,"shown/final report lost");
    assert(!run.messages[0].includes("PRIVATE_SECRET"),"raw evidence leaked");
    metrics.normalEnvelopeBytes=run.bytes;
  });
  function stress(tagCount){
    const input=fixture(),n=Number.MAX_SAFE_INTEGER;
    function obs(){
      const o=observation(true);o.helpTags=Array.from({length:tagCount},()=>tag());
      for(const t of o.helpTags){
        const d=t.textReadDiagnostic;
        for(const part of [d.current,d.legacy,d.private])for(const key of Object.keys(part))if(typeof part[key]==="number")part[key]=n;
        d.current.rows=Array.from({length:16},(_,i)=>({node:n,field:"text-field-value",calls:n,read:"captured",kind:"attributed-string",normalized:true,length:n,nonempty:true,exactExpected:false,metadataStatus:"observed"}));
        d.legacy.rows=Array.from({length:8},()=>({node:n,read:"returned",kind:"attributed-string",normalized:true,length:n,nonempty:true,exactExpected:false,metadataStatus:"observed"}));
        d.private.schemaVersion=1;
        d.private.rows=Array.from({length:4},()=>{const r=privateRow();r.node=n;r.length=n;for(const s of [r.before,r.after]){s.sourceWindowNumber=n;s.frameInSelectedWindow={x:n,y:n,width:n,height:n};}return r;});
      }
      o.windows=Array.from({length:12},()=>({number:n,visible:true,onscreen:true,frame:{x:n,y:n,width:n,height:n},roles:Array(12).fill("AXSplitGroup")}));
      return o;
    }
    input.shown.observation=obs();input.lastObservation=obs();return input;
  }
  group("one 16 KiB envelope trims both snapshots and preserves explicit over-limit fallback",()=>{
    const trimmed=makeReport(stress(1));
    assert(trimmed.report.status==="summary"&&trimmed.report.diagnosticRowsOmittedForByteLimit===true,"row-trim case did not stay useful");
    for(const key of ["shownObservation","observation"]){
      assert(trimmed.report.summary[key].helpTags.total===1,"trim removed snapshot");
      for(const t of trimmed.report.summary[key].helpTags.records)for(const kind of ["current","legacy","private"])assert(t.textReadDiagnostic[kind].rows.records.length===0,"detail rows survived trim");
    }
    assert(trimmed.bytes<=16384,"trim exceeded full envelope budget");metrics.trimmedEnvelopeBytes=trimmed.bytes;
    const omitted=makeReport(stress(8));
    assert(omitted.report.status==="omitted-over-log-limit"&&omitted.report.outputSummaryOmitted===true&&omitted.report.summary===undefined,"generic fallback not explicit");
    assert(omitted.bytes<=16384&&omitted.report.original.sha256,"fallback lost budget/original identity");metrics.fallbackEnvelopeBytes=omitted.bytes;
    for(const options of [{readError:true},{closeError:true},{consoleError:true}]){
      const primary=new Error("original native inspector failure");
      let seen;try{try{throw primary;}catch(error){makeReport(fixture(),options);throw error;}}catch(error){seen=error;}
      assert(seen===primary,"secondary report error replaced primary");
    }
  });
  return{status:"passed",groups,metrics,scope:"Eight V8 source/typed-projection/mock-report designs; no Node filesystem, Objective-C++, AppKit or native runtime execution."};
}
return function reviewPrivateTooltip(inputs) {
  return runTooltipPrivateReview(inputs, {utf8, git, sha, manifests, edits, oldPrivate});
};
})()
