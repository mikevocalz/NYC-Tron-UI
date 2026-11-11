#pragma once

#include "IslandLayout.h"
#include <winrt/Microsoft.ReactNative.Composition.h>
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
  void UpdateLayout(
      winrt::Microsoft::ReactNative::Composition::ContentIslandComponentView const& view,
      winrt::Microsoft::ReactNative::LayoutMetricsChangedArgs const& args) {
    // This event runs after ComponentView commits its own new metrics. RNW's
    // preceding ParentLayoutChanged still used the previous own frame. Apply
    // this correction only here: Mounted and ancestor/scroll events already
    // compute their transform from the current own frame.
    if (!m_site || !m_island || m_site.IsClosed() || m_island.IsClosed() ||
        !m_island.IsConnected()) return;
    const auto mountedSite = view.ChildSiteLink();
    if (!mountedSite || mountedSite != m_site) return;
    const auto previous = args.OldLayoutMetrics();
    const auto current = args.NewLayoutMetrics();
    if (previous.Frame.X == current.Frame.X && previous.Frame.Y == current.Frame.Y &&
        previous.PointScaleFactor == current.PointScaleFactor) return;
    auto transform = m_site.LocalToParentTransformMatrix();
    const auto translation = UpdateLayoutTranslation(
        {transform.m41, transform.m42},
        {previous.Frame.X, previous.Frame.Y, previous.PointScaleFactor},
        {current.Frame.X, current.Frame.Y, current.PointScaleFactor});
    transform.m41 = translation.x;
    transform.m42 = translation.y;
    m_site.LocalToParentTransformMatrix(transform);
  }
  winrt::Microsoft::UI::Content::ChildSiteLink Site() const noexcept { return m_site; }
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
