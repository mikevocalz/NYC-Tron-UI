// Copyright (c) NYC-Tron UI contributors.
// XAML Fabric island pattern adapted from Microsoft's RNW v0.85
// packages/sample-custom-component/ComboBox.cpp (MIT).
#include "pch.h"
#include "TronNavigationView.h"

#ifdef RNW_NEW_ARCH
#include "IslandConnection.h"
#include "codegen/react/components/NYCTronFluentFabric/TronNavigationView.g.h"

#include <winrt/Microsoft.ReactNative.Composition.h>
#include <winrt/Microsoft.UI.Dispatching.h>
#include <winrt/Microsoft.UI.Xaml.Automation.h>
#include <winrt/Microsoft.UI.Xaml.Controls.h>
#include <winrt/Microsoft.UI.Xaml.Media.h>
#include <winrt/Windows.Data.Json.h>
#include <exception>
#include <unordered_set>
#include <vector>

namespace winrt::NYCTronFluentFabric {

struct TronNavigationViewComponentView
    : winrt::implements<TronNavigationViewComponentView, winrt::IInspectable>,
      Codegen::BaseTronNavigationView<TronNavigationViewComponentView> {

  ~TronNavigationViewComponentView() { Destroy(); }

  void Destroy() noexcept {
    if (std::exchange(m_disposed, true)) return;
    try { if (m_xamlIsland) m_xamlIsland.Close(); } catch (...) {}
    m_connection.Close();
  }

  void Mounted(winrt::Microsoft::ReactNative::ComponentView const& view) noexcept {
    if (m_disposed) return;
    try { m_connection.SetSite(view.as<winrt::Microsoft::ReactNative::Composition::ContentIslandComponentView>().ChildSiteLink()); }
    catch (...) { ReportNativeError("Could not retain the navigation connection: " + DescribeCurrentException()); }
  }
  void LayoutChanged(winrt::IInspectable const& sender, winrt::Microsoft::ReactNative::LayoutMetricsChangedArgs const& args) noexcept {
    if (m_disposed) return;
    try { m_connection.UpdateLayout(sender.as<winrt::Microsoft::ReactNative::Composition::ContentIslandComponentView>(), args); }
    catch (...) { ReportNativeError("Could not update navigation input geometry: " + DescribeCurrentException()); }
  }

  void InitializeContentIsland(
      const winrt::Microsoft::ReactNative::Composition::ContentIslandComponentView& islandView) noexcept {
    try {
      m_xamlIsland = winrt::Microsoft::UI::Xaml::XamlIsland{};
      m_navigation = winrt::Microsoft::UI::Xaml::Controls::NavigationView{};
      m_navigation.IsBackButtonVisible(
          winrt::Microsoft::UI::Xaml::Controls::NavigationViewBackButtonVisible::Collapsed);
      m_navigation.IsPaneToggleButtonVisible(true);
      m_navigation.IsSettingsVisible(false);
      m_navigation.IsPaneOpen(false);
      m_navigation.HorizontalAlignment(winrt::Microsoft::UI::Xaml::HorizontalAlignment::Stretch);
      m_navigation.VerticalAlignment(winrt::Microsoft::UI::Xaml::VerticalAlignment::Stretch);
      m_xamlIsland.Content(m_navigation);
      m_connection.SetIsland(m_xamlIsland.ContentIsland());
      islandView.Connect(m_xamlIsland.ContentIsland());

      m_itemInvoked = m_navigation.ItemInvoked(
          [weak = get_weak()](
              winrt::Microsoft::UI::Xaml::Controls::NavigationView const&,
              winrt::Microsoft::UI::Xaml::Controls::NavigationViewItemInvokedEventArgs const& args) {
            if (auto self = weak.get()) self->OnItemInvoked(args);
          });
      m_paneOpened = m_navigation.PaneOpened(
          [weak = get_weak()](auto const&, auto const&) {
            if (auto self = weak.get()) self->OnPaneChanged(true);
          });
      m_paneClosed = m_navigation.PaneClosed(
          [weak = get_weak()](auto const&, auto const&) {
            if (auto self = weak.get()) self->OnPaneChanged(false);
          });
      m_selectionChanged = m_navigation.SelectionChanged(
          [weak = get_weak()](auto const&, auto const&) {
            if (auto self = weak.get()) self->OnSelectionChanged();
          });
      if (m_props) ApplyProps(*m_props);
    } catch (...) {
      // Fail closed: no substitute UI. The error reaches JS through
      // onNativeError once the event emitter is attached.
      ReportNativeError("NavigationView initialization failed: " + DescribeCurrentException());
    }
  }

  void UpdateEventEmitter(
      const std::shared_ptr<Codegen::TronNavigationViewEventEmitter>& eventEmitter) noexcept override {
    Codegen::BaseTronNavigationView<TronNavigationViewComponentView>::UpdateEventEmitter(eventEmitter);
    // Errors raised before React attached the emitter (initialization runs
    // first) are delivered here instead of being dropped.
    auto pending = std::move(m_pendingErrors);
    m_pendingErrors.clear();
    for (auto& message : pending) ReportNativeError(std::move(message));
  }

  void UpdateProps(
      const winrt::Microsoft::ReactNative::ComponentView& sender,
      const winrt::com_ptr<Codegen::TronNavigationViewProps>& newProps,
      const winrt::com_ptr<Codegen::TronNavigationViewProps>& oldProps) noexcept override {
    if (m_disposed) return;
    m_props = newProps;
    if (m_navigation && newProps) ApplyProps(*newProps);
    Codegen::BaseTronNavigationView<TronNavigationViewComponentView>::UpdateProps(
        sender, newProps, oldProps);
  }

  void HandleFocusSelectedCommand() noexcept override {
    if (m_disposed) return;
    try {
      if (m_navigation && m_navigation.IsLoaded()) FocusItem(m_navigation.SelectedItem());
    } catch (...) { ReportNativeError("Could not restore navigation focus: " + DescribeCurrentException()); }
  }

  void HandleFocusSettingsCommand() noexcept override {
    if (m_disposed) return;
    try {
      if (m_navigation && m_navigation.IsLoaded() && m_navigation.IsSettingsVisible()) FocusItem(m_navigation.SettingsItem());
    } catch (...) { ReportNativeError("Could not restore Settings focus: " + DescribeCurrentException()); }
  }

 private:
  static void FocusItem(winrt::IInspectable const& value) {
    auto item = value.try_as<winrt::Microsoft::UI::Xaml::Controls::Control>();
    if (item && item.IsEnabled()) item.Focus(winrt::Microsoft::UI::Xaml::FocusState::Programmatic);
  }
  static winrt::Microsoft::UI::Xaml::Controls::NavigationViewItem MakeItem(
      winrt::Windows::Data::Json::JsonObject const& data) {
    const auto id = data.GetNamedString(L"id", L"");
    const auto label = data.GetNamedString(L"label", L"");
    auto item = winrt::Microsoft::UI::Xaml::Controls::NavigationViewItem{};
    item.Tag(winrt::box_value(id));
    item.Content(winrt::box_value(label));
    winrt::Microsoft::UI::Xaml::Automation::AutomationProperties::SetName(item, label);
    item.IsEnabled(!data.GetNamedBoolean(L"disabled", false));
    const auto glyph = data.GetNamedString(L"glyph", L"");
    if (!glyph.empty()) {
      auto icon = winrt::Microsoft::UI::Xaml::Controls::FontIcon{};
      icon.Glyph(glyph);
      icon.FontFamily(winrt::Microsoft::UI::Xaml::Media::FontFamily{L"Segoe Fluent Icons"});
      item.Icon(icon);
    }
    return item;
  }

  // Returns how many entries were skipped as non-objects, missing id/label
  // or duplicate ids, so the caller can report them instead of hiding them.
  static uint32_t AppendItems(
      winrt::Windows::Data::Json::JsonArray const& data,
      winrt::Windows::Foundation::Collections::IVector<winrt::IInspectable> const& target,
      std::unordered_set<std::wstring>& seen) {
    uint32_t skipped = 0;
    for (auto const& value : data) {
      if (value.ValueType() != winrt::Windows::Data::Json::JsonValueType::Object) {
        ++skipped;
        continue;
      }
      auto object = value.GetObject();
      auto id = object.GetNamedString(L"id", L"");
      auto label = object.GetNamedString(L"label", L"");
      if (id.empty() || label.empty() || !seen.insert(std::wstring(id.c_str())).second) {
        ++skipped;
        continue;
      }
      target.Append(MakeItem(object));
    }
    return skipped;
  }

  // Must be called from inside a catch block.
  static std::string DescribeCurrentException() noexcept {
    try {
      throw;
    } catch (winrt::hresult_error const& error) {
      return winrt::to_string(error.message());
    } catch (std::exception const& error) {
      return error.what();
    } catch (...) {
      return "unknown native exception";
    }
  }

  void ReportNativeError(std::string message) noexcept {
    if (m_disposed) return;
    if (auto emitter = EventEmitter()) {
      Codegen::TronNavigationViewEventEmitter::OnNativeError payload;
      payload.message = std::move(message);
      emitter->onNativeError(std::move(payload));
    } else {
      m_pendingErrors.push_back(std::move(message));
    }
  }

  winrt::Microsoft::UI::Xaml::Controls::NavigationViewItem FindItem(winrt::hstring const& id) const {
    if (id.empty()) return nullptr;
    for (auto const& items : {m_navigation.MenuItems(), m_navigation.FooterMenuItems()}) {
      for (auto const& entry : items) {
        if (auto item = entry.try_as<winrt::Microsoft::UI::Xaml::Controls::NavigationViewItem>()) {
          if (winrt::unbox_value<winrt::hstring>(item.Tag()) == id) return item;
        }
      }
    }
    return nullptr;
  }

  void SetSelectedId(winrt::hstring const& id) {
    m_navigation.SelectedItem(FindItem(id));
  }

  // Route approval belongs to JS. NavigationView moves its selection as soon
  // as an item is invoked, so a user selection is put back on the committed
  // route; the indicator moves only when JS commits a new selectedId. Items
  // keep the default SelectsOnInvoked: NavigationView undoes a programmatic
  // SelectedItem that points at an item which does not select on invoke.
  // The restore is queued so NavigationView's selection change is not
  // re-entered from its own SelectionChanged event.
  void OnSelectionChanged() {
    if (m_disposed || m_updatingFromJs || m_restorePending) return;
    if (m_navigation.SelectedItem() == FindItem(winrt::to_hstring(m_selectedId))) return;
    // TryEnqueue fails only while the queue shuts down; then nothing is
    // pending and later selection changes must still be handled.
    m_restorePending = m_navigation.DispatcherQueue().TryEnqueue([weak = get_weak()]() noexcept {
      if (auto self = weak.get()) {
        self->m_restorePending = false;
        self->RunFromJs([&] { self->SetSelectedId(winrt::to_hstring(self->m_selectedId)); },
            "Restoring the committed selection failed: ");
      }
    });
  }

  // Runs a native write with events from it suppressed. A WinRT error (for
  // example during island teardown) is reported instead of escaping a
  // dispatcher callback, and never leaves m_updatingFromJs set, which would
  // silence every later selection and pane event.
  template <typename Write>
  void RunFromJs(Write&& write, char const* failure) noexcept {
    if (m_disposed) return;
    m_updatingFromJs = true;
    try {
      write();
    } catch (...) {
      ReportNativeError(failure + DescribeCurrentException());
    }
    m_updatingFromJs = false;
  }

  void ApplyProps(Codegen::TronNavigationViewProps const& props) noexcept {
    try {
      m_updatingFromJs = true;
      const auto footerJson = props.footerItemsJson.value_or("[]");
      // Preserve native item identity and keyboard focus for route, pane,
      // title and layout updates. Rebuild only when destinations change.
      if (!m_itemsInitialized || props.itemsJson != m_itemsJson || footerJson != m_footerItemsJson) {
        auto menu = winrt::Windows::Data::Json::JsonArray::Parse(
            winrt::to_hstring(props.itemsJson));
        auto footer = winrt::Windows::Data::Json::JsonArray::Parse(
            winrt::to_hstring(footerJson));
        m_navigation.MenuItems().Clear();
        m_navigation.FooterMenuItems().Clear();
        std::unordered_set<std::wstring> seen;
        const auto skipped = AppendItems(menu, m_navigation.MenuItems(), seen) +
            AppendItems(footer, m_navigation.FooterMenuItems(), seen);
        if (skipped > 0) {
          ReportNativeError(std::to_string(skipped) +
              " destination(s) skipped: each needs a unique nonempty id and a nonempty label");
        }
        m_itemsJson = props.itemsJson;
        m_footerItemsJson = footerJson;
        m_itemsInitialized = true;
      }
      const auto mode = props.paneMode.value_or("auto");
      using Mode = winrt::Microsoft::UI::Xaml::Controls::NavigationViewPaneDisplayMode;
      m_navigation.PaneDisplayMode(
          mode == "expanded" ? Mode::Left :
          mode == "compact" ? Mode::LeftCompact :
          mode == "minimal" ? Mode::LeftMinimal : Mode::Auto);
      const auto title = winrt::to_hstring(props.paneTitle.value_or(""));
      m_navigation.PaneTitle(title);
      // Narrator names the navigation landmark after the pane title.
      winrt::Microsoft::UI::Xaml::Automation::AutomationProperties::SetName(m_navigation, title);
      m_navigation.IsSettingsVisible(props.settingsVisible.value_or(false));
      m_selectedId = props.selectedId.value_or("");
      SetSelectedId(winrt::to_hstring(m_selectedId));
      m_navigation.FlowDirection(props.isRTL.value_or(false)
          ? winrt::Microsoft::UI::Xaml::FlowDirection::RightToLeft
          : winrt::Microsoft::UI::Xaml::FlowDirection::LeftToRight);
      m_paneOpen = props.paneOpen.value_or(false);
      m_navigation.IsPaneOpen(m_paneOpen);
      m_updatingFromJs = false;
    } catch (...) {
      m_updatingFromJs = false;
      // Invalid serialized items must not crash native; report them instead.
      ReportNativeError("NavigationView props update failed: " + DescribeCurrentException());
    }
  }

  void OnItemInvoked(
      winrt::Microsoft::UI::Xaml::Controls::NavigationViewItemInvokedEventArgs const& args) {
    if (m_disposed || m_updatingFromJs) return;
    if (args.IsSettingsInvoked()) {
      if (auto emitter = EventEmitter()) {
        Codegen::TronNavigationViewEventEmitter::OnSettingsInvoked payload;
        payload.id = "settings";
        emitter->onSettingsInvoked(std::move(payload));
      }
      return;
    }
    auto item = args.InvokedItemContainer()
        .try_as<winrt::Microsoft::UI::Xaml::Controls::NavigationViewItem>();
    if (!item || !item.IsEnabled() || !item.Tag()) return;
    const auto id = winrt::to_string(winrt::unbox_value<winrt::hstring>(item.Tag()));
    if (id == m_selectedId) return;
    if (auto emitter = EventEmitter()) {
      Codegen::TronNavigationViewEventEmitter::OnDestinationInvoked payload;
      payload.id = id;
      emitter->onDestinationInvoked(std::move(payload));
    }
  }

  // Pane approval belongs to JS, like route approval. A user change is sent
  // as a request and the pane is put back on the committed paneOpen; it
  // moves only when JS commits a new value. Without this a rejected toggle
  // stayed on screen, since nothing re-renders the component, and the island
  // stayed sized for the committed state.
  // - PaneOpened/PaneClosed can arrive after the write that caused them, so
  //   they are compared with the committed value and the control's current
  //   state rather than trusting m_updatingFromJs alone.
  // - A close is put back only in the Expanded display mode. In Compact and
  //   Minimal the open pane is an overlay that NavigationView closes itself
  //   (light dismiss, item invoke, a narrower island in auto); reopening it
  //   over the content with no user action would be worse than waiting for
  //   the next paneOpen.
  // - The restore is queued like the selection one, so it does not re-enter
  //   NavigationView's own pane change. A toggle while it is queued is
  //   dropped; the restore still runs.
  void OnPaneChanged(bool open) {
    if (m_disposed || m_updatingFromJs || m_paneRestorePending) return;
    if (open == m_paneOpen || m_navigation.IsPaneOpen() != open) return;
    using DisplayMode = winrt::Microsoft::UI::Xaml::Controls::NavigationViewDisplayMode;
    if (open || m_navigation.DisplayMode() == DisplayMode::Expanded) {
      m_paneRestorePending = m_navigation.DispatcherQueue().TryEnqueue([weak = get_weak()]() noexcept {
        if (auto self = weak.get()) {
          self->m_paneRestorePending = false;
          self->RunFromJs([&] {
            if (self->m_navigation.IsPaneOpen() != self->m_paneOpen) {
              self->m_navigation.IsPaneOpen(self->m_paneOpen);
            }
          }, "Restoring the committed pane state failed: ");
        }
      });
    }
    if (auto emitter = EventEmitter()) {
      Codegen::TronNavigationViewEventEmitter::OnPaneOpenChanged payload;
      payload.open = open;
      emitter->onPaneOpenChanged(std::move(payload));
    }
  }

  winrt::Microsoft::UI::Xaml::XamlIsland m_xamlIsland{nullptr};
  nyctron::islands::IslandConnection m_connection;
  winrt::Microsoft::UI::Xaml::Controls::NavigationView m_navigation{nullptr};
  winrt::com_ptr<Codegen::TronNavigationViewProps> m_props;
  winrt::event_token m_itemInvoked{};
  winrt::event_token m_paneOpened{};
  winrt::event_token m_paneClosed{};
  winrt::event_token m_selectionChanged{};
  std::string m_selectedId;
  std::string m_itemsJson;
  std::string m_footerItemsJson;
  bool m_itemsInitialized{false};
  bool m_disposed{false};
  bool m_updatingFromJs{false};
  bool m_restorePending{false};
  // Committed by JS through the paneOpen prop. Matches the initial
  // IsPaneOpen(false) set in InitializeContentIsland.
  bool m_paneOpen{false};
  bool m_paneRestorePending{false};
  std::vector<std::string> m_pendingErrors;
};

} // namespace winrt::NYCTronFluentFabric

void RegisterTronNavigationViewComponent(
    winrt::Microsoft::ReactNative::IReactPackageBuilder const& packageBuilder) {
  winrt::NYCTronFluentFabric::Codegen::RegisterTronNavigationViewNativeComponent<
      winrt::NYCTronFluentFabric::TronNavigationViewComponentView>(
      packageBuilder,
      [](const winrt::Microsoft::ReactNative::Composition::IReactCompositionViewComponentBuilder& builder) {
        // Without this flag ReactNativeHost never creates RNW's XamlApplication
        // (WindowsXamlManager plus XamlControlsResources), so the XamlIsland
        // has no XAML framework behind it and the pane stays empty.
        builder.as<winrt::Microsoft::ReactNative::IReactViewComponentBuilder>().XamlSupport(true);
        builder.SetContentIslandComponentViewInitializer(
            [](const winrt::Microsoft::ReactNative::Composition::ContentIslandComponentView& islandView) noexcept {
              auto data = winrt::make_self<winrt::NYCTronFluentFabric::TronNavigationViewComponentView>();
              data->InitializeContentIsland(islandView);
              islandView.UserData(*data);
              islandView.Mounted([weak = data->get_weak()](winrt::IInspectable const&, winrt::Microsoft::ReactNative::ComponentView const& mounted) noexcept {
                if (auto owner = weak.get()) owner->Mounted(mounted);
              });
              islandView.LayoutMetricsChanged([weak = data->get_weak()](winrt::IInspectable const& sender, winrt::Microsoft::ReactNative::LayoutMetricsChangedArgs const& args) noexcept {
                if (auto owner = weak.get()) owner->LayoutChanged(sender, args);
              });
              islandView.Destroying([weak = data->get_weak()](auto const&, auto const&) noexcept {
                if (auto owner = weak.get()) owner->Destroy();
              });
            });
      });
}
#endif // RNW_NEW_ARCH
