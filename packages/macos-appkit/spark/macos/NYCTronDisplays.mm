#import "NYCTronDisplays.h"
#import <AppKit/AppKit.h>
#import <CoreGraphics/CoreGraphics.h>

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
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeNYCTronDisplaysSpecJSI>(params);
}
@end
