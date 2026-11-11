# Actual Expo decoder bridge host

This task-owned source host compiled and ran the actual NYC-Tron platform-services package through Expo 58 / RN 0.88.1 SwiftPM, including real Record macros, JS-native module registration, JPEG writes and cache deletion. It excludes the experimental Nitro player and does not change Forge's default dependency graph. The selected iOS simulator was BBCC4078-E64D-4642-893B-ACF80ACB29A1.

Create a NEW isolated host using `python3 tooling/native/presentation-bridge-ios/bootstrap.py`. The script verifies the recorded production source hashes, borrows installed dependency symlinks and copies the existing lab's generated iOS project; it performs no installation/build and refuses an existing destination. It preserves orientation/default window configuration and assigns ai.nyctron.p03bridge. The existing lab and node_modules must already exist at the documented recovered-work sibling path, or pass --lab/--host explicitly.

From the PRINTED HOST directory, run:

```sh
./node_modules/.bin/react-native spm update --yes
xcodebuild -project ios/NitroForgeCadenceNative.xcodeproj -scheme NitroForgeCadenceNative -configuration Debug -sdk iphonesimulator -destination id=BBCC4078-E64D-4642-893B-ACF80ACB29A1 -derivedDataPath derived -jobs 2 build CODE_SIGNING_ALLOWED=NO
codesign --force --sign - derived/Build/Products/Debug-iphonesimulator/NitroForgeCadenceNative.app
./node_modules/.bin/expo start --port 8081 --offline
```

Check free space before the build. The observed RN/Hermes debug+release download was approximately 250 MiB compressed; actual caches/builds consume more. Never override pins or delete user data to obtain space. Use Argent reinstall-app for the printed host's .app and ai.nyctron.p03bridge, then replay qa-p03-decoder-bridge on the simulator. Preserve existing Metro processes; choose a coordinated port/build configuration if 8081 is occupied.

The source resolver pins React, React Native, Expo, ExpoModulesCore, FileSystem and Zustand to the host. Without this, importing the local source can load a second same-version RN installation and fail on the immutable DevTools dispatcher global. This is singleton resolution, not a runtime shim.

The recorded path passed twice unchanged (9.3s and 4.8s). Each launch checked actual capabilities, all 36 timestamps/JPEG files across CFR/VFR/Bframes, actual cache deletion and native rejection codes. It retains raw AX waits from the live recording; no idle-based broad QA claim is made. Native-devtools registration recovered after one device-scoped simulator-service recycle; no user Metro/device stop occurred. See QA-CONTRACT.md, provenance.json and docs/completion/evidence/P03-ios-bridge-* for scope/evidence. Android, the player and broad P19 acceptance are separate gates.
