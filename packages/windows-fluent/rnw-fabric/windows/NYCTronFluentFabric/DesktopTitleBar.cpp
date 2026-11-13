#include "pch.h"
#include "DesktopTitleBar.h"
#include <winrt/Windows.Foundation.h>
#include <winrt/Windows.Graphics.h>
#include <winrt/Windows.UI.h>
#include <array>
#include <stdexcept>

namespace nyctron::desktop {
namespace Windowing = winrt::Microsoft::UI::Windowing;
namespace Json = winrt::Windows::Data::Json;
using winrt::Windows::Foundation::IReference;
using winrt::Windows::UI::Color;

TitleBarStyle ParseTitleBarStyle(std::string const& value) {
  if (value == "standard") return TitleBarStyle::Standard;
  if (value == "extended") return TitleBarStyle::Extended;
  throw std::invalid_argument("Title bar style must be standard or extended");
}

void UpdateTitleBarDragRegion(Windowing::AppWindow const& app, HWND hwnd) {
  auto const bar = app.TitleBar();
  RECT client{};
  winrt::check_bool(GetClientRect(hwnd, &client));
  // AppWindowTitleBar reports insets, height and drag rectangles in physical
  // client pixels, so no DPI conversion happens here.
  const int32_t left = bar.LeftInset(), right = bar.RightInset(), height = bar.Height();
  const int32_t width = (client.right - client.left) - left - right;
  // A window too narrow for a strip keeps the system default drag region.
  if (width <= 0 || height <= 0) return;
  std::array<winrt::Windows::Graphics::RectInt32, 1> strip{winrt::Windows::Graphics::RectInt32{left, 0, width, height}};
  bar.SetDragRectangles(strip);
}

void ApplyTitleBarStyle(Windowing::AppWindow const& app, HWND hwnd, TitleBarStyle style) {
  const bool supported = Windowing::AppWindowTitleBar::IsCustomizationSupported();
  if (style == TitleBarStyle::Standard) {
    // Without customization support the system title bar is already standard.
    if (!supported) return;
    auto const bar = app.TitleBar();
    bar.ResetToDefault();
    bar.ExtendsContentIntoTitleBar(false);
    return;
  }
  if (!supported) throw std::runtime_error("This Windows version cannot extend content into the title bar");
  auto const bar = app.TitleBar();
  bar.ExtendsContentIntoTitleBar(true);
  // The system keeps drawing the caption buttons; only their resting
  // backgrounds become transparent so app content shows beneath them.
  const IReference<Color> transparent{Color{0, 0, 0, 0}};
  bar.ButtonBackgroundColor(transparent);
  bar.ButtonInactiveBackgroundColor(transparent);
  UpdateTitleBarDragRegion(app, hwnd);
}

TitleBarMetrics ReadTitleBarMetrics(Windowing::AppWindow const& app) {
  auto const bar = app.TitleBar();
  return TitleBarMetrics{bar.LeftInset(), bar.RightInset(), bar.Height()};
}

Json::JsonObject TitleBarJson(TitleBarStyle style, TitleBarMetrics const& metrics, HWND hwnd, double scale) {
  Json::JsonObject value;
  double leading = 0, trailing = 0, height = 0;
  if (style == TitleBarStyle::Extended) {
    const double left = metrics.left * scale, right = metrics.right * scale;
    // Leading and trailing follow layout direction, as in TitleBarInsets.
    const bool rtl = (GetWindowLongPtrW(hwnd, GWL_EXSTYLE) & WS_EX_LAYOUTRTL) != 0;
    leading = rtl ? right : left;
    trailing = rtl ? left : right;
    height = metrics.height * scale;
  }
  value.SetNamedValue(L"style", Json::JsonValue::CreateStringValue(style == TitleBarStyle::Extended ? L"extended" : L"standard"));
  value.SetNamedValue(L"leading", Json::JsonValue::CreateNumberValue(leading));
  value.SetNamedValue(L"trailing", Json::JsonValue::CreateNumberValue(trailing));
  value.SetNamedValue(L"height", Json::JsonValue::CreateNumberValue(height));
  return value;
}
}
