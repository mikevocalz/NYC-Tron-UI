// Based on Microsoft RNW v0.85 sample CustomComponent (MIT).
#include "pch.h"
#include "ReactPackageProvider.h"
#if __has_include("ReactPackageProvider.g.cpp")
#include "ReactPackageProvider.g.cpp"
#endif
#include "TronNavigationView.h"
using namespace winrt::Microsoft::ReactNative;
namespace winrt::NYCTronFluentFabric::implementation {
void ReactPackageProvider::CreatePackage(IReactPackageBuilder const& builder) noexcept {
#ifdef RNW_NEW_ARCH
  RegisterTronNavigationViewComponent(builder);
#endif
}
}
