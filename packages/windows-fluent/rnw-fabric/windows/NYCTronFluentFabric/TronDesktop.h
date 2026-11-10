#pragma once
#include <NativeModules.h>
#include "codegen/NativeTronDesktopSpec.g.h"
#include "DesktopSession.h"

namespace winrt::NYCTronFluentFabric::implementation {
REACT_TURBO_MODULE(TronDesktop)
struct TronDesktop : std::enable_shared_from_this<TronDesktop> {
  using ModuleSpec = winrt::NYCTronFluentFabric::Codegen::TronDesktopSpec;
  using Promise = winrt::Microsoft::ReactNative::ReactPromise<std::string>;
  ~TronDesktop();
  REACT_INIT(Initialize)
  void Initialize(winrt::Microsoft::ReactNative::ReactContext const& context) noexcept;
  REACT_EVENT(onSnapshot) std::function<void(std::string)> onSnapshot;
  REACT_EVENT(onError) std::function<void(std::string)> onError;
  REACT_EVENT(onNativeDrag) std::function<void(std::string)> onNativeDrag;
  REACT_METHOD(connect) void connect(std::string primaryId, std::string component, Promise&& promise) noexcept;
  REACT_METHOD(read) void read(std::string owner, Promise&& promise) noexcept;
  REACT_METHOD(open) void open(std::string owner, std::string request, Promise&& promise) noexcept;
  REACT_METHOD(move) void move(std::string owner, std::string id, std::string request, Promise&& promise) noexcept;
  REACT_METHOD(focus) void focus(std::string owner, std::string id, Promise&& promise) noexcept;
  REACT_METHOD(minimize) void minimize(std::string owner, std::string id, Promise&& promise) noexcept;
  REACT_METHOD(restore) void restore(std::string owner, std::string id, Promise&& promise) noexcept;
  REACT_METHOD(requestClose) void requestClose(std::string owner, std::string id, Promise&& promise) noexcept;
  REACT_METHOD(resolveClose) void resolveClose(std::string owner, std::string id, std::string generation, std::string token, bool accepted, Promise&& promise) noexcept;
  REACT_METHOD(dispose) void dispose(std::string owner, winrt::Microsoft::ReactNative::ReactPromise<void>&& promise) noexcept;
  REACT_METHOD(startNativeDrag) void startNativeDrag(std::string owner, std::string source, std::string token, std::string request, Promise&& promise) noexcept;
  REACT_METHOD(resolveNativeDrop) void resolveNativeDrop(std::string owner, std::string token, std::string request, bool accepted, winrt::Microsoft::ReactNative::ReactPromise<bool>&& promise) noexcept;
  REACT_METHOD(cancelNativeDrag) void cancelNativeDrag(std::string owner, std::string request, winrt::Microsoft::ReactNative::ReactPromise<void>&& promise) noexcept;
  REACT_METHOD(enableNativeDragDiagnostics) void enableNativeDragDiagnostics(std::string owner, winrt::Microsoft::ReactNative::ReactPromise<void>&& promise) noexcept;
 private:
  void Run(std::string owner, Promise promise, std::function<void(nyctron::desktop::DesktopSession&)> work) noexcept;
  winrt::Microsoft::ReactNative::ReactContext m_context;
  std::shared_ptr<nyctron::desktop::DesktopSession> m_session;
};
}
