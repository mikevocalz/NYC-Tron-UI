
/*
 * This file is auto-generated from a NativeModule spec file in js.
 *
 * This is a C++ Spec class that should be used with MakeTurboModuleProvider to register native modules
 * in a way that also verifies at compile time that the native module matches the interface required
 * by the TurboModule JS spec.
 */
#pragma once
// clang-format off

#include <NativeModules.h>
#include <tuple>

namespace winrt::NYCTronFluentFabric::Codegen {


struct TronDesktopSpec : winrt::Microsoft::ReactNative::TurboModuleSpec {
  static constexpr auto methods = std::tuple{
      Method<void(std::string, std::string, Promise<std::string>) noexcept>{0, L"connect"},
      Method<void(std::string, Promise<std::string>) noexcept>{1, L"read"},
      Method<void(std::string, std::string, Promise<std::string>) noexcept>{2, L"open"},
      Method<void(std::string, std::string, std::string, Promise<std::string>) noexcept>{3, L"move"},
      Method<void(std::string, std::string, Promise<std::string>) noexcept>{4, L"focus"},
      Method<void(std::string, std::string, Promise<std::string>) noexcept>{5, L"minimize"},
      Method<void(std::string, std::string, Promise<std::string>) noexcept>{6, L"restore"},
      Method<void(std::string, std::string, std::string, Promise<std::string>) noexcept>{7, L"setTitleBar"},
      Method<void(std::string, std::string, Promise<std::string>) noexcept>{8, L"requestClose"},
      Method<void(std::string, std::string, std::string, std::string, bool, Promise<std::string>) noexcept>{9, L"resolveClose"},
      Method<void(std::string, Promise<void>) noexcept>{10, L"dispose"},
      Method<void(std::string, std::string, std::string, std::string, Promise<std::string>) noexcept>{11, L"startNativeDrag"},
      Method<void(std::string, std::string, std::string, bool, Promise<bool>) noexcept>{12, L"resolveNativeDrop"},
      Method<void(std::string, std::string, Promise<void>) noexcept>{13, L"cancelNativeDrag"},
      Method<void(std::string, Promise<void>) noexcept>{14, L"enableNativeDragDiagnostics"},
      EventEmitter<void(std::string)>{15, L"onSnapshot"},
      EventEmitter<void(std::string)>{16, L"onError"},
      EventEmitter<void(std::string)>{17, L"onNativeDrag"},
  };

  template <class TModule>
  static constexpr void ValidateModule() noexcept {
    constexpr auto methodCheckResults = CheckMethods<TModule, TronDesktopSpec>();

    REACT_SHOW_METHOD_SPEC_ERRORS(
          0,
          "connect",
          "    REACT_METHOD(connect) void connect(std::string primaryWindowId, std::string componentName, ::React::ReactPromise<std::string> &&result) noexcept { /* implementation */ }\n"
          "    REACT_METHOD(connect) static void connect(std::string primaryWindowId, std::string componentName, ::React::ReactPromise<std::string> &&result) noexcept { /* implementation */ }\n");
    REACT_SHOW_METHOD_SPEC_ERRORS(
          1,
          "read",
          "    REACT_METHOD(read) void read(std::string ownerToken, ::React::ReactPromise<std::string> &&result) noexcept { /* implementation */ }\n"
          "    REACT_METHOD(read) static void read(std::string ownerToken, ::React::ReactPromise<std::string> &&result) noexcept { /* implementation */ }\n");
    REACT_SHOW_METHOD_SPEC_ERRORS(
          2,
          "open",
          "    REACT_METHOD(open) void open(std::string ownerToken, std::string request, ::React::ReactPromise<std::string> &&result) noexcept { /* implementation */ }\n"
          "    REACT_METHOD(open) static void open(std::string ownerToken, std::string request, ::React::ReactPromise<std::string> &&result) noexcept { /* implementation */ }\n");
    REACT_SHOW_METHOD_SPEC_ERRORS(
          3,
          "move",
          "    REACT_METHOD(move) void move(std::string ownerToken, std::string id, std::string request, ::React::ReactPromise<std::string> &&result) noexcept { /* implementation */ }\n"
          "    REACT_METHOD(move) static void move(std::string ownerToken, std::string id, std::string request, ::React::ReactPromise<std::string> &&result) noexcept { /* implementation */ }\n");
    REACT_SHOW_METHOD_SPEC_ERRORS(
          4,
          "focus",
          "    REACT_METHOD(focus) void focus(std::string ownerToken, std::string id, ::React::ReactPromise<std::string> &&result) noexcept { /* implementation */ }\n"
          "    REACT_METHOD(focus) static void focus(std::string ownerToken, std::string id, ::React::ReactPromise<std::string> &&result) noexcept { /* implementation */ }\n");
    REACT_SHOW_METHOD_SPEC_ERRORS(
          5,
          "minimize",
          "    REACT_METHOD(minimize) void minimize(std::string ownerToken, std::string id, ::React::ReactPromise<std::string> &&result) noexcept { /* implementation */ }\n"
          "    REACT_METHOD(minimize) static void minimize(std::string ownerToken, std::string id, ::React::ReactPromise<std::string> &&result) noexcept { /* implementation */ }\n");
    REACT_SHOW_METHOD_SPEC_ERRORS(
          6,
          "restore",
          "    REACT_METHOD(restore) void restore(std::string ownerToken, std::string id, ::React::ReactPromise<std::string> &&result) noexcept { /* implementation */ }\n"
          "    REACT_METHOD(restore) static void restore(std::string ownerToken, std::string id, ::React::ReactPromise<std::string> &&result) noexcept { /* implementation */ }\n");
    REACT_SHOW_METHOD_SPEC_ERRORS(
          7,
          "setTitleBar",
          "    REACT_METHOD(setTitleBar) void setTitleBar(std::string ownerToken, std::string id, std::string style, ::React::ReactPromise<std::string> &&result) noexcept { /* implementation */ }\n"
          "    REACT_METHOD(setTitleBar) static void setTitleBar(std::string ownerToken, std::string id, std::string style, ::React::ReactPromise<std::string> &&result) noexcept { /* implementation */ }\n");
    REACT_SHOW_METHOD_SPEC_ERRORS(
          8,
          "requestClose",
          "    REACT_METHOD(requestClose) void requestClose(std::string ownerToken, std::string id, ::React::ReactPromise<std::string> &&result) noexcept { /* implementation */ }\n"
          "    REACT_METHOD(requestClose) static void requestClose(std::string ownerToken, std::string id, ::React::ReactPromise<std::string> &&result) noexcept { /* implementation */ }\n");
    REACT_SHOW_METHOD_SPEC_ERRORS(
          9,
          "resolveClose",
          "    REACT_METHOD(resolveClose) void resolveClose(std::string ownerToken, std::string id, std::string generation, std::string token, bool accepted, ::React::ReactPromise<std::string> &&result) noexcept { /* implementation */ }\n"
          "    REACT_METHOD(resolveClose) static void resolveClose(std::string ownerToken, std::string id, std::string generation, std::string token, bool accepted, ::React::ReactPromise<std::string> &&result) noexcept { /* implementation */ }\n");
    REACT_SHOW_METHOD_SPEC_ERRORS(
          10,
          "dispose",
          "    REACT_METHOD(dispose) void dispose(std::string ownerToken, ::React::ReactPromise<void> &&result) noexcept { /* implementation */ }\n"
          "    REACT_METHOD(dispose) static void dispose(std::string ownerToken, ::React::ReactPromise<void> &&result) noexcept { /* implementation */ }\n");
    REACT_SHOW_METHOD_SPEC_ERRORS(
          11,
          "startNativeDrag",
          "    REACT_METHOD(startNativeDrag) void startNativeDrag(std::string ownerToken, std::string sourceId, std::string token, std::string requestId, ::React::ReactPromise<std::string> &&result) noexcept { /* implementation */ }\n"
          "    REACT_METHOD(startNativeDrag) static void startNativeDrag(std::string ownerToken, std::string sourceId, std::string token, std::string requestId, ::React::ReactPromise<std::string> &&result) noexcept { /* implementation */ }\n");
    REACT_SHOW_METHOD_SPEC_ERRORS(
          12,
          "resolveNativeDrop",
          "    REACT_METHOD(resolveNativeDrop) void resolveNativeDrop(std::string ownerToken, std::string token, std::string requestId, bool accepted, ::React::ReactPromise<bool> &&result) noexcept { /* implementation */ }\n"
          "    REACT_METHOD(resolveNativeDrop) static void resolveNativeDrop(std::string ownerToken, std::string token, std::string requestId, bool accepted, ::React::ReactPromise<bool> &&result) noexcept { /* implementation */ }\n");
    REACT_SHOW_METHOD_SPEC_ERRORS(
          13,
          "cancelNativeDrag",
          "    REACT_METHOD(cancelNativeDrag) void cancelNativeDrag(std::string ownerToken, std::string requestOrToken, ::React::ReactPromise<void> &&result) noexcept { /* implementation */ }\n"
          "    REACT_METHOD(cancelNativeDrag) static void cancelNativeDrag(std::string ownerToken, std::string requestOrToken, ::React::ReactPromise<void> &&result) noexcept { /* implementation */ }\n");
    REACT_SHOW_METHOD_SPEC_ERRORS(
          14,
          "enableNativeDragDiagnostics",
          "    REACT_METHOD(enableNativeDragDiagnostics) void enableNativeDragDiagnostics(std::string ownerToken, ::React::ReactPromise<void> &&result) noexcept { /* implementation */ }\n"
          "    REACT_METHOD(enableNativeDragDiagnostics) static void enableNativeDragDiagnostics(std::string ownerToken, ::React::ReactPromise<void> &&result) noexcept { /* implementation */ }\n");
    REACT_SHOW_EVENTEMITTER_SPEC_ERRORS(
          15,
          "onSnapshot",
          "    REACT_EVENT(onSnapshot) std::function<void(std::string)> onSnapshot;\n");
    REACT_SHOW_EVENTEMITTER_SPEC_ERRORS(
          16,
          "onError",
          "    REACT_EVENT(onError) std::function<void(std::string)> onError;\n");
    REACT_SHOW_EVENTEMITTER_SPEC_ERRORS(
          17,
          "onNativeDrag",
          "    REACT_EVENT(onNativeDrag) std::function<void(std::string)> onNativeDrag;\n");
  }
};

} // namespace winrt::NYCTronFluentFabric::Codegen
