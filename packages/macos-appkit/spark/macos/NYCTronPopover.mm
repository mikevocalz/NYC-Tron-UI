#import "NYCTronPopover.h"
#import "NYCTronPopoverComponentDescriptor.h"
#import <React/RCTSurfaceTouchHandler.h>
#import <react/renderer/components/NYCTronAppKitSpec/EventEmitters.h>
#import <react/renderer/components/NYCTronAppKitSpec/Props.h>

#include <cmath>

// Fixed diagnostic slots only. Tokens and weak object identities remain private;
// no diagnostic path calls layout, presentation, focus or a client callback.
enum class NYCTronPresentationBranch {
  Unknown, Closing, ContentPrerequisites, TokenSuppressed, OwnerUnavailable,
  ShowEntered, ShowNotShown, ContentWindowUnavailable, CoordinatesPending,
  CoordinatesReady, OutsideRegion
};
struct NYCTronPresentationMark {
  BOOL observed{NO}, ownerWasPresent{NO};
  NSUInteger sequence{}, generation{}, lifetime{};
  __weak NSWindow *owner = nil;
  __weak NSView *content = nil;
  __weak NSPopover *popover = nil;
  NSString *scope = nil;
  NSString *presentation = nil;
  NSRect anchor{}, region{};
  NSSize size{};
  BOOL visible{NO}, above{NO};
};
struct NYCTronPresentationBranchRecord {
  NYCTronPresentationMark mark;
  NYCTronPresentationBranch branch{NYCTronPresentationBranch::Unknown};
};
struct NYCTronPresentationShowRecord {
  NYCTronPresentationMark mark;
  BOOL returned{NO}, shown{NO}, windowRead{NO}, hasWindow{NO};
  BOOL containmentRead{NO}, contained{NO}, coordinatesRead{NO}, coordinatesReady{NO};
  NSRect anchor{}, region{}, frame{};
};
static BOOL NYCTronDiagnosticTokenEqual(NSString *a, NSString *b) {
  return a == b || (a && b && [a isEqualToString:b]);
}
static id NYCTronDiagnosticRect(NSRect rect) {
  const double x = rect.origin.x, y = rect.origin.y, width = rect.size.width, height = rect.size.height;
  if (!std::isfinite(x) || !std::isfinite(y) || !std::isfinite(width) || !std::isfinite(height) ||
      !std::isfinite(x + width) || !std::isfinite(y + height)) return NSNull.null;
  return @{ @"x": @(x), @"y": @(y), @"width": @(width), @"height": @(height) };
}
static id NYCTronDiagnosticBranchName(NYCTronPresentationBranch branch) {
  switch (branch) {
    case NYCTronPresentationBranch::Closing: return @"closing";
    case NYCTronPresentationBranch::ContentPrerequisites: return @"content-prerequisites";
    case NYCTronPresentationBranch::TokenSuppressed: return @"token-suppressed";
    case NYCTronPresentationBranch::OwnerUnavailable: return @"owner-unavailable";
    case NYCTronPresentationBranch::ShowEntered: return @"show-entered";
    case NYCTronPresentationBranch::ShowNotShown: return @"show-not-shown";
    case NYCTronPresentationBranch::ContentWindowUnavailable: return @"content-window-unavailable";
    case NYCTronPresentationBranch::CoordinatesPending: return @"coordinates-pending";
    case NYCTronPresentationBranch::CoordinatesReady: return @"coordinates-ready";
    case NYCTronPresentationBranch::OutsideRegion: return @"outside-region";
    default: return NSNull.null;
  }
}

using namespace facebook::react;

@interface NYCTronPopoverContent : NSView
@end
@implementation NYCTronPopoverContent
- (BOOL)isFlipped { return YES; }
@end

@interface NYCTronPopoverContentController : NSViewController
@property (nonatomic, weak) NSPopover *popover;
@end
@implementation NYCTronPopoverContentController
- (void)cancelOperation:(id)sender { [self.popover performClose:sender]; }
@end

@implementation NYCTronPopoverComponentView {
  NSPopover *_popover;
  NYCTronPopoverContent *_content;
  RCTSurfaceTouchHandler *_touchHandler;
  NYCTronPopoverRootShadowNode::ConcreteState::Shared _state;
  __weak NSWindow *_owner;
  __weak NSResponder *_opener;
  NSString *_scopeToken;
  NSString *_presentationToken;
  NSString *_presentedToken;
  NSString *_dismissedToken;
  NSString *_rejectedPresentationToken;
  NSRect _anchor;
  NSRect _allowedRegion;
  NSSize _contentSize;
  BOOL _visible;
  BOOL _above;
  BOOL _silentClose;
  BOOL _closing;
  BOOL _restoreFocus;
  NSUInteger _generation;
  NSUInteger _presentationObservationSequence, _presentationObservationLifetime;
  BOOL _presentationObservationUnavailable;
  NYCTronPresentationBranchRecord _presentationBranch;
  NYCTronPresentationShowRecord _presentationShow;
}
- (instancetype)init {
  if (self = [super init]) {
    _props = std::make_shared<const NYCTronPopoverProps>();
    _content = [NYCTronPopoverContent new];
    _content.accessibilityRole = NSAccessibilityGroupRole;
    _content.accessibilityElement = YES;
    // RNmacOS 0.83 hit-tests the retained Fabric children and dispatches through
    // each child's existing touch event emitter/EventTarget. The native view
    // ancestry need not contain another RCTSurfaceHostingView or React root.
    _touchHandler = [RCTSurfaceTouchHandler new];
    [_touchHandler attachToView:_content];
    _popover = [NSPopover new];
    _popover.behavior = NSPopoverBehaviorTransient;
    _popover.delegate = self;
    [self observePopoverNotifications];
    NYCTronPopoverContentController *controller = [NYCTronPopoverContentController new];
    controller.view = _content; controller.popover = _popover;
    _popover.contentViewController = controller;
  }
  return self;
}
- (NSPopover *)nativePopover { return _popover; }
- (NSRect)nativeAllowedRegion { return _allowedRegion; }
- (void)capturePresentationMark:(NYCTronPresentationMark *)mark {
  @try {
    if (_presentationObservationUnavailable || _presentationObservationSequence == NSUIntegerMax) {
      _presentationObservationUnavailable = YES;
      return;
    }
    mark->sequence = ++_presentationObservationSequence;
    mark->generation = _generation; mark->lifetime = _presentationObservationLifetime;
    mark->owner = _owner; mark->ownerWasPresent = _owner != nil;
    mark->content = _content; mark->popover = _popover;
    mark->scope = _scopeToken; mark->presentation = _presentationToken;
    mark->anchor = _anchor; mark->region = _allowedRegion; mark->size = _contentSize;
    mark->visible = _visible; mark->above = _above; mark->observed = YES;
  } @catch (NSException *exception) { (void)exception; mark->observed = NO; }
}
- (void)observePresentationBranch:(NYCTronPresentationBranch)branch mark:(NYCTronPresentationMark const &)mark {
  @try {
    if (mark.observed && !_presentationObservationUnavailable && mark.lifetime == _presentationObservationLifetime) {
      _presentationBranch.mark = mark; _presentationBranch.branch = branch;
    }
  } @catch (NSException *exception) { (void)exception; _presentationBranch.mark.observed = NO; }
}
- (NSDictionary *)presentationContext:(NYCTronPresentationMark const &)mark owner:(NSWindow *)owner {
  if (!mark.observed || _presentationObservationUnavailable) return @{
    @"status": @"unavailable", @"sameGeneration": NSNull.null, @"sameLifetime": NSNull.null,
    @"sameIdentity": NSNull.null, @"sameScopeToken": NSNull.null,
    @"samePresentationToken": NSNull.null, @"sameParameters": NSNull.null
  };
  BOOL lifetime = mark.lifetime == _presentationObservationLifetime;
  BOOL identity = owner && _owner == owner && self.window == owner &&
    (mark.ownerWasPresent ? mark.owner && mark.owner == _owner : !_owner) &&
    mark.content && mark.content == _content && mark.popover && mark.popover == _popover;
  BOOL scope = NYCTronDiagnosticTokenEqual(mark.scope, _scopeToken);
  BOOL presentation = NYCTronDiagnosticTokenEqual(mark.presentation, _presentationToken);
  BOOL parameters = NSEqualRects(mark.anchor, _anchor) && NSEqualRects(mark.region, _allowedRegion) &&
    NSEqualSizes(mark.size, _contentSize) && mark.visible == _visible && mark.above == _above;
  // Last executed records remain historical when controlled props/tokens change.
  // Only recycle or actual owner/object identity loss invalidates their values.
  return @{ @"status": lifetime && identity ? @"observed" : @"stale",
    @"sameGeneration": @(mark.generation == _generation), @"sameLifetime": @(lifetime),
    @"sameIdentity": @(identity), @"sameScopeToken": @(scope),
    @"samePresentationToken": @(presentation), @"sameParameters": @(parameters) };
}
- (NSDictionary *)nativePresentationObservationForOwner:(NSWindow *)owner {
  if (!NSThread.isMainThread) return nil;
  @try {
    id unknown = NSNull.null;
    NSDictionary *current = @{
      @"controlledVisible": @(_visible), @"closing": @(_closing), @"silentClose": @(_silentClose),
      @"hasOwner": @(_owner != nil), @"ownerMatchesCommand": _owner ? @(_owner == owner) : unknown,
      @"componentWindowMatchesCommand": self.window ? @(self.window == owner) : unknown,
      @"ownerVisible": _owner ? @(_owner.visible) : unknown,
      @"ownerMiniaturized": _owner ? @(_owner.miniaturized) : unknown,
      @"hasPositioningView": _owner ? @(_owner.contentView != nil) : unknown,
      @"hasContent": @(_content != nil), @"hasChildren": _content ? @(_content.subviews.count > 0) : unknown,
      @"hasContentWindow": _content ? @(_content.window != nil) : unknown, @"hasFabricState": @(_state != nullptr),
      @"scopeTokenPresent": @(_scopeToken != nil), @"presentationTokenPresent": @(_presentationToken != nil),
      @"presentedTokenMatches": _scopeToken ? @([_presentedToken isEqual:_scopeToken]) : unknown,
      @"dismissedTokenMatches": _scopeToken ? @([_dismissedToken isEqual:_scopeToken]) : unknown,
      @"rejectedTokenMatches": _presentationToken ? @([_rejectedPresentationToken isEqual:_presentationToken]) : unknown,
      @"preferredEdge": _above ? @"above" : @"below", @"anchor": NYCTronDiagnosticRect(_anchor),
      @"contentSize": NYCTronDiagnosticRect(NSMakeRect(0, 0, _contentSize.width, _contentSize.height))
    };
    NSMutableDictionary *branch = [[self presentationContext:_presentationBranch.mark owner:owner] mutableCopy];
    BOOL branchValid = [branch[@"status"] isEqual:@"observed"];
    branch[@"branch"] = branchValid ? NYCTronDiagnosticBranchName(_presentationBranch.branch) : unknown;
    NSMutableDictionary *show = [[self presentationContext:_presentationShow.mark owner:owner] mutableCopy];
    BOOL showValid = [show[@"status"] isEqual:@"observed"];
    show[@"stage"] = showValid ? (_presentationShow.returned ? @"returned" : @"entered") : unknown;
    show[@"shownAfterCall"] = showValid && _presentationShow.returned ? @(_presentationShow.shown) : unknown;
    show[@"contentWindowPresent"] = showValid && _presentationShow.windowRead ? @(_presentationShow.hasWindow) : unknown;
    show[@"contained"] = showValid && _presentationShow.containmentRead ? @(_presentationShow.contained) : unknown;
    show[@"coordinatesReady"] = showValid && _presentationShow.coordinatesRead ? @(_presentationShow.coordinatesReady) : unknown;
    show[@"anchor"] = showValid ? NYCTronDiagnosticRect(_presentationShow.anchor) : unknown;
    show[@"region"] = showValid ? NYCTronDiagnosticRect(_presentationShow.region) : unknown;
    show[@"actualFrame"] = showValid && _presentationShow.containmentRead ? NYCTronDiagnosticRect(_presentationShow.frame) : unknown;
    return @{ @"schemaVersion": @1, @"status": @"observed", @"current": current,
      @"lastBranch": branch, @"lastShow": show };
  } @catch (NSException *exception) { (void)exception; return nil; }
}
- (void)closeSilently {
  if (_popover.shown) { _silentClose = YES; [_popover close]; }
}
- (void)schedulePresentation {
  NSUInteger generation = ++_generation;
  __weak NYCTronPopoverComponentView *weakSelf = self;
  dispatch_async(dispatch_get_main_queue(), ^{
    NYCTronPopoverComponentView *view = weakSelf;
    if (view && view->_generation == generation) [view synchronizePresentation];
  });
}
- (BOOL)synchronizeContentCoordinates {
  if (!_state || !_content.window) return NO;
  NSRect contentRect = [_content convertRect:_content.bounds toView:nil];
  NSSize windowSize = _content.window.frame.size;
  // RNmacOS touch.page coordinates use the NSWindow frame's top-left, rather
  // than the popover's inner content origin. Include the actual border/arrow.
  facebook::react::Point origin{(Float)NSMinX(contentRect), (Float)(windowSize.height - NSMaxY(contentRect))};
  facebook::react::Size size{(Float)windowSize.width, (Float)windowSize.height};
  const auto &data = _state->getData();
  if (data.contentOrigin != origin || data.viewportSize != size) {
    _state->updateState(NYCTronPopoverRootStateData(origin, size));
    return NO;
  }
  // Yoga includes that origin for Fabric measurement. Subtract it exactly
  // once in native drawing, keeping the retained children at the same place.
  [_content setBoundsOrigin:NSMakePoint(origin.x, origin.y)];
  return YES;
}
- (void)synchronizePresentation {
  NYCTronPresentationMark observation;
  [self capturePresentationMark:&observation];
  if (_closing) { [self observePresentationBranch:NYCTronPresentationBranch::Closing mark:observation]; return; }
  if (!_visible || !_owner || !_content.subviews.count) { [self observePresentationBranch:NYCTronPresentationBranch::ContentPrerequisites mark:observation]; [self closeSilently]; return; }
  if ([_dismissedToken isEqual:_scopeToken] || [_rejectedPresentationToken isEqual:_presentationToken]) { [self observePresentationBranch:NYCTronPresentationBranch::TokenSuppressed mark:observation]; return; }
  NSView *positioningView = _owner.contentView;
  if (!positioningView || !_owner.visible || _owner.miniaturized) { [self observePresentationBranch:NYCTronPresentationBranch::OwnerUnavailable mark:observation]; [self closeSilently]; return; }
  NSRect anchor = _anchor;
  // The public contract uses top-left owner-content coordinates.
  if (!positioningView.isFlipped) anchor.origin.y = NSHeight(positioningView.bounds) - NSMaxY(anchor);
  _content.frame = NSMakeRect(0, 0, _contentSize.width, _contentSize.height);
  _popover.contentSize = _contentSize;
  BOOL presenting = !_popover.shown;
  if (presenting) { _opener = _owner.firstResponder; _presentedToken = [_scopeToken copy]; }
  NSRectEdge edge = _above ? (positioningView.isFlipped ? NSMinYEdge : NSMaxYEdge) : (positioningView.isFlipped ? NSMaxYEdge : NSMinYEdge);
  // AppKit may fit against a screen rather than an app-reserved region. Keep
  // controls hidden until its actual placement satisfies the selected region.
  // An already presented field must keep its responder/composition while the
  // owner moves or resizes. Only the initial reveal is hidden for this check.
  if (presenting) _content.hidden = YES;
  [self observePresentationBranch:NYCTronPresentationBranch::ShowEntered mark:observation];
  @try {
    _presentationShow = {};
    _presentationShow.mark = observation; _presentationShow.anchor = anchor; _presentationShow.region = _allowedRegion;
  } @catch (NSException *exception) { (void)exception; _presentationShow.mark.observed = NO; }
  [_popover showRelativeToRect:anchor ofView:positioningView preferredEdge:edge];
  // Cache only the two scalar results of the original short-circuit predicate.
  BOOL shownAfterCall = _popover.shown;
  BOOL contentWindowPresent = shownAfterCall && _content.window != nil;
  if (_presentationShow.mark.observed && _presentationShow.mark.sequence == observation.sequence) {
    _presentationShow.returned = YES; _presentationShow.shown = shownAfterCall;
    _presentationShow.windowRead = shownAfterCall; _presentationShow.hasWindow = contentWindowPresent;
  }
  if (shownAfterCall && contentWindowPresent) {
    [_content layoutSubtreeIfNeeded];
    // NSWindow.frame includes AppKit's popover border and arrow. The separate
    // window shadow is an OS effect, not part of the interactive frame.
    NSRect screenRect = _content.window.frame;
    NSRect actual = [positioningView convertRect:[_owner convertRectFromScreen:screenRect] fromView:nil];
    if (!positioningView.isFlipped) actual.origin.y = NSHeight(positioningView.bounds) - NSMaxY(actual);
    if (_presentationShow.mark.observed && _presentationShow.mark.sequence == observation.sequence) {
      _presentationShow.frame = actual; _presentationShow.region = _allowedRegion;
      _presentationShow.containmentRead = YES;
    }
    if (NSContainsRect(_allowedRegion, actual)) {
      if (_presentationShow.mark.observed && _presentationShow.mark.sequence == observation.sequence) _presentationShow.contained = YES;
      // Initial controls remain hidden until the matching Fabric layout has
      // committed. A shown field stays visible through safe geometry changes.
      BOOL coordinatesReady = [self synchronizeContentCoordinates];
      if (_presentationShow.mark.observed && _presentationShow.mark.sequence == observation.sequence) {
        _presentationShow.coordinatesRead = YES; _presentationShow.coordinatesReady = coordinatesReady;
      }
      [self observePresentationBranch:coordinatesReady ? NYCTronPresentationBranch::CoordinatesReady : NYCTronPresentationBranch::CoordinatesPending mark:observation];
      if (coordinatesReady) _content.hidden = NO;
    }
    else {
      [self observePresentationBranch:NYCTronPresentationBranch::OutsideRegion mark:observation];
      _rejectedPresentationToken = [_presentationToken copy];
      [self closeSilently];
      auto emitter = std::static_pointer_cast<const NYCTronPopoverEventEmitter>(_eventEmitter);
      if (emitter) {
        NYCTronPopoverEventEmitter::OnPresentationRejected event;
        event.scopeToken = _scopeToken.UTF8String ?: "";
        event.presentationToken = _presentationToken.UTF8String ?: "";
        event.x = actual.origin.x; event.y = actual.origin.y;
        event.width = actual.size.width; event.height = actual.size.height;
        event.regionX = _allowedRegion.origin.x; event.regionY = _allowedRegion.origin.y;
        event.regionWidth = _allowedRegion.size.width; event.regionHeight = _allowedRegion.size.height;
        emitter->onPresentationRejected(event);
      }
    }
  } else {
    [self observePresentationBranch:shownAfterCall ? NYCTronPresentationBranch::ContentWindowUnavailable : NYCTronPresentationBranch::ShowNotShown mark:observation];
  }
}
- (void)viewDidMoveToWindow {
  [super viewDidMoveToWindow];
  if (_owner != self.window) {
    [self closeSilently];
    // Remove only the observations of the previous owner. A blanket
    // removeObserver:self also strips the notifications NSPopover registered
    // for its delegate, so popoverWillClose:/popoverDidClose: never arrived.
    if (_owner) {
      for (NSNotificationName name in @[NSWindowDidResizeNotification, NSWindowDidMoveNotification, NSWindowDidBecomeKeyNotification, NSWindowDidMiniaturizeNotification, NSWindowDidDeminiaturizeNotification, NSWindowDidChangeOcclusionStateNotification, NSWindowWillCloseNotification]) {
        [NSNotificationCenter.defaultCenter removeObserver:self name:name object:_owner];
      }
    }
    _owner = self.window;
    if (_owner) {
      for (NSNotificationName name in @[NSWindowDidResizeNotification, NSWindowDidMoveNotification, NSWindowDidBecomeKeyNotification, NSWindowDidMiniaturizeNotification, NSWindowDidDeminiaturizeNotification, NSWindowDidChangeOcclusionStateNotification]) {
        [NSNotificationCenter.defaultCenter addObserver:self selector:@selector(ownerChanged:) name:name object:_owner];
      }
      [NSNotificationCenter.defaultCenter addObserver:self selector:@selector(ownerClosing:) name:NSWindowWillCloseNotification object:_owner];
    }
  }
  [self schedulePresentation];
}
- (void)ownerChanged:(NSNotification *)note { [self schedulePresentation]; }
- (void)ownerClosing:(NSNotification *)note { ++_generation; [self closeSilently]; }
- (void)updateState:(State::Shared const &)state oldState:(State::Shared const &)oldState {
  _state = std::static_pointer_cast<const NYCTronPopoverRootShadowNode::ConcreteState>(state);
  [super updateState:state oldState:oldState];
  [self schedulePresentation];
}
- (void)updateLayoutMetrics:(LayoutMetrics const &)layoutMetrics oldLayoutMetrics:(LayoutMetrics const &)oldLayoutMetrics {
  [super updateLayoutMetrics:layoutMetrics oldLayoutMetrics:oldLayoutMetrics];
  [self schedulePresentation];
}
- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps {
  const auto &value = *std::static_pointer_cast<const NYCTronPopoverProps>(props);
  NSString *token = [NSString stringWithUTF8String:value.scopeToken.c_str()];
  if (_scopeToken && ![_scopeToken isEqual:token]) [self closeSilently];
  _scopeToken = token;
  _presentationToken = [NSString stringWithUTF8String:value.presentationToken.c_str()];
  _visible = value.visible;
  _above = value.preferredEdge == "above";
  _anchor = NSMakeRect(value.anchorX, value.anchorY, MAX(1, value.anchorWidth), MAX(1, value.anchorHeight));
  _allowedRegion = NSMakeRect(value.regionX, value.regionY, value.regionWidth, value.regionHeight);
  _contentSize = NSMakeSize(value.popupWidth, value.popupHeight);
  _popover.animates = value.animated && !NSWorkspace.sharedWorkspace.accessibilityDisplayShouldReduceMotion;
  _content.accessibilityLabel = [NSString stringWithUTF8String:value.accessibilityLabel.c_str()];
  [super updateProps:props oldProps:oldProps];
  [self schedulePresentation];
}
- (void)mountChildComponentView:(RCTUIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index {
  NSView *next = index < _content.subviews.count ? _content.subviews[index] : nil;
  if (next) [_content addSubview:childComponentView positioned:NSWindowBelow relativeTo:next];
  else [_content addSubview:childComponentView];
  [self schedulePresentation];
}
- (void)unmountChildComponentView:(RCTUIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index {
  [childComponentView removeFromSuperview];
  [self schedulePresentation];
}
- (void)observePopoverNotifications {
  for (NSNotificationName name in @[NSPopoverWillCloseNotification, NSPopoverDidCloseNotification]) {
    [NSNotificationCenter.defaultCenter addObserver:self selector:@selector(popoverNotificationObserved:) name:name object:_popover];
  }
}
- (void)popoverNotificationObserved:(NSNotification *)notification {
  NSLog(@"NYCTronPopover phase=center-%@ delegateIsSelf=%d", notification.name, _popover.delegate == self);
}
- (void)emitDismissIfUserInitiated {
  // AppKit posts popoverDidClose only after the close animation completes. The
  // dismissal intent is known at popoverWillClose, so React is told then and
  // does not wait on animation completion.
  if (_silentClose || !_visible || ![_presentedToken isEqual:_scopeToken] || [_dismissedToken isEqual:_scopeToken]) return;
  _dismissedToken = [_presentedToken copy];
  auto emitter = std::static_pointer_cast<const NYCTronPopoverEventEmitter>(_eventEmitter);
  if (emitter) {
    NYCTronPopoverEventEmitter::OnDismiss event;
    event.scopeToken = _presentedToken.UTF8String ?: "";
    emitter->onDismiss(event);
  }
}
- (void)popoverWillClose:(NSNotification *)notification {
  _closing = YES;
  NSWindow *key = NSApp.keyWindow;
  _restoreFocus = !key || key == _owner || key == _content.window;
  NSLog(@"NYCTronPopover phase=will-close silent=%d visible=%d presented=%@ scope=%@ emitter=%d", _silentClose, _visible, _presentedToken, _scopeToken, _eventEmitter != nullptr);
  [self emitDismissIfUserInitiated];
}
- (void)popoverDidClose:(NSNotification *)notification {
  BOOL silent = _silentClose; _silentClose = NO; _closing = NO;
  NSLog(@"NYCTronPopover phase=did-close silent=%d visible=%d presented=%@ dismissed=%@", silent, _visible, _presentedToken, _dismissedToken);
  // Do not replace a focus choice made in another window while this closed.
  NSWindow *key = NSApp.keyWindow;
  if (_restoreFocus && (!key || key == _owner) && _owner.visible && !_owner.miniaturized &&
      [_opener isKindOfClass:NSView.class] && ((NSView *)_opener).window == _owner) [_owner makeFirstResponder:_opener];
  [self schedulePresentation];
}
- (void)prepareForRecycle {
  // Recycle invalidates both diagnostic identities before the original cleanup.
  if (_presentationObservationLifetime == NSUIntegerMax) _presentationObservationUnavailable = YES;
  else ++_presentationObservationLifetime;
  @try { _presentationBranch = {}; _presentationShow = {}; }
  @catch (NSException *exception) { (void)exception; _presentationObservationUnavailable = YES; }
  ++_generation; _visible = NO; [self closeSilently];
  if (_owner) {
    for (NSNotificationName name in @[NSWindowDidResizeNotification, NSWindowDidMoveNotification, NSWindowDidBecomeKeyNotification, NSWindowDidMiniaturizeNotification, NSWindowDidDeminiaturizeNotification, NSWindowDidChangeOcclusionStateNotification, NSWindowWillCloseNotification]) {
      [NSNotificationCenter.defaultCenter removeObserver:self name:name object:_owner];
    }
  }
  _owner = nil; _opener = nil; _scopeToken = nil; _presentationToken = nil; _presentedToken = nil; _dismissedToken = nil; _rejectedPresentationToken = nil;
  _state.reset(); [_content setBoundsOrigin:NSZeroPoint];
  [super prepareForRecycle];
}
- (void)dealloc {
  [NSNotificationCenter.defaultCenter removeObserver:self];
  _popover.delegate = nil; [_popover close];
  [_touchHandler detachFromView:_content];
}
+ (ComponentDescriptorProvider)componentDescriptorProvider { return concreteComponentDescriptorProvider<NYCTronPopoverRootComponentDescriptor>(); }
@end
