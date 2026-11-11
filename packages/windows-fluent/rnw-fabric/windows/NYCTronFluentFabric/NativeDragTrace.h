#pragma once
#include "NativeDragTraceBudget.h"
#include <winrt/Windows.Data.Json.h>
#include <memory>
#include <string>
#include <string_view>

namespace nyctron::desktop {
// Private acceptance diagnostic, disabled until explicitly enabled by the
// owning desktop session. Labels are fixed; tokens and data values never enter
// a record. The only output is a PID-named file in this app's LocalFolder.
class NativeDragTrace final {
 public:
  static std::shared_ptr<NativeDragTrace> Enable(std::string const& owner);
  static bool Enabled(std::string const& owner) noexcept;
  // Diagnostic records from components that have no desktop owner token, such as the
  // navigation view. Writes only while a session already enabled the trace.
  static void RecordActive(winrt::Windows::Data::Json::JsonObject const& record) noexcept;
  static void Record(std::string const& owner, winrt::Windows::Data::Json::JsonObject const& record) noexcept;
  ~NativeDragTrace();
  NativeDragTrace(NativeDragTrace const&) = delete;
  NativeDragTrace& operator=(NativeDragTrace const&) = delete;
 private:
  explicit NativeDragTrace(std::string owner);
  void Write(winrt::Windows::Data::Json::JsonObject const& record) noexcept;
  bool WriteBytes(std::string_view bytes) noexcept;
  void Close() noexcept;
  std::string m_owner;
  void* m_file{nullptr};
  NativeDragTraceBudget m_budget;
  bool m_finished{false};
};
}
