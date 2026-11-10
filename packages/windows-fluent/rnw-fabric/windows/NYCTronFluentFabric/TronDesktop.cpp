#include "pch.h"
#include "TronDesktop.h"
#include <stdexcept>

namespace winrt::NYCTronFluentFabric::implementation {
void TronDesktop::Initialize(Microsoft::ReactNative::ReactContext const& context) noexcept { m_context = context; }
TronDesktop::~TronDesktop() {
  if (m_session) m_context.UIDispatcher().Post([session = std::move(m_session)] { session->Dispose(); });
}
void TronDesktop::connect(std::string primary, std::string component, Promise&& promise) noexcept {
  m_context.UIDispatcher().Post([self = shared_from_this(), primary = std::move(primary), component = std::move(component), promise] {
    try {
      if (self->m_session && !self->m_session->IsDisposed()) throw std::runtime_error("This React runtime already has a native desktop owner");
      const auto weak = self->weak_from_this();
      auto session = std::make_shared<nyctron::desktop::DesktopSession>(self->m_context,
        [weak](std::string value) { if (auto module = weak.lock()) module->onSnapshot(value); },
        [weak](std::string value) { if (auto module = weak.lock()) module->onError(value); },
        [weak](std::string value) { if (auto module = weak.lock()) module->onNativeDrag(value); });
      try { session->Connect(primary, component); self->m_session = session; promise.Resolve(session->Snapshot()); }
      catch (...) { session->Dispose(); throw; }
    } catch (std::exception const& error) { promise.Reject(error.what()); }
    catch (winrt::hresult_error const& error) { promise.Reject(error.message().c_str()); }
    catch (...) { promise.Reject("Could not connect the native Windows host"); }
  });
}
void TronDesktop::Run(std::string owner, Promise promise, std::function<void(nyctron::desktop::DesktopSession&)> work) noexcept {
  m_context.UIDispatcher().Post([self = shared_from_this(), owner = std::move(owner), promise, work = std::move(work)] {
    try {
      if (!self->m_session) throw std::runtime_error("Native desktop is not connected");
      self->m_session->RequireOwner(owner); work(*self->m_session); promise.Resolve(self->m_session->Snapshot());
    } catch (std::exception const& error) { promise.Reject(error.what()); }
    catch (winrt::hresult_error const& error) { promise.Reject(error.message().c_str()); }
    catch (...) { promise.Reject("Native window operation failed"); }
  });
}
void TronDesktop::read(std::string owner, Promise&& promise) noexcept { Run(std::move(owner), promise, [](auto&) {}); }
void TronDesktop::open(std::string owner, std::string request, Promise&& promise) noexcept { Run(std::move(owner), promise, [request = std::move(request)](auto& session) { session.Open(request); }); }
void TronDesktop::move(std::string owner, std::string id, std::string request, Promise&& promise) noexcept { Run(std::move(owner), promise, [id = std::move(id), request = std::move(request)](auto& session) { session.Move(id, request); }); }
void TronDesktop::focus(std::string owner, std::string id, Promise&& promise) noexcept { Run(std::move(owner), promise, [id = std::move(id)](auto& session) { session.Focus(id); }); }
void TronDesktop::minimize(std::string owner, std::string id, Promise&& promise) noexcept { Run(std::move(owner), promise, [id = std::move(id)](auto& session) { session.Minimize(id); }); }
void TronDesktop::restore(std::string owner, std::string id, Promise&& promise) noexcept { Run(std::move(owner), promise, [id = std::move(id)](auto& session) { session.Restore(id); }); }
void TronDesktop::requestClose(std::string owner, std::string id, Promise&& promise) noexcept { Run(std::move(owner), promise, [id = std::move(id)](auto& session) { session.RequestClose(id); }); }
void TronDesktop::resolveClose(std::string owner, std::string id, std::string generation, std::string token, bool accepted, Promise&& promise) noexcept {
  Run(std::move(owner), promise, [id = std::move(id), generation = std::move(generation), token = std::move(token), accepted](auto& session) { session.ResolveClose(id, generation, token, accepted); });
}
void TronDesktop::dispose(std::string owner, Microsoft::ReactNative::ReactPromise<void>&& promise) noexcept {
  m_context.UIDispatcher().Post([self = shared_from_this(), owner = std::move(owner), promise] {
    try { if (!self->m_session) throw std::runtime_error("Native desktop is not connected"); self->m_session->RequireOwner(owner); self->m_session->Dispose(); promise.Resolve(); }
    catch (std::exception const& error) { promise.Reject(error.what()); }
    catch (winrt::hresult_error const& error) { promise.Reject(error.message().c_str()); }
    catch (...) { promise.Reject("Could not detach the native Windows host"); }
  });
}
void TronDesktop::startNativeDrag(std::string owner, std::string source, std::string token, std::string request, Promise&& promise) noexcept {
  m_context.UIDispatcher().Post([self = shared_from_this(), owner = std::move(owner), source = std::move(source), token = std::move(token), request = std::move(request), promise] {
    try {
      if (!self->m_session) throw std::runtime_error("Native desktop is not connected");
      self->m_session->RequireOwner(owner);
      self->m_session->StartNativeDrag(source, token, request, [promise](std::string result) { promise.Resolve(result); });
    } catch (std::exception const& error) { promise.Reject(error.what()); }
    catch (winrt::hresult_error const& error) { promise.Reject(error.message().c_str()); }
    catch (...) { promise.Reject("Native drag could not start"); }
  });
}
void TronDesktop::resolveNativeDrop(std::string owner, std::string token, std::string request, bool accepted, Microsoft::ReactNative::ReactPromise<bool>&& promise) noexcept {
  m_context.UIDispatcher().Post([self = shared_from_this(), owner = std::move(owner), token = std::move(token), request = std::move(request), accepted, promise] {
    try {
      if (!self->m_session) throw std::runtime_error("Native desktop is not connected");
      self->m_session->RequireOwner(owner); promise.Resolve(self->m_session->ResolveNativeDrop(token, request, accepted));
    } catch (std::exception const& error) { promise.Reject(error.what()); }
    catch (winrt::hresult_error const& error) { promise.Reject(error.message().c_str()); }
    catch (...) { promise.Reject("Native drop approval failed"); }
  });
}
void TronDesktop::cancelNativeDrag(std::string owner, std::string request, Microsoft::ReactNative::ReactPromise<void>&& promise) noexcept {
  m_context.UIDispatcher().Post([self = shared_from_this(), owner = std::move(owner), request = std::move(request), promise] {
    try {
      if (!self->m_session) throw std::runtime_error("Native desktop is not connected");
      self->m_session->RequireOwner(owner); self->m_session->CancelNativeDrag(request); promise.Resolve();
    } catch (std::exception const& error) { promise.Reject(error.what()); }
    catch (winrt::hresult_error const& error) { promise.Reject(error.message().c_str()); }
    catch (...) { promise.Reject("Native drag cancellation failed"); }
  });
}
void TronDesktop::enableNativeDragDiagnostics(std::string owner, Microsoft::ReactNative::ReactPromise<void>&& promise) noexcept {
  m_context.UIDispatcher().Post([self = shared_from_this(), owner = std::move(owner), promise] {
    try {
      if (!self->m_session) throw std::runtime_error("Native desktop is not connected");
      self->m_session->RequireOwner(owner);
      self->m_session->EnableNativeDragDiagnostics();
      promise.Resolve();
    } catch (...) { promise.Reject("Native drag diagnostics could not be enabled"); }
  });
}
}
