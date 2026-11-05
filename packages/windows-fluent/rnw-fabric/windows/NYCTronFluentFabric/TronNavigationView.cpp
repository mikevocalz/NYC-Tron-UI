// Copyright (c) NYC-Tron UI contributors.
// XAML Fabric island pattern adapted from Microsoft's RNW v0.85
// packages/sample-custom-component/ComboBox.cpp (MIT).
#include "pch.h"
#include "TronNavigationView.h"

#ifdef RNW_NEW_ARCH
#include "codegen/react/components/NYCTronFluentFabric/TronNavigationView.g.h"

#include <winrt/Microsoft.ReactNative.Composition.h>
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
      // SettingsItem is created when the NavigationView template applies,
      // which happens after the first ApplyProps. Configure it on Loaded.
      m_loaded = m_navigation.Loaded(
          [weak = get_weak()](auto const&, auto const&) {
            if (auto self = weak.get()) {
              self->DisableSelectOnInvokeForSettings();
              self->SetSelectedId(winrt::to_hstring(self->m_selectedId));
            }
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
    m_props = newProps;
    if (m_navigation && newProps) ApplyProps(*newProps);
    Codegen::BaseTronNavigationView<TronNavigationViewComponentView>::UpdateProps(
        sender, newProps, oldProps);
  }

 private:
  static winrt::Microsoft::UI::Xaml::Controls::NavigationViewItem MakeItem(
      winrt::Windows::Data::Json::JsonObject const& data) {
    const auto id = data.GetNamedString(L"id", L"");
    const auto label = data.GetNamedString(L"label", L"");
    auto item = winrt::Microsoft::UI::Xaml::Controls::NavigationViewItem{};
    item.Tag(winrt::box_value(id));
    item.Content(winrt::box_value(label));
    winrt::Microsoft::UI::Xaml::Automation::AutomationProperties::SetName(item, label);
    // Route approval belongs to JS. A rejected/async request must not move
    // the native selection indicator away from the committed route.
    item.SelectsOnInvoked(false);
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
    if (auto emitter = EventEmitter()) {
      Codegen::TronNavigationViewEventEmitter::OnNativeError payload;
      payload.message = std::move(message);
      emitter->onNativeError(std::move(payload));
    } else {
      m_pendingErrors.push_back(std::move(message));
    }
  }

  void SetSelectedId(winrt::hstring const& id) {
    if (id.empty()) {
      m_navigation.SelectedItem(nullptr);
      return;
    }
    for (auto const& entry : m_navigation.MenuItems()) {
      if (auto item = entry.try_as<winrt::Microsoft::UI::Xaml::Controls::NavigationViewItem>()) {
        if (winrt::unbox_value<winrt::hstring>(item.Tag()) == id) {
          m_navigation.SelectedItem(item);
          return;
        }
      }
    }
    for (auto const& entry : m_navigation.FooterMenuItems()) {
      if (auto item = entry.try_as<winrt::Microsoft::UI::Xaml::Controls::NavigationViewItem>()) {
        if (winrt::unbox_value<winrt::hstring>(item.Tag()) == id) {
          m_navigation.SelectedItem(item);
          return;
        }
      }
    }
    m_navigation.SelectedItem(nullptr);
  }

  void DisableSelectOnInvokeForSettings() {
    if (!m_navigation) return;
    if (auto settings = m_navigation.SettingsItem().try_as<winrt::Microsoft::UI::Xaml::Controls::NavigationViewItem>()) {
      settings.SelectsOnInvoked(false);
    }
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
      DisableSelectOnInvokeForSettings();
      m_selectedId = props.selectedId.value_or("");
      SetSelectedId(winrt::to_hstring(m_selectedId));
      m_navigation.FlowDirection(props.isRTL.value_or(false)
          ? winrt::Microsoft::UI::Xaml::FlowDirection::RightToLeft
          : winrt::Microsoft::UI::Xaml::FlowDirection::LeftToRight);
      m_navigation.IsPaneOpen(props.paneOpen.value_or(false));
      m_updatingFromJs = false;
    } catch (...) {
      m_updatingFromJs = false;
      // Invalid serialized items must not crash native; report them instead.
      ReportNativeError("NavigationView props update failed: " + DescribeCurrentException());
    }
  }

  void OnItemInvoked(
      winrt::Microsoft::UI::Xaml::Controls::NavigationViewItemInvokedEventArgs const& args) {
    if (m_updatingFromJs) return;
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

  void OnPaneChanged(bool open) {
    if (m_updatingFromJs) return;
    if (auto emitter = EventEmitter()) {
      Codegen::TronNavigationViewEventEmitter::OnPaneOpenChanged payload;
      payload.open = open;
      emitter->onPaneOpenChanged(std::move(payload));
    }
  }

  winrt::Microsoft::UI::Xaml::XamlIsland m_xamlIsland{nullptr};
  winrt::Microsoft::UI::Xaml::Controls::NavigationView m_navigation{nullptr};
  winrt::com_ptr<Codegen::TronNavigationViewProps> m_props;
  winrt::event_token m_itemInvoked{};
  winrt::event_token m_paneOpened{};
  winrt::event_token m_paneClosed{};
  winrt::event_token m_loaded{};
  std::string m_selectedId;
  std::string m_itemsJson;
  std::string m_footerItemsJson;
  bool m_itemsInitialized{false};
  bool m_updatingFromJs{false};
  std::vector<std::string> m_pendingErrors;
};

} // namespace winrt::NYCTronFluentFabric

void RegisterTronNavigationViewComponent(
    winrt::Microsoft::ReactNative::IReactPackageBuilder const& packageBuilder) {
  winrt::NYCTronFluentFabric::Codegen::RegisterTronNavigationViewNativeComponent<
      winrt::NYCTronFluentFabric::TronNavigationViewComponentView>(
      packageBuilder,
      [](const winrt::Microsoft::ReactNative::Composition::IReactCompositionViewComponentBuilder& builder) {
        builder.SetContentIslandComponentViewInitializer(
            [](const winrt::Microsoft::ReactNative::Composition::ContentIslandComponentView& islandView) noexcept {
              auto data = winrt::make_self<winrt::NYCTronFluentFabric::TronNavigationViewComponentView>();
              data->InitializeContentIsland(islandView);
              islandView.UserData(*data);
            });
      });
}
#endif // RNW_NEW_ARCH
