# Third-party notices

NYC-Tron owns the adapter, window controller, display geometry module and
reference application under the repository's MIT license.

The package imports these separately installed dependencies. Their source is
not copied into this archive:

| Dependency | Version | License and upstream |
| --- | --- | --- |
| Legend Spark | 0.0.2 | MIT; https://github.com/LegendApp/legend-spark |
| React | 19.2.0 | MIT; https://github.com/facebook/react |
| React Native | 0.83.10 | MIT; https://github.com/facebook/react-native |
| React Native macOS | 0.83.0 | MIT; https://github.com/microsoft/react-native-macos |
| Expo | 55.0.32 | MIT; https://github.com/expo/expo |
| NYC-Tron core | 1.0.0 | MIT; https://github.com/mikevocalz/NYC-Tron-UI |

Spark retains its own packaged native sources and license notices. Its pinned
runtime uses react-native-nitro-modules 0.37.0; that runtime is not vendored into
this adapter or upgraded to the mobile workspace's Nitro v1. Apple AppKit and
CoreGraphics come from the host macOS SDK under Apple's SDK terms.

The optional native acceptance extension is original test code in the example
application. It uses SparkTestDriver's documented registration protocol and is
excluded from the distributed library package.
