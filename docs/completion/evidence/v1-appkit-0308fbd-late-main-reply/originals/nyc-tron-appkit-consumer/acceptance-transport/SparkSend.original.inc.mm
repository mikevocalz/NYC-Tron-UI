static BOOL SparkSendOriginal(int fd, NSDictionary *message) {
  NSMutableData *data = [[NSJSONSerialization dataWithJSONObject:message options:0 error:nil] mutableCopy];
  [data appendBytes:"\n" length:1];
  const char *bytes = (const char *)data.bytes;
  size_t remaining = data.length;
  while (remaining) {
    ssize_t count = send(fd, bytes, remaining, 0);
    if (count < 0 && errno == EINTR) continue;
    if (count <= 0) return NO;
    bytes += count; remaining -= (size_t)count;
  }
  return YES;
}