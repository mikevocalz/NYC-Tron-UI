# P03 Android native validation checkpoint

2026-11-07. This is an incomplete Android validation checkpoint, not an APK or emulator pass.

The isolated `p03-decoder-native-host` links the actual NYC-Tron platform-services and native-controls source through Expo autolinking. It excludes the experimental Nitro player. Its Android application ID is `ai.nyctron.p03bridge`; original lab metadata, dependency pins, orientation, and source work remain unchanged.

The installed JDK 17, Gradle wrapper 9.4.1, RN 0.88.1, Expo 58.0.23, SDK/build-tools 37, and NDK 27.1.12297006 were used with arm64-v8a only. The actual platform-services and native-controls Kotlin compilation completed successfully, as did application Kotlin/Java compilation. The operator cancelled the build when free disk reached 2.85 GiB, before packaging and before booting ForgeCompletion_API36. No Android timestamp, JPEG, cache-cleanup, player lifecycle, or audio-focus runtime result is claimed.

Command from the isolated host Android directory:

```sh
JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home ANDROID_HOME=/Users/mikevocalz/Library/Android/sdk ./gradlew :app:assembleDebug --no-daemon --max-workers=2 -PreactNativeArchitectures=arm64-v8a -Porg.gradle.parallel=false
```

Filtered task evidence is in `../evidence/P03-android-native-compile.txt`; full attempt log remains `/tmp/p03-android-isolated-build.log`.

A subsequent source candidate splits player props, status payload, owner, and composable into focused Kotlin files. It rejects nonfinite, negative, and greater-than-Int.MAX_VALUE-millisecond seeks before acknowledging or mutating seek state. VideoView exposes an Int millisecond status clock on all supported API levels. Invalid seeks pause the previous transport before entering failed state; the exception path attempts to pause without masking the original request failure. The post-delta native-controls Kotlin compile subsequently passed in 19 seconds (45 tasks: one executed, 44 up-to-date). Root authorized reclaim of only the two task-created isolated iOS generated directories after archiving their SHA256 manifests; this raised free disk from 2.97 to 3.36 GiB. Installed iOS app, source repro, original lab, and global caches remain intact. No APK packaging or emulator was launched. Runtime validation remains open. API 26+ disables VideoView automatic audio-focus requests; equivalent pre-26 focus policy remains an open, unverified limitation.

Resume packaging and emulator validation only with enough disk headroom to remain above approximately 3 GiB. Compare actual MediaExtractor/MediaCodec timestamp semantics independently on Android; the iOS exact-frame results are separate evidence.

Post-delta command (same JDK/SDK environment):

```sh
./gradlew :nyc-tron-native-controls:compileDebugKotlin --no-daemon --max-workers=1 -PreactNativeArchitectures=arm64-v8a -Porg.gradle.parallel=false
```
