#import "NYCTronDisplays.h"
#import <AppKit/AppKit.h>
#import <CoreGraphics/CoreGraphics.h>

// Ownership: every AppKit read below runs on the main queue, which owns NSApp,
// NSScreen and NSWindow. The module holds no state, no locks and no C++
// resources; ARC releases the dictionaries and the JSON data when each block
// returns. Each promise block is called exactly once, on the main queue, and
// nothing else runs after it in the same block.

// Spark exposes the host-created main window as `main`; its NSWindow
// identifier is `spark.main`. Other Spark windows use their ID unchanged.
static NSWindow *NYCTronSparkWindow(NSString *windowId) {
  NSString *identifier = [windowId isEqualToString:@"main"] ? @"spark.main" : windowId;
  for (NSWindow *window in NSApp.windows) if ([window.identifier isEqualToString:identifier]) return window;
  return nil;
}

@implementation NYCTronDisplays
RCT_EXPORT_MODULE(NativeNYCTronDisplays)
+ (BOOL)requiresMainQueueSetup { return NO; }

// NSScreen frames are points, with Y increasing upwards. The shared space has
// the main display's top-left origin and downward Y. Never multiply by scale.
RCT_EXPORT_METHOD(readDisplays:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSArray<NSScreen *> *screens = NSScreen.screens;
    NSScreen *primary = nil;
    for (NSScreen *screen in screens) {
      if ([screen.deviceDescription[@"NSScreenNumber"] unsignedIntValue] == CGMainDisplayID()) primary = screen;
    }
    if (!primary) { reject(@"E_DISPLAY_UNAVAILABLE", @"No primary NSScreen", nil); return; }
    CGFloat top = NSMaxY(primary.frame), left = NSMinX(primary.frame);
    NSMutableArray *result = [NSMutableArray new];
    for (NSScreen *screen in screens) {
      NSRect frame = screen.frame, work = screen.visibleFrame;
      [result addObject:@{
        @"id": [screen.deviceDescription[@"NSScreenNumber"] stringValue],
        @"primary": @(screen == primary),
        @"origin": @{ @"x": @(NSMinX(frame) - left), @"y": @(top - NSMaxY(frame)) },
        @"bounds": @{ @"x": @(NSMinX(work) - left), @"y": @(top - NSMaxY(work)), @"width": @(NSWidth(work)), @"height": @(NSHeight(work)) },
        @"scaleFactor": @(screen.backingScaleFactor)
      }];
    }
    NSError *error = nil;
    NSData *data = [NSJSONSerialization dataWithJSONObject:result options:0 error:&error];
    if (!data) { reject(@"E_DISPLAY_DATA", @"Could not encode NSScreen geometry", error); return; }
    resolve([[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding]);
  });
}

// Measures the system window buttons in window coordinates (points). The
// leading inset runs from the leading edge to the far side of the visible
// button group: the right edge of the rightmost button in left-to-right title
// bars, or the distance from the window's right edge to the left edge of the
// leftmost button in right-to-left ones. Hidden buttons are skipped. The
// height is the frame height minus contentLayoutRect, which is the title bar
// AppKit reserves whether or not the content view runs under it.
RCT_EXPORT_METHOD(readTitleBarInsets:(NSString *)windowId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
  NSString *requested = [windowId copy];
  dispatch_async(dispatch_get_main_queue(), ^{
    if (requested.length == 0) { reject(@"E_INVALID_ARGUMENT", @"readTitleBarInsets needs a nonempty window ID", nil); return; }
    NSWindow *window = NYCTronSparkWindow(requested);
    if (!window) { reject(@"E_WINDOW_NOT_FOUND", [NSString stringWithFormat:@"No NSWindow for Spark window ID %@", requested], nil); return; }
    NSRect group = NSZeroRect;
    for (NSNumber *kind in @[@(NSWindowCloseButton), @(NSWindowMiniaturizeButton), @(NSWindowZoomButton)]) {
      NSButton *button = [window standardWindowButton:(NSWindowButton)kind.integerValue];
      if (!button || button.isHiddenOrHasHiddenAncestor) continue;
      NSRect frame = [button convertRect:button.bounds toView:nil];
      group = NSIsEmptyRect(group) ? frame : NSUnionRect(group, frame);
    }
    CGFloat width = NSWidth(window.frame);
    BOOL rightToLeft = window.windowTitlebarLayoutDirection == NSUserInterfaceLayoutDirectionRightToLeft;
    CGFloat leading = NSIsEmptyRect(group) ? 0 : (rightToLeft ? width - NSMinX(group) : NSMaxX(group));
    CGFloat height = NSHeight(window.frame) - NSHeight(window.contentLayoutRect);
    NSDictionary *insets = @{ @"leading": @(MAX(leading, 0)), @"trailing": @0, @"height": @(MAX(height, 0)) };
    NSError *error = nil;
    NSData *data = [NSJSONSerialization dataWithJSONObject:insets options:0 error:&error];
    if (!data) { reject(@"E_INSETS_DATA", @"Could not encode title bar insets", error); return; }
    resolve([[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding]);
  });
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeNYCTronDisplaysSpecJSI>(params);
}
@end
