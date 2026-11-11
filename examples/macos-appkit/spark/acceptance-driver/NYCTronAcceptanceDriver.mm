#import <AppKit/AppKit.h>
#import <objc/runtime.h>
#import <QuartzCore/CAMediaTiming.h>
#include <atomic>
#include <math.h>
#import <RNDesktopApp/SparkTestDriver.h>
#import <NYCTronAppKit/NYCTronPopover.h>
#import <UniformTypeIdentifiers/UniformTypeIdentifiers.h>
#import <ApplicationServices/ApplicationServices.h>
#import <RNDesktopDrag/RNDesktopDragView.h>
#import <React/RCTSurfaceTouchHandler.h>

#if SPARK_TEST_DRIVER
static NSView *Find(NSView *view, NSString *identifier) {
  if ([view.accessibilityIdentifier isEqual:identifier]) return view;
  for (NSView *child in view.subviews) { NSView *found = Find(child, identifier); if (found) return found; }
  if ([view isKindOfClass:NYCTronPopoverComponentView.class]) return Find(((NYCTronPopoverComponentView *)view).nativePopover.contentViewController.view, identifier);
  return nil;
}
static NSView *Control(NSView *view, Class cls) {
  if ([view isKindOfClass:cls]) return view;
  for (NSView *child in view.subviews) { NSView *found = Control(child, cls); if (found) return found; }
  return nil;
}
static NSWindow *Window(NSString *identifier) {
  NSString *nativeID = [identifier isEqual:@"main"] ? @"spark.main" : identifier;
  for (NSWindow *window in NSApp.windows) if ([window.identifier isEqual:nativeID]) return window;
  return nil;
}
static void Classes(NSView *view, NSMutableArray *classes) {
  if (classes.count > 512) return;
  NSString *name = NSStringFromClass(view.class);
  if (![classes containsObject:name]) [classes addObject:name];
  for (NSView *child in view.subviews) Classes(child, classes);
  if ([view isKindOfClass:NYCTronPopoverComponentView.class]) Classes(((NYCTronPopoverComponentView *)view).nativePopover.contentViewController.view, classes);
}
static void Labels(NSView *view, NSMutableArray *labels) {
  if (labels.count > 512) return;
  NSString *label = view.accessibilityLabel;
  if (label.length && ![labels containsObject:label]) [labels addObject:label];
  if ([view isKindOfClass:NSTextField.class]) {
    NSString *value = ((NSTextField *)view).stringValue;
    if (value.length && ![labels containsObject:value]) [labels addObject:value];
  }
  for (NSView *child in view.subviews) Labels(child, labels);
  if ([view isKindOfClass:NYCTronPopoverComponentView.class]) Labels(((NYCTronPopoverComponentView *)view).nativePopover.contentViewController.view, labels);
}
static NSDictionary *RectDictionary(NSRect rect) { return @{ @"x": @(rect.origin.x), @"y": @(rect.origin.y), @"width": @(rect.size.width), @"height": @(rect.size.height) }; }
static NSRect OwnerCoordinates(NSWindow *owner, NSRect screenRect) {
  NSView *content = owner.contentView;
  NSRect result = [content convertRect:[owner convertRectFromScreen:screenRect] fromView:nil];
  if (!content.isFlipped) result.origin.y = NSHeight(content.bounds) - NSMaxY(result);
  return result;
}
static NSDictionary *Failure(NSString *message) { return @{ @"ok": @NO, @"error": @{ @"code": @"E_ACCEPTANCE", @"message": message } }; }

// Private acceptance observation only. No delegate or focus behavior is changed.
@interface NYCTronAcceptancePopoverCloseObservation : NSObject {
@public
  NSUInteger sequence, willCloseCount, didCloseCount;
  __weak NSWindow *owner;
  __weak NYCTronPopoverComponentView *component;
  __weak NSPopover *popover;
  id willObserver, didObserver;
  NSNumber *willCloseOnMain, *didCloseOnMain;
  BOOL armedWhileShown, postDidCloseMainTurnObserved, expired, released;
  BOOL unavailable, threadViolation, identityEnded, overflowed;
}
- (void)removeObservers;
- (void)releaseObservation;
- (BOOL)matchesLiveObjects;
- (void)observe:(NSNotification *)notification didClose:(BOOL)didClose;
@end
static NYCTronAcceptancePopoverCloseObservation *PopoverCloseObservation;
static NSUInteger PopoverCloseArms;
@implementation NYCTronAcceptancePopoverCloseObservation
- (void)removeObservers {
  if (willObserver) { [NSNotificationCenter.defaultCenter removeObserver:willObserver]; willObserver = nil; }
  if (didObserver) { [NSNotificationCenter.defaultCenter removeObserver:didObserver]; didObserver = nil; }
}
- (void)releaseObservation { released = YES; [self removeObservers]; }
- (BOOL)matchesLiveObjects {
  NSWindow *currentOwner = owner;
  NYCTronPopoverComponentView *currentComponent = component;
  NSPopover *currentPopover = popover;
  return currentOwner && currentComponent && currentPopover &&
    currentComponent.window == currentOwner && currentComponent.nativePopover == currentPopover;
}
- (void)observe:(NSNotification *)notification didClose:(BOOL)didClose {
  __weak NYCTronAcceptancePopoverCloseObservation *weakObservation = self;
  const NSUInteger observedSequence = sequence;
  if (!NSThread.isMainThread) {
    dispatch_async(dispatch_get_main_queue(), ^{
      NYCTronAcceptancePopoverCloseObservation *value = weakObservation;
      if (value && value == PopoverCloseObservation && value->sequence == observedSequence && !value->released) {
        value->threadViolation = YES;
        if (didClose) value->didCloseOnMain = @NO; else value->willCloseOnMain = @NO;
        [value removeObservers];
      }
    });
    return;
  }
  if (self != PopoverCloseObservation || released || expired || unavailable || threadViolation) return;
  @try {
    if (notification.object != popover || ![self matchesLiveObjects]) {
      identityEnded = YES; [self removeObservers]; return;
    }
    if (!didClose) {
      willCloseOnMain = @YES;
      if (willCloseCount < 8) willCloseCount++; else overflowed = YES;
      return;
    }
    didCloseOnMain = @YES;
    if (didCloseCount < 8) didCloseCount++; else overflowed = YES;
    [self removeObservers];
    // Observer entry does not establish the delegate's focus result. Require
    // a later owned main-queue turn, then keep the exact focus checks.
    dispatch_async(dispatch_get_main_queue(), ^{
      NYCTronAcceptancePopoverCloseObservation *value = weakObservation;
      if (!value || value != PopoverCloseObservation || value->sequence != observedSequence ||
          value->released || value->expired || value->unavailable || value->threadViolation) return;
      @try {
        if ([value matchesLiveObjects] && !value->popover.shown) value->postDidCloseMainTurnObserved = YES;
        else value->identityEnded = YES;
      } @catch (__unused NSException *exception) { value->unavailable = YES; }
    });
  } @catch (__unused NSException *exception) {
    unavailable = YES; [self removeObservers];
  }
}
- (void)dealloc { [self removeObservers]; }
@end
static void ArmPopoverCloseObservation(NSWindow *owner, NYCTronPopoverComponentView *component, NSPopover *popover) {
  [PopoverCloseObservation releaseObservation]; PopoverCloseObservation = nil;
  // The verifier arms only its Escape and newer-window-focus scenarios.
  if (PopoverCloseArms >= 2) return;
  NYCTronAcceptancePopoverCloseObservation *value = [NYCTronAcceptancePopoverCloseObservation new];
  value->sequence = ++PopoverCloseArms; value->owner = owner; value->component = component; value->popover = popover;
  PopoverCloseObservation = value;
  @try {
    NSView *content = popover.contentViewController.view;
    if (![value matchesLiveObjects] || !popover.shown || !content || content.hidden) {
      value->unavailable = YES; return;
    }
    value->armedWhileShown = YES;
    __weak NYCTronAcceptancePopoverCloseObservation *weakObservation = value;
    value->willObserver = [NSNotificationCenter.defaultCenter addObserverForName:NSPopoverWillCloseNotification object:popover queue:nil usingBlock:^(NSNotification *notification) {
      [weakObservation observe:notification didClose:NO];
    }];
    value->didObserver = [NSNotificationCenter.defaultCenter addObserverForName:NSPopoverDidCloseNotification object:popover queue:nil usingBlock:^(NSNotification *notification) {
      [weakObservation observe:notification didClose:YES];
    }];
    if (!value->willObserver || !value->didObserver) { value->unavailable = YES; [value removeObservers]; return; }
    const NSUInteger observedSequence = value->sequence;
    // Cleanup only: this expiry never supplies completion or extends a wait.
    // No native object is retained by this delayed block.
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, 60 * NSEC_PER_SEC), dispatch_get_main_queue(), ^{
      NYCTronAcceptancePopoverCloseObservation *current = weakObservation;
      if (current && current == PopoverCloseObservation && current->sequence == observedSequence &&
          !current->released && !current->postDidCloseMainTurnObserved) {
        current->expired = YES; [current removeObservers];
      }
    });
  } @catch (__unused NSException *exception) { value->unavailable = YES; [value removeObservers]; }
}
static NSDictionary *PopoverCloseObservationState(NSWindow *owner, NYCTronPopoverComponentView *component, NSPopover *popover) {
  @try {
    NYCTronAcceptancePopoverCloseObservation *value = PopoverCloseObservation;
    if (!value) return @{ @"schemaVersion": @1, @"status": @"unavailable", @"sequence": NSNull.null };
    NSWindow *observedOwner = value->owner;
    NYCTronPopoverComponentView *observedComponent = value->component;
    NSPopover *observedPopover = value->popover;
    id identity = observedOwner && observedComponent && observedPopover ?
      @(observedOwner == owner && observedComponent == component && observedPopover == popover && [value matchesLiveObjects]) : NSNull.null;
    NSString *status = value->unavailable || value->threadViolation || value->identityEnded ? @"unavailable" :
      value->expired ? @"expired" : value->released ? @"released" :
      value->postDidCloseMainTurnObserved ? @"completed" : @"armed";
    return @{ @"schemaVersion": @1, @"status": status, @"sequence": @(value->sequence),
      @"identityMatches": identity, @"armedWhileShown": @(value->armedWhileShown),
      @"willCloseCount": @(value->willCloseCount), @"didCloseCount": @(value->didCloseCount),
      @"willCloseOnMain": value->willCloseOnMain ?: NSNull.null, @"didCloseOnMain": value->didCloseOnMain ?: NSNull.null,
      @"postDidCloseMainTurnObserved": @(value->postDidCloseMainTurnObserved),
      @"expired": @(value->expired), @"released": @(value->released),
      @"threadViolation": @(value->threadViolation), @"overflowed": @(value->overflowed) };
  } @catch (__unused NSException *exception) {
    return @{ @"schemaVersion": @1, @"status": @"unavailable", @"sequence": NSNull.null };
  }
}

static NSMenu *TrackedContextMenu;
static NSUInteger ContextMenuGeneration, TrackedContextMenuGeneration, EndedContextMenuGeneration;
static NSUInteger ContextMenuTraceEvents;
static void TraceContextMenu(NSString *phase, NSUInteger generation) {
  if (ContextMenuTraceEvents++ >= 64) return;
  // Fixed phase labels and local generations only; AppKit supplies the log's
  // timestamp. An operation returning is separate from its end notification.
  NSLog(@"NYCTronContextMenu phase=%@ generation=%lu active=%lu ended=%lu", phase,
    (unsigned long)generation, (unsigned long)TrackedContextMenuGeneration, (unsigned long)EndedContextMenuGeneration);
}
static NSUInteger ActivationSequence;
static pid_t WorkspaceVerifiedProcessId;
static NSURL *WorkspaceVerifiedBundleURL;
static std::atomic<unsigned int> ActivationTraceEvents{0};
static void TraceActivation(NSString *phase, NSUInteger operation, NSDictionary *(^details)(void)) {
  if (ActivationTraceEvents.fetch_add(1) >= 128) return;
  // Call sites supply fixed phase labels and boolean/enum classifications.
  // Details run inside the guard so observations cannot replace the operation
  // or reply. Completion-queue details read no application/window objects.
  // No paths, error reasons or callback payloads are logged.
  @try {
    NSDictionary *record = @{ @"phase": phase, @"operation": @(operation), @"at": @(NSDate.date.timeIntervalSince1970),
      @"mainThread": @(NSThread.isMainThread), @"details": details ? details() : @{} };
    NSData *data = [NSJSONSerialization dataWithJSONObject:record options:0 error:nil];
    if (data && data.length <= 2048) NSLog(@"NYCTronActivation %@", [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding]);
    else NSLog(@"NYCTronActivation trace-encoding-failed");
  } @catch (NSException *exception) {
    (void)exception;
    @try { NSLog(@"NYCTronActivation trace-encoding-threw"); }
    @catch (NSException *loggingException) { (void)loggingException; }
  }
}
static NSDictionary *ActivationWindowState(NSWindow *window) {
  // Main-thread local state only. Additional LaunchServices queries could
  // disturb the activation phase that this diagnostic needs to distinguish.
  return @{ @"policy": @(NSApp.activationPolicy), @"applicationActive": @(NSApp.active),
    @"visible": @(window.visible), @"key": @(window.keyWindow), @"miniaturized": @(window.miniaturized),
    @"canBecomeKey": @(window.canBecomeKeyWindow) };
}
static NSMenuItem *FindMenuItem(NSMenu *menu, NSString *identifier) {
  for (NSMenuItem *item in menu.itemArray) {
    if ([item.identifier isEqual:identifier]) return item;
    NSMenuItem *found = item.submenu ? FindMenuItem(item.submenu, identifier) : nil;
    if (found) return found;
  }
  return nil;
}

// This fixture supplies an NSDraggingInfo object and a real isolated
// NSPasteboard to the installed native source/destination protocol methods.
// It does not synthesize a physical mouse gesture or an NSDraggingSession.
@interface NYCTronProtocolDrag : NSObject <NSDraggingInfo>
@property (nonatomic, strong) NSPasteboard *draggingPasteboard;
@property (nonatomic, strong) id draggingSource;
@property (nonatomic, weak) NSView *destination;
@property (nonatomic, weak) NSWindow *draggingDestinationWindow;
@property (nonatomic) NSPoint draggingLocation;
@property (nonatomic) NSDragOperation draggingSourceOperationMask;
@property (nonatomic) NSInteger draggingSequenceNumber;
@property (nonatomic) NSInteger numberOfValidItemsForDrop;
@property (nonatomic) NSDraggingFormation draggingFormation;
@property (nonatomic) BOOL animatesToDestination;
@end
@implementation NYCTronProtocolDrag
- (NSImage *)draggedImage { return nil; }
- (NSPoint)draggedImageLocation { return self.draggingLocation; }
- (void)slideDraggedImageTo:(NSPoint)point {}
- (NSArray<NSString *> *)namesOfPromisedFilesDroppedAtDestination:(NSURL *)destination { return nil; }
- (void)enumerateDraggingItemsWithOptions:(NSDraggingItemEnumerationOptions)options forView:(NSView *)view classes:(NSArray<Class> *)classes searchOptions:(NSDictionary *)searchOptions usingBlock:(void (^)(NSDraggingItem *, NSInteger, BOOL *))block {}
@end
static NYCTronProtocolDrag *ProtocolDrag;
static NSInteger NextProtocolDrag;
static NSDictionary *PointerSession;
static BOOL PointerRunning;
static __weak RCTSurfaceTouchHandler *ResponderHandler;
static __weak NSView *ResponderTarget;
static __weak NSWindow *ResponderWindow;
static NSPoint ResponderStart, ResponderPoint;
static NSInteger ResponderToken, NextResponderToken;
static void ClearResponder(void) {
  // Reset the recognizer between synthetic sequences. An unfinished sequence
  // follows RN's actual cancellation path; no JS callback is invoked directly.
  ResponderHandler.enabled = NO; ResponderHandler.enabled = YES;
  ResponderHandler = nil; ResponderTarget = nil; ResponderWindow = nil; ResponderToken = 0;
}

// Spark 0.0.2 does not implement this optional observer. Adding it only to the
// private acceptance app records the real NSDraggingSession AppKit supplies,
// without replacing the installed source's begin/end or destination methods.
@implementation RNDesktopDragView (NYCTronSessionObservation)
- (void)draggingSession:(NSDraggingSession *)session willBeginAtPoint:(NSPoint)point {
  PointerSession = @{ @"nativeSession": @([session isKindOfClass:NSDraggingSession.class]), @"class": NSStringFromClass(session.class), @"sequence": @(session.draggingSequenceNumber), @"source": self.accessibilityIdentifier ?: @"", @"pasteboardTypes": session.draggingPasteboard.types ?: @[] };
}
@end

static NSScreen *PrimaryScreen(void) {
  for (NSScreen *screen in NSScreen.screens) if ([screen.deviceDescription[@"NSScreenNumber"] unsignedIntValue] == CGMainDisplayID()) return screen;
  return nil;
}
static CGPoint QuartzPoint(NSPoint point, NSScreen *primary) { return CGPointMake(point.x, NSMaxY(primary.frame) - point.y); }
static void PostPointer(CGEventType type, CGPoint point, double delay) {
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(delay * NSEC_PER_SEC)), dispatch_get_global_queue(QOS_CLASS_USER_INTERACTIVE, 0), ^{
    CGEventRef event = CGEventCreateMouseEvent(NULL, type, point, kCGMouseButtonLeft);
    if (event) { CGEventSetFlags(event, 0); CGEventSetIntegerValueField(event, kCGMouseEventClickState, 1); CGEventPost(kCGHIDEventTap, event); CFRelease(event); }
  });
}

// Inspect native windows and accessibility nodes. A tooltip text binding on the
// trigger is never counted as a presented help tag; the presented text is read
// from the tooltip panel itself (see HelpTagStrings).
static NSArray *AccessibilityNodes(id root, BOOL *truncated) {
  NSMutableArray *queue = [NSMutableArray arrayWithObject:root], *nodes = [NSMutableArray new];
  NSHashTable *visited = [NSHashTable hashTableWithOptions:NSPointerFunctionsObjectPointerPersonality];
  for (NSUInteger index = 0; index < queue.count; index++) {
    id node = queue[index];
    if ([visited containsObject:node]) continue;
    if (nodes.count >= 512) { *truncated = YES; break; }
    [visited addObject:node]; [nodes addObject:node];
    NSMutableArray *children = [NSMutableArray new];
    if ([node respondsToSelector:@selector(accessibilityChildren)]) {
      id accessible = [node accessibilityChildren];
      if ([accessible isKindOfClass:NSArray.class]) [children addObjectsFromArray:accessible];
    }
    if ([node isKindOfClass:NSView.class]) [children addObjectsFromArray:((NSView *)node).subviews];
    if ([node isKindOfClass:NSWindow.class] && ((NSWindow *)node).contentView) [children addObject:((NSWindow *)node).contentView];
    for (id child in children) {
      if ([visited containsObject:child]) continue;
      if (queue.count >= 2048) { *truncated = YES; break; }
      [queue addObject:child];
    }
  }
  return nodes;
}
// Read metadata stays separate from acceptance strings. These limits are shared
// by every help tag in one observation; they bound reads, not elapsed time.
struct HelpTagDiagnosticBudget { NSUInteger currentDetails = 0, legacyNodes = 0, privateNodes = 0, privateDetails = 0; };
struct HelpTagReadRecord {
  NSUInteger node = 0, field = 0, calls = 0, state = 0, kind = 0, length = 0;
  BOOL normalized = NO;
};
static NSDictionary *HelpTagReadDetail(const HelpTagReadRecord &read, NSString *text) {
  static NSString *const fields[] = { @"value", @"label", @"title", @"text-field-value" };
  static NSString *const states[] = { @"unavailable", @"nil", @"captured" };
  static NSString *const kinds[] = { @"none", @"string", @"attributed-string", @"other" };
  id matches = NSNull.null;
  NSString *metadataStatus = @"observed";
  @try {
    if (read.normalized) matches = @((read.length == 37) && [text isEqualToString:@"Save this document's local checkpoint"]);
  } @catch (__unused NSException *exception) { metadataStatus = @"exception"; }
  return @{ @"node": @(read.node), @"field": fields[read.field], @"read": states[read.state], @"calls": @(read.calls),
    @"kind": kinds[read.kind], @"normalized": @(read.normalized), @"length": read.normalized ? @(read.length) : NSNull.null,
    @"nonempty": read.normalized ? @(read.length > 0) : NSNull.null, @"exactExpected": matches, @"metadataStatus": metadataStatus };
}
static BOOL HelpTagFiniteNonemptyRect(NSRect rect) {
  return isfinite(rect.origin.x) && isfinite(rect.origin.y) && isfinite(rect.size.width) && isfinite(rect.size.height) &&
    rect.size.width > 0 && rect.size.height > 0;
}
static NSDictionary *PrivateHelpTagViewState(NSView *view, NSWindow *selectedWindow, BOOL *eligible) {
  *eligible = NO;
  NSMutableDictionary *state = [@{ @"hasWindow": NSNull.null, @"sameWindow": NSNull.null, @"inContentSubtree": NSNull.null,
    @"windowOnscreen": NSNull.null, @"viewVisible": NSNull.null, @"boundsNonempty": NSNull.null,
    @"visibleIntersectionNonempty": NSNull.null, @"frameNonempty": NSNull.null,
    @"sourceWindowNumber": NSNull.null, @"frameInSelectedWindow": NSNull.null } mutableCopy];
  NSWindow *actualWindow = view.window;
  state[@"hasWindow"] = @(actualWindow != nil);
  if (!actualWindow || !selectedWindow) return state;
  state[@"sameWindow"] = @(actualWindow == selectedWindow);
  if (actualWindow != selectedWindow) return state;
  state[@"sourceWindowNumber"] = @(actualWindow.windowNumber);
  NSView *content = selectedWindow.contentView;
  BOOL inContent = content && (view == content || [view isDescendantOf:content]);
  BOOL onscreen = selectedWindow.visible && !selectedWindow.miniaturized && selectedWindow.alphaValue > 0 &&
    (selectedWindow.occlusionState & NSWindowOcclusionStateVisible);
  state[@"inContentSubtree"] = @(inContent); state[@"windowOnscreen"] = @(onscreen);
  if (!inContent || !onscreen) return state;
  BOOL visible = ![view isHiddenOrHasHiddenAncestor];
  state[@"viewVisible"] = @(visible);
  if (!visible) return state;
  NSRect bounds = view.bounds, visibleRect = view.visibleRect;
  BOOL boundsNonempty = HelpTagFiniteNonemptyRect(bounds);
  state[@"boundsNonempty"] = @(boundsNonempty);
  if (!boundsNonempty || !HelpTagFiniteNonemptyRect(visibleRect)) {
    state[@"visibleIntersectionNonempty"] = @NO; return state;
  }
  NSRect intersection = NSIntersectionRect(bounds, visibleRect);
  BOOL intersectionNonempty = HelpTagFiniteNonemptyRect(intersection);
  state[@"visibleIntersectionNonempty"] = @(intersectionNonempty);
  if (!intersectionNonempty) return state;
  NSRect frame = [view convertRect:intersection toView:nil];
  BOOL frameNonempty = HelpTagFiniteNonemptyRect(frame);
  state[@"frameNonempty"] = @(frameNonempty);
  if (frameNonempty) state[@"frameInSelectedWindow"] = RectDictionary(frame);
  *eligible = frameNonempty;
  return state;
}
static NSDictionary *PrivateHelpTagStrings(NSArray *nodes, NSWindow *selectedWindow,
    NSMutableOrderedSet<NSString *> *strings, HelpTagDiagnosticBudget *budget) {
  // This is an OS-private storage observation on the selected visible panel.
  // The retained 79a evidence establishes nil results only for its tested
  // getters; the separately reported AX attribute enumeration is uninspected.
  // No public-AX text or independently verified pixel-content claim follows.
  const NSUInteger beforeCount = strings.count;
  NSUInteger considered = 0, classMatches = 0, eligibleViews = 0, postReadEligibleViews = 0;
  NSUInteger attempted = 0, returned = 0, nilReads = 0, stringValues = 0, attributedValues = 0, otherValues = 0;
  NSUInteger normalizedNil = 0, empty = 0, nonempty = 0, acceptedValues = 0, unavailable = 0, ineligible = 0, exceptions = 0;
  @try {
    NSMutableArray *rows = [NSMutableArray new];
    for (id node in nodes) {
      if (budget->privateNodes >= 8) break;
      budget->privateNodes++; NSUInteger index = considered++;
      NSMutableDictionary *row = [@{ @"node": @(index), @"read": @"unavailable", @"stage": @"class",
        @"classMatch": NSNull.null, @"ivarPresent": NSNull.null, @"objectEncoding": NSNull.null,
        @"kind": NSNull.null, @"normalized": NSNull.null, @"length": NSNull.null, @"nonempty": NSNull.null,
        @"exactExpected": NSNull.null, @"accepted": @NO, @"uniqueAdded": @NO,
        @"before": NSNull.null, @"after": NSNull.null } mutableCopy];
      NSString *stage = @"class";
      @try {
        do {
          Class drawClass = object_getClass(node);
          BOOL classMatch = [node isKindOfClass:NSView.class] &&
            [NSStringFromClass(drawClass) isEqualToString:@"NSCustomToolTipDrawView"];
          row[@"classMatch"] = @(classMatch);
          if (!classMatch) break;
          classMatches++;
          NSView *view = (NSView *)node;
          stage = @"eligibility";
          BOOL eligible = NO;
          row[@"before"] = PrivateHelpTagViewState(view, selectedWindow, &eligible);
          if (!eligible) { row[@"read"] = @"ineligible"; break; }
          eligibleViews++;
          stage = @"ivar";
          Ivar drawText = class_getInstanceVariable(drawClass, "_attributedString");
          row[@"ivarPresent"] = @(drawText != NULL);
          const char *encoding = drawText ? ivar_getTypeEncoding(drawText) : NULL;
          if (encoding) row[@"objectEncoding"] = @(encoding[0] == '@');
          if (!encoding || encoding[0] != '@') break;
          stage = @"read"; attempted++;
          id drawn = object_getIvar(node, drawText);
          returned++;
          NSString *text = nil; NSUInteger length = 0;
          row[@"read"] = drawn ? @"captured" : @"nil";
          if (!drawn) nilReads++;
          else {
            stage = @"normalize";
            BOOL attributed = [drawn isKindOfClass:NSAttributedString.class];
            BOOL plain = !attributed && [drawn isKindOfClass:NSString.class];
            row[@"kind"] = attributed ? @"attributed-string" : plain ? @"string" : @"other";
            if (attributed) attributedValues++; else if (plain) stringValues++; else otherValues++;
            text = attributed ? [drawn string] : plain ? drawn : nil;
            row[@"normalized"] = @(text != nil);
            if (!text) normalizedNil++;
            else {
              length = text.length;
              row[@"length"] = @(length); row[@"nonempty"] = @(length > 0);
              row[@"exactExpected"] = @((length == 37) && [text isEqualToString:@"Save this document's local checkpoint"]);
              if (length) nonempty++; else empty++;
            }
          }
          stage = @"recheck";
          BOOL eligibleAfter = NO;
          row[@"after"] = PrivateHelpTagViewState(view, selectedWindow, &eligibleAfter);
          if (!eligibleAfter) { row[@"read"] = @"ineligible"; break; }
          postReadEligibleViews++;
          if (text && length) {
            stage = @"retain";
            NSUInteger prior = strings.count;
            [strings addObject:text];
            acceptedValues++; row[@"accepted"] = @YES; row[@"uniqueAdded"] = @(strings.count > prior);
          }
          stage = @"complete";
        } while (NO);
      } @catch (__unused NSException *exception) {
        exceptions++; row[@"read"] = @"exception";
      }
      row[@"stage"] = stage;
      if ([row[@"read"] isEqual:@"unavailable"]) unavailable++;
      else if ([row[@"read"] isEqual:@"ineligible"]) ineligible++;
      if (budget->privateDetails < 4) { [rows addObject:row]; budget->privateDetails++; }
    }
    return @{ @"schemaVersion": @1, @"status": @"observed", @"source": @"private-appkit-draw-view",
      @"nodeLimit": @8, @"detailLimit": @4, @"nodesConsidered": @(considered), @"nodesOmitted": @(nodes.count - considered),
      @"classMatches": @(classMatches), @"eligibleViews": @(eligibleViews), @"postReadEligibleViews": @(postReadEligibleViews),
      @"readAttempts": @(attempted), @"returned": @(returned), @"nil": @(nilReads), @"string": @(stringValues),
      @"attributedString": @(attributedValues), @"other": @(otherValues), @"normalizedNil": @(normalizedNil),
      @"empty": @(empty), @"nonempty": @(nonempty), @"acceptedValues": @(acceptedValues),
      @"uniqueStringsAdded": @(strings.count - beforeCount), @"unavailable": @(unavailable), @"ineligible": @(ineligible),
      @"exceptions": @(exceptions), @"detailsOmitted": @(considered - rows.count), @"rows": rows };
  } @catch (__unused NSException *exception) {
    // Added observations cannot replace the original public collector's result
    // or exception behavior. Missing private diagnostics remain unknown.
    return nil;
  }
}
static NSArray<NSString *> *HelpTagStrings(id root, NSWindow *selectedWindow, BOOL *truncated, HelpTagDiagnosticBudget *budget, NSDictionary *__autoreleasing *diagnostic) {
  NSMutableOrderedSet<NSString *> *strings = [NSMutableOrderedSet new];
  NSArray *nodes = AccessibilityNodes(root, truncated);
  HelpTagReadRecord details[16] = {};
  NSString *__strong detailTexts[16] = {};
  NSUInteger detailCount = 0, nodeIndex = 0, calls = 0, unavailable = 0, nilReads = 0, captured = 0;
  NSUInteger stringValues = 0, attributedValues = 0, otherValues = 0, normalizedNil = 0, empty = 0, nonempty = 0;
  for (id node in nodes) {
    NSMutableArray *values = [NSMutableArray new];
    HelpTagReadRecord reads[4] = {};
    NSUInteger fields[4] = {}, valueCount = 0;
    NSString *__strong normalizedTexts[4] = {};
    // Keep the original presence probe and captured read, including its
    // addObject:nil exception if a getter changes between those two reads.
    if ([node respondsToSelector:@selector(accessibilityValue)]) {
      reads[0].calls = 1; reads[0].state = 1;
      if ([node accessibilityValue]) {
        [values addObject:[node accessibilityValue]]; fields[valueCount++] = 0;
        reads[0].calls = 2; reads[0].state = 2;
      }
    }
    if ([node respondsToSelector:@selector(accessibilityLabel)]) {
      reads[1].calls = 1; reads[1].state = 1;
      if ([node accessibilityLabel]) {
        [values addObject:[node accessibilityLabel]]; fields[valueCount++] = 1;
        reads[1].calls = 2; reads[1].state = 2;
      }
    }
    if ([node respondsToSelector:@selector(accessibilityTitle)]) {
      reads[2].calls = 1; reads[2].state = 1;
      if ([node accessibilityTitle]) {
        [values addObject:[node accessibilityTitle]]; fields[valueCount++] = 2;
        reads[2].calls = 2; reads[2].state = 2;
      }
    }
    if ([node isKindOfClass:NSTextField.class]) {
      [values addObject:((NSTextField *)node).stringValue]; fields[valueCount++] = 3;
      reads[3].calls = 1; reads[3].state = 2;
    }
    NSUInteger valueIndex = 0;
    for (id value in values) {
      BOOL attributed = [value isKindOfClass:NSAttributedString.class];
      BOOL plain = !attributed && [value isKindOfClass:NSString.class];
      NSString *text = attributed ? [value string] : (plain ? value : nil);
      NSUInteger length = text.length;
      if (length) [strings addObject:text];
      NSUInteger field = fields[valueIndex++];
      reads[field].kind = attributed ? 2 : (plain ? 1 : 3);
      reads[field].normalized = text != nil; reads[field].length = length;
      normalizedTexts[field] = text;
    }
    // Only primitive bookkeeping and bounded retained references are added
    // during collection. Formatting/equality and legacy reads follow it.
    for (NSUInteger field = 0; field < 4; field++) {
      HelpTagReadRecord &read = reads[field];
      read.node = nodeIndex; read.field = field; calls += read.calls;
      if (read.state == 0) unavailable++;
      else if (read.state == 1) nilReads++;
      else {
        captured++;
        if (read.kind == 1) stringValues++;
        else if (read.kind == 2) attributedValues++;
        else otherValues++;
        if (!read.normalized) normalizedNil++;
        else if (read.length) nonempty++;
        else empty++;
      }
      if (budget->currentDetails < 16) {
        details[detailCount] = read; detailTexts[detailCount++] = normalizedTexts[field];
        budget->currentDetails++;
      }
    }
    nodeIndex++;
  }
  const NSUInteger publicRetainedStrings = strings.count;
  NSDictionary *privateDiagnostic = PrivateHelpTagStrings(nodes, selectedWindow, strings, budget);
  NSArray<NSString *> *result = strings.array;
  // Every original read, normalization and ordered-set operation above keeps
  // its failure behavior. Only the added observations are exception-contained.
  @try {
    NSMutableArray *currentRows = [NSMutableArray new], *legacyRows = [NSMutableArray new];
    for (NSUInteger index = 0; index < detailCount; index++) [currentRows addObject:HelpTagReadDetail(details[index], detailTexts[index])];
    NSUInteger considered = 0, attempted = 0, returned = 0, thrown = 0, selectorExceptions = 0, metadataExceptions = 0;
    for (id node in nodes) {
      if (budget->legacyNodes >= 8) break;
      budget->legacyNodes++; NSUInteger index = considered++;
      BOOL selectorReturned = NO, supported = NO, readReturned = NO;
      id value = nil;
      @try {
        supported = [node respondsToSelector:@selector(accessibilityAttributeValue:)];
        selectorReturned = YES;
        if (supported) {
          attempted++;
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
          value = [node accessibilityAttributeValue:NSAccessibilityValueAttribute];
#pragma clang diagnostic pop
          returned++; readReturned = YES;
        }
      } @catch (__unused NSException *exception) {
        if (selectorReturned && supported) thrown++; else selectorExceptions++;
      }
      NSString *state = !selectorReturned ? @"selector-exception" : !supported ? @"unavailable" : !readReturned ? @"read-exception" : value ? @"returned" : @"nil";
      NSString *kind = @"none", *metadataStatus = @"observed";
      id length = NSNull.null, hasText = NSNull.null, hasContent = NSNull.null, matches = NSNull.null;
      @try {
        if (readReturned && value) {
          BOOL attributed = [value isKindOfClass:NSAttributedString.class];
          BOOL plain = !attributed && [value isKindOfClass:NSString.class];
          NSString *text = attributed ? [value string] : (plain ? value : nil);
          kind = attributed ? @"attributed-string" : plain ? @"string" : @"other";
          hasText = @(text != nil);
          if (text) {
            NSUInteger size = text.length;
            length = @(size); hasContent = @(size > 0);
            matches = @((size == 37) && [text isEqualToString:@"Save this document's local checkpoint"]);
          }
        }
      } @catch (__unused NSException *exception) {
        metadataExceptions++; metadataStatus = @"exception";
        kind = @"unknown"; length = NSNull.null; hasText = NSNull.null; hasContent = NSNull.null; matches = NSNull.null;
      }
      [legacyRows addObject:@{ @"node": @(index), @"read": state, @"kind": kind, @"normalized": hasText,
        @"length": length, @"nonempty": hasContent, @"exactExpected": matches, @"metadataStatus": metadataStatus }];
    }
    *diagnostic = @{ @"schemaVersion": @1, @"status": @"observed", @"nodes": @(nodeIndex),
      @"combinedRetainedStrings": @(result.count), @"private": privateDiagnostic ?: NSNull.null,
      @"current": @{ @"fieldSlots": @(nodeIndex * 4), @"calls": @(calls), @"unavailable": @(unavailable), @"nil": @(nilReads), @"captured": @(captured),
        @"string": @(stringValues), @"attributedString": @(attributedValues), @"other": @(otherValues), @"normalizedNil": @(normalizedNil),
        @"empty": @(empty), @"nonempty": @(nonempty), @"retainedStrings": @(publicRetainedStrings), @"detailLimit": @16,
        @"detailsOmitted": @(nodeIndex * 4 - detailCount), @"rows": currentRows },
      @"legacy": @{ @"diagnosticOnly": @YES, @"nodeLimit": @8, @"nodesConsidered": @(considered), @"supportedReadsAttempted": @(attempted),
        @"returned": @(returned), @"thrown": @(thrown), @"selectorExceptions": @(selectorExceptions), @"metadataExceptions": @(metadataExceptions),
        @"nodesOmitted": @(nodeIndex - considered), @"rows": legacyRows } };
  } @catch (__unused NSException *exception) {
    // Missing diagnostics stay unknown to the reporter; strings remain exact.
  }
  return result;
}
static NSDictionary *TooltipObservation(NSWindow *owner, NSView *trigger) {
  BOOL truncated = NO;
  HelpTagDiagnosticBudget diagnosticBudget;
  NSMutableArray *windows = [NSMutableArray new], *helpTags = [NSMutableArray new];
  for (NSWindow *window in NSApp.windows) {
    if (windows.count >= 64) { truncated = YES; break; }
    BOOL onscreen = window.visible && !window.miniaturized && window.alphaValue > 0 && (window.occlusionState & NSWindowOcclusionStateVisible);
    NSMutableDictionary *record = [@{ @"number": @(window.windowNumber), @"class": NSStringFromClass(window.class), @"visible": @(window.visible), @"onscreen": @(onscreen), @"alpha": @(window.alphaValue), @"frame": RectDictionary(window.frame) } mutableCopy];
    [windows addObject:record];
    if (!onscreen) continue;
    NSMutableOrderedSet<NSString *> *roles = [NSMutableOrderedSet new];
    for (id node in AccessibilityNodes(window, &truncated)) {
      NSString *role = [node respondsToSelector:@selector(accessibilityRole)] ? [node accessibilityRole] : nil;
      if (role.length) [roles addObject:role];
      if (![role isEqual:(__bridge NSString *)kAXHelpTagRole]) continue;
      NSRect frame = [node respondsToSelector:@selector(accessibilityFrame)] ? [node accessibilityFrame] : NSZeroRect;
      NSDictionary *textDiagnostic = nil;
      [helpTags addObject:@{ @"windowNumber": @(window.windowNumber), @"windowFrame": RectDictionary(window.frame), @"frame": RectDictionary(frame), @"role": [node accessibilityRole], @"strings": HelpTagStrings(node, window, &truncated, &diagnosticBudget, &textDiagnostic) }];
      @try {
        if (textDiagnostic) {
          NSMutableDictionary *tag = [helpTags.lastObject mutableCopy];
          tag[@"textReadDiagnostic"] = textDiagnostic; helpTags[helpTags.count - 1] = tag;
        }
      } @catch (__unused NSException *exception) {}
    }
    record[@"roles"] = roles.array;
  }
  NSRect triggerFrame = [owner convertRectToScreen:[trigger convertRect:trigger.bounds toView:nil]];
  NSPoint cursor = NSEvent.mouseLocation;
  // AXIsProcessTrusted returns C Boolean, whose boxed value serializes as a
  // number. Preserve its truth value with explicit JSON boolean objects.
  return @{ @"ok": @YES, @"boundary": @"native-help-tag-observation-with-private-draw-view-text", @"postEventsAllowed": @(CGPreflightPostEventAccess()), @"accessibilityTrusted": (AXIsProcessTrusted() ? @YES : @NO),
    @"ownerVisible": @(owner.visible && !owner.miniaturized), @"ownerKey": @(owner.keyWindow), @"applicationActive": @(NSApp.active), @"pointerRunning": @(PointerRunning), @"triggerFrame": RectDictionary(triggerFrame),
    @"cursor": @{ @"x": @(cursor.x), @"y": @(cursor.y) }, @"cursorInsideTrigger": @(NSPointInRect(cursor, triggerFrame)), @"windows": windows, @"helpTags": helpTags, @"traversalTruncated": @(truncated) };
}

@interface NYCTronAcceptanceDriver : NSObject @end
@implementation NYCTronAcceptanceDriver
+ (void)load {
  dispatch_async(dispatch_get_main_queue(), ^{
    [NSNotificationCenter.defaultCenter addObserverForName:NSMenuDidBeginTrackingNotification object:nil queue:NSOperationQueue.mainQueue usingBlock:^(NSNotification *note) {
      NSMenu *menu = [note.object isKindOfClass:NSMenu.class] ? note.object : nil;
      if ([menu.title isEqual:@"ContextMenu"]) {
        TrackedContextMenu = menu;
        TrackedContextMenuGeneration = ++ContextMenuGeneration;
        TraceContextMenu(@"begin", TrackedContextMenuGeneration);
      }
    }];
    [NSNotificationCenter.defaultCenter addObserverForName:NSMenuDidEndTrackingNotification object:nil queue:NSOperationQueue.mainQueue usingBlock:^(NSNotification *note) {
      if (TrackedContextMenu == note.object) {
        EndedContextMenuGeneration = TrackedContextMenuGeneration;
        TrackedContextMenu = nil;
        TrackedContextMenuGeneration = 0;
        TraceContextMenu(@"end", EndedContextMenuGeneration);
      }
    }];
    SparkTestDriverRegisterCommand(@"tron.inspect", ^(NSDictionary *request, SparkTestDriverReply reply) {
      NSWindow *window = Window(request[@"window"] ?: @"main");
      if (!window) { reply(Failure(@"Native window not found")); return; }
      NSView *view = request[@"testID"] ? Find(window.contentView, request[@"testID"]) : window.contentView;
      if (!view) { reply(Failure(@"Native view not found")); return; }
      NSMutableArray *classes = [NSMutableArray new]; Classes(view, classes);
      NSMutableArray *labels = [NSMutableArray new]; Labels(view, labels);
      NSMutableDictionary *result = [@{ @"ok": @YES, @"classes": classes, @"identity": [NSString stringWithFormat:@"%p", view], @"label": view.accessibilityLabel ?: @"", @"minimized": @(window.miniaturized), @"width": @(NSWidth(window.frame)), @"height": @(NSHeight(window.frame)) } mutableCopy];
      result[@"labels"] = labels;
      result[@"tooltip"] = view.toolTip ?: @"";
      result[@"help"] = view.accessibilityHelp ?: @"";
      result[@"windowClass"] = NSStringFromClass(window.class);
      result[@"viewBounds"] = RectDictionary(view.bounds);
      result[@"visibleRect"] = RectDictionary(view.visibleRect);
      result[@"fullyVisible"] = @(![view isHiddenOrHasHiddenAncestor] && NSContainsRect(view.visibleRect, view.bounds));
      result[@"contentBounds"] = RectDictionary(window.contentView.bounds);
      result[@"visible"] = @(window.visible);
      result[@"key"] = @(window.keyWindow);
      result[@"canBecomeKey"] = @(window.canBecomeKeyWindow);
      result[@"applicationActive"] = @(NSApp.active);
      result[@"activationPolicy"] = @(NSApp.activationPolicy);
      result[@"processId"] = @(NSProcessInfo.processInfo.processIdentifier);
      result[@"frontmostProcessId"] = @(NSWorkspace.sharedWorkspace.frontmostApplication.processIdentifier);
      result[@"firstResponderIdentity"] = window.firstResponder ? [NSString stringWithFormat:@"%p", window.firstResponder] : @"";
      result[@"appearance"] = [window.effectiveAppearance bestMatchFromAppearancesWithNames:@[NSAppearanceNameAqua, NSAppearanceNameDarkAqua]] ?: @"";
      result[@"hasButton"] = @(Control(view, NSButton.class) != nil);
      result[@"hasSplitView"] = @(Control(view, NSSplitView.class) != nil);
      result[@"hasTableView"] = @(Control(view, NSTableView.class) != nil);
      result[@"hasTextField"] = @(Control(view, NSTextField.class) != nil);
      result[@"hasNativeDragView"] = @(Control(view, RNDesktopDragView.class) != nil);
      NSTextField *field = (NSTextField *)Control(view, NSTextField.class);
      if (field) { result[@"value"] = field.stringValue; result[@"editing"] = @([field currentEditor] != nil); result[@"editorIdentity"] = field.currentEditor ? [NSString stringWithFormat:@"%p", field.currentEditor] : @""; }
      NSPopUpButton *popup = (NSPopUpButton *)Control(view, NSPopUpButton.class);
      if (popup) result[@"selected"] = @(popup.indexOfSelectedItem);
      NSSegmentedControl *segmented = (NSSegmentedControl *)Control(view, NSSegmentedControl.class);
      if (segmented) result[@"selected"] = @(segmented.selectedSegment);
      NSTableView *table = (NSTableView *)Control(view, NSTableView.class);
      if (table) result[@"selected"] = @(table.selectedRow);
      reply(result);
    });
    SparkTestDriverRegisterCommand(@"tron.popover", ^(NSDictionary *request, SparkTestDriverReply reply) {
      NSWindow *owner = Window(request[@"window"] ?: @"main");
      NSView *view = owner ? Find(owner.contentView, request[@"testID"]) : nil;
      if (![view isKindOfClass:NYCTronPopoverComponentView.class]) { reply(Failure(@"Expected the installed native NSPopover component")); return; }
      NYCTronPopoverComponentView *component = (NYCTronPopoverComponentView *)view;
      NSPopover *popover = component.nativePopover;
      NSView *content = popover.contentViewController.view;
      if ([request[@"action"] isEqual:@"arm-close-observation"]) ArmPopoverCloseObservation(owner, component, popover);
      NSMutableDictionary *closeTrace = nil;
      if ([request[@"action"] isEqual:@"escape"] || [request[@"action"] isEqual:@"close"]) {
        BOOL escape = [request[@"action"] isEqual:@"escape"];
        closeTrace = [@{ @"shownBefore": @(popover.shown), @"animates": @(popover.animates), @"behavior": @(popover.behavior),
          @"delegateClass": popover.delegate ? NSStringFromClass([(id)popover.delegate class]) : @"nil",
          @"delegateIsComponent": @(popover.delegate == (id)component),
          @"controllerClass": NSStringFromClass(popover.contentViewController.class),
          @"controllerResponds": @([popover.contentViewController respondsToSelector:@selector(cancelOperation:)]),
          @"popoverWindowVisible": @(content.window.visible) } mutableCopy];
        if (escape) closeTrace[@"performed"] = @([popover.contentViewController tryToPerform:@selector(cancelOperation:) with:nil]);
        else [popover performClose:nil];
        closeTrace[@"shownAfter"] = @(popover.shown);
        NSLog(@"NYCTronPopoverDriver close-trace %@", closeTrace);
      }
      NSMutableArray *classes = [NSMutableArray new]; Classes(content, classes);
      NSMutableDictionary *result = [@{ @"ok": @YES, @"nativePopover": @([popover isKindOfClass:NSPopover.class]), @"class": NSStringFromClass(popover.class), @"shown": @(popover.shown), @"contentVisible": @(!content.hidden), @"contentIdentity": [NSString stringWithFormat:@"%p", content], @"classes": classes, @"region": RectDictionary(component.nativeAllowedRegion) } mutableCopy];
      if (closeTrace) result[@"closeTrace"] = closeTrace;
      result[@"closeObservation"] = PopoverCloseObservationState(owner, component, popover);
      if (popover.shown && content.window) result[@"frame"] = RectDictionary(OwnerCoordinates(owner, content.window.frame));
      reply(result);
    });
    SparkTestDriverRegisterCommand(@"tron.react-responder", ^(NSDictionary *request, SparkTestDriverReply reply) {
      // Synthetic NSEvents enter the installed RCTSurfaceTouchHandler. Its
      // actual hit-test/emitter/responder path reaches an ordinary Pressable;
      // this is neither Spark target/action nor a physical OS mouse gesture.
      NSString *action = request[@"action"];
      if ([action isEqual:@"down"]) {
        if (ResponderToken || PointerRunning) { reply(Failure(@"Another native acceptance gesture is active")); return; }
        NSWindow *owner = Window(request[@"window"] ?: @"main");
        NSView *target = owner ? Find(owner.contentView, request[@"testID"]) : nil;
        RCTSurfaceTouchHandler *handler = nil;
        for (NSView *ancestor = target; ancestor && !handler; ancestor = ancestor.superview) {
          for (NSGestureRecognizer *recognizer in ancestor.gestureRecognizers) {
            if ([recognizer isKindOfClass:RCTSurfaceTouchHandler.class]) { handler = (RCTSurfaceTouchHandler *)recognizer; break; }
          }
        }
        if (!target || !handler || !target.window.visible || [target isHiddenOrHasHiddenAncestor] || !NSContainsRect(target.visibleRect, target.bounds) || Control(target, NSControl.class)) {
          reply(Failure(@"Expected a visible ordinary Fabric view with its installed surface touch handler")); return;
        }
        ResponderTarget = target; ResponderHandler = handler; ResponderWindow = target.window;
        ResponderToken = ++NextResponderToken;
        ResponderStart = [target convertPoint:NSMakePoint(NSMinX(target.bounds) + NSWidth(target.bounds) / 4, NSMidY(target.bounds)) toView:nil];
        ResponderPoint = ResponderStart;
      } else {
        if (!ResponderToken || ![request[@"token"] isKindOfClass:NSNumber.class] || [request[@"token"] integerValue] != ResponderToken) {
          reply(Failure(@"Stale native responder sequence")); return;
        }
        if ([action isEqual:@"cancel"]) { ClearResponder(); reply(@{ @"ok": @YES, @"boundary": @"synthetic-native-responder", @"cancelled": @YES }); return; }
        if (![action isEqual:@"move"] && ![action isEqual:@"up"]) { reply(Failure(@"Unknown native responder action")); return; }
      }
      NSView *target = ResponderTarget;
      RCTSurfaceTouchHandler *handler = ResponderHandler;
      NSWindow *window = ResponderWindow;
      if (!target || !handler || !window.visible || target.window != window || [target isHiddenOrHasHiddenAncestor] || !NSContainsRect(target.visibleRect, target.bounds) || ![target isDescendantOf:handler.view]) {
        ClearResponder(); reply(Failure(@"Native responder target lifetime ended")); return;
      }
      if ([action isEqual:@"move"]) {
        double dx = request[@"dx"] ? [request[@"dx"] doubleValue] : 4;
        double dy = request[@"dy"] ? [request[@"dy"] doubleValue] : 1;
        if (!isfinite(dx) || !isfinite(dy) || fabs(dx) > 20 || fabs(dy) > 20) { reply(Failure(@"Responder movement exceeded its local acceptance bounds")); return; }
        ResponderPoint = NSMakePoint(ResponderStart.x + dx, ResponderStart.y - dy);
      }
      if (!NSPointInRect([target convertPoint:ResponderPoint fromView:nil], target.bounds)) {
        ClearResponder(); reply(Failure(@"Responder acceptance point left the actual native target bounds")); return;
      }
      NSEventType type = [action isEqual:@"down"] ? NSEventTypeLeftMouseDown : [action isEqual:@"move"] ? NSEventTypeLeftMouseDragged : NSEventTypeLeftMouseUp;
      NSEvent *event = [NSEvent mouseEventWithType:type location:ResponderPoint modifierFlags:0 timestamp:NSProcessInfo.processInfo.systemUptime
          windowNumber:window.windowNumber context:nil eventNumber:100000 + ResponderToken clickCount:1 pressure:type == NSEventTypeLeftMouseUp ? 0 : 1];
      if (!event) { ClearResponder(); reply(Failure(@"Cannot construct the native responder event")); return; }
      NSRect bounds = [target convertRect:target.bounds toView:nil];
      bounds.origin.y = NSHeight(window.frame) - NSMaxY(bounds);
      NSRect handlerBounds = [handler.view convertRect:handler.view.bounds toView:nil];
      handlerBounds.origin.y = NSHeight(window.frame) - NSMaxY(handlerBounds);
      NSDictionary *result = @{ @"ok": @YES, @"boundary": @"synthetic-native-responder", @"token": @(ResponderToken),
        @"handlerClass": NSStringFromClass(handler.class), @"targetClass": NSStringFromClass(target.class),
        @"point": @{ @"x": @(ResponderPoint.x), @"y": @(NSHeight(window.frame) - ResponderPoint.y) }, @"nativeBounds": RectDictionary(bounds),
        @"handlerBounds": RectDictionary(handler.view.bounds), @"handlerWindowBounds": RectDictionary(handlerBounds),
        @"windowViewport": @{ @"width": @(NSWidth(window.frame)), @"height": @(NSHeight(window.frame)) } };
      if (type == NSEventTypeLeftMouseDown) [handler mouseDown:event];
      else if (type == NSEventTypeLeftMouseDragged) [handler mouseDragged:event];
      else { [handler mouseUp:event]; ClearResponder(); }
      reply(result);
    });
    SparkTestDriverRegisterCommand(@"tron.menu", ^(NSDictionary *request, SparkTestDriverReply reply) {
      NSMenuItem *item = FindMenuItem(NSApp.mainMenu, request[@"itemId"]);
      if (!item) { reply(Failure(@"Native application menu item not found")); return; }
      if ([request[@"action"] isEqual:@"select"]) {
        if (!item.enabled || item.hidden || !item.action) { reply(Failure(@"Application menu item is not selectable")); return; }
        [item.menu performActionForItemAtIndex:[item.menu indexOfItem:item]];
      }
      reply(@{ @"ok": @YES, @"nativeMenu": @([item.menu isKindOfClass:NSMenu.class]), @"class": NSStringFromClass(item.class), @"enabled": @(item.enabled), @"title": item.title, @"keyEquivalent": item.keyEquivalent });
    });
    SparkTestDriverRegisterCommand(@"tron.context-menu", ^(NSDictionary *request, SparkTestDriverReply reply) {
      NSMenu *menu = TrackedContextMenu;
      NSUInteger generation = TrackedContextMenuGeneration;
      NSString *action = request[@"action"];
      if (!menu) {
        if (action) { TraceContextMenu(@"rejected-absent", 0); reply(Failure(@"No native context menu is tracking")); return; }
        reply(@{ @"ok": @YES, @"shown": @NO, @"generation": @0, @"endedGeneration": @(EndedContextMenuGeneration) }); return;
      }
      // A selected command can resolve its React Promise before AppKit ends
      // tracking. Never let a later operation silently target that old menu.
      if (action && (![request[@"generation"] isKindOfClass:NSNumber.class] || [request[@"generation"] doubleValue] != (double)generation)) {
        TraceContextMenu(@"rejected-generation", generation);
        reply(Failure(@"Native context menu tracking generation changed")); return;
      }
      NSMutableArray *items = [NSMutableArray new];
      for (NSMenuItem *item in menu.itemArray) {
        [items addObject:@{ @"id": [item.representedObject isKindOfClass:NSString.class] ? item.representedObject : @"", @"enabled": @(item.enabled), @"class": NSStringFromClass(item.class) }];
      }
      if ([action isEqual:@"select"]) {
        NSMenuItem *selected = nil;
        for (NSMenuItem *item in menu.itemArray) if ([item.representedObject isEqual:request[@"itemId"]]) selected = item;
        if (!selected || !selected.enabled || selected.hidden || !selected.action) { reply(Failure(@"Context menu item is not selectable")); return; }
        TraceContextMenu(@"select-requested", generation);
        [menu performActionForItemAtIndex:[menu indexOfItem:selected]];
        [menu cancelTracking];
        TraceContextMenu(@"select-returned", generation);
      } else if ([action isEqual:@"cancel"]) {
        TraceContextMenu(@"cancel-requested", generation);
        [menu cancelTracking];
        TraceContextMenu(@"cancel-returned", generation);
      } else if (action) { reply(Failure(@"Unknown native context menu action")); return; }
      NSMutableDictionary *result = [@{ @"ok": @YES, @"shown": @(TrackedContextMenu != nil), @"nativeMenu": @([menu isKindOfClass:NSMenu.class]), @"items": items,
        @"generation": @(TrackedContextMenuGeneration), @"endedGeneration": @(EndedContextMenuGeneration) } mutableCopy];
      if (action) result[@"actedOnGeneration"] = @(generation);
      reply(result);
    });
    SparkTestDriverRegisterCommand(@"tron.windows", ^(NSDictionary *request, SparkTestDriverReply reply) {
      NSMutableArray *windows = [NSMutableArray new];
      for (NSWindow *window in NSApp.windows) {
        if (![window.identifier isEqual:@"spark.main"] && ![window.identifier isEqual:@"document-1"]) continue;
        [windows addObject:@{ @"id": window.identifier, @"class": NSStringFromClass(window.class), @"minimized": @(window.miniaturized), @"width": @(NSWidth(window.frame)), @"height": @(NSHeight(window.frame)) }];
      }
      reply(@{ @"ok": @YES, @"windows": windows });
    });
    SparkTestDriverRegisterCommand(@"tron.drag-protocol", ^(NSDictionary *request, SparkTestDriverReply reply) {
      NSString *action = request[@"action"];
      if ([action isEqual:@"enter"]) {
        if (ProtocolDrag) { reply(Failure(@"A native protocol offer is already active")); return; }
        NSWindow *sourceWindow = Window(request[@"source"]), *targetWindow = Window(request[@"target"]);
        NSView *source = sourceWindow ? Find(sourceWindow.contentView, [@"drop-" stringByAppendingString:request[@"source"]]) : nil;
        NSView *target = targetWindow ? Find(targetWindow.contentView, [@"drop-" stringByAppendingString:request[@"target"]]) : nil;
        Class nativeClass = NSClassFromString(@"RNDesktopDragView");
        if (![source isKindOfClass:nativeClass] || ![target isKindOfClass:nativeClass] || source == target) { reply(Failure(@"Expected distinct installed native drag views")); return; }
        // Read the actual configured native source rather than inventing a JS
        // callback payload; these private fixture diagnostics never ship.
        NSDictionary *sourceData = [source valueForKey:@"source"];
        NSDictionary *data = sourceData[@"data"];
        if (![data isKindOfClass:NSDictionary.class] || !data.count) { reply(Failure(@"Native source has no document representation")); return; }
        NYCTronProtocolDrag *offer = [NYCTronProtocolDrag new];
        offer.draggingPasteboard = [NSPasteboard pasteboardWithUniqueName];
        for (NSString *mime in data) {
          NSPasteboardType type = [UTType typeWithMIMEType:mime].identifier;
          if (!type || ![data[mime] isKindOfClass:NSString.class]) { [offer.draggingPasteboard releaseGlobally]; reply(Failure(@"Invalid configured native source representation")); return; }
          [offer.draggingPasteboard setString:data[mime] forType:type];
        }
        offer.draggingSource = source; offer.destination = target;
        offer.draggingDestinationWindow = targetWindow;
        offer.draggingLocation = [target convertPoint:NSMakePoint(NSMidX(target.bounds), NSMidY(target.bounds)) toView:nil];
        offer.draggingSourceOperationMask = [(id<NSDraggingSource>)source draggingSession:nil sourceOperationMaskForDraggingContext:NSDraggingContextWithinApplication];
        offer.draggingSequenceNumber = ++NextProtocolDrag; offer.numberOfValidItemsForDrop = 1;
        ProtocolDrag = offer;
        NSDragOperation operation = [target draggingEntered:offer];
        reply(@{ @"ok": @YES, @"boundary": @"native-protocol", @"operation": @(operation), @"sourceMask": @(offer.draggingSourceOperationMask), @"pasteboardTypes": offer.draggingPasteboard.types ?: @[] });
        return;
      }
      NYCTronProtocolDrag *offer = ProtocolDrag;
      if (!offer || !offer.destination) { reply(Failure(@"No live native protocol offer")); return; }
      if ([action isEqual:@"drop"]) {
        BOOL accepted = [offer.destination performDragOperation:offer];
        [(id<NSDraggingSource>)offer.draggingSource draggingSession:nil endedAtPoint:offer.draggingLocation operation:accepted ? NSDragOperationMove : NSDragOperationNone];
        [offer.draggingPasteboard releaseGlobally]; ProtocolDrag = nil;
        reply(@{ @"ok": @YES, @"boundary": @"native-protocol", @"nativeAccepted": @(accepted) });
      } else if ([action isEqual:@"cancel"]) {
        [offer.destination draggingExited:offer];
        [(id<NSDraggingSource>)offer.draggingSource draggingSession:nil endedAtPoint:offer.draggingLocation operation:NSDragOperationNone];
        [offer.draggingPasteboard releaseGlobally]; ProtocolDrag = nil;
        reply(@{ @"ok": @YES, @"boundary": @"native-protocol" });
      } else reply(Failure(@"Unknown native protocol action"));
    });
    SparkTestDriverRegisterCommand(@"tron.tooltip", ^(NSDictionary *request, SparkTestDriverReply reply) {
      NSWindow *owner = Window(request[@"window"] ?: @"main");
      NSView *trigger = owner ? Find(owner.contentView, request[@"testID"]) : nil;
      if (!trigger || !trigger.toolTip.length) { reply(Failure(@"Expected a native tooltip trigger")); return; }
      NSString *action = request[@"action"] ?: @"inspect";
      if ([action isEqual:@"inspect"]) { reply(TooltipObservation(owner, trigger)); return; }
      if ([action isEqual:@"capture"]) {
        NSInteger number = [request[@"windowNumber"] integerValue];
        NSDictionary *observation = TooltipObservation(owner, trigger);
        BOOL observed = NO;
        for (NSDictionary *tag in observation[@"helpTags"]) if ([tag[@"windowNumber"] integerValue] == number && [tag[@"strings"] containsObject:trigger.toolTip]) observed = YES;
        NSWindow *window = observed ? [NSApp windowWithWindowNumber:number] : nil;
        NSView *content = window.contentView;
        NSBitmapImageRep *bitmap = content ? [content bitmapImageRepForCachingDisplayInRect:content.bounds] : nil;
        if (!bitmap || bitmap.pixelsWide <= 0 || bitmap.pixelsHigh <= 0 || bitmap.pixelsWide * bitmap.pixelsHigh > 4000000) { reply(Failure(@"No bounded visible native help-tag content to capture")); return; }
        [content cacheDisplayInRect:content.bounds toBitmapImageRep:bitmap];
        NSData *png = [bitmap representationUsingType:NSBitmapImageFileTypePNG properties:@{}];
        if (!png.length || png.length > 1024 * 1024) { reply(Failure(@"Native help-tag capture is empty or exceeds the fixture limit")); return; }
        reply(@{ @"ok": @YES, @"windowNumber": @(number), @"width": @(bitmap.pixelsWide), @"height": @(bitmap.pixelsHigh), @"pngBase64": [png base64EncodedStringWithOptions:0],
          @"boundary": @"Visible native help-tag window content bitmap; excludes the system shadow and desktop compositor" }); return;
      }
      if (![action isEqual:@"enter"] && ![action isEqual:@"leave"]) { reply(Failure(@"Unknown tooltip pointer action")); return; }
      if (!CGPreflightPostEventAccess()) { reply(Failure(@"CGPreflightPostEventAccess denied tooltip hover input; no permission prompt was attempted")); return; }
      if (PointerRunning || ProtocolDrag || ResponderHandler) { reply(Failure(@"Another pointer or native protocol sequence is active")); return; }
      if (!owner.visible || owner.miniaturized || !owner.keyWindow || !NSApp.active) { reply(Failure(@"The tooltip owner must be visible, key and active before pointer input")); return; }
      NSView *target = [action isEqual:@"enter"] ? trigger : Find(owner.contentView, request[@"outsideTestID"]);
      BOOL hidden = NO;
      for (NSView *ancestor = target; ancestor; ancestor = ancestor.superview) if (ancestor.hidden) hidden = YES;
      NSScreen *primary = PrimaryScreen();
      if (!target || !primary || hidden || NSIsEmptyRect(target.bounds) || !NSContainsRect(target.visibleRect, target.bounds)) { reply(Failure(@"The native tooltip pointer target must be fully visible")); return; }
      NSPoint point = [owner convertPointToScreen:[target convertPoint:NSMakePoint(NSMidX(target.bounds), NSMidY(target.bounds)) toView:nil]];
      NSRect triggerFrame = [owner convertRectToScreen:[trigger convertRect:trigger.bounds toView:nil]];
      if ([action isEqual:@"leave"] && NSPointInRect(point, triggerFrame)) { reply(Failure(@"The tooltip exit point is still inside the trigger")); return; }
      PointerRunning = YES;
      PostPointer(kCGEventMouseMoved, QuartzPoint(point, primary), 0);
      dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.2 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{ PointerRunning = NO; });
      reply(@{ @"ok": @YES, @"boundary": @"CGEvent-posted-pointer", @"action": action, @"targetPoint": @{ @"x": @(point.x), @"y": @(point.y) }, @"triggerFrame": RectDictionary(triggerFrame) });
    });
    SparkTestDriverRegisterCommand(@"tron.pointer", ^(NSDictionary *request, SparkTestDriverReply reply) {
      BOOL postEvents = CGPreflightPostEventAccess();
      NSString *action = request[@"action"];
      if (!action || [action isEqual:@"status"]) {
        reply(@{ @"ok": @YES, @"postEventsAllowed": @(postEvents), @"accessibilityTrusted": (AXIsProcessTrusted() ? @YES : @NO), @"running": @(PointerRunning), @"session": PointerSession ?: (id)NSNull.null }); return;
      }
      if (!postEvents) { reply(Failure(@"CGPreflightPostEventAccess denied event posting; no permission prompt or synthetic gesture was attempted")); return; }
      if (PointerRunning || ProtocolDrag) { reply(Failure(@"Another pointer or protocol action is active")); return; }
      NSWindow *sourceWindow = Window(request[@"source"]), *targetWindow = Window(request[@"target"]);
      NSScreen *primary = PrimaryScreen();
      if (!primary || !sourceWindow || !targetWindow || sourceWindow == targetWindow) { reply(Failure(@"Expected two native windows and a primary display")); return; }
      if ([action isEqual:@"arrange"]) {
        NSRect area = primary.visibleFrame;
        CGFloat width = MIN(720, (NSWidth(area) - 24) / 2), height = MIN(760, NSHeight(area) - 16);
        if (width < 540 || height < 420) { reply(Failure(@"Primary display is too small for two unobscured native drag surfaces")); return; }
        [sourceWindow setFrame:NSMakeRect(NSMinX(area) + 8, NSMinY(area) + 8, width, height) display:YES];
        [targetWindow setFrame:NSMakeRect(NSMaxX(area) - width - 8, NSMinY(area) + 8, width, height) display:YES];
        [NSApp activateIgnoringOtherApps:YES]; [targetWindow orderFront:nil]; [sourceWindow makeKeyAndOrderFront:nil];
        reply(@{ @"ok": @YES, @"sourceFrame": RectDictionary(sourceWindow.frame), @"targetFrame": RectDictionary(targetWindow.frame), @"display": RectDictionary(area) }); return;
      }
      if (![action isEqual:@"drag"]) { reply(Failure(@"Unknown pointer action")); return; }
      NSView *source = Find(sourceWindow.contentView, [@"drop-" stringByAppendingString:request[@"source"]]);
      NSView *target = Find(targetWindow.contentView, [@"drop-" stringByAppendingString:request[@"target"]]);
      if (![source isKindOfClass:RNDesktopDragView.class] || ![target isKindOfClass:RNDesktopDragView.class]) { reply(Failure(@"Expected installed native drag surfaces")); return; }
      [source scrollRectToVisible:source.bounds]; [target scrollRectToVisible:target.bounds];
      [sourceWindow layoutIfNeeded]; [targetWindow layoutIfNeeded];
      NSRect sourceVisible = source.visibleRect, targetVisible = target.visibleRect;
      if (NSIsEmptyRect(sourceVisible) || NSIsEmptyRect(targetVisible)) { reply(Failure(@"A native drag surface is outside its visible scroll region")); return; }
      NSPoint sourcePoint = [sourceWindow convertPointToScreen:[source convertPoint:NSMakePoint(NSMidX(sourceVisible), NSMidY(sourceVisible)) toView:nil]];
      NSPoint targetPoint = [targetWindow convertPointToScreen:[target convertPoint:NSMakePoint(NSMidX(targetVisible), NSMidY(targetVisible)) toView:nil]];
      CGPoint start = QuartzPoint(sourcePoint, primary), end = QuartzPoint(targetPoint, primary);
      PointerSession = nil; PointerRunning = YES;
      PostPointer(kCGEventMouseMoved, start, 0.10);
      PostPointer(kCGEventLeftMouseDown, start, 0.20);
      for (NSInteger step = 1; step <= 24; step++) {
        double fraction = (double)step / 24;
        PostPointer(kCGEventLeftMouseDragged, CGPointMake(start.x + (end.x - start.x) * fraction, start.y + (end.y - start.y) * fraction), 0.25 + 0.05 * step);
      }
      PostPointer(kCGEventLeftMouseUp, end, 1.65);
      dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1.8 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{ PointerRunning = NO; });
      reply(@{ @"ok": @YES, @"started": @YES, @"boundary": @"CGEvent-posted-pointer", @"sourcePoint": @{ @"x": @(start.x), @"y": @(start.y) }, @"targetPoint": @{ @"x": @(end.x), @"y": @(end.y) } });
    });
    SparkTestDriverRegisterCommand(@"tron.control", ^(NSDictionary *request, SparkTestDriverReply reply) {
      NSWindow *window = Window(request[@"window"] ?: @"main");
      NSView *view = window ? Find(window.contentView, request[@"testID"]) : nil;
      if (!view) { reply(Failure(@"Native view not found")); return; }
      NSString *action = request[@"action"];
      if ([action isEqual:@"press"]) {
        NSButton *button = (NSButton *)Control(view, NSButton.class);
        if (!button || !button.enabled) { reply(Failure(@"Expected enabled NSButton")); return; }
        [button performClick:nil];
      } else if ([action isEqual:@"text"]) {
        NSTextField *field = (NSTextField *)Control(view, NSTextField.class);
        if (!field || !field.enabled || ![request[@"value"] isKindOfClass:NSString.class]) { reply(Failure(@"Expected editable NSTextField")); return; }
        NSWindow *controlWindow = field.window;
        if (!controlWindow) { reply(Failure(@"Native text field is not in a presented window")); return; }
        [controlWindow makeFirstResponder:field]; [field selectText:nil];
        NSTextView *editor = (NSTextView *)field.currentEditor;
        if (!editor) { reply(Failure(@"NSTextField has no native field editor")); return; }
        [editor insertText:request[@"value"] replacementRange:NSMakeRange(0, editor.string.length)];
      } else if ([action isEqual:@"select"]) {
        NSInteger index = [request[@"index"] integerValue];
        NSPopUpButton *popup = (NSPopUpButton *)Control(view, NSPopUpButton.class);
        NSSegmentedControl *segmented = (NSSegmentedControl *)Control(view, NSSegmentedControl.class);
        NSTableView *table = (NSTableView *)Control(view, NSTableView.class);
        if (popup && popup.enabled && index >= 0 && index < popup.numberOfItems) { [popup selectItemAtIndex:index]; [popup sendAction:popup.action to:popup.target]; }
        else if (segmented && segmented.enabled && index >= 0 && index < segmented.segmentCount) { segmented.selectedSegment = index; [segmented sendAction:segmented.action to:segmented.target]; }
        else if (table && index >= 0 && index < table.numberOfRows) { [table selectRowIndexes:[NSIndexSet indexSetWithIndex:(NSUInteger)index] byExtendingSelection:NO]; }
        else { reply(Failure(@"Expected native selection control and valid index")); return; }
      } else { reply(Failure(@"Unknown native control action")); return; }
      reply(@{ @"ok": @YES });
    });
    SparkTestDriverRegisterCommand(@"tron.window", ^(NSDictionary *request, SparkTestDriverReply reply) {
      NSWindow *window = Window(request[@"window"] ?: @"main");
      if (!window) { reply(Failure(@"Native window not found")); return; }
      NSString *action = request[@"action"];
      if ([action isEqual:@"resize"]) {
        double width = [request[@"width"] doubleValue], height = [request[@"height"] doubleValue];
        if (!isfinite(width) || !isfinite(height) || width < 460 || height < 420 || width > 2400 || height > 1600) { reply(Failure(@"Invalid acceptance bounds")); return; }
        NSRect frame = window.frame; frame.size = NSMakeSize(width, height); [window setFrame:frame display:YES];
      } else if ([action isEqual:@"close"]) [window performClose:nil];
      else if ([action isEqual:@"minimize"]) [window miniaturize:nil];
      // This explicit private-fixture command opts into interactive native
      // acceptance. Spark's stock capture driver starts with Prohibited
      // activation policy; screenshots alone do not need a visible owner.
      else if ([action isEqual:@"show"]) {
        NSUInteger operation = ++ActivationSequence;
        TraceActivation(@"policy-entered", operation, ^{ return ActivationWindowState(window); });
        // A window switch within the verified foreground process does not need
        // another bundle reopen, whose host policy can select the main window.
        // The initial and inactive paths still use Workspace identity checks.
        if (WorkspaceVerifiedProcessId > 0 && NSApp.activationPolicy == NSApplicationActivationPolicyRegular && NSApp.active) {
          pid_t processId = NSProcessInfo.processInfo.processIdentifier;
          NSURL *bundleURL = NSBundle.mainBundle.bundleURL.URLByResolvingSymlinksInPath;
          BOOL sameProcess = WorkspaceVerifiedProcessId == processId;
          BOOL sameBundle = WorkspaceVerifiedBundleURL && [WorkspaceVerifiedBundleURL isEqual:bundleURL];
          BOOL frontmost = sameProcess && sameBundle && NSWorkspace.sharedWorkspace.frontmostApplication.processIdentifier == processId;
          if (frontmost) {
            TraceActivation(@"policy-returned", operation, ^{ return @{ @"accepted": @YES, @"state": ActivationWindowState(window) }; });
            TraceActivation(@"identity-checked", operation, ^{ return @{ @"sameProcess": @(sameProcess), @"sameBundle": @(sameBundle) }; });
            if (window.miniaturized) {
              TraceActivation(@"deminiaturize-entered", operation, ^{ return ActivationWindowState(window); });
              [window deminiaturize:nil];
              TraceActivation(@"deminiaturize-returned", operation, ^{ return ActivationWindowState(window); });
            }
            TraceActivation(@"order-front-entered", operation, ^{ return ActivationWindowState(window); });
            [window makeKeyAndOrderFront:nil];
            TraceActivation(@"order-front-returned", operation, nil);
            NSDictionary *result = @{ @"ok": @YES, @"activationPath": @"NSWindow.makeKeyAndOrderFront", @"priorWorkspaceIdentityVerified": @YES,
              @"processId": @(processId), @"activationPolicy": @(NSApp.activationPolicy), @"applicationActive": @(NSApp.active), @"key": @(window.keyWindow), @"visible": @(window.visible) };
            TraceActivation(@"reply-prepared", operation, ^{ return @{ @"ok": result[@"ok"], @"policy": result[@"activationPolicy"],
              @"applicationActive": result[@"applicationActive"], @"key": result[@"key"], @"visible": result[@"visible"] }; });
            reply(result);
            return;
          }
        }
        // A second show finds the policy already Regular, and AppKit returns NO
        // for that no-op (run 42985584907, operation 2: policy 0, accepted false).
        // The requirement is the resulting policy, so check that.
        if (NSApp.activationPolicy != NSApplicationActivationPolicyRegular) [NSApp setActivationPolicy:NSApplicationActivationPolicyRegular];
        BOOL policyAccepted = NSApp.activationPolicy == NSApplicationActivationPolicyRegular;
        TraceActivation(@"policy-returned", operation, ^{ return @{ @"accepted": @(policyAccepted), @"state": ActivationWindowState(window) }; });
        if (!policyAccepted) { reply(Failure(@"The native test host refused interactive activation policy")); return; }
        // Sonoma ignores activateIgnoringOtherApps' old force flag. Use the
        // public workspace-opening activation context, targeting only this
        // already running test bundle. An activation request is not a pass:
        // the caller still observes actual active/key/visible native state.
        NSURL *bundleURL = NSBundle.mainBundle.bundleURL;
        pid_t processId = NSProcessInfo.processInfo.processIdentifier;
        NSWorkspaceOpenConfiguration *configuration = [NSWorkspaceOpenConfiguration configuration];
        configuration.activates = YES;
        configuration.createsNewApplicationInstance = NO;
        configuration.allowsRunningApplicationSubstitution = NO;
        configuration.addsToRecentItems = NO;
        configuration.hides = NO;
        configuration.hidesOthers = NO;
        configuration.promptsUserIfNeeded = NO;
        TraceActivation(@"workspace-request-entered", operation, nil);
        [NSWorkspace.sharedWorkspace openApplicationAtURL:bundleURL configuration:configuration completionHandler:^(NSRunningApplication *application, NSError *error) {
          const CFTimeInterval completionTraceStarted = CACurrentMediaTime();
          TraceActivation(@"workspace-completion-received", operation, ^{ return @{ @"hasApplication": @(application != nil), @"hasError": @(error != nil) }; });
          // NSWorkspace completes on a concurrent queue; window operations and
          // the observed activation state must return to AppKit's main queue.
          const CFTimeInterval submissionStarted = CACurrentMediaTime();
          dispatch_async(dispatch_get_main_queue(), ^{
            const CFTimeInterval mainEntered = CACurrentMediaTime();
            TraceActivation(@"workspace-main-continuation", operation, ^{
              // This clock excludes system sleep. Both intervals include any
              // descheduling; submission-to-entry also includes dispatch work.
              // Neither duration isolates queue residence or establishes cause.
              double completionTraceElapsedSeconds = submissionStarted - completionTraceStarted;
              double submissionStartToMainEntrySeconds = mainEntered - submissionStarted;
              return @{ @"state": ActivationWindowState(window), @"timing": @{
                @"clock": @"CACurrentMediaTime", @"clockExcludesSystemSleep": @YES,
                @"intervalsAreNotQueueResidence": @YES, @"intervalsDoNotEstablishCause": @YES,
                @"completionTraceElapsedSeconds": isfinite(completionTraceElapsedSeconds) && completionTraceElapsedSeconds >= 0 ? @(completionTraceElapsedSeconds) : NSNull.null,
                @"submissionStartToMainEntrySeconds": isfinite(submissionStartToMainEntrySeconds) && submissionStartToMainEntrySeconds >= 0 ? @(submissionStartToMainEntrySeconds) : NSNull.null
              } };
            });
            if (error || !application) {
              TraceActivation(@"workspace-rejected", operation, ^{ return @{ @"hasApplication": @(application != nil), @"hasError": @(error != nil) }; });
              reply(Failure([NSString stringWithFormat:@"Workspace activation failed: %@", error.localizedDescription ?: @"No running application returned"])); return;
            }
            BOOL sameProcess = application.processIdentifier == processId;
            BOOL sameBundle = sameProcess && [application.bundleURL.URLByResolvingSymlinksInPath isEqual:bundleURL.URLByResolvingSymlinksInPath];
            TraceActivation(@"identity-checked", operation, ^{ return @{ @"sameProcess": @(sameProcess), @"sameBundle": @(sameBundle) }; });
            if (!sameProcess || !sameBundle) {
              reply(Failure(@"Workspace activation did not return the existing acceptance process and bundle")); return;
            }
            WorkspaceVerifiedProcessId = processId;
            WorkspaceVerifiedBundleURL = [bundleURL.URLByResolvingSymlinksInPath copy];
            if (window.miniaturized) {
              TraceActivation(@"deminiaturize-entered", operation, ^{ return ActivationWindowState(window); });
              [window deminiaturize:nil];
              TraceActivation(@"deminiaturize-returned", operation, ^{ return ActivationWindowState(window); });
            }
            TraceActivation(@"order-front-entered", operation, ^{ return ActivationWindowState(window); });
            [window makeKeyAndOrderFront:nil];
            TraceActivation(@"order-front-returned", operation, nil);
            NSDictionary *result = @{ @"ok": @YES, @"activationPath": @"NSWorkspace.openApplication", @"processId": @(processId), @"activationPolicy": @(NSApp.activationPolicy), @"applicationActive": @(NSApp.active), @"key": @(window.keyWindow), @"visible": @(window.visible) };
            TraceActivation(@"reply-prepared", operation, ^{ return @{ @"ok": result[@"ok"], @"policy": result[@"activationPolicy"],
              @"applicationActive": result[@"applicationActive"], @"key": result[@"key"], @"visible": result[@"visible"] }; });
            reply(result);
          });
        }];
        TraceActivation(@"workspace-request-returned", operation, nil);
        return;
      }
      else { reply(Failure(@"Unknown native window action")); return; }
      reply(@{ @"ok": @YES });
    });
  });
}
@end
#endif
