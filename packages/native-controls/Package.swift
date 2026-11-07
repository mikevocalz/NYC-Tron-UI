// swift-tools-version: 6.2
import PackageDescription

// Expo injects the host's build-local Expo/React compile dependencies.
// Keep the target, iOS floor and explicit system linkage aligned with CocoaPods.
let package = Package(
  name: "nyc-tron-native-controls",
  platforms: [.iOS("16.4")],
  products: [.library(name: "NYCTronInstruments", targets: ["NYCTronInstruments"])],
  dependencies: [],
  targets: [
    .target(
      name: "NYCTronInstruments",
      dependencies: [],
      path: "ios",
      exclude: ["NYCTronInstruments.podspec"],
      linkerSettings: [
        .linkedFramework("AVFoundation"),
        .linkedFramework("UIKit"),
      ]
    )
  ]
)
