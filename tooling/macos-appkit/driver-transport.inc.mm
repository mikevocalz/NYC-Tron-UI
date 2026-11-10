// NYC-Tron acceptance-only diagnostics for the pinned Spark test driver.
// Never installed by a normal reference preparation or shipped in the adapter.
#include <cmath>

static std::atomic<unsigned long> SparkTransportRequestSequence{0};
static id SparkTransportIdentifier(id value) {
  @try {
    if ([value isKindOfClass:NSString.class]) return value;
    if ([value isKindOfClass:NSNumber.class] && std::isfinite([value doubleValue])) return value;
  } @catch (NSException *exception) { (void)exception; }
  return NSNull.null;
}
static void SparkTransportTrace(NSString *phase, NSDictionary *request, NSDictionary *fields) {
  // Authentication never supplies request metadata. Do not log its token,
  // unparsed input, protocol ID values, request arguments, response values or
  // exception reasons. Fixed command labels and a local sequence identify stages.
  if (!request) return;
  static std::atomic<unsigned long> count{0};
  unsigned long number = count.fetch_add(1);
  if (number > 20000) return;
  @try {
    NSArray *commands = @[@"ping", @"waitFor", @"navigate", @"openFile", @"setAppAppearance", @"capture", @"quit", @"tron.inspect", @"tron.control", @"tron.window", @"tron.popover", @"tron.responder", @"tron.menu", @"tron.context-menu", @"tron.drag-protocol", @"tron.pointer", @"tron.tooltip"];
    NSString *command = [request[@"command"] isKindOfClass:NSString.class] && [commands containsObject:request[@"command"]] ? request[@"command"] : @"unrecognized-command";
    NSMutableDictionary *record = [@{ @"phase": number == 20000 ? @"trace-bound-reached" : phase,
      @"at": @([NSDate.date timeIntervalSince1970]), @"mainThread": @(NSThread.isMainThread),
      @"sequence": @(SparkTransportRequestSequence.load()), @"command": command } mutableCopy];
    if (number < 20000) record[@"details"] = fields ?: @{};
    NSData *data = [NSJSONSerialization dataWithJSONObject:record options:0 error:nil];
    if (data && data.length <= 4096) NSLog(@"NYCTronDriverTransport %@", [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding]);
    else NSLog(@"NYCTronDriverTransport trace-encoding-failed");
  } @catch (NSException *exception) { (void)exception; NSLog(@"NYCTronDriverTransport trace-encoding-threw"); }
}
static void SparkTransportIssues(id value, NSString *path, NSUInteger depth, NSUInteger *remaining, NSMutableArray *issues) {
  if (issues.count >= 8) return;
  if (!*remaining || depth > 12) { [issues addObject:@{ @"path": path, @"kind": @"inspection-bound" }]; return; }
  --*remaining;
  if ([value isKindOfClass:NSString.class] || value == NSNull.null) return;
  if ([value isKindOfClass:NSNumber.class]) {
    if (!std::isfinite([value doubleValue])) [issues addObject:@{ @"path": path, @"kind": @"nonfinite-number" }];
    return;
  }
  if ([value isKindOfClass:NSArray.class]) {
    NSUInteger index = 0;
    for (id child in value) { SparkTransportIssues(child, [path stringByAppendingFormat:@"[%lu]", (unsigned long)index++], depth + 1, remaining, issues); if (!*remaining || issues.count >= 8) break; }
    return;
  }
  if ([value isKindOfClass:NSDictionary.class]) {
    for (id key in value) {
      if (![key isKindOfClass:NSString.class]) { [issues addObject:@{ @"path": path, @"kind": @"nonstring-key" }]; if (issues.count >= 8) break; continue; }
      // Keep only fixed geometry/protocol field names, never arbitrary keys.
      NSArray *allowed = @[@"frame", @"bounds", @"viewBounds", @"visibleRect", @"contentBounds", @"region", @"windowFrame", @"triggerFrame", @"cursor", @"x", @"y", @"width", @"height", @"alpha", @"windows", @"helpTags", @"bytes", @"id", @"ok", @"error", @"code", @"message"];
      NSString *field = [allowed containsObject:key] ? key : @"<field>";
      SparkTransportIssues(value[key], [path stringByAppendingFormat:@".%@", field], depth + 1, remaining, issues);
      if (!*remaining || issues.count >= 8) break;
    }
    return;
  }
  [issues addObject:@{ @"path": path, @"kind": value ? @"unsupported-type" : @"nil-response" }];
}
static BOOL SparkSend(int fd, NSDictionary *message, NSDictionary *request) {
  NSData *encoded = nil;
  NSError *error = nil;
  NSString *exceptionName = nil;
  BOOL valid = NO, replacedWithFailure = NO;
  @try {
    valid = message && [NSJSONSerialization isValidJSONObject:message];
    if (valid) encoded = [NSJSONSerialization dataWithJSONObject:message options:0 error:&error];
  } @catch (NSException *exception) { exceptionName = exception.name; }
  if (!encoded.length) {
    NSMutableArray *issues = [NSMutableArray new]; NSUInteger remaining = 1024;
    @try { SparkTransportIssues(message, @"$", 0, &remaining, issues); }
    @catch (NSException *exception) { (void)exception; [issues removeAllObjects]; [issues addObject:@{ @"path": @"$", @"kind": @"inspection-threw" }]; }
    SparkTransportTrace(@"serialization-failed", request, @{ @"validJSONObject": @(valid), @"fieldIssues": issues,
      @"hasError": @(error != nil), @"errorCode": @(error.code), @"threwException": @(exceptionName != nil) });
    // A serialization failure is a failed command, never an empty successful send.
    // Preserve the caller's protocol ID, and never normalize invalid geometry.
    NSDictionary *failure = @{ @"id": SparkTransportIdentifier(request[@"id"]), @"ok": @NO,
      @"error": @{ @"code": @"E_SERIALIZATION", @"message": @"Native driver could not serialize its response" } };
    @try { encoded = [NSJSONSerialization dataWithJSONObject:failure options:0 error:nil]; }
    @catch (NSException *exception) { (void)exception; encoded = nil; }
    if (!encoded.length) { SparkTransportTrace(@"failure-serialization-failed", request, @{}); return NO; }
    replacedWithFailure = YES;
  }
  SparkTransportTrace(@"serialized", request, @{ @"bytes": @(encoded.length), @"replacedWithFailure": @(replacedWithFailure) });
  NSMutableData *data = [encoded mutableCopy];
  if (!data) { SparkTransportTrace(@"send-buffer-failed", request, @{}); return NO; }
  [data appendBytes:"\n" length:1];
  const char *bytes = (const char *)data.bytes;
  size_t remaining = data.length, sent = 0;
  while (remaining) {
    ssize_t count = send(fd, bytes, remaining, 0);
    if (count < 0 && errno == EINTR) continue;
    if (count <= 0) { int code = count < 0 ? errno : 0; SparkTransportTrace(@"send-failed", request, @{ @"bytes": @(sent), @"errno": @(code) }); return NO; }
    bytes += count; remaining -= (size_t)count; sent += (size_t)count;
  }
  SparkTransportTrace(@"send-completed", request, @{ @"bytes": @(sent), @"replacedWithFailure": @(replacedWithFailure) });
  return YES;
}
