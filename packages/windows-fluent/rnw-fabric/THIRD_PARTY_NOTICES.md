# Third-party notices

`@nyc-tron/windows-fluent-fabric` is MIT-licensed (see `LICENSE`).

## React Native Windows sample

`windows/NYCTronFluentFabric/TronNavigationView.cpp` and `.h` follow the XAML
Fabric ContentIsland pattern of the React Native Windows 0.85 sample
`packages/sample-custom-component/windows/SampleCustomComponent/ComboBox.cpp`,
and the project skeleton follows the same sample's native codegen and C++
layout. Copyright (c) Microsoft Corporation and contributors, MIT. The license
text is in `licenses/REACT-NATIVE-WINDOWS-MIT.txt`.

The desktop host uses the public RNW 0.85 `ReactNativeWindow`,
`ReactNativeHost::FromContext` and `ReactCoreInjection::MakeViewHost` APIs
also used by Microsoft's `Microsoft.ReactNative/Modules/LogBoxModule.cpp`.
Its connection ownership, close leases and lifecycle registry integration
are NYC-Tron code; it does not embed another React runtime.
