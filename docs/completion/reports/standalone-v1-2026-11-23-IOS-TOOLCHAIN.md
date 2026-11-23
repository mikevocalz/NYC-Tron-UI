# Expo 58 iOS CI toolchain investigation

Recommendation: make a workflow-only change to the kitchen iOS job: use GitHub's `xcode-27` runner and explicitly select Xcode 27.1. Preserve Expo 58.0.24, React Native 0.88.1, all build/runtime acceptance steps and native configuration. This is a supported-toolchain correction to test, not a claim that the new CI run already passes.

## Observed failure and pinned dependency chain

[Job 137464493363 in run 45105064940](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/45105064940/job/137464493363) completed its Xcode 26.2/Swift-version assertion and consumer preparation successfully, then failed the installed-archive iOS simulator compilation. Native runtime steps were skipped. The lead's captured diagnostic is `JavaScriptObject.swift:946: sending 'slot' risks causing data races`, involving capture in a JavaScriptActor-isolated closure; warning-group diagnostics also name ImplicitStrongCapture and NoUsage. This investigation verified job step conclusions through GitHub's job API; retrieval of the complete job log was unavailable, so the exact compiler diagnostic is attributed to the lead's captured output.

Read-only inspection of the actual prepared consumer established: expo 58.0.24 → expo-modules-core ~58.1.0 (resolved 58.1.0) → expo-modules-jsi ~58.0.23 (resolved 58.0.23), with react-native 0.88.1. The installed JSI `apple/Package.swift` declares swift-tools-version 6.2. Its Swift settings include C++ interoperability and upcoming isolation features. Its source explains the warning-group flags in terms of Xcode 27 behavior. The failing source uses a nonisolated(unsafe) temporary slot captured by JavaScriptActor.assumeIsolated. Minimum manifest syntax compatibility alone therefore does not establish compiler compatibility for the entire source.

Primary package/source references: [published JSI 58.0.23 metadata](https://registry.npmjs.org/expo-modules-jsi/58.0.23), [Expo JSI package manifest](https://github.com/expo/expo/blob/main/packages/expo-modules-jsi/apple/Package.swift), [JavaScriptObject source](https://github.com/expo/expo/blob/main/packages/expo-modules-jsi/apple/Sources/ExpoModulesJSI/Runtime/Values/JavaScriptObject.swift). Moving `main` source is corroboration, not a substitute for the inspected installed 58.0.23 bytes.

## Official supported build environment

[Expo's build infrastructure reference](https://docs.expo.dev/build-reference/infrastructure/#ios-server-images) assigns its iOS `sdk-58` alias to `macos-tahoe-26.6-xcode-27.1`, listing Xcode 27.1 RC build 27A9275. Xcode 26.2 is associated with SDK 55. This directly supports moving the SDK 58 build to Xcode 27.1 rather than inferring a Swift 6.3 minimum from one diagnostic.

[GitHub's October 15 GA announcement](https://github.blog/changelog/2026-10-15-xcode-27-runner-image-generally-available/) confirms the `xcode-27` label is generally available and Apple Silicon only. The older preview issue/banner is superseded by that announcement.

[Current official xcode-27 software inventory](https://github.com/actions/runner-images/blob/main/images/macos/xcode-27-arm64-Readme.md) identifies image 20261104.0337.1, Xcode 27.1 default build 27A9275, its version-specific app path and an iOS 27.1 simulator SDK. It also contains 27.0 and 27.2; explicitly selecting 27.1 avoids changing to 27.2 merely because it is newer. The runner image can roll forward, so fail-fast selection/version assertions should remain.

## Concrete workflow-only patch

In `.github/workflows/kitchen-sink.yml`, change only the iOS job toolchain selection:

```yaml
runs-on: xcode-27
env:
  DEVELOPER_DIR: /Applications/Xcode_27.1.app/Contents/Developer
```

Replace the existing Xcode 26.2 assertion with:

```bash
xcodebuild -version
xcrun swift --version
xcodebuild -version | grep -Fx 'Xcode 27.1'
xcodebuild -version | grep -Fx 'Build version 27A9275'
```

The `/Applications` location above is the documented hosted-runner toolchain path, not a local computer path. Keep the source-declared Swift minimum assertion if desired, but do not invent an exact Swift minor without observing this runner's output. The exact Xcode/build assertion is the official environment binding.

No upstream patch release specifically fixing this diagnostic was established. No dependency upgrade/downgrade, concurrency diagnostic suppression, unsafe native source patch or gate weakening is recommended. Rerun the unchanged archive build and both import-path simulator scenarios; their actual outcomes determine acceptance. The new arm64 runner also changes host architecture, so failures in simulator setup must be assessed separately rather than counted as native proof. No local build, simulator interaction or physical-device action was performed by this investigation.
