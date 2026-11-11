#include "pch.h"
#include "NativeDragTrace.h"
#include <winrt/Windows.Storage.h>
#include <chrono>
#include <stdexcept>

namespace nyctron::desktop {
namespace Json = winrt::Windows::Data::Json;
namespace {
// Every caller is on RNW's UI dispatcher. One diagnostic session per process;
// it cannot redirect another desktop owner's trace or choose an output path.
std::weak_ptr<NativeDragTrace> activeTrace;
void Number(Json::JsonObject const& record, wchar_t const* key, double value) {
  record.SetNamedValue(key, Json::JsonValue::CreateNumberValue(value));
}
}
NativeDragTrace::NativeDragTrace(std::string owner) : m_owner(std::move(owner)) {
  const auto local = winrt::Windows::Storage::ApplicationData::Current().LocalFolder().Path();
  const auto path = std::wstring(local.c_str(), local.size()) + L"\\nyctron-native-drag-" + std::to_wstring(GetCurrentProcessId()) + L".jsonl";
  const auto file = CreateFileW(path.c_str(), GENERIC_WRITE, FILE_SHARE_READ, nullptr, CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, nullptr);
  if (file == INVALID_HANDLE_VALUE) throw std::runtime_error("Native drag diagnostic file could not be opened");
  m_file = file;
}
NativeDragTrace::~NativeDragTrace() { Close(); }
std::shared_ptr<NativeDragTrace> NativeDragTrace::Enable(std::string const& owner) {
  if (auto active = activeTrace.lock()) {
    if (active->m_owner != owner) throw std::runtime_error("A different desktop owner already enabled native drag diagnostics");
    return active;
  }
  auto trace = std::shared_ptr<NativeDragTrace>(new NativeDragTrace(owner));
  activeTrace = trace;
  Json::JsonObject record;
  record.SetNamedValue(L"stage", Json::JsonValue::CreateStringValue(L"trace-enabled"));
  Number(record, L"schemaVersion", 1);
  Number(record, L"recordLimit", static_cast<double>(NativeDragTraceBudget::RecordLimit));
  Number(record, L"byteLimit", static_cast<double>(NativeDragTraceBudget::ByteLimit));
  trace->Write(record);
  return trace;
}
bool NativeDragTrace::Enabled(std::string const& owner) noexcept {
  auto trace = activeTrace.lock();
  return trace && trace->m_owner == owner && !trace->m_finished;
}
void NativeDragTrace::Record(std::string const& owner, Json::JsonObject const& record) noexcept {
  if (auto trace = activeTrace.lock()) if (trace->m_owner == owner) trace->Write(record);
}
void NativeDragTrace::RecordActive(Json::JsonObject const& record) noexcept {
  if (auto trace = activeTrace.lock()) if (!trace->m_finished) trace->Write(record);
}
void NativeDragTrace::Close() noexcept {
  if (m_file) { CloseHandle(m_file); m_file = nullptr; }
}
bool NativeDragTrace::WriteBytes(std::string_view bytes) noexcept {
  if (!m_file) return false;
  DWORD written = 0;
  const auto success = WriteFile(m_file, bytes.data(), static_cast<DWORD>(bytes.size()), &written, nullptr);
  if (!success || written != bytes.size()) { m_finished = true; Close(); return false; }
  return true;
}
void NativeDragTrace::Write(Json::JsonObject const& record) noexcept {
  if (m_finished || !m_file) return;
  try {
    Number(record, L"sequence", static_cast<double>(m_budget.Records()));
    Number(record, L"processId", GetCurrentProcessId());
    Number(record, L"threadId", GetCurrentThreadId());
    const auto now = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::system_clock::now().time_since_epoch()).count();
    Number(record, L"timestampUnixMs", static_cast<double>(now));
    auto bytes = winrt::to_string(record.Stringify()) + "\n";
    if (!m_budget.Accept(bytes.size())) {
      // Fixed terminal entry fits the budget's reserved bytes and record slot.
      WriteBytes("{\"stage\":\"trace-limit\",\"truncated\":true}\n");
      m_finished = true;
      Close();
      return;
    }
    WriteBytes(bytes);
  } catch (...) {
    // Diagnostics cannot change native input, framework deferrals or results.
    WriteBytes("{\"stage\":\"trace-error\",\"category\":\"record-unavailable\"}\n");
    m_finished = true;
    Close();
  }
}
}
