// swift-tools-version: 6.2
import PackageDescription

// Expo injects its build-local dependencies and Modules 2 macro plugin.
// Preserve every explicit framework from the CocoaPods specification.
let package = Package(
  name: "nyc-tron-platform-services",
  platforms: [.iOS("16.4")],
  products: [.library(name: "NYCTronPlatformServices", targets: ["NYCTronPlatformServices"])],
  dependencies: [],
  targets: [
    .target(
      name: "NYCTronPlatformServices",
      dependencies: [],
      path: "ios",
      exclude: ["NYCTronPlatformServices.podspec"],
      linkerSettings: [
        .linkedFramework("AVFoundation"),
        .linkedFramework("AudioToolbox"),
        .linkedFramework("CoreMedia"),
        .linkedFramework("UniformTypeIdentifiers"),
        .linkedFramework("VideoToolbox"),
      ]
    )
  ]
)
