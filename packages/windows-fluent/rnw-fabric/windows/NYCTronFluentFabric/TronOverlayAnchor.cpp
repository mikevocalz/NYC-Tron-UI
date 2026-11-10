#include "pch.h"
#include "TronOverlayAnchor.h"
#include "OverlayDismissal.h"
#include "InspectorEditSequence.h"
#ifdef RNW_NEW_ARCH
#include "codegen/react/components/NYCTronFluentFabric/TronOverlayAnchor.g.h"
#include <winrt/Microsoft.ReactNative.Composition.h>
#include <winrt/Microsoft.UI.Dispatching.h>
#include <winrt/Microsoft.UI.Xaml.Automation.h>
#include <winrt/Microsoft.UI.Xaml.Controls.h>
#include <winrt/Microsoft.UI.Xaml.Controls.Primitives.h>
#include <winrt/Windows.Data.Json.h>
#include <algorithm>
#include <cmath>
#include <limits>
#include <stdexcept>
#include <unordered_set>

namespace winrt::NYCTronFluentFabric {
namespace Xaml = winrt::Microsoft::UI::Xaml;
namespace Controls = Xaml::Controls;
namespace Json = winrt::Windows::Data::Json;
using Automation = Xaml::Automation::AutomationProperties;

struct TronOverlayAnchorComponentView
    : winrt::implements<TronOverlayAnchorComponentView, winrt::IInspectable>,
      Codegen::BaseTronOverlayAnchor<TronOverlayAnchorComponentView> {
  ~TronOverlayAnchorComponentView() { Destroy(); }
  void Destroy() noexcept {
    if (m_disposed) return;
    m_disposed = true;
    // RNW's Destroying event runs while the ComponentView is still alive.
    // Final COM release can occur after that removal boundary.
    try { HideFlyout(); } catch (...) {}
    try { if (m_tooltip) m_tooltip.IsOpen(false); } catch (...) {}
    try { if (m_island) m_island.Close(); } catch (...) {}
  }
  void InitializeContentIsland(winrt::Microsoft::ReactNative::Composition::ContentIslandComponentView const& view) noexcept {
    try {
      m_island = Xaml::XamlIsland{};
      m_anchor = Controls::Button{};
      m_anchor.HorizontalAlignment(Xaml::HorizontalAlignment::Stretch);
      m_anchor.VerticalAlignment(Xaml::VerticalAlignment::Stretch);
      m_anchor.Click([weak = get_weak()](auto const&, auto const&) {
        if (auto self = weak.get()) {
          if (self->m_kind == "popover") self->OpenRequested(!self->m_open, self->m_scope);
          else if (self->m_kind == "tooltip") self->Action("anchor", self->m_scope);
        }
      });
      m_anchor.Loaded([weak = get_weak()](auto const&, auto const&) { if (auto self = weak.get()) self->ApplyOpen(); });
      m_anchor.Unloaded([weak = get_weak()](auto const&, auto const&) {
        if (auto self = weak.get()) self->Write([&] { self->HideFlyout(); if (self->m_tooltip) self->m_tooltip.IsOpen(false); });
      });
      m_island.Content(m_anchor); view.Connect(m_island.ContentIsland());
      if (m_props) Apply(*m_props);
    } catch (...) { Error("Native overlay initialization failed: " + Exception()); }
  }
  void UpdateEventEmitter(std::shared_ptr<Codegen::TronOverlayAnchorEventEmitter> const& emitter) noexcept override {
    Codegen::BaseTronOverlayAnchor<TronOverlayAnchorComponentView>::UpdateEventEmitter(emitter);
    auto errors = std::move(m_errors); m_errors.clear(); for (auto& error : errors) Error(std::move(error));
  }
  void UpdateProps(winrt::Microsoft::ReactNative::ComponentView const& sender,
      winrt::com_ptr<Codegen::TronOverlayAnchorProps> const& props,
      winrt::com_ptr<Codegen::TronOverlayAnchorProps> const& previous) noexcept override {
    m_props = props; if (m_anchor && props) Apply(*props);
    Codegen::BaseTronOverlayAnchor<TronOverlayAnchorComponentView>::UpdateProps(sender, props, previous);
  }
  void HandleAcknowledgeDismissalCommand(std::string scopeToken, std::string requestId) noexcept override {
    if (m_disposed || scopeToken != m_scope || requestId.empty()) return;
    try {
      const auto pending = m_dismissal.PendingRequestId();
      if (pending && requestId == std::to_string(pending)) m_dismissal.Acknowledge(pending);
    } catch (...) { Error("Native dismissal acknowledgment failed: " + Exception()); }
  }
 private:
  struct Field {
    std::string id, value, text; Controls::TextBox input{nullptr};
    nyctron::overlays::InspectorEditSequence edits;
  };
  static std::string Exception() {
    try { throw; } catch (winrt::hresult_error const& error) { return winrt::to_string(error.message()); }
    catch (std::exception const& error) { return error.what(); } catch (...) { return "unknown native error"; }
  }
  void Error(std::string message) noexcept {
    if (m_disposed) return;
    if (auto emitter = EventEmitter()) { Codegen::TronOverlayAnchorEventEmitter::OnNativeError payload; payload.scopeToken = m_scope; payload.message = std::move(message); emitter->onNativeError(std::move(payload)); }
    else m_errors.push_back(std::move(message));
  }
  template<class F> void Write(F&& body) noexcept {
    const bool before = m_applying; m_applying = true;
    try { body(); } catch (...) { Error(Exception()); }
    m_applying = before;
  }
  void Action(std::string const& id, std::string const& scope) {
    if (m_disposed || m_applying || scope != m_scope || !m_anchor.IsEnabled()) return;
    if (auto emitter = EventEmitter()) { Codegen::TronOverlayAnchorEventEmitter::OnAction payload; payload.scopeToken = scope; payload.id = id; emitter->onAction(std::move(payload)); }
  }
  void OpenRequested(bool open, std::string const& scope, std::string const& requestId = {}) {
    if (m_disposed || m_applying || scope != m_scope || !m_anchor.IsEnabled()) return;
    if (auto emitter = EventEmitter()) { Codegen::TronOverlayAnchorEventEmitter::OnOpenChanged payload; payload.scopeToken = scope; payload.open = open; payload.requestId = requestId; emitter->onOpenChanged(std::move(payload)); }
  }
  static Json::JsonArray Data(std::string const& json, uint32_t budget) {
    if (json.size() > 262144) throw std::invalid_argument("Native overlay data exceeds its budget");
    auto data = Json::JsonArray::Parse(winrt::to_hstring(json));
    if (data.Size() > budget) throw std::invalid_argument("Too many native overlay entries");
    std::unordered_set<std::wstring> ids;
    for (auto const& value : data) {
      auto item = value.GetObject(); auto id = item.GetNamedString(L"id"), label = item.GetNamedString(L"label");
      if (id.empty() || id.size() > 256 || label.empty() || label.size() > 1024 || !ids.insert(std::wstring(id.c_str())).second)
        throw std::invalid_argument("Native overlay entries require unique bounded IDs and labels");
    }
    return data;
  }
  static winrt::hstring Help(Json::JsonObject const& item) {
    auto text = item.GetNamedString(L"description", L"");
    return item.GetNamedBoolean(L"danger", false) ? winrt::hstring(L"Destructive action. ") + text : text;
  }
  void HideFlyout() { if (m_flyout) { m_dismissal.AllowClose(); m_flyout.Hide(); } }
  void CreateFlyout(std::string const& kind) {
    HideFlyout();
    m_anchor.Flyout(nullptr); m_anchor.ContextFlyout(nullptr);
    m_flyout = nullptr; m_menu = nullptr; m_popover = nullptr; m_fields.clear(); m_nativeOpen = false; m_kind = kind;
    m_dismissal.Reset();
    const auto scope = m_scope;
    if (kind == "menu" || kind == "context") {
      m_menu = Controls::MenuFlyout{}; m_flyout = m_menu;
      if (kind == "menu") m_anchor.Flyout(m_menu); else m_anchor.ContextFlyout(m_menu);
    } else if (kind == "popover") {
      m_popover = Controls::Flyout{}; m_flyout = m_popover;
      m_panel = Controls::StackPanel{}; m_panel.Spacing(12); m_panel.MinWidth(280); m_panel.MaxWidth(480);
      m_title = Controls::TextBlock{}; m_title.FontSize(20); m_title.TextWrapping(Xaml::TextWrapping::Wrap);
      m_description = Controls::TextBlock{}; m_description.TextWrapping(Xaml::TextWrapping::Wrap);
      m_fieldsPanel = Controls::StackPanel{}; m_fieldsPanel.Spacing(10);
      m_actionsPanel = Controls::StackPanel{}; m_actionsPanel.Spacing(8);
      m_panel.Children().Append(m_title); m_panel.Children().Append(m_description);
      m_panel.Children().Append(m_fieldsPanel); m_panel.Children().Append(m_actionsPanel);
      auto scroll = Controls::ScrollViewer{}; scroll.Content(m_panel); scroll.MaxHeight(480);
      scroll.VerticalScrollBarVisibility(Controls::ScrollBarVisibility::Auto); scroll.HorizontalScrollBarVisibility(Controls::ScrollBarVisibility::Disabled);
      m_popover.Content(scroll);
    } else if (kind != "tooltip") throw std::invalid_argument("Unsupported native overlay kind");
    if (m_flyout) {
      // Islands are anchor-sized; native popup windows must extend beyond that root.
      m_flyout.ShouldConstrainToRootBounds(false);
      m_flyout.Opened([weak = get_weak(), scope](auto const&, auto const&) { if (auto self = weak.get(); self && self->m_scope == scope) { self->m_nativeOpen = true; if (self->m_kind != "popover") self->OpenRequested(true, scope); } });
      m_flyout.Closing([weak = get_weak(), scope](auto const&, Controls::Primitives::FlyoutBaseClosingEventArgs const& args) {
        if (auto self = weak.get(); self && self->m_scope == scope && self->m_kind == "popover") {
          const auto decision = self->m_dismissal.Closing(self->m_open, self->m_disposed || self->m_applying || !self->m_anchor.IsLoaded() || !self->m_anchor.IsEnabled());
          if (decision != nyctron::overlays::ClosingDecision::Allow) args.Cancel(true);
          if (decision == nyctron::overlays::ClosingDecision::Request)
            self->OpenRequested(false, scope, std::to_string(self->m_dismissal.PendingRequestId()));
        }
      });
      m_flyout.Closed([weak = get_weak(), scope](auto const&, auto const&) {
        if (auto self = weak.get(); self && self->m_scope == scope) {
          const bool allowed = self->m_dismissal.Closed(); self->m_nativeOpen = false;
          if (self->m_kind != "popover") self->OpenRequested(false, scope);
          // A newer committed open can arrive during an allowed close animation.
          // A user request never closes/reopens while waiting for JS approval.
          if (allowed && self->m_kind == "popover" && self->m_open && !self->m_disposed)
            self->m_anchor.DispatcherQueue().TryEnqueue([weak, scope] { if (auto live = weak.get(); live && live->m_scope == scope) live->ApplyOpen(); });
        }
      });
    }
    m_itemsJson.clear(); m_actionsJson.clear(); m_fieldsJson.clear();
  }
  void SyncMenu(std::string const& json) {
    auto data = Data(json, 128); auto items = m_menu.Items();
    bool same = items.Size() == data.Size();
    for (uint32_t i = 0; same && i < data.Size(); ++i)
      same = items.GetAt(i).Tag() && winrt::unbox_value<winrt::hstring>(items.GetAt(i).Tag()) == data.GetObjectAt(i).GetNamedString(L"id");
    if (!same) items.Clear();
    for (uint32_t i = 0; i < data.Size(); ++i) {
      const auto value = data.GetObjectAt(i); const auto id = winrt::to_string(value.GetNamedString(L"id"));
      auto item = same ? items.GetAt(i).as<Controls::MenuFlyoutItem>() : Controls::MenuFlyoutItem{};
      item.Tag(winrt::box_value(winrt::to_hstring(id))); item.Text(value.GetNamedString(L"label"));
      item.IsEnabled(m_anchor.IsEnabled() && !value.GetNamedBoolean(L"disabled", false)); Automation::SetName(item, item.Text()); Automation::SetHelpText(item, Help(value));
      if (!same) { item.Click([weak = get_weak(), id, scope = m_scope](auto const&, auto const&) { if (auto self = weak.get()) self->Action(id, scope); }); items.Append(item); }
    }
    m_itemsJson = json;
  }
  void SyncFields(std::string const& json) {
    auto data = Data(json, 32); std::vector<Field> next; next.reserve(data.Size());
    bool sameOrder = m_fields.size() == data.Size();
    Controls::TextBox focused{nullptr}; int32_t selection{0}, selectionLength{0};
    for (auto const& field : m_fields) if (field.input.FocusState() != Xaml::FocusState::Unfocused) {
      focused = field.input; selection = focused.SelectionStart(); selectionLength = focused.SelectionLength();
    }
    for (uint32_t i = 0; i < data.Size(); ++i) {
      const auto value = data.GetObjectAt(i); const auto text = value.GetNamedString(L"value");
      const auto id = winrt::to_string(value.GetNamedString(L"id"));
      const auto count = value.GetNamedNumber(L"acknowledgedEventCount", 0);
      if (text.size() > 4096 || !std::isfinite(count) || count < 0 || count > std::numeric_limits<int32_t>::max() || std::floor(count) != count)
        throw std::invalid_argument("Native inspector value or event acknowledgment exceeds its budget");
      const auto acknowledged = static_cast<int32_t>(count);
      auto old = std::find_if(m_fields.begin(), m_fields.end(), [&](auto const& f) { return f.id == id; });
      sameOrder = sameOrder && i < m_fields.size() && m_fields[i].id == id;
      Field field;
      if (old != m_fields.end()) field = *old;
      else {
        if (acknowledged != 0) throw std::invalid_argument("A newly mounted inspector field starts at event count zero");
        field.id = id; field.input = Controls::TextBox{}; field.input.MaxLength(4096);
        // TextChanged is asynchronous: a prior JS acknowledgment could arrive
        // after another text mutation but before its count advanced. Observe in
        // TextChanging, while Text already contains that mutation. This handler
        // only snapshots text/count and queues the existing JS event.
        field.input.TextChanging([weak = get_weak(), scope = m_scope](auto const& sender, Controls::TextBoxTextChangingEventArgs const&) {
          if (auto self = weak.get(); self && self->m_scope == scope) self->TextChanging(sender, scope);
        });
      }
      const auto acknowledgment = field.edits.Commit(acknowledged);
      if (acknowledgment == nyctron::overlays::InspectorAcknowledgment::Invalid) throw std::invalid_argument("Inspector acknowledgment is newer than its native edit");
      field.input.Header(winrt::box_value(value.GetNamedString(L"label"))); Automation::SetName(field.input, value.GetNamedString(L"label"));
      field.input.IsReadOnly(value.GetNamedBoolean(L"readOnly", false)); field.input.IsEnabled(m_anchor.IsEnabled());
      // An older JS commit must never replace text from a newer native edit.
      if (acknowledgment != nyctron::overlays::InspectorAcknowledgment::Ignore) field.value = winrt::to_string(text);
      // Disabling editing discards any unacknowledged display draft without
      // manufacturing an app acknowledgment or reusing its event counts.
      if (acknowledgment == nyctron::overlays::InspectorAcknowledgment::Apply || !m_anchor.IsEnabled() || field.input.IsReadOnly()) {
        const auto committed = winrt::to_hstring(field.value); field.text = field.value;
        if (field.input.Text() != committed) {
          const auto caret = field.input.SelectionStart(), length = field.input.SelectionLength(); field.input.Text(committed);
          const auto start = std::min(caret, static_cast<int32_t>(committed.size()));
          field.input.Select(start, std::min(length, static_cast<int32_t>(committed.size()) - start));
        }
      }
      next.push_back(std::move(field));
    }
    m_fields = std::move(next);
    if (!sameOrder) {
      m_fieldsPanel.Children().Clear(); for (auto const& field : m_fields) m_fieldsPanel.Children().Append(field.input);
      if (focused && std::any_of(m_fields.begin(), m_fields.end(), [&](auto const& f) { return f.input == focused; })) {
        focused.Focus(Xaml::FocusState::Keyboard); const auto start = std::min(selection, static_cast<int32_t>(focused.Text().size()));
        focused.Select(start, std::min(selectionLength, static_cast<int32_t>(focused.Text().size()) - start));
      }
    }
    m_fieldsJson = json;
  }
  void TextChanging(Controls::TextBox const& input, std::string const& scope) {
    if (m_applying || m_disposed || scope != m_scope || !m_anchor.IsEnabled() || input.IsReadOnly()) return;
    auto found = std::find_if(m_fields.begin(), m_fields.end(), [&](auto const& f) { return f.input == input; });
    if (found == m_fields.end() || found->text == winrt::to_string(input.Text())) return;
    if (!found->edits.ObserveChange()) { Error("Inspector edit count is exhausted; start a new scope"); return; }
    found->text = winrt::to_string(input.Text());
    if (auto emitter = EventEmitter()) {
      Codegen::TronOverlayAnchorEventEmitter::OnFieldChanged payload; payload.scopeToken = scope;
      payload.id = found->id; payload.value = found->text; payload.eventCount = found->edits.EventCount();
      emitter->onFieldChanged(std::move(payload));
    }
  }
  void SyncActions(std::string const& json) {
    auto data = Data(json, 128); auto children = m_actionsPanel.Children(); bool same = children.Size() == data.Size();
    for (uint32_t i = 0; same && i < data.Size(); ++i) {
      auto button = children.GetAt(i).as<Controls::Button>();
      same = button.Tag() && winrt::unbox_value<winrt::hstring>(button.Tag()) == data.GetObjectAt(i).GetNamedString(L"id");
    }
    if (!same) children.Clear();
    for (uint32_t i = 0; i < data.Size(); ++i) {
      auto value = data.GetObjectAt(i); auto id = winrt::to_string(value.GetNamedString(L"id")); auto button = same ? children.GetAt(i).as<Controls::Button>() : Controls::Button{};
      button.Tag(winrt::box_value(winrt::to_hstring(id)));
      button.Content(winrt::box_value(value.GetNamedString(L"label"))); button.IsEnabled(m_anchor.IsEnabled() && !value.GetNamedBoolean(L"disabled", false));
      Automation::SetName(button, value.GetNamedString(L"label")); Automation::SetHelpText(button, Help(value));
      if (!same) { button.Click([weak = get_weak(), id, scope = m_scope](auto const&, auto const&) { if (auto self = weak.get()) self->Action(id, scope); }); children.Append(button); }
    }
    m_actionsJson = json;
  }
  void ApplyOpen() noexcept {
    if (m_disposed || m_kind != "popover" || !m_flyout || !m_anchor.IsLoaded()) return;
    Write([&] { if (m_open && m_anchor.IsEnabled() && !m_nativeOpen) { m_dismissal.Reset(); m_flyout.ShowAt(m_anchor); } else if ((!m_open || !m_anchor.IsEnabled()) && m_nativeOpen) HideFlyout(); });
  }
  void Apply(Codegen::TronOverlayAnchorProps const& props) noexcept {
    Write([&] {
      if (props.scopeToken.empty() || props.scopeToken.size() > 256) throw std::invalid_argument("Native overlay scope is invalid");
      if (m_kind != props.kind || m_scope != props.scopeToken) { m_scope = props.scopeToken; CreateFlyout(props.kind); }
      m_anchor.Content(winrt::box_value(winrt::to_hstring(props.label))); Automation::SetName(m_anchor, winrt::to_hstring(props.label));
      m_anchor.IsEnabled(!props.disabled.value_or(false));
      if (!m_anchor.IsEnabled()) HideFlyout();
      const auto theme = props.theme.value_or("system");
      m_anchor.RequestedTheme(theme == "dark" ? Xaml::ElementTheme::Dark : theme == "light" ? Xaml::ElementTheme::Light : Xaml::ElementTheme::Default);
      m_anchor.FlowDirection(props.isRTL.value_or(false) ? Xaml::FlowDirection::RightToLeft : Xaml::FlowDirection::LeftToRight);
      const auto tip = props.tooltip.value_or("");
      if (!tip.empty()) {
        if (!m_tooltip) m_tooltip = Controls::ToolTip{};
        m_tooltip.Content(winrt::box_value(winrt::to_hstring(tip))); Automation::SetName(m_tooltip, winrt::to_hstring(tip));
        Controls::ToolTipService::SetToolTip(m_anchor, m_tooltip);
      } else { if (m_tooltip) m_tooltip.IsOpen(false); Controls::ToolTipService::SetToolTip(m_anchor, nullptr); }
      if (m_menu) SyncMenu(props.itemsJson);
      if (m_popover) {
        m_title.Text(winrt::to_hstring(props.title.value_or(""))); m_description.Text(winrt::to_hstring(props.description.value_or("")));
        m_description.Visibility(m_description.Text().empty() ? Xaml::Visibility::Collapsed : Xaml::Visibility::Visible);
        SyncFields(props.fieldsJson); SyncActions(props.actionsJson);
      }
      m_open = props.open.value_or(false);
      m_dismissal.Commit(m_open);
    });
    ApplyOpen();
  }
  Xaml::XamlIsland m_island{nullptr}; Controls::Button m_anchor{nullptr}; Controls::ToolTip m_tooltip{nullptr};
  Controls::Primitives::FlyoutBase m_flyout{nullptr}; Controls::MenuFlyout m_menu{nullptr}; Controls::Flyout m_popover{nullptr};
  Controls::StackPanel m_panel{nullptr}, m_fieldsPanel{nullptr}, m_actionsPanel{nullptr}; Controls::TextBlock m_title{nullptr}, m_description{nullptr};
  winrt::com_ptr<Codegen::TronOverlayAnchorProps> m_props;
  nyctron::overlays::OverlayDismissal m_dismissal;
  std::string m_kind, m_scope, m_itemsJson, m_fieldsJson, m_actionsJson;
  std::vector<Field> m_fields; std::vector<std::string> m_errors;
  bool m_applying{false}, m_disposed{false}, m_open{false}, m_nativeOpen{false};
};
}
void RegisterTronOverlayAnchorComponent(winrt::Microsoft::ReactNative::IReactPackageBuilder const& builder) {
  winrt::NYCTronFluentFabric::Codegen::RegisterTronOverlayAnchorNativeComponent<winrt::NYCTronFluentFabric::TronOverlayAnchorComponentView>(builder,
    [](winrt::Microsoft::ReactNative::Composition::IReactCompositionViewComponentBuilder const& component) {
      component.as<winrt::Microsoft::ReactNative::IReactViewComponentBuilder>().XamlSupport(true);
      component.SetContentIslandComponentViewInitializer([](auto const& view) noexcept {
        auto data = winrt::make_self<winrt::NYCTronFluentFabric::TronOverlayAnchorComponentView>(); data->InitializeContentIsland(view); view.UserData(*data);
        view.Destroying([weak = data->get_weak()](auto const&, auto const&) noexcept {
          if (auto owner = weak.get()) owner->Destroy();
        });
      });
    });
}
#endif
