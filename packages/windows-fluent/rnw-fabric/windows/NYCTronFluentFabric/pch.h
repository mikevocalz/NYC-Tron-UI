// Based on Microsoft's RNW v0.85 sample-custom-component/pch.h (MIT).
#pragma once
#include "targetver.h"
#define NOMINMAX 1
#define WIN32_LEAN_AND_MEAN 1
#define WINRT_LEAN_AND_MEAN 1
#include <windows.h>
#undef GetCurrentTime
#include <unknwn.h>
#include <CppWinRTIncludes.h>
#include <winrt/Microsoft.ReactNative.h>
#include <winrt/base.h>
#include <memory>
#include <optional>
#include <string>
#include <vector>
