// Copyright (c) NYC-Tron UI contributors.
// XAML Fabric island pattern adapted from Microsoft's RNW v0.85
// packages/sample-custom-component/ComboBox.cpp (MIT).
#include "pch.h"
#include "TronNavigationView.h"

#ifdef RNW_NEW_ARCH
#include "codegen/react/components/NYCTronFluentFabric/TronNavigationView.g.h"

#include <winrt/Microsoft.ReactNative.Composition.h>
#include <winrt/Microsoft.UI.Xaml.Controls.h>
#include <winrt/Microsoft.UI.Xaml.Media.h>
#include <winrt/Windows.Data.Json.h>
#include <unordered_set>

namespace winrt::NYCTronFluentFabric {

struct TronNavigationViewComponentView final
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
      if (m_props) ApplyProps(*m_props);
    } catch (...) {
      // Initialization fails closed: do not display a fake substitute or
      // dispatch an event for a view we could not initialize.
    }
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

  static void AppendItems(
      winrt::Windows::Data::Json::JsonArray const& data,
      winrt::Windows::Foundation::Collections::IVector<winrt::IInspectable> const& target,
      std::unordered_set<std::wstring>& seen) {
    for (auto const& value : data) {
      if (value.ValueType() != winrt::Windows::Data::Json::JsonValueType::Object) continue;
      auto object = value.GetObject();
      auto id = object.GetNamedString(L"id", L"");
      auto label = object.GetNamedString(L"label", L"");
      if (id.empty() || label.empty() || !seen.insert(std::wstring(id.c_str())).second) continue;
      target.Append(MakeItem(object));
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

  void ApplyProps(Codegen::TronNavigationViewProps const& props) noexcept {
    try {
      m_updatingFromJs = true;
      auto menu = winrt::Windows::Data::Json::JsonArray::Parse(
          winrt::to_hstring(props.itemsJson));
      auto footer = winrt::Windows::Data::Json::JsonArray::Parse(
          winrt::to_hstring(props.footerItemsJson.value_or("[]")));
      m_navigation.MenuItems().Clear();
      m_navigation.FooterMenuItems().Clear();
      std::unordered_set<std::wstring> seen;
      AppendItems(menu, m_navigation.MenuItems(), seen);
      AppendItems(footer, m_navigation.FooterMenuItems(), seen);
      const auto mode = props.paneMode.value_or("auto");
      using Mode = winrt::Microsoft::UI::Xaml::Controls::NavigationViewPaneDisplayMode;
      m_navigation.PaneDisplayMode(
          mode == "expanded" ? Mode::Left :
          mode == "compact" ? Mode::LeftCompact :
          mode == "minimal" ? Mode::LeftMinimal : Mode::Auto);
      m_navigation.PaneTitle(winrt::to_hstring(props.paneTitle.value_or("")));
      m_navigation.IsSettingsVisible(props.settingsVisible.value_or(false));
      m_selectedId = props.selectedId.value_or("");
      SetSelectedId(winrt::to_hstring(m_selectedId));
      m_navigation.IsPaneOpen(props.paneOpen.value_or(false));
      m_updatingFromJs = false;
    } catch (...) {
      m_updatingFromJs = false;
      // Invalid serialized items must not crash native. JS wrapper validates.
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
  std::string m_selectedId;
  bool m_updatingFromJs{false};
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
