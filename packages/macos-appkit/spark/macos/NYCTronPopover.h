#import <AppKit/AppKit.h>
#import <React/RCTViewComponentView.h>

@interface NYCTronPopoverComponentView : RCTViewComponentView <NSPopoverDelegate>
// Native diagnostics inspect the actual AppKit object; no JavaScript test API.
@property (nonatomic, readonly) NSPopover *nativePopover;
@property (nonatomic, readonly) NSRect nativeAllowedRegion;
@end
