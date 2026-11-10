#import <AppKit/AppKit.h>
#include <math.h>
#import <RNDesktopApp/SparkTestDriver.h>

#if SPARK_TEST_DRIVER
static NSView *Find(NSView *view, NSString *identifier) {
  if ([view.accessibilityIdentifier isEqual:identifier]) return view;
  for (NSView *child in view.subviews) { NSView *found = Find(child, identifier); if (found) return found; }
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
}
static NSDictionary *Failure(NSString *message) { return @{ @"ok": @NO, @"error": @{ @"code": @"E_ACCEPTANCE", @"message": message } }; }

@interface NYCTronAcceptanceDriver : NSObject @end
@implementation NYCTronAcceptanceDriver
+ (void)load {
  dispatch_async(dispatch_get_main_queue(), ^{
    SparkTestDriverRegisterCommand(@"tron.inspect", ^(NSDictionary *request, SparkTestDriverReply reply) {
      NSWindow *window = Window(request[@"window"] ?: @"main");
      if (!window) { reply(Failure(@"Native window not found")); return; }
      NSView *view = request[@"testID"] ? Find(window.contentView, request[@"testID"]) : window.contentView;
      if (!view) { reply(Failure(@"Native view not found")); return; }
      NSMutableArray *classes = [NSMutableArray new]; Classes(view, classes);
      NSMutableArray *labels = [NSMutableArray new]; Labels(view, labels);
      NSMutableDictionary *result = [@{ @"ok": @YES, @"classes": classes, @"identity": [NSString stringWithFormat:@"%p", view], @"label": view.accessibilityLabel ?: @"", @"minimized": @(window.miniaturized), @"width": @(NSWidth(window.frame)), @"height": @(NSHeight(window.frame)) } mutableCopy];
      result[@"labels"] = labels;
      result[@"windowClass"] = NSStringFromClass(window.class);
      result[@"appearance"] = [window.effectiveAppearance bestMatchFromAppearancesWithNames:@[NSAppearanceNameAqua, NSAppearanceNameDarkAqua]] ?: @"";
      result[@"hasButton"] = @(Control(view, NSButton.class) != nil);
      result[@"hasSplitView"] = @(Control(view, NSSplitView.class) != nil);
      result[@"hasTableView"] = @(Control(view, NSTableView.class) != nil);
      result[@"hasTextField"] = @(Control(view, NSTextField.class) != nil);
      NSTextField *field = (NSTextField *)Control(view, NSTextField.class);
      if (field) { result[@"value"] = field.stringValue; result[@"editing"] = @([field currentEditor] != nil); }
      NSPopUpButton *popup = (NSPopUpButton *)Control(view, NSPopUpButton.class);
      if (popup) result[@"selected"] = @(popup.indexOfSelectedItem);
      NSSegmentedControl *segmented = (NSSegmentedControl *)Control(view, NSSegmentedControl.class);
      if (segmented) result[@"selected"] = @(segmented.selectedSegment);
      NSTableView *table = (NSTableView *)Control(view, NSTableView.class);
      if (table) result[@"selected"] = @(table.selectedRow);
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
        [window makeFirstResponder:field]; [field selectText:nil];
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
      else { reply(Failure(@"Unknown native window action")); return; }
      reply(@{ @"ok": @YES });
    });
  });
}
@end
#endif
