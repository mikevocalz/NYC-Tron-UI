#include "pch.h"
#include "DesktopGeometry.h"
#include <cmath>
#include <climits>
#include <stdexcept>

namespace nyctron::desktop {
namespace Json = winrt::Windows::Data::Json;
std::string DisplayId(HMONITOR monitor) {
  MONITORINFOEXW info{}; info.cbSize = sizeof(info);
  winrt::check_bool(GetMonitorInfoW(monitor, reinterpret_cast<MONITORINFO*>(&info)));
  return winrt::to_string(info.szDevice);
}
std::vector<Display> ReadDisplays() {
  struct Enumeration { std::vector<Display> displays; std::exception_ptr error; } result;
  SetLastError(ERROR_SUCCESS);
  const bool ok = EnumDisplayMonitors(nullptr, nullptr, [](HMONITOR monitor, HDC, LPRECT, LPARAM pointer) -> BOOL {
    auto& state = *reinterpret_cast<Enumeration*>(pointer);
    try {
      if (state.displays.size() == 64) throw std::runtime_error("Native display count exceeds 64");
      MONITORINFOEXW info{}; info.cbSize = sizeof(info);
      winrt::check_bool(GetMonitorInfoW(monitor, reinterpret_cast<MONITORINFO*>(&info)));
      state.displays.push_back({winrt::to_string(info.szDevice), info.rcMonitor, info.rcWork, (info.dwFlags & MONITORINFOF_PRIMARY) != 0});
      return TRUE;
    } catch (...) { state.error = std::current_exception(); return FALSE; }
  }, reinterpret_cast<LPARAM>(&result));
  if (result.error) std::rethrow_exception(result.error);
  winrt::check_bool(ok);
  if (result.displays.empty()) throw std::runtime_error("No connected desktop displays");
  return result.displays;
}
Json::JsonObject RectJson(RECT const& rect, double scale) {
  Json::JsonObject value;
  value.SetNamedValue(L"x", Json::JsonValue::CreateNumberValue(rect.left * scale));
  value.SetNamedValue(L"y", Json::JsonValue::CreateNumberValue(rect.top * scale));
  value.SetNamedValue(L"width", Json::JsonValue::CreateNumberValue((rect.right - rect.left) * scale));
  value.SetNamedValue(L"height", Json::JsonValue::CreateNumberValue((rect.bottom - rect.top) * scale));
  return value;
}
RECT ReadRect(Json::JsonObject const& object, double scale) {
  auto x = object.GetNamedNumber(L"x"), y = object.GetNamedNumber(L"y");
  auto width = object.GetNamedNumber(L"width"), height = object.GetNamedNumber(L"height");
  for (auto number : {x, y, width, height}) {
    if (!std::isfinite(number) || std::abs(number) > 10'000'000) throw std::invalid_argument("Invalid desktop coordinate");
  }
  const auto left = std::llround(x * scale), top = std::llround(y * scale);
  const auto w = std::llround(width * scale), h = std::llround(height * scale);
  if (w < 1 || h < 1 || std::abs(left) + w > LONG_MAX || std::abs(top) + h > LONG_MAX)
    throw std::invalid_argument("Native desktop bounds exceed their pixel budget");
  return {static_cast<LONG>(left), static_cast<LONG>(top), static_cast<LONG>(left + w), static_cast<LONG>(top + h)};
}
std::string ReadId(Json::JsonObject const& object, wchar_t const* key) {
  auto value = winrt::to_string(object.GetNamedString(key));
  if (value.empty() || value.size() > 256 || value.find_first_not_of(" \t\r\n") == std::string::npos)
    throw std::invalid_argument("Native window and display IDs must be nonempty and bounded");
  return value;
}
std::string NewToken() {
  GUID value{}; winrt::check_hresult(CoCreateGuid(&value));
  wchar_t buffer[40]{};
  if (!StringFromGUID2(value, buffer, 40)) throw std::runtime_error("Could not serialize native lifetime token");
  return winrt::to_string(buffer);
}
RECT WindowRect(HWND hwnd) {
  RECT rect{};
  if (IsIconic(hwnd)) {
    // WINDOWPLACEMENT normal coordinates use monitor workspace coordinates.
    WINDOWPLACEMENT placement{}; placement.length = sizeof(placement);
    winrt::check_bool(GetWindowPlacement(hwnd, &placement));
    rect = placement.rcNormalPosition;
    MONITORINFO info{}; info.cbSize = sizeof(info);
    winrt::check_bool(GetMonitorInfoW(MonitorFromWindow(hwnd, MONITOR_DEFAULTTONEAREST), &info));
    OffsetRect(&rect, info.rcWork.left - info.rcMonitor.left, info.rcWork.top - info.rcMonitor.top);
  } else winrt::check_bool(GetWindowRect(hwnd, &rect));
  return rect;
}
}
