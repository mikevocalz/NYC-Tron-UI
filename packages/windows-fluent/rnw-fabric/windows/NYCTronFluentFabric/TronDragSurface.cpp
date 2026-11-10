#include "pch.h"
#include "TronDragSurface.h"
#include "NativeDragBroker.h"
#ifdef RNW_NEW_ARCH
#include "IslandConnection.h"
#include "codegen/react/components/NYCTronFluentFabric/TronDragSurface.g.h"
#include <winrt/Microsoft.ReactNative.Composition.h>
#include <winrt/Microsoft.UI.Xaml.Automation.h>
#include <winrt/Microsoft.UI.Xaml.Controls.h>
#include <winrt/Windows.ApplicationModel.DataTransfer.h>
#include <stdexcept>
#include <utility>

namespace winrt::NYCTronFluentFabric {
namespace Xaml = winrt::Microsoft::UI::Xaml;
namespace Transfer = winrt::Windows::ApplicationModel::DataTransfer;
using Broker = nyctron::desktop::NativeDragBroker;
static constexpr wchar_t NonceProperty[] = L"NYCTron.NativeWindowDrag.Nonce";
static constexpr wchar_t PrivateFormat[] = L"application/x-nyc-tron-window-transfer";
// Acquired and completed on the UI dispatcher. Every exit, including exceptions in
// property setters, releases the framework deferral once; no nested message pump.
class DragDeferral final {
 public:
  ~DragDeferral() { Complete(); }
  void Set(Xaml::DragOperationDeferral const& value) noexcept { m_value = value; }
  bool Claim() noexcept { return !std::exchange(m_claimed, true); }
  void Complete() noexcept {
    m_claimed = true; auto value = std::exchange(m_value, nullptr);
    if (value) try { value.Complete(); } catch (...) {}
  }
 private:
  Xaml::DragOperationDeferral m_value{nullptr}; bool m_claimed{false};
};
struct TronDragSurfaceComponentView
    : winrt::implements<TronDragSurfaceComponentView, winrt::IInspectable>,
      Codegen::BaseTronDragSurface<TronDragSurfaceComponentView> {
  ~TronDragSurfaceComponentView() { Destroy(); }
  void Destroy() noexcept {
    if (std::exchange(m_disposed, true)) return;
    m_mounted = false;
    m_loaded = false;
    // Release broker deferrals and the XAML island at RNW's removal boundary,
    // before UIA references can postpone the UserData object's final release.
    Cleanup();
    try { if (m_island) m_island.Close(); } catch (...) {}
    m_connection.Close();
  }
  void Mounted(winrt::Microsoft::ReactNative::ComponentView const& view) noexcept {
    if (m_disposed) return;
    try {
      m_connection.SetSite(view.as<winrt::Microsoft::ReactNative::Composition::ContentIslandComponentView>().ChildSiteLink());
      m_mounted = true;
      ApplyDragCapabilities();
    }
    catch (...) { Error("Could not retain the native drag connection"); }
  }
  void Unmounted() noexcept {
    if (m_disposed) return;
    m_mounted = false;
    Cleanup();
  }
  void LayoutChanged(winrt::IInspectable const& sender, winrt::Microsoft::ReactNative::LayoutMetricsChangedArgs const& args) noexcept {
    if (m_disposed) return;
    try { m_connection.UpdateLayout(sender.as<winrt::Microsoft::ReactNative::Composition::ContentIslandComponentView>(), args); }
    catch (...) { Error("Could not update native drag input geometry"); }
  }
  void Loaded() noexcept {
    if (m_disposed) return;
    m_loaded = true;
    ApplyDragCapabilities();
  }
  void Unloaded() noexcept {
    if (m_disposed) return;
    m_loaded = false;
    // Unregistering CanDrag also needs a live input-site registration. Once
    // unloaded, cancel the app transfer without changing that native property.
    Cleanup();
  }
  void InitializeContentIsland(winrt::Microsoft::ReactNative::Composition::ContentIslandComponentView const& view) noexcept {
    try {
      m_island = Xaml::XamlIsland{}; m_surface = Xaml::Controls::Button{};
      m_surface.HorizontalAlignment(Xaml::HorizontalAlignment::Stretch); m_surface.VerticalAlignment(Xaml::VerticalAlignment::Stretch);
      m_surface.DragStarting([weak = get_weak()](auto const&, Xaml::DragStartingEventArgs const& args) { if (auto self = weak.get()) self->Starting(args); else args.Cancel(true); });
      m_surface.DropCompleted([weak = get_weak()](auto const&, Xaml::DropCompletedEventArgs const& args) {
        if (auto self = weak.get()) {
          if (self->m_disposed || self->m_request.empty()) return;
          const auto result = args.DropResult();
          auto effect = result == Transfer::DataPackageOperation::Move ? "move" : result == Transfer::DataPackageOperation::Copy ? "copy" : result == Transfer::DataPackageOperation::Link ? "link" : result == Transfer::DataPackageOperation::None ? "none" : "unknown";
          if (auto broker = Broker::Find(self->m_owner)) broker->NativeCompleted(self->m_request, effect);
          self->m_request.clear();
        }
      });
      m_surface.DragEnter([weak = get_weak()](auto const&, Xaml::DragEventArgs const& args) { if (auto self = weak.get()) self->Hover(args); });
      m_surface.DragOver([weak = get_weak()](auto const&, Xaml::DragEventArgs const& args) { if (auto self = weak.get()) self->Hover(args); });
      m_surface.DragLeave([weak = get_weak()](auto const&, Xaml::DragEventArgs const&) {
        if (auto self = weak.get()) if (self->InputReady()) if (auto broker = Broker::Find(self->m_owner)) broker->Leave(self->m_window, self->m_generation);
      });
      m_surface.Drop([weak = get_weak()](auto const&, Xaml::DragEventArgs const& args) { if (auto self = weak.get()) self->Drop(args); });
      m_surface.Loaded([weak = get_weak()](auto const&, auto const&) { if (auto self = weak.get()) self->Loaded(); });
      m_surface.Unloaded([weak = get_weak()](auto const&, auto const&) { if (auto self = weak.get()) self->Unloaded(); });
      m_island.Content(m_surface);
      m_connection.SetIsland(m_island.ContentIsland());
      view.Connect(m_island.ContentIsland()); if (m_props) Apply(*m_props);
    } catch (...) { Error("Could not initialize the native WinUI drag surface"); }
  }
  void UpdateProps(winrt::Microsoft::ReactNative::ComponentView const& view, winrt::com_ptr<Codegen::TronDragSurfaceProps> const& props, winrt::com_ptr<Codegen::TronDragSurfaceProps> const& old) noexcept override {
    if (m_disposed) return;
    m_props = props; if (m_surface && props) Apply(*props);
    Codegen::BaseTronDragSurface<TronDragSurfaceComponentView>::UpdateProps(view, props, old);
  }
  void UpdateEventEmitter(std::shared_ptr<Codegen::TronDragSurfaceEventEmitter> const& emitter) noexcept override {
    Codegen::BaseTronDragSurface<TronDragSurfaceComponentView>::UpdateEventEmitter(emitter);
    auto pending = std::move(m_errors); m_errors.clear(); for (auto const& message : pending) Error(message);
  }
 private:
  void Error(std::string const& message) noexcept {
    if (m_disposed) return;
    if (auto emitter = EventEmitter()) { Codegen::TronDragSurfaceEventEmitter::OnNativeError error; error.message = message; emitter->onNativeError(std::move(error)); }
    else m_errors.push_back(message);
  }
  void Cleanup() noexcept {
    if (auto broker = Broker::Find(m_owner)) {
      if (!m_request.empty()) broker->Cancel(m_request, "unavailable");
      if (m_role == "target") broker->CancelTarget(m_window, m_generation);
    }
    m_request.clear();
  }
  bool InputReady() const noexcept {
    try {
      if (m_disposed || !m_mounted || !m_loaded || !m_surface || !m_surface.IsLoaded() || !m_island) return false;
      const auto island = m_island.ContentIsland();
      return island && !island.IsClosed() && island.IsConnected();
    } catch (...) { return false; }
  }
  void ApplyDragCapabilities() noexcept {
    // RNW defers Connect until Mounted. In WinUI 1.8, setting CanDrag while
    // this element belongs to an unconnected XAML island can fail-fast during
    // input-site registration. Both Mounted and Loaded replay current props
    // so either event ordering is safe; no timer or speculative retry is used.
    if (!m_props || !InputReady()) return;
    try {
      m_surface.CanDrag(m_role == "source" && m_surface.IsEnabled());
      m_surface.AllowDrop(m_role == "target" && m_surface.IsEnabled());
    } catch (...) { Error("Could not apply native drag capabilities"); }
  }
  void Apply(Codegen::TronDragSurfaceProps const& props) noexcept {
    try {
      if (props.scopeToken != m_scope || props.ownerToken != m_owner || props.windowId != m_window || props.generation != m_generation || props.dragRole != m_role || props.disabled.value_or(false)) Cleanup();
      m_scope = props.scopeToken;
      m_owner = props.ownerToken; m_window = props.windowId; m_generation = props.generation; m_role = props.dragRole;
      if (m_role != "source" && m_role != "target") throw std::invalid_argument("Invalid native drag surface role");
      m_surface.Content(winrt::box_value(winrt::to_hstring(props.label)));
      Xaml::Automation::AutomationProperties::SetName(m_surface, winrt::to_hstring(props.label));
      m_surface.IsEnabled(!props.disabled.value_or(false));
      ApplyDragCapabilities();
    } catch (...) { Error("Native drag surface properties are invalid"); }
  }
  void Starting(Xaml::DragStartingEventArgs const& args) noexcept {
    std::shared_ptr<DragDeferral> completion;
    try {
      completion = std::make_shared<DragDeferral>(); completion->Set(args.GetDeferral());
      auto ready = [args, completion](bool allowed, std::string const& nonce) {
        if (!completion->Claim()) return;
        try {
          args.Cancel(!allowed);
          if (allowed) {
            // The data package carries a nonce only. Documents never leave the JS owner.
            args.Data().SetData(PrivateFormat, winrt::box_value(winrt::to_hstring(nonce)));
            args.Data().Properties().Insert(NonceProperty, winrt::box_value(winrt::to_hstring(nonce)));
            args.Data().RequestedOperation(Transfer::DataPackageOperation::Move);
          }
        } catch (...) { try { args.Cancel(true); } catch (...) {} completion->Complete(); throw; }
        completion->Complete();
      };
      auto broker = Broker::Find(m_owner); auto emitter = EventEmitter();
      if (!InputReady() || !broker || !emitter || m_role != "source" || !m_surface.IsEnabled()) { ready(false, ""); return; }
      m_request = broker->PrepareSource(m_window, m_generation, ready);
      Codegen::TronDragSurfaceEventEmitter::OnDragStarting event; event.scopeToken = m_scope; event.requestId = m_request; emitter->onDragStarting(std::move(event));
    } catch (...) {
      try { args.Cancel(true); } catch (...) {} if (completion) completion->Complete();
      if (!m_disposed) Cleanup(); Error("Native drag start was refused or its owner is unavailable");
    }
  }
  static std::string Nonce(Xaml::DragEventArgs const& args) {
    auto properties = args.DataView().Properties();
    if (!args.DataView().Contains(PrivateFormat) || !properties.HasKey(NonceProperty)) return "";
    auto value = winrt::unbox_value<winrt::hstring>(properties.Lookup(NonceProperty)); return value.size() > 256 ? "" : winrt::to_string(value);
  }
  void Hover(Xaml::DragEventArgs const& args) noexcept {
    try {
      args.Handled(true); args.AcceptedOperation(Transfer::DataPackageOperation::None);
      auto broker = Broker::Find(m_owner); const auto nonce = Nonce(args);
      if (InputReady() && m_role == "target" && m_surface.IsEnabled() && broker && broker->CanTarget(nonce, m_window, m_generation)) {
        args.AcceptedOperation(Transfer::DataPackageOperation::Move); broker->Hover(nonce, m_window, m_generation);
      }
    } catch (...) { /* Unrelated or malformed OS data is not an accepted app transfer. */ }
  }
  void Drop(Xaml::DragEventArgs const& args) noexcept {
    std::shared_ptr<DragDeferral> completion;
    try {
      args.Handled(true); args.AcceptedOperation(Transfer::DataPackageOperation::None);
      completion = std::make_shared<DragDeferral>(); completion->Set(args.GetDeferral());
      auto ready = [args, completion](bool accepted) {
        if (!completion->Claim()) return;
        try { args.AcceptedOperation(accepted ? Transfer::DataPackageOperation::Move : Transfer::DataPackageOperation::None); }
        catch (...) { try { args.AcceptedOperation(Transfer::DataPackageOperation::None); } catch (...) {} completion->Complete(); throw; }
        completion->Complete();
      };
      auto broker = Broker::Find(m_owner); const auto nonce = Nonce(args);
      if (!InputReady() || m_role != "target" || !m_surface.IsEnabled() || !broker || !broker->CanTarget(nonce, m_window, m_generation)) { ready(false); return; }
      broker->Offer(nonce, m_window, m_generation, ready);
    } catch (...) {
      try { args.AcceptedOperation(Transfer::DataPackageOperation::None); } catch (...) {} if (completion) completion->Complete();
      if (!m_disposed) Cleanup(); Error("Native drop could not reach its live application owner");
    }
  }
  Xaml::XamlIsland m_island{nullptr}; Xaml::Controls::Button m_surface{nullptr};
  nyctron::islands::IslandConnection m_connection;
  winrt::com_ptr<Codegen::TronDragSurfaceProps> m_props;
  std::string m_owner, m_window, m_generation, m_role, m_scope, m_request;
  std::vector<std::string> m_errors; bool m_disposed{false}, m_mounted{false}, m_loaded{false};
};
}
void RegisterTronDragSurfaceComponent(winrt::Microsoft::ReactNative::IReactPackageBuilder const& builder) {
  winrt::NYCTronFluentFabric::Codegen::RegisterTronDragSurfaceNativeComponent<winrt::NYCTronFluentFabric::TronDragSurfaceComponentView>(builder,
    [](winrt::Microsoft::ReactNative::Composition::IReactCompositionViewComponentBuilder const& component) {
      component.as<winrt::Microsoft::ReactNative::IReactViewComponentBuilder>().XamlSupport(true);
      component.SetContentIslandComponentViewInitializer([](auto const& view) noexcept {
        auto data = winrt::make_self<winrt::NYCTronFluentFabric::TronDragSurfaceComponentView>(); data->InitializeContentIsland(view); view.UserData(*data);
        view.Mounted([weak = data->get_weak()](winrt::IInspectable const&, winrt::Microsoft::ReactNative::ComponentView const& mounted) noexcept {
          if (auto owner = weak.get()) owner->Mounted(mounted);
        });
        view.Unmounted([weak = data->get_weak()](auto const&, auto const&) noexcept {
          if (auto owner = weak.get()) owner->Unmounted();
        });
        view.LayoutMetricsChanged([weak = data->get_weak()](winrt::IInspectable const& sender, winrt::Microsoft::ReactNative::LayoutMetricsChangedArgs const& args) noexcept {
          if (auto owner = weak.get()) owner->LayoutChanged(sender, args);
        });
        view.Destroying([weak = data->get_weak()](auto const&, auto const&) noexcept {
          if (auto owner = weak.get()) owner->Destroy();
        });
      });
    });
}
#endif
