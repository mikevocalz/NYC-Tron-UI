#pragma once
#include <winrt/Windows.Data.Json.h>
#include <windows.h>
#include <string>
#include <vector>

namespace nyctron::desktop {
struct Display { std::string id; RECT bounds; RECT work; bool primary; };
std::vector<Display> ReadDisplays();
std::string DisplayId(HMONITOR monitor);
winrt::Windows::Data::Json::JsonObject RectJson(RECT const& rect, double scale = 1.0);
RECT ReadRect(winrt::Windows::Data::Json::JsonObject const& object, double scale);
std::string ReadId(winrt::Windows::Data::Json::JsonObject const& object, wchar_t const* key);
std::string NewToken();
RECT WindowRect(HWND hwnd);
}
