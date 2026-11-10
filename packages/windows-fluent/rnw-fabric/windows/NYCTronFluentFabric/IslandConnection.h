#pragma once

#include <winrt/Microsoft.UI.Content.h>
#include <utility>

namespace nyctron::islands {

// RNW 0.85 keeps its ChildSiteLink after OnUnmounted and exposes that link
// only while mounted. Retain the actual connection before destruction so
// native automation providers cannot postpone its system-resource cleanup.
class IslandConnection final {
 public:
  void SetIsland(winrt::Microsoft::UI::Content::ContentIsland const& island) noexcept {
    m_island = island;
  }
  void SetSite(winrt::Microsoft::UI::Content::ChildSiteLink const& site) noexcept {
    m_site = site;
  }
  void Close() noexcept {
    // Clear ownership before either close can dispatch a native callback.
    // Closing the island can implicitly close its link; still release both
    // independently, including when XAML disposal or either close fails.
    auto island = std::exchange(m_island, nullptr);
    auto site = std::exchange(m_site, nullptr);
    try { if (island && !island.IsClosed()) island.Close(); } catch (...) {}
    try { if (site && !site.IsClosed()) site.Close(); } catch (...) {}
  }

 private:
  winrt::Microsoft::UI::Content::ContentIsland m_island{nullptr};
  winrt::Microsoft::UI::Content::ChildSiteLink m_site{nullptr};
};

} // namespace nyctron::islands
