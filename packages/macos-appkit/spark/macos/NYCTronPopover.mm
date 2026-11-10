#import "NYCTronPopover.h"
#import "NYCTronPopoverComponentDescriptor.h"
#import <React/RCTSurfaceTouchHandler.h>
#import <react/renderer/components/NYCTronAppKitSpec/EventEmitters.h>
#import <react/renderer/components/NYCTronAppKitSpec/Props.h>

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
    NYCTronPopoverContentController *controller = [NYCTronPopoverContentController new];
    controller.view = _content; controller.popover = _popover;
    _popover.contentViewController = controller;
  }
  return self;
}
- (NSPopover *)nativePopover { return _popover; }
- (NSRect)nativeAllowedRegion { return _allowedRegion; }
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
  if (_closing) return;
  if (!_visible || !_owner || !_content.subviews.count) { [self closeSilently]; return; }
  if ([_dismissedToken isEqual:_scopeToken] || [_rejectedPresentationToken isEqual:_presentationToken]) return;
  NSView *positioningView = _owner.contentView;
  if (!positioningView || !_owner.visible || _owner.miniaturized) { [self closeSilently]; return; }
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
  [_popover showRelativeToRect:anchor ofView:positioningView preferredEdge:edge];
  if (_popover.shown && _content.window) {
    [_content layoutSubtreeIfNeeded];
    // NSWindow.frame includes AppKit's popover border and arrow. The separate
    // window shadow is an OS effect, not part of the interactive frame.
    NSRect screenRect = _content.window.frame;
    NSRect actual = [positioningView convertRect:[_owner convertRectFromScreen:screenRect] fromView:nil];
    if (!positioningView.isFlipped) actual.origin.y = NSHeight(positioningView.bounds) - NSMaxY(actual);
    if (NSContainsRect(_allowedRegion, actual)) {
      // Initial controls remain hidden until the matching Fabric layout has
      // committed. A shown field stays visible through safe geometry changes.
      if ([self synchronizeContentCoordinates]) _content.hidden = NO;
    }
    else {
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
  }
}
- (void)viewDidMoveToWindow {
  [super viewDidMoveToWindow];
  if (_owner != self.window) {
    [self closeSilently];
    [NSNotificationCenter.defaultCenter removeObserver:self];
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
- (void)popoverWillClose:(NSNotification *)notification {
  _closing = YES;
  NSWindow *key = NSApp.keyWindow;
  _restoreFocus = !key || key == _owner || key == _content.window;
}
- (void)popoverDidClose:(NSNotification *)notification {
  BOOL silent = _silentClose; _silentClose = NO; _closing = NO;
  // Do not replace a focus choice made in another window while this closed.
  NSWindow *key = NSApp.keyWindow;
  if (_restoreFocus && (!key || key == _owner) && _owner.visible && !_owner.miniaturized &&
      [_opener isKindOfClass:NSView.class] && ((NSView *)_opener).window == _owner) [_owner makeFirstResponder:_opener];
  if (!silent && _visible && [_presentedToken isEqual:_scopeToken]) {
    _dismissedToken = [_presentedToken copy];
    auto emitter = std::static_pointer_cast<const NYCTronPopoverEventEmitter>(_eventEmitter);
    if (emitter) {
      NYCTronPopoverEventEmitter::OnDismiss event;
      event.scopeToken = _presentedToken.UTF8String ?: "";
      emitter->onDismiss(event);
    }
  }
  [self schedulePresentation];
}
- (void)prepareForRecycle {
  ++_generation; _visible = NO; [self closeSilently];
  [NSNotificationCenter.defaultCenter removeObserver:self];
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
