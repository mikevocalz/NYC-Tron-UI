#pragma once
#include <winrt/Microsoft.UI.Windowing.h>
#include <winrt/Windows.Data.Json.h>
#include <windows.h>
#include <cstdint>
#include <string>

namespace nyctron::desktop {
// Title-bar presentation of one AppWindow. Owner: the React UI dispatcher
// thread that owns DesktopSession. These functions hold no state and no lock;
// they read and write the AppWindow passed in, synchronously, on that thread.
enum class TitleBarStyle { Standard, Extended };

// Throws std::invalid_argument for anything but "standard" or "extended".
TitleBarStyle ParseTitleBarStyle(std::string const& value);

// Standard restores the system title bar. Extended puts app content under the
// title bar with transparent caption-button backgrounds and a drag strip
// between the system insets. Throws std::runtime_error, before changing the
// window, when Extended is requested and AppWindowTitleBar customization is
// unsupported on this Windows version.
void ApplyTitleBarStyle(winrt::Microsoft::UI::Windowing::AppWindow const& app, HWND hwnd, TitleBarStyle style);

// Recomputes the drag strip from the current client width and system insets.
// Call after WM_SIZE and WM_DPICHANGED. Only valid for an Extended window.
void UpdateTitleBarDragRegion(winrt::Microsoft::UI::Windowing::AppWindow const& app, HWND hwnd);

// AppWindowTitleBar insets and height in physical client pixels.
struct TitleBarMetrics { int32_t left{0}, right{0}, height{0}; };

// Reads the current metrics. Only meaningful for an Extended window that is
// not minimized: an iconic window has no client area, and the caption-button
// insets AppWindowTitleBar reports for it are not the ones its content uses.
TitleBarMetrics ReadTitleBarMetrics(winrt::Microsoft::UI::Windowing::AppWindow const& app);

// {style, leading, trailing, height}, the metrics times `scale`.
// Standard reports zeros: the system frame sits outside the client area.
winrt::Windows::Data::Json::JsonObject TitleBarJson(TitleBarStyle style, TitleBarMetrics const& metrics, HWND hwnd, double scale);
}
