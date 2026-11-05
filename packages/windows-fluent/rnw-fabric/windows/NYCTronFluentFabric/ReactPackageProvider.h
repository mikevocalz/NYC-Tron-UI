// Based on Microsoft RNW v0.85 sample CustomComponent (MIT).
#pragma once
#include "ReactPackageProvider.g.h"
using namespace winrt::Microsoft::ReactNative;
namespace winrt::NYCTronFluentFabric::implementation {
struct ReactPackageProvider : ReactPackageProviderT<ReactPackageProvider> {
  ReactPackageProvider() = default;
  void CreatePackage(IReactPackageBuilder const& packageBuilder) noexcept;
};
}
namespace winrt::NYCTronFluentFabric::factory_implementation {
struct ReactPackageProvider : ReactPackageProviderT<ReactPackageProvider, implementation::ReactPackageProvider> {};
}
