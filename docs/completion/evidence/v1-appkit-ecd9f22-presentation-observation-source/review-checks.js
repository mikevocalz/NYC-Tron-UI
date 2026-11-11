(function () {
const H = (() => {
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
const expected = {"header":{"path":"packages/macos-appkit/spark/macos/NYCTronPopover.h","preimage":"42776ef0157ad390af0b139a8080993082d243f3","gitBlob":"ac9c7077d62cb52650ee5ee36bba1f6b383a4a5f","bytes":516,"sha256":"000b3a7c94d355fcbc79c49c474757311d2b79d81c0a23582236ed504b2c6e05"},"native":{"path":"packages/macos-appkit/spark/macos/NYCTronPopover.mm","preimage":"9e00e3d966569b5fc2c03dac2432fdfe67548177","gitBlob":"ecd9f2235d17c4d3bf6a20143c385d72d0dfea63","bytes":25122,"sha256":"79af800a514f55f64938494f4a14ca6496cf2036a1b53328181e7805805a63e2"},"driver":{"path":"examples/macos-appkit/spark/acceptance-driver/NYCTronAcceptanceDriver.mm","preimage":"7df9831d697b7815cd7662ea3317a331cf9570e7","gitBlob":"6eaeab02acb6af6635a368101bce514bc0c89549","bytes":78701,"sha256":"a37b7cefbfe910de05e96c6e06ecab8d090cb823e8857cf17f7c2b0bb7b8d5d8"},"verifier":{"path":"examples/macos-appkit/spark/verify-native.mjs","preimage":"f79ff69823912de0efb4b6664ede1f14627b9bda","gitBlob":"f4e630f147d8bb7f5370531e778ed60acf03a802","bytes":133456,"sha256":"4c706372c05aa8f7086f3ea6a9cc50339845bb551ee42724b0a1e6831e38a01b"}};
const edits = [{"path":"packages/macos-appkit/spark/macos/NYCTronPopover.h","note":"declare internal read-only snapshot","before":"@property (nonatomic, readonly) NSRect nativeAllowedRegion;\n","after":"@property (nonatomic, readonly) NSRect nativeAllowedRegion;\n// Read-only private acceptance projection; no synchronization or presentation.\n- (NSDictionary * _Nullable)nativePresentationObservationForOwner:(NSWindow *)owner;\n"},{"path":"packages/macos-appkit/spark/macos/NYCTronPopover.mm","note":"add fixed private record types and finite projection helpers","before":"using namespace facebook::react;\n","after":"#include <cmath>\n\n// Fixed diagnostic slots only. Tokens and weak object identities remain private;\n// no diagnostic path calls layout, presentation, focus or a client callback.\nenum class NYCTronPresentationBranch {\n  Unknown, Closing, ContentPrerequisites, TokenSuppressed, OwnerUnavailable,\n  ShowEntered, ShowNotShown, ContentWindowUnavailable, CoordinatesPending,\n  CoordinatesReady, OutsideRegion\n};\nstruct NYCTronPresentationMark {\n  BOOL observed{NO}, ownerWasPresent{NO};\n  NSUInteger sequence{}, generation{}, lifetime{};\n  __weak NSWindow *owner = nil;\n  __weak NSView *content = nil;\n  __weak NSPopover *popover = nil;\n  NSString *scope = nil;\n  NSString *presentation = nil;\n  NSRect anchor{}, region{};\n  NSSize size{};\n  BOOL visible{NO}, above{NO};\n};\nstruct NYCTronPresentationBranchRecord {\n  NYCTronPresentationMark mark;\n  NYCTronPresentationBranch branch{NYCTronPresentationBranch::Unknown};\n};\nstruct NYCTronPresentationShowRecord {\n  NYCTronPresentationMark mark;\n  BOOL returned{NO}, shown{NO}, windowRead{NO}, hasWindow{NO};\n  BOOL containmentRead{NO}, contained{NO}, coordinatesRead{NO}, coordinatesReady{NO};\n  NSRect anchor{}, region{}, frame{};\n};\nstatic BOOL NYCTronDiagnosticTokenEqual(NSString *a, NSString *b) {\n  return a == b || (a && b && [a isEqualToString:b]);\n}\nstatic id NYCTronDiagnosticRect(NSRect rect) {\n  const double x = rect.origin.x, y = rect.origin.y, width = rect.size.width, height = rect.size.height;\n  if (!std::isfinite(x) || !std::isfinite(y) || !std::isfinite(width) || !std::isfinite(height) ||\n      !std::isfinite(x + width) || !std::isfinite(y + height)) return NSNull.null;\n  return @{ @\"x\": @(x), @\"y\": @(y), @\"width\": @(width), @\"height\": @(height) };\n}\nstatic id NYCTronDiagnosticBranchName(NYCTronPresentationBranch branch) {\n  switch (branch) {\n    case NYCTronPresentationBranch::Closing: return @\"closing\";\n    case NYCTronPresentationBranch::ContentPrerequisites: return @\"content-prerequisites\";\n    case NYCTronPresentationBranch::TokenSuppressed: return @\"token-suppressed\";\n    case NYCTronPresentationBranch::OwnerUnavailable: return @\"owner-unavailable\";\n    case NYCTronPresentationBranch::ShowEntered: return @\"show-entered\";\n    case NYCTronPresentationBranch::ShowNotShown: return @\"show-not-shown\";\n    case NYCTronPresentationBranch::ContentWindowUnavailable: return @\"content-window-unavailable\";\n    case NYCTronPresentationBranch::CoordinatesPending: return @\"coordinates-pending\";\n    case NYCTronPresentationBranch::CoordinatesReady: return @\"coordinates-ready\";\n    case NYCTronPresentationBranch::OutsideRegion: return @\"outside-region\";\n    default: return NSNull.null;\n  }\n}\n\nusing namespace facebook::react;\n"},{"path":"packages/macos-appkit/spark/macos/NYCTronPopover.mm","note":"add two bounded diagnostic slots and nonwrapping private identity counters","before":"  NSUInteger _generation;\n","after":"  NSUInteger _generation;\n  NSUInteger _presentationObservationSequence, _presentationObservationLifetime;\n  BOOL _presentationObservationUnavailable;\n  NYCTronPresentationBranchRecord _presentationBranch;\n  NYCTronPresentationShowRecord _presentationShow;\n"},{"path":"packages/macos-appkit/spark/macos/NYCTronPopover.mm","note":"add guarded read-only snapshot and private capture helpers","before":"- (NSRect)nativeAllowedRegion { return _allowedRegion; }\n","after":"- (NSRect)nativeAllowedRegion { return _allowedRegion; }\n- (void)capturePresentationMark:(NYCTronPresentationMark *)mark {\n  @try {\n    if (_presentationObservationUnavailable || _presentationObservationSequence == NSUIntegerMax) {\n      _presentationObservationUnavailable = YES;\n      return;\n    }\n    mark->sequence = ++_presentationObservationSequence;\n    mark->generation = _generation; mark->lifetime = _presentationObservationLifetime;\n    mark->owner = _owner; mark->ownerWasPresent = _owner != nil;\n    mark->content = _content; mark->popover = _popover;\n    mark->scope = _scopeToken; mark->presentation = _presentationToken;\n    mark->anchor = _anchor; mark->region = _allowedRegion; mark->size = _contentSize;\n    mark->visible = _visible; mark->above = _above; mark->observed = YES;\n  } @catch (NSException *exception) { (void)exception; mark->observed = NO; }\n}\n- (void)observePresentationBranch:(NYCTronPresentationBranch)branch mark:(NYCTronPresentationMark const &)mark {\n  @try {\n    if (mark.observed && !_presentationObservationUnavailable && mark.lifetime == _presentationObservationLifetime) {\n      _presentationBranch.mark = mark; _presentationBranch.branch = branch;\n    }\n  } @catch (NSException *exception) { (void)exception; _presentationBranch.mark.observed = NO; }\n}\n- (NSDictionary *)presentationContext:(NYCTronPresentationMark const &)mark owner:(NSWindow *)owner {\n  if (!mark.observed || _presentationObservationUnavailable) return @{\n    @\"status\": @\"unavailable\", @\"sameGeneration\": NSNull.null, @\"sameLifetime\": NSNull.null,\n    @\"sameIdentity\": NSNull.null, @\"sameScopeToken\": NSNull.null,\n    @\"samePresentationToken\": NSNull.null, @\"sameParameters\": NSNull.null\n  };\n  BOOL lifetime = mark.lifetime == _presentationObservationLifetime;\n  BOOL identity = owner && _owner == owner && self.window == owner &&\n    (mark.ownerWasPresent ? mark.owner && mark.owner == _owner : !_owner) &&\n    mark.content && mark.content == _content && mark.popover && mark.popover == _popover;\n  BOOL scope = NYCTronDiagnosticTokenEqual(mark.scope, _scopeToken);\n  BOOL presentation = NYCTronDiagnosticTokenEqual(mark.presentation, _presentationToken);\n  BOOL parameters = NSEqualRects(mark.anchor, _anchor) && NSEqualRects(mark.region, _allowedRegion) &&\n    NSEqualSizes(mark.size, _contentSize) && mark.visible == _visible && mark.above == _above;\n  // Last executed records remain historical when controlled props/tokens change.\n  // Only recycle or actual owner/object identity loss invalidates their values.\n  return @{ @\"status\": lifetime && identity ? @\"observed\" : @\"stale\",\n    @\"sameGeneration\": @(mark.generation == _generation), @\"sameLifetime\": @(lifetime),\n    @\"sameIdentity\": @(identity), @\"sameScopeToken\": @(scope),\n    @\"samePresentationToken\": @(presentation), @\"sameParameters\": @(parameters) };\n}\n- (NSDictionary *)nativePresentationObservationForOwner:(NSWindow *)owner {\n  if (!NSThread.isMainThread) return nil;\n  @try {\n    id unknown = NSNull.null;\n    NSDictionary *current = @{\n      @\"controlledVisible\": @(_visible), @\"closing\": @(_closing), @\"silentClose\": @(_silentClose),\n      @\"hasOwner\": @(_owner != nil), @\"ownerMatchesCommand\": _owner ? @(_owner == owner) : unknown,\n      @\"componentWindowMatchesCommand\": self.window ? @(self.window == owner) : unknown,\n      @\"ownerVisible\": _owner ? @(_owner.visible) : unknown,\n      @\"ownerMiniaturized\": _owner ? @(_owner.miniaturized) : unknown,\n      @\"hasPositioningView\": _owner ? @(_owner.contentView != nil) : unknown,\n      @\"hasContent\": @(_content != nil), @\"hasChildren\": _content ? @(_content.subviews.count > 0) : unknown,\n      @\"hasContentWindow\": _content ? @(_content.window != nil) : unknown, @\"hasFabricState\": @(_state != nullptr),\n      @\"scopeTokenPresent\": @(_scopeToken != nil), @\"presentationTokenPresent\": @(_presentationToken != nil),\n      @\"presentedTokenMatches\": _scopeToken ? @([_presentedToken isEqual:_scopeToken]) : unknown,\n      @\"dismissedTokenMatches\": _scopeToken ? @([_dismissedToken isEqual:_scopeToken]) : unknown,\n      @\"rejectedTokenMatches\": _presentationToken ? @([_rejectedPresentationToken isEqual:_presentationToken]) : unknown,\n      @\"preferredEdge\": _above ? @\"above\" : @\"below\", @\"anchor\": NYCTronDiagnosticRect(_anchor),\n      @\"contentSize\": NYCTronDiagnosticRect(NSMakeRect(0, 0, _contentSize.width, _contentSize.height))\n    };\n    NSMutableDictionary *branch = [[self presentationContext:_presentationBranch.mark owner:owner] mutableCopy];\n    BOOL branchValid = [branch[@\"status\"] isEqual:@\"observed\"];\n    branch[@\"branch\"] = branchValid ? NYCTronDiagnosticBranchName(_presentationBranch.branch) : unknown;\n    NSMutableDictionary *show = [[self presentationContext:_presentationShow.mark owner:owner] mutableCopy];\n    BOOL showValid = [show[@\"status\"] isEqual:@\"observed\"];\n    show[@\"stage\"] = showValid ? (_presentationShow.returned ? @\"returned\" : @\"entered\") : unknown;\n    show[@\"shownAfterCall\"] = showValid && _presentationShow.returned ? @(_presentationShow.shown) : unknown;\n    show[@\"contentWindowPresent\"] = showValid && _presentationShow.windowRead ? @(_presentationShow.hasWindow) : unknown;\n    show[@\"contained\"] = showValid && _presentationShow.containmentRead ? @(_presentationShow.contained) : unknown;\n    show[@\"coordinatesReady\"] = showValid && _presentationShow.coordinatesRead ? @(_presentationShow.coordinatesReady) : unknown;\n    show[@\"anchor\"] = showValid ? NYCTronDiagnosticRect(_presentationShow.anchor) : unknown;\n    show[@\"region\"] = showValid ? NYCTronDiagnosticRect(_presentationShow.region) : unknown;\n    show[@\"actualFrame\"] = showValid && _presentationShow.containmentRead ? NYCTronDiagnosticRect(_presentationShow.frame) : unknown;\n    return @{ @\"schemaVersion\": @1, @\"status\": @\"observed\", @\"current\": current,\n      @\"lastBranch\": branch, @\"lastShow\": show };\n  } @catch (NSException *exception) { (void)exception; return nil; }\n}\n"},{"path":"packages/macos-appkit/spark/macos/NYCTronPopover.mm","note":"record existing guard/show/containment outcomes without changing their actions","before":"- (void)synchronizePresentation {\n  if (_closing) return;\n  if (!_visible || !_owner || !_content.subviews.count) { [self closeSilently]; return; }\n  if ([_dismissedToken isEqual:_scopeToken] || [_rejectedPresentationToken isEqual:_presentationToken]) return;\n  NSView *positioningView = _owner.contentView;\n  if (!positioningView || !_owner.visible || _owner.miniaturized) { [self closeSilently]; return; }\n  NSRect anchor = _anchor;\n  // The public contract uses top-left owner-content coordinates.\n  if (!positioningView.isFlipped) anchor.origin.y = NSHeight(positioningView.bounds) - NSMaxY(anchor);\n  _content.frame = NSMakeRect(0, 0, _contentSize.width, _contentSize.height);\n  _popover.contentSize = _contentSize;\n  BOOL presenting = !_popover.shown;\n  if (presenting) { _opener = _owner.firstResponder; _presentedToken = [_scopeToken copy]; }\n  NSRectEdge edge = _above ? (positioningView.isFlipped ? NSMinYEdge : NSMaxYEdge) : (positioningView.isFlipped ? NSMaxYEdge : NSMinYEdge);\n  // AppKit may fit against a screen rather than an app-reserved region. Keep\n  // controls hidden until its actual placement satisfies the selected region.\n  // An already presented field must keep its responder/composition while the\n  // owner moves or resizes. Only the initial reveal is hidden for this check.\n  if (presenting) _content.hidden = YES;\n  [_popover showRelativeToRect:anchor ofView:positioningView preferredEdge:edge];\n  if (_popover.shown && _content.window) {\n    [_content layoutSubtreeIfNeeded];\n    // NSWindow.frame includes AppKit's popover border and arrow. The separate\n    // window shadow is an OS effect, not part of the interactive frame.\n    NSRect screenRect = _content.window.frame;\n    NSRect actual = [positioningView convertRect:[_owner convertRectFromScreen:screenRect] fromView:nil];\n    if (!positioningView.isFlipped) actual.origin.y = NSHeight(positioningView.bounds) - NSMaxY(actual);\n    if (NSContainsRect(_allowedRegion, actual)) {\n      // Initial controls remain hidden until the matching Fabric layout has\n      // committed. A shown field stays visible through safe geometry changes.\n      if ([self synchronizeContentCoordinates]) _content.hidden = NO;\n    }\n    else {\n      _rejectedPresentationToken = [_presentationToken copy];\n      [self closeSilently];\n      auto emitter = std::static_pointer_cast<const NYCTronPopoverEventEmitter>(_eventEmitter);\n      if (emitter) {\n        NYCTronPopoverEventEmitter::OnPresentationRejected event;\n        event.scopeToken = _scopeToken.UTF8String ?: \"\";\n        event.presentationToken = _presentationToken.UTF8String ?: \"\";\n        event.x = actual.origin.x; event.y = actual.origin.y;\n        event.width = actual.size.width; event.height = actual.size.height;\n        event.regionX = _allowedRegion.origin.x; event.regionY = _allowedRegion.origin.y;\n        event.regionWidth = _allowedRegion.size.width; event.regionHeight = _allowedRegion.size.height;\n        emitter->onPresentationRejected(event);\n      }\n    }\n  }\n}\n","after":"- (void)synchronizePresentation {\n  NYCTronPresentationMark observation;\n  [self capturePresentationMark:&observation];\n  if (_closing) { [self observePresentationBranch:NYCTronPresentationBranch::Closing mark:observation]; return; }\n  if (!_visible || !_owner || !_content.subviews.count) { [self observePresentationBranch:NYCTronPresentationBranch::ContentPrerequisites mark:observation]; [self closeSilently]; return; }\n  if ([_dismissedToken isEqual:_scopeToken] || [_rejectedPresentationToken isEqual:_presentationToken]) { [self observePresentationBranch:NYCTronPresentationBranch::TokenSuppressed mark:observation]; return; }\n  NSView *positioningView = _owner.contentView;\n  if (!positioningView || !_owner.visible || _owner.miniaturized) { [self observePresentationBranch:NYCTronPresentationBranch::OwnerUnavailable mark:observation]; [self closeSilently]; return; }\n  NSRect anchor = _anchor;\n  // The public contract uses top-left owner-content coordinates.\n  if (!positioningView.isFlipped) anchor.origin.y = NSHeight(positioningView.bounds) - NSMaxY(anchor);\n  _content.frame = NSMakeRect(0, 0, _contentSize.width, _contentSize.height);\n  _popover.contentSize = _contentSize;\n  BOOL presenting = !_popover.shown;\n  if (presenting) { _opener = _owner.firstResponder; _presentedToken = [_scopeToken copy]; }\n  NSRectEdge edge = _above ? (positioningView.isFlipped ? NSMinYEdge : NSMaxYEdge) : (positioningView.isFlipped ? NSMaxYEdge : NSMinYEdge);\n  // AppKit may fit against a screen rather than an app-reserved region. Keep\n  // controls hidden until its actual placement satisfies the selected region.\n  // An already presented field must keep its responder/composition while the\n  // owner moves or resizes. Only the initial reveal is hidden for this check.\n  if (presenting) _content.hidden = YES;\n  [self observePresentationBranch:NYCTronPresentationBranch::ShowEntered mark:observation];\n  @try {\n    _presentationShow = {};\n    _presentationShow.mark = observation; _presentationShow.anchor = anchor; _presentationShow.region = _allowedRegion;\n  } @catch (NSException *exception) { (void)exception; _presentationShow.mark.observed = NO; }\n  [_popover showRelativeToRect:anchor ofView:positioningView preferredEdge:edge];\n  // Cache only the two scalar results of the original short-circuit predicate.\n  BOOL shownAfterCall = _popover.shown;\n  BOOL contentWindowPresent = shownAfterCall && _content.window != nil;\n  if (_presentationShow.mark.observed && _presentationShow.mark.sequence == observation.sequence) {\n    _presentationShow.returned = YES; _presentationShow.shown = shownAfterCall;\n    _presentationShow.windowRead = shownAfterCall; _presentationShow.hasWindow = contentWindowPresent;\n  }\n  if (shownAfterCall && contentWindowPresent) {\n    [_content layoutSubtreeIfNeeded];\n    // NSWindow.frame includes AppKit's popover border and arrow. The separate\n    // window shadow is an OS effect, not part of the interactive frame.\n    NSRect screenRect = _content.window.frame;\n    NSRect actual = [positioningView convertRect:[_owner convertRectFromScreen:screenRect] fromView:nil];\n    if (!positioningView.isFlipped) actual.origin.y = NSHeight(positioningView.bounds) - NSMaxY(actual);\n    if (_presentationShow.mark.observed && _presentationShow.mark.sequence == observation.sequence) {\n      _presentationShow.frame = actual; _presentationShow.region = _allowedRegion;\n      _presentationShow.containmentRead = YES;\n    }\n    if (NSContainsRect(_allowedRegion, actual)) {\n      if (_presentationShow.mark.observed && _presentationShow.mark.sequence == observation.sequence) _presentationShow.contained = YES;\n      // Initial controls remain hidden until the matching Fabric layout has\n      // committed. A shown field stays visible through safe geometry changes.\n      BOOL coordinatesReady = [self synchronizeContentCoordinates];\n      if (_presentationShow.mark.observed && _presentationShow.mark.sequence == observation.sequence) {\n        _presentationShow.coordinatesRead = YES; _presentationShow.coordinatesReady = coordinatesReady;\n      }\n      [self observePresentationBranch:coordinatesReady ? NYCTronPresentationBranch::CoordinatesReady : NYCTronPresentationBranch::CoordinatesPending mark:observation];\n      if (coordinatesReady) _content.hidden = NO;\n    }\n    else {\n      [self observePresentationBranch:NYCTronPresentationBranch::OutsideRegion mark:observation];\n      _rejectedPresentationToken = [_presentationToken copy];\n      [self closeSilently];\n      auto emitter = std::static_pointer_cast<const NYCTronPopoverEventEmitter>(_eventEmitter);\n      if (emitter) {\n        NYCTronPopoverEventEmitter::OnPresentationRejected event;\n        event.scopeToken = _scopeToken.UTF8String ?: \"\";\n        event.presentationToken = _presentationToken.UTF8String ?: \"\";\n        event.x = actual.origin.x; event.y = actual.origin.y;\n        event.width = actual.size.width; event.height = actual.size.height;\n        event.regionX = _allowedRegion.origin.x; event.regionY = _allowedRegion.origin.y;\n        event.regionWidth = _allowedRegion.size.width; event.regionHeight = _allowedRegion.size.height;\n        emitter->onPresentationRejected(event);\n      }\n    }\n  } else {\n    [self observePresentationBranch:shownAfterCall ? NYCTronPresentationBranch::ContentWindowUnavailable : NYCTronPresentationBranch::ShowNotShown mark:observation];\n  }\n}\n"},{"path":"packages/macos-appkit/spark/macos/NYCTronPopover.mm","note":"invalidate diagnostic identities before unchanged recycle cleanup","before":"- (void)prepareForRecycle {\n","after":"- (void)prepareForRecycle {\n  // Recycle invalidates both diagnostic identities before the original cleanup.\n  if (_presentationObservationLifetime == NSUIntegerMax) _presentationObservationUnavailable = YES;\n  else ++_presentationObservationLifetime;\n  @try { _presentationBranch = {}; _presentationShow = {}; }\n  @catch (NSException *exception) { (void)exception; _presentationObservationUnavailable = YES; }\n"},{"path":"examples/macos-appkit/spark/acceptance-driver/NYCTronAcceptanceDriver.mm","note":"attach guarded snapshot to existing popover response only","before":"      result[@\"closeObservation\"] = PopoverCloseObservationState(owner, component, popover);\n","after":"      result[@\"closeObservation\"] = PopoverCloseObservationState(owner, component, popover);\n      result[@\"presentationObservation\"] = NSNull.null;\n      @try {\n        NSDictionary *observation = [component nativePresentationObservationForOwner:owner];\n        if (observation) result[@\"presentationObservation\"] = observation;\n      } @catch (NSException *exception) { (void)exception;\n        // A read-only diagnostic failure cannot replace the existing response.\n      }\n"},{"path":"examples/macos-appkit/spark/verify-native.mjs","note":"add own-data typed presentation-state projection","before":"function projectPopoverResponse(value, firstIdentity = null) {\n","after":"function projectPopoverPresentation(value) {\n  const read = (object, name) => {\n    if (!object || typeof object !== 'object' || Array.isArray(object)) return undefined;\n    const descriptor = Object.getOwnPropertyDescriptor(object, name);\n    return descriptor && Object.prototype.hasOwnProperty.call(descriptor, 'value') ? descriptor.value : undefined;\n  };\n  const boolean = item => typeof item === 'boolean' ? item : null;\n  const choice = (item, allowed) => allowed.includes(item) ? item : null;\n  const rectangle = item => {\n    const names = ['x', 'y', 'width', 'height'];\n    const values = names.map(name => read(item, name));\n    const finite = values.every(field => typeof field === 'number' && Number.isFinite(field));\n    const complete = finite && Number.isFinite(values[0] + values[2]) && Number.isFinite(values[1] + values[3]);\n    return { status: item == null ? 'missing' : complete ? 'observed' : 'invalid',\n      ...Object.fromEntries(names.map((name, index) =>\n        [name, typeof values[index] === 'number' && Number.isFinite(values[index]) ? values[index] : null])) };\n  };\n  const known = read(value, 'schemaVersion') === 1 && read(value, 'status') === 'observed';\n  const current = known ? read(value, 'current') : null;\n  const context = item => {\n    const status = choice(read(item, 'status'), ['observed', 'unavailable', 'stale']);\n    const sameGeneration = boolean(read(item, 'sameGeneration'));\n    const sameLifetime = boolean(read(item, 'sameLifetime'));\n    const sameIdentity = boolean(read(item, 'sameIdentity'));\n    const sameScopeToken = boolean(read(item, 'sameScopeToken'));\n    const samePresentationToken = boolean(read(item, 'samePresentationToken'));\n    const sameParameters = boolean(read(item, 'sameParameters'));\n    return { status, sameGeneration, sameLifetime, sameIdentity, sameScopeToken, samePresentationToken, sameParameters };\n  };\n  const qualified = item => item.status === 'observed' &&\n    item.sameLifetime === true && item.sameIdentity === true;\n  const branchSource = known ? read(value, 'lastBranch') : null;\n  const branch = context(branchSource);\n  const showSource = known ? read(value, 'lastShow') : null;\n  const show = context(showSource);\n  const showValid = qualified(show);\n  const stage = showValid ? choice(read(showSource, 'stage'), ['entered', 'returned']) : null;\n  const returned = stage === 'returned';\n  const contained = returned ? boolean(read(showSource, 'contained')) : null;\n  return {\n    schemaVersion: known ? 1 : null, status: known ? 'observed' : 'unavailable',\n    scope: 'current-fields-and-identity-qualified-last-executed-records',\n    lastRecordsAreHistorical: true,\n    showAnchorCoordinates: 'positioning-view', regionAndFrameCoordinates: 'owner-content-top-left',\n    current: {\n      ...Object.fromEntries(['controlledVisible', 'closing', 'silentClose', 'hasOwner', 'ownerMatchesCommand',\n        'componentWindowMatchesCommand', 'ownerVisible', 'ownerMiniaturized', 'hasPositioningView',\n        'hasContent', 'hasChildren', 'hasContentWindow', 'hasFabricState', 'scopeTokenPresent',\n        'presentationTokenPresent', 'presentedTokenMatches', 'dismissedTokenMatches', 'rejectedTokenMatches']\n        .map(name => [name, boolean(read(current, name))])),\n      preferredEdge: choice(read(current, 'preferredEdge'), ['above', 'below']),\n      anchor: rectangle(read(current, 'anchor')), contentSize: rectangle(read(current, 'contentSize')),\n    },\n    lastBranch: { ...branch, branch: qualified(branch) ? choice(read(branchSource, 'branch'),\n      ['closing', 'content-prerequisites', 'token-suppressed', 'owner-unavailable', 'show-entered',\n        'show-not-shown', 'content-window-unavailable', 'coordinates-pending', 'coordinates-ready', 'outside-region']) : null },\n    lastShow: { ...show, stage,\n      shownAfterCall: returned ? boolean(read(showSource, 'shownAfterCall')) : null,\n      contentWindowPresent: returned ? boolean(read(showSource, 'contentWindowPresent')) : null,\n      contained, coordinatesReady: contained === true ? boolean(read(showSource, 'coordinatesReady')) : null,\n      anchor: rectangle(showValid && stage !== null ? read(showSource, 'anchor') : null),\n      region: rectangle(showValid && stage !== null ? read(showSource, 'region') : null),\n      actualFrame: rectangle(contained !== null ? read(showSource, 'actualFrame') : null),\n    },\n  };\n}\nfunction projectPopoverResponse(value, firstIdentity = null) {\n"},{"path":"examples/macos-appkit/spark/verify-native.mjs","note":"include typed presentation history in existing bounded failure records","before":"      frame, region, geometry: { frameNonempty, regionNonempty, frameInsideRegion },\n","after":"      frame, region, geometry: { frameNonempty, regionNonempty, frameInsideRegion },\n      presentation: projectPopoverPresentation(read(value, 'presentationObservation')),\n"}];
const ensure = (value, message) => { if (!value) throw new Error(message); };
const equal = (actual, expected, message) => { if (actual !== expected) throw new Error(message + ": " + String(actual) + " !== " + String(expected)); };
const same = (actual, expected, message) => equal(JSON.stringify(actual), JSON.stringify(expected), message);
function section(text, begin, end) {
  const start = text.indexOf(begin), finish = text.indexOf(end, start + begin.length);
  ensure(start >= 0 && finish > start, "Missing exact source section " + begin);
  ensure(text.indexOf(begin, start + 1) < 0, "Nonunique source section " + begin);
  return text.slice(start, finish);
}
function extracted(text) {
  const helperStart = text.includes("function projectPopoverPresentation(") ? text.indexOf("function projectPopoverPresentation(") : text.indexOf("function projectPopoverResponse(");
  const shownStart = text.indexOf("async function shownPopover(window = 'main') {");
  return {
    helpers: helperStart < 0 ? "" : text.slice(helperStart, shownStart),
    wait: section(text, "async function waitFor(", "\nconst inspect ="),
    popover: section(text, "const popover =", "\nasync function armPopoverCloseObservation"),
    shown: section(text, "async function shownPopover(window = 'main') {", "\nasync function dragProtocol"),
  };
}
function environment(text, options = {}) {
  const pieces = extracted(text), good = {
    ok: true, nativePopover: true, shown: true, contentVisible: true, contentIdentity: "PRIVATE_IDENTITY_SENTINEL",
    frame: { x: 20, y: 30, width: 40, height: 50 }, region: { x: 0, y: 0, width: 500, height: 400 },
    class: "PRIVATE_CLASS_SENTINEL", classes: ["PRIVATE_NESTED_CLASS"], closeTrace: { scopeToken: "PRIVATE_TOKEN" },
  };
  const values = options.values ?? [good];
  const trace = { time: 0, polls: 0, calls: [], assertions: [], files: [], logs: [], consoleAttempts: 0,
    waitFailure: null, assertionError: null, storage: new Map(), popovers: [] };
  if (options.existingDiagnostic !== undefined) trace.storage.set("/mock-evidence/popover-show-failure.json", options.existingDiagnostic);
  const driver = { request(name, args) {
    trace.calls.push({ name, args }); equal(name, "tron.popover", "Added or changed native command");
    const index = trace.polls++;
    if (options.requestError) return Promise.reject(options.requestError);
    return Promise.resolve(values[Math.min(index, values.length - 1)]);
  } };
  const assertionFailure = message => { const error = new Error(message ?? "Mock assertion failed"); trace.assertionError = error; throw error; };
  const assert = {
    equal(actual, expected, message) { trace.assertions.push({ kind: "equal", actual, expected, message: message ?? null }); if (actual !== expected) assertionFailure(message); },
    ok(value, message) { trace.assertions.push({ kind: "ok", value: Boolean(value), message: message ?? null }); if (!value) assertionFailure(message); },
  };
  const write = (path, content, flags) => {
    trace.files.push({ path, content, flags: flags ?? null });
    if (path.endsWith("/popover-show-failure.json")) {
      equal(flags?.flag, "wx", "Diagnostic output must be exclusive");
      if (options.writeError) throw options.writeError;
      if (trace.storage.has(path)) { const error = new Error("private duplicate detail"); error.code = "EEXIST"; throw error; }
    } else {
      equal(path, "/mock-evidence/popovers.json", "Unexpected filesystem output");
      if (options.popoversWriteError) throw options.popoversWriteError;
    }
    trace.storage.set(path, content);
  };
  const instrument = [
    "const originalWaitFor = waitFor;",
    "waitFor = async (...args) => { try { return await originalWaitFor(...args); } catch (error) { trace.waitFailure = error; throw error; } };",
    "return { shownPopover,",
    "project: typeof projectPopoverResponse === 'function' ? projectPopoverResponse : null,",
    "create: typeof createPopoverObservation === 'function' ? createPopoverObservation : null,",
    "capture: typeof capturePopoverResponse === 'function' ? capturePopoverResponse : null,",
    "summary: typeof popoverObservationSummary === 'function' ? popoverObservationSummary : null,",
    "report: typeof reportPopoverFailure === 'function' ? reportPopoverFailure : null };",
  ].join("\n");
  const program = pieces.helpers + "\n" + pieces.wait + "\n" + pieces.popover + "\n" + pieces.shown + "\n" + instrument;
  const api = new Function("driver", "assert", "pause", "Date", "Buffer", "writeFileSync", "join", "output", "revision", "console", "assertRunning", "trace", "popovers", program)(
    driver, assert, async milliseconds => { trace.time += milliseconds; }, { now: () => trace.time },
    { byteLength: value => H.utf8(value).length }, write, (...parts) => parts.join("/"), "/mock-evidence", "a".repeat(40),
    { info(value) { trace.consoleAttempts++; if (options.consoleError) throw options.consoleError; trace.logs.push(value); } },
    () => { if (options.runningError) throw options.runningError; }, trace, trace.popovers);
  return { trace, api, good, async run(owner = "document-1") {
    try { return { value: await api.shownPopover(owner), error: null }; } catch (error) { return { value: null, error }; }
  } };
}
function envelope(text) {
  const lines = text.split("\n");
  equal(lines.length, 3, "Envelope must be complete three-line output");
  equal(lines[0], "NYCTRON_POPOVER_SHOW_EVIDENCE_BEGIN", "Wrong begin marker");
  equal(lines[2], "NYCTRON_POPOVER_SHOW_EVIDENCE_END", "Wrong end marker");
  ensure(H.utf8(text + "\n").length <= 8192, "Console envelope exceeded eight KiB");
  return JSON.parse(lines[1]);
}
function privateOutput(trace) {
  const selected = trace.files.filter(file => file.path.endsWith("/popover-show-failure.json")).map(file => file.content).concat(trace.logs).join("\n");
  for (const forbidden of ["PRIVATE_IDENTITY_SENTINEL", "PRIVATE_CLASS_SENTINEL", "PRIVATE_NESTED_CLASS", "PRIVATE_TOKEN", "PRIVATE_ERROR_SENTINEL"])
    ensure(!selected.includes(forbidden), "Diagnostic leaked " + forbidden);
}



return async function reviewPopoverPresentation(input) {
  const groups = [], metrics = {};
  const keys = ["header", "native", "driver", "verifier"];
  for (const key of keys) {
    const before = input[key + "Preimage"], after = input[key], identity = expected[key];
    equal(H.blob(before), identity.preimage, "Wrong " + key + " preimage");
    equal(H.blob(after), identity.gitBlob, "Wrong " + key + " candidate");
    equal(H.utf8(after).length, identity.bytes, "Wrong " + key + " size");
    equal(H.sha256(after), identity.sha256, "Wrong " + key + " SHA256");
    let forward = before;
    for (const edit of edits.filter(edit => edit.path === identity.path)) {
      equal(forward.split(edit.before).length, 2, "Nonunique forward " + edit.note);
      forward = forward.replace(edit.before, edit.after);
    }
    equal(forward, after, "Full forward differs for " + key);
    let inverse = after;
    for (const edit of [...edits].reverse().filter(edit => edit.path === identity.path)) {
      equal(inverse.split(edit.after).length, 2, "Nonunique inverse " + edit.note);
      inverse = inverse.replace(edit.after, edit.before);
    }
    equal(inverse, before, "Full inverse differs for " + key);
  }
  equal(edits.length, 9, "Unexpected edit count");
  const source = input.verifier, preimage = input.verifierPreimage;
  const before = extracted(preimage), after = extracted(source);
  equal(before.wait, after.wait, "Original wait/deadline changed");
  equal(before.popover, after.popover, "Original request helper changed");
  equal(before.shown, after.shown, "Original presentation polling/actions/assertions changed");
  equal(section(preimage, "function createPopoverObservation", "async function shownPopover"),
    section(source, "function createPopoverObservation", "async function shownPopover"),
    "Existing capture/record bound/file/error/console reporter changed");
  equal(preimage.slice(preimage.indexOf("async function shownPopover")),
    source.slice(source.indexOf("async function shownPopover")), "Runtime/error/cleanup suffix changed");
  const parseOnly = source.replace(/^import .*;\r?$/gm, "").replaceAll("import.meta.url", '"file:///review/verify-native.mjs"');
  new (Object.getPrototypeOf(async function(){}).constructor)(parseOnly);
  groups.push("four exact identities, nine reversible edits, unchanged request/wait/recorder/runtime suffix and V8 parse only");

  const nativeHelpers = section(input.native, "- (void)capturePresentationMark:", "- (void)closeSilently");
  for (const forbidden of ["showRelativeToRect:", "layoutSubtreeIfNeeded", "synchronizeContentCoordinates]", "schedulePresentation]", "performClose:", "makeKeyAndOrderFront:", "NSLog("])
    ensure(!nativeHelpers.includes(forbidden), "Snapshot/capture helper performs " + forbidden);
  ensure(input.native.includes("if (!NSThread.isMainThread) return nil;"), "Missing UI-thread refusal");
  ensure(input.native.includes("lifetime && identity ? @\"observed\" : @\"stale\""), "History validity changed");
  ensure(!input.native.includes("lifetime && identity && parameters ?"), "Parameter change erases history");
  ensure(input.native.includes("mark->sequence = ++_presentationObservationSequence"), "Missing per-invocation ownership sequence");
  ensure(input.native.includes("_presentationObservationSequence == NSUIntegerMax"), "Missing overflow refusal");
  equal((input.native.match(/_presentationShow\.mark\.sequence == observation\.sequence/g) || []).length, 4, "Show updates lack exact invocation ownership");
  ensure(input.native.includes("__weak NSWindow *owner") && input.native.includes("__weak NSView *content") &&
    input.native.includes("__weak NSPopover *popover"), "Historical record retains a visual strongly");
  ensure(!input.native.includes("@catch (NSException *)") && !input.driver.includes("@catch (NSException *)"), "Unnamed new exception declaration remains");
  const syncBefore = section(input.nativePreimage, "- (void)synchronizePresentation {", "- (void)viewDidMoveToWindow {");
  const syncAfter = section(input.native, "- (void)synchronizePresentation {", "- (void)viewDidMoveToWindow {");
  for (const action of ["[_popover showRelativeToRect:anchor ofView:positioningView preferredEdge:edge];",
    "[_content layoutSubtreeIfNeeded];", "NSContainsRect(_allowedRegion, actual)", "[self synchronizeContentCoordinates]",
    "_rejectedPresentationToken = [_presentationToken copy];", "emitter->onPresentationRejected(event);"]) {
    equal(syncBefore.split(action).length, 2, "Missing original native action");
    equal(syncAfter.split(action).length, 2, "Native action repeated/removed");
  }
  ensure(syncAfter.includes("BOOL shownAfterCall = _popover.shown;\n  BOOL contentWindowPresent = shownAfterCall && _content.window != nil;"),
    "Short-circuit scalar cache changed");
  const compareScalar = (shown, hasWindow, cached) => {
    const trace = [];
    const object = { get shown() { trace.push("shown"); return shown; }, get window() { trace.push("window"); return hasWindow ? {} : null; } };
    let result;
    if (cached) { const currentShown = object.shown, currentWindow = currentShown && object.window != null; result = !!(currentShown && currentWindow); }
    else result = !!(object.shown && object.window);
    return { result, trace };
  };
  for (const shown of [false, true]) for (const hasWindow of [false, true])
    same(compareScalar(shown, hasWindow, true), compareScalar(shown, hasWindow, false), "Scalar read order changed");
  groups.push("native source-only observer/action/thread/lifetime review and four modeled scalar short-circuit comparisons; no Objective-C execution");

  const pure = environment(source), projection = value => pure.api.project({presentationObservation: value}).state.presentation;
  const rect = { x: 10, y: 20, width: 30, height: 40 };
  const context = { status: "observed", sameGeneration: true, sameLifetime: true, sameIdentity: true,
    sameScopeToken: true, samePresentationToken: true, sameParameters: true };
  const observed = () => ({
    schemaVersion: 1, status: "observed",
    current: {
      controlledVisible: true, closing: false, silentClose: false, hasOwner: true, ownerMatchesCommand: true,
      componentWindowMatchesCommand: true, ownerVisible: true, ownerMiniaturized: false, hasPositioningView: true,
      hasContent: true, hasChildren: true, hasContentWindow: false, hasFabricState: true,
      scopeTokenPresent: true, presentationTokenPresent: true, presentedTokenMatches: true,
      dismissedTokenMatches: false, rejectedTokenMatches: true, preferredEdge: "below",
      anchor: {...rect}, contentSize: {x:0,y:0,width:320,height:300},
      token: "PRIVATE_TOKEN", pointer: "PRIVATE_IDENTITY_SENTINEL", text: "PRIVATE_CLASS_SENTINEL"
    },
    lastBranch: {...context, branch: "outside-region", rawToken: "PRIVATE_TOKEN"},
    lastShow: {...context, stage: "returned", shownAfterCall: true, contentWindowPresent: true,
      contained: false, coordinatesReady: null, anchor: {...rect},
      region: {x:0,y:0,width:680,height:592}, actualFrame:{x:600,y:300,width:320,height:300},
      symbol: "PRIVATE_CLASS_SENTINEL"},
    arbitrary: "PRIVATE_NESTED_CLASS"
  });
  const valid = projection(observed());
  equal(valid.current.closing, false, "Observed false coerced to unknown/true");
  equal(valid.current.rejectedTokenMatches, true, "True predicate lost");
  equal(valid.lastBranch.branch, "outside-region", "Executed branch lost");
  equal(valid.lastShow.contained, false, "Observed outside-region result lost");
  equal(valid.lastShow.actualFrame.x, 600, "Actual historical geometry lost");
  ensure(valid.lastRecordsAreHistorical, "History mislabeled current");
  equal(valid.showAnchorCoordinates, "positioning-view", "Show anchor coordinates mislabeled");
  equal(valid.regionAndFrameCoordinates, "owner-content-top-left", "Actual frame coordinates mislabeled");
  for (const secret of ["PRIVATE_TOKEN","PRIVATE_IDENTITY_SENTINEL","PRIVATE_CLASS_SENTINEL","PRIVATE_NESTED_CLASS"])
    ensure(!JSON.stringify(valid).includes(secret), "Projection leaked " + secret);
  const malformed = observed();
  malformed.current.closing = "false"; delete malformed.current.silentClose;
  malformed.current.anchor = {x:Infinity,y:0,width:5,height:4}; malformed.current.preferredEdge = "PRIVATE_TOKEN";
  const bad = projection(malformed);
  equal(bad.current.closing, null, "String coerced to Boolean"); equal(bad.current.silentClose, null, "Missing Boolean became false");
  equal(bad.current.anchor.x, null, "Nonfinite native geometry retained");
  equal(bad.current.anchor.status, "invalid", "Invalid geometry lost status");
  equal(bad.current.preferredEdge, null, "Arbitrary edge enum retained");
  same(projection(null).current, projection({schemaVersion:"1", status:"observed", current:observed().current}).current,
    "Malformed schema exposed fields");
  groups.push("typed current fields, false versus unknown, finite geometry, fixed enums and no token/pointer/arbitrary-text projection");

  for (const field of ["sameGeneration", "sameScopeToken", "samePresentationToken", "sameParameters"]) {
    const value = observed(); value.lastBranch[field] = false; value.lastShow[field] = false;
    const result = projection(value);
    equal(result.lastBranch[field], false, "Historical equality qualifier lost");
    equal(result.lastBranch.branch, "outside-region", "Changed controlled state erased last executed branch");
    equal(result.lastShow.actualFrame.x, 600, "Changed controlled state erased actual show geometry");
    equal(result.lastShow.contained, false, "Changed controlled state erased actual containment result");
  }
  for (const field of ["sameLifetime", "sameIdentity"]) {
    const value = observed(); value.lastBranch[field] = false; value.lastShow[field] = false;
    const result = projection(value);
    equal(result.lastBranch.branch, null, "Stale lifetime/object branch leaked");
    equal(result.lastShow.stage, null, "Stale lifetime/object show leaked");
    equal(result.lastShow.actualFrame.status, "missing", "Stale geometry leaked");
  }
  for (const status of ["unavailable", "stale", "PRIVATE_TOKEN"]) {
    const value = observed(); value.lastBranch.status = status; value.lastShow.status = status;
    const result = projection(value);
    equal(result.lastBranch.branch, null, "Unobserved branch became observed");
    equal(result.lastShow.contained, null, "Unobserved containment became false");
  }
  const never = projection({schemaVersion:1,status:"observed",current:{},lastBranch:{},lastShow:{}});
  equal(never.lastShow.sameLifetime, null, "Missing qualifier became false");
  equal(never.lastShow.shownAfterCall, null, "Never-read show became false");
  groups.push("historical generation/token/parameter changes retained; owner/object/recycle mismatch and never-captured records remain unknown");

  const entered = observed(); entered.lastShow.stage = "entered";
  const entry = projection(entered);
  equal(entry.lastShow.stage, "entered", "Entered call stage lost");
  equal(entry.lastShow.shownAfterCall, null, "Entered call invented a return");
  equal(entry.lastShow.contained, null, "Entered call invented containment");
  equal(entry.lastShow.actualFrame.status, "missing", "Entered call leaked unobserved frame");
  const pending = observed(); pending.lastBranch.branch = "coordinates-pending";
  pending.lastShow.contained = true; pending.lastShow.coordinatesReady = false;
  equal(projection(pending).lastShow.coordinatesReady, false, "Actual pending coordinates lost");
  const overflow = observed(); overflow.lastShow.actualFrame={x:Number.MAX_VALUE,y:0,width:Number.MAX_VALUE,height:5};
  equal(projection(overflow).lastShow.actualFrame.status, "invalid", "Overflowing rectangle accepted");
  let reads = 0;
  const accessor = observed(); Object.defineProperty(accessor.current,"closing",{get(){reads++;throw new Error("PRIVATE_ERROR_SENTINEL");}});
  Object.defineProperty(accessor.lastShow,"actualFrame",{get(){reads++;throw new Error("PRIVATE_ERROR_SENTINEL");}});
  const projected = projection(accessor);
  equal(reads,0,"Projection invoked an accessor"); equal(projected.current.closing,null,"Accessor treated as data");
  equal(projected.lastShow.actualFrame.status,"missing","Accessor frame treated as observed");
  groups.push("entered-versus-returned show stage, containment/readiness separation, overflow geometry and getter-free own-data access");

  const response = (presentation, contentVisible=false) => ({
    nativePopover:true,shown:false,contentVisible,contentIdentity:"PRIVATE_IDENTITY_SENTINEL",
    region:{x:0,y:0,width:680,height:592},presentationObservation:presentation,
    rawScope:"PRIVATE_TOKEN"
  });
  const states = [response(observed(),true), response(observed(),false)];
  states[1].presentationObservation.current.controlledVisible=false;
  states[1].presentationObservation.lastShow.sameGeneration=false;
  states[1].presentationObservation.lastShow.sameScopeToken=false;
  states[1].presentationObservation.lastShow.samePresentationToken=false;
  states[1].presentationObservation.lastShow.sameParameters=false;
  const oldRun=environment(preimage,{values:states}), newRun=environment(source,{values:states});
  const oldFailure=await oldRun.run(), newFailure=await newRun.run();
  equal(newFailure.error,newRun.trace.waitFailure,"Original timeout identity replaced");
  equal(newFailure.error.message,oldFailure.error.message,"Original timeout text changed");
  equal(newRun.trace.time,20000,"Deadline changed"); equal(newRun.trace.polls,400,"Polling count changed");
  same(newRun.trace.calls,oldRun.trace.calls,"Commands/arguments/order changed");
  equal(newRun.trace.logs.length,1,"Missing or duplicate failure envelope");
  const failure=envelope(newRun.trace.logs[0]);
  equal(failure.returnedResponses,400,"Returned-response count changed");
  ensure(failure.records.length<=8,"Record count exceeded cap");
  equal(failure.records.at(-1).presentation.lastShow.contained,false,"Historical containment lost after controlled-close props");
  equal(failure.records.at(-1).presentation.lastShow.sameScopeToken,false,"Historical token change omitted");
  privateOutput(newRun.trace);
  const success=environment(source), successful=await success.run();
  equal(successful.error,null,"Original successful presentation failed");equal(success.trace.calls.length,1,"Success added a request");
  equal(success.trace.logs.length,0,"Success emitted failure diagnostics");
  metrics.polls=newRun.trace.polls;metrics.commands=newRun.trace.calls.length;metrics.mockMilliseconds=newRun.trace.time;
  metrics.failureEnvelopeBytes=H.utf8(newRun.trace.logs[0]+"\n").length;
  groups.push("actual extracted show/wait functions: unchanged 400 requests/20,000 mock ms, exact timeout identity and one-request success");

  const primary=new Error("PRIVATE_ERROR_SENTINEL");
  for (const options of [
    {requestError:primary,writeError:Object.assign(new Error("PRIVATE_WRITE"),{code:"EPERM"})},
    {requestError:primary,consoleError:new Error("PRIVATE_CONSOLE")},
    {requestError:primary,existingDiagnostic:"FIRST_ORIGINAL_BYTES"},
  ]) {
    const test=environment(source,options), result=await test.run();
    equal(result.error,primary,"Reporter replaced original request error");
    equal(test.trace.calls.length,1,"Failure added a native request");
    if(options.existingDiagnostic)equal(test.trace.storage.get("/mock-evidence/popover-show-failure.json"),"FIRST_ORIGINAL_BYTES","Duplicate write replaced original");
    if(test.trace.logs.length){const selected=envelope(test.trace.logs[0]);ensure(["failed","retained"].includes(selected.original.writeStatus),"Write status missing");}
    privateOutput(test.trace);
  }
  const capture=environment(source);
  const hostile= new Proxy({}, {getOwnPropertyDescriptor(){throw new Error("PRIVATE_ERROR_SENTINEL");}});
  const observation=capture.api.create("document-1");capture.api.capture(observation,response(hostile));
  equal(observation.captureFailed,true,"Projection error not accounted");
  capture.api.report(observation);envelope(capture.trace.logs[0]);privateOutput(capture.trace);
  groups.push("request Error identity, exclusive first receipt, secondary write/log failure and throwing own-data projection isolation");

  const stress=environment(source), collected=stress.api.create("document-1");
  for(let i=0;i<40;i++){
    const value=observed();value.current.closing=i%2===0;value.lastShow.sameGeneration=i%3===0;
    const maximum={x:-Number.MAX_VALUE/4,y:Number.MAX_VALUE/4,width:1.2345678901234567e200,height:9.876543210987654e199};
    value.current.anchor={...maximum};value.current.contentSize={...maximum};
    value.lastShow.anchor={...maximum};value.lastShow.region={...maximum};value.lastShow.actualFrame={...maximum};
    stress.api.capture(collected,response(value));
  }
  equal(collected.retained.length,7,"First/recent in-memory bound changed");
  stress.api.report(collected);
  const report=envelope(stress.trace.logs[0]);
  ensure(report.records.length<=8,"Output record bound exceeded");
  ensure(report.recordsOmittedForByteLimit>0,"Byte-budget trimming was not exercised");
  ensure(report.records.length>=2,"Useful first/last observations unexpectedly lost");
  equal(report.records[0].response,1,"First observation lost");
  equal(report.records.at(-1).response,40,"Last observation lost");
  equal(report.omittedResponses,40-report.records.length,"Omitted response count wrong after byte trim");
  equal(report.omittedStateChanges,39-report.records.filter(record=>record.stateChange).length,"Omitted state changes wrong after trim");
  ensure(report.records.some(record=>record.presentation.lastShow.contained===false),"Bounded history lost all actual containment");
  const file=stress.trace.storage.get("/mock-evidence/popover-show-failure.json");
  ensure(H.utf8(file).length<=8192,"Original retained selected JSON exceeds bound");
  equal(JSON.parse(file).selectedRecords,report.selectedRecords,"Original/console selection differs");
  privateOutput(stress.trace);
  metrics.stressEnvelopeBytes=H.utf8(stress.trace.logs[0]+"\n").length;
  metrics.stressSelectedRecords=report.selectedRecords;
  metrics.stressOmittedRecordsForBytes=report.recordsOmittedForByteLimit;
  groups.push("eight-record and complete 8 KiB envelope limits, useful first/last history and exact post-trim omission accounting");

  equal(groups.length,8,"Unexpected design count");
  return {scope:"eight author designs; pure V8/extracted-function mocks and native source inspection only; no Node filesystem, Objective-C, AppKit or CI execution",groups,metrics};
};

})()