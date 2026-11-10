#import <Foundation/Foundation.h>
#include <atomic>
#include <cerrno>
#include <cmath>
#include <fcntl.h>
#include <sys/socket.h>
#include <unistd.h>

// These are extracted from the exact before/after driver bytes by preparation.
// The harness calls the real functions, not a separately reimplemented sender.
#include "SparkSend.original.inc.mm"
#include "SparkSend.patched.inc.mm"

static NSUInteger ProbeInspectionThrows;
@interface ProbeThrowingDictionary : NSDictionary
@property (nonatomic, readonly) BOOL fixtureConstructed;
@end
@implementation ProbeThrowingDictionary
- (instancetype)initWithObjects:(id const [])objects forKeys:(id<NSCopying> const [])keys count:(NSUInteger)count {
  // NSDictionary subclasses must implement this primitive. This fixture has
  // no entries; its deliberate fault belongs to inspection after construction.
  if (count != 0) @throw [NSException exceptionWithName:NSInvalidArgumentException reason:@"The probe fixture requires zero entries" userInfo:nil];
  self = [super init];
  if (self) _fixtureConstructed = YES;
  return self;
}
- (NSUInteger)count { ProbeInspectionThrows++; @throw [NSException exceptionWithName:@"ProbeSerializationException" reason:@"probe-private-exception-reason" userInfo:nil]; }
- (NSEnumerator *)keyEnumerator { ProbeInspectionThrows++; @throw [NSException exceptionWithName:@"ProbeSerializationException" reason:@"probe-private-exception-reason" userInfo:nil]; }
- (id)objectForKey:(id)key { ProbeInspectionThrows++; @throw [NSException exceptionWithName:@"ProbeSerializationException" reason:@"probe-private-exception-reason" userInfo:nil]; }
@end

static void Require(BOOL condition, const char *message) {
  if (!condition) { fprintf(stderr, "Transport probe assertion: %s\n", message); exit(1); }
}
static NSDictionary *Observe(BOOL patched, id payload, NSDictionary *request, BOOL finite) {
  int pair[2]; Require(socketpair(AF_UNIX, SOCK_STREAM, 0, pair) == 0, "socketpair");
  int one = 1; Require(setsockopt(pair[0], SOL_SOCKET, SO_NOSIGPIPE, &one, sizeof one) == 0, "SO_NOSIGPIPE");
  BOOL returned = NO, threw = NO;
  @try { returned = patched ? SparkSend(pair[0], payload, request) : SparkSendOriginal(pair[0], payload); }
  @catch (NSException *exception) { (void)exception; threw = YES; }
  Require(fcntl(pair[1], F_SETFL, O_NONBLOCK) == 0, "nonblocking probe read");
  NSMutableData *received = [NSMutableData new]; char buffer[4096];
  for (;;) {
    ssize_t bytes = recv(pair[1], buffer, sizeof buffer, 0);
    if (bytes < 0 && errno == EINTR) continue;
    if (bytes < 0 && (errno == EAGAIN || errno == EWOULDBLOCK)) break;
    Require(bytes > 0, "unexpected socket read error");
    [received appendBytes:buffer length:(NSUInteger)bytes]; Require(received.length < 65536, "probe response exceeded bound");
  }
  close(pair[0]); close(pair[1]);
  id decoded = received.length ? [NSJSONSerialization JSONObjectWithData:received options:0 error:nil] : nil;
  NSString *outcome;
  if (finite) {
    Require(!threw && returned && [decoded isEqual:payload], "finite response must retain all payload fields");
    Require(((const char *)received.bytes)[received.length - 1] == '\n', "finite response must retain newline framing");
    outcome = @"finite-response-preserved";
  } else if (patched) {
    Require(!threw && returned && [decoded isKindOfClass:NSDictionary.class], "invalid response must produce a real JSON failure frame");
    Require([decoded[@"ok"] isEqual:@NO] && [decoded[@"id"] isEqual:request[@"id"]], "serialization failure must retain ID and fail the command");
    Require([decoded[@"error"][@"code"] isEqual:@"E_SERIALIZATION"], "serialization failure code");
    outcome = @"structured-failure";
  } else {
    Require(threw || !returned || received.length == 0, "unexpected original invalid serialization behavior");
    outcome = threw ? @"exception-escaped" : returned && received.length == 0 ? @"empty-successful-send" : @"explicit-failure";
  }
  return @{ @"outcome": outcome, @"returned": @(returned), @"threw": @(threw), @"bytes": @(received.length) };
}
int main(void) {
  @autoreleasepool {
    ProbeThrowingDictionary *throwing = nil;
    BOOL constructionThrew = NO;
    @try { throwing = [[ProbeThrowingDictionary alloc] initWithObjects:NULL forKeys:NULL count:0]; }
    @catch (NSException *exception) { (void)exception; constructionThrew = YES; }
    Require(!constructionThrew && [throwing isKindOfClass:ProbeThrowingDictionary.class] && throwing.fixtureConstructed && ProbeInspectionThrows == 0,
      "throwing fixture must construct without invoking its inspection fault");
    NSDictionary *request = @{ @"id": @11, @"command": @"waitFor", @"token": @"probe-private-credential" };
    NSDictionary *finite = @{ @"id": @11, @"ok": @YES, @"window": @"spark.main", @"frame": @{ @"x": @1.25, @"y": @28, @"width": @1040, @"height": @732 } };
    NSArray *cases = @[
      @{ @"name": @"finite-frame", @"payload": finite, @"finite": @YES },
      @{ @"name": @"nan-frame", @"payload": @{ @"id": @11, @"ok": @YES, @"frame": @{ @"x": @(NAN) } } },
      @{ @"name": @"positive-infinite-frame", @"payload": @{ @"frame": @{ @"width": @(INFINITY) } } },
      @{ @"name": @"negative-infinite-frame", @"payload": @{ @"frame": @{ @"y": @(-INFINITY) } } },
      @{ @"name": @"unsupported-object", @"payload": @{ @"frame": NSDate.date } },
      @{ @"name": @"nil-response" },
      @{ @"name": @"throwing-container", @"payload": throwing },
    ];
    NSMutableArray *observations = [NSMutableArray new];
    for (NSDictionary *test in cases) {
      SparkTransportRequestSequence.fetch_add(1);
      NSUInteger beforeInspection = ProbeInspectionThrows;
      NSDictionary *original = Observe(NO, test[@"payload"], request, [test[@"finite"] boolValue]);
      if ([test[@"name"] isEqual:@"throwing-container"]) Require([original[@"threw"] boolValue] && ProbeInspectionThrows > beforeInspection,
        "the original sender must encounter the intended inspection exception");
      [observations addObject:@{ @"case": test[@"name"], @"original": original,
        @"patched": Observe(YES, test[@"payload"], request, [test[@"finite"] boolValue]) }];
    }
    NSDictionary *privateRequest = @{ @"id": @"probe-private-id", @"command": @"probe-private-command", @"token": @"probe-private-credential" };
    SparkTransportRequestSequence.fetch_add(1);
    NSDictionary *privacy = Observe(YES, @{ @"probe-private-field": @(NAN), @"message": @"probe-private-payload" }, privateRequest, NO);
    int pair[2]; Require(socketpair(AF_UNIX, SOCK_STREAM, 0, pair) == 0, "closed-peer socketpair");
    int one = 1; Require(setsockopt(pair[0], SOL_SOCKET, SO_NOSIGPIPE, &one, sizeof one) == 0, "closed-peer SO_NOSIGPIPE");
    close(pair[1]); Require(!SparkSend(pair[0], finite, request), "closed-peer send must fail explicitly"); close(pair[0]);
    NSDictionary *result = @{ @"schemaVersion": @1, @"status": @"passed", @"scope": @"foundation-socketpair-probe", @"cases": observations, @"throwingFixtureConstructed": @YES,
      @"privacyCase": privacy, @"closedPeer": @"explicit-failure", @"nativeInteractionsAccepted": @NO,
      @"limitation": @"Controlled serializer inputs test transport behavior; they do not establish the cause of the preceding native mount timeout." };
    NSData *data = [NSJSONSerialization dataWithJSONObject:result options:NSJSONWritingPrettyPrinted error:nil];
    Require(data != nil, "probe result serialization"); fwrite(data.bytes, 1, data.length, stdout); fputc('\n', stdout);
  }
  return 0;
}
