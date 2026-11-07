# Focused iOS presentation-index harness

This task-owned UIKit host compiles the production AVURLAsset presentation-index implementation, MediaSource and error mapping directly. It does not copy/reimplement timestamp enumeration and does not mock Expo. The production worker result is plain data; the real Expo module maps that result into its existing Record. This host does not validate Expo record/macro generation, React Native autolinking or the player.

The existing full native-cadence host currently fails Xcode package resolution because its generated ios/build SwiftPM packages and xcframeworks are absent. The standalone producer host avoids those missing dependencies while exercising actual AVFoundation on the iOS simulator. Fixtures are generated with ffmpeg and checked with ffprobe, not nominal FPS synthesized as index values.

Build: `python3 tooling/native/presentation-index-ios/build.py`. The output path is printed; use Argent reinstall-app/launch-app for ai.nyctron.p03producer and await p03-producer-result containing P03 PRODUCER PASS. This one-off producer check is not a saved QA e2e suite. It also compiles the shared production image-generator owner and proves exact rational frame alignment; Expo module/record wrappers and the JPEG cache writer remain outside this small host.
