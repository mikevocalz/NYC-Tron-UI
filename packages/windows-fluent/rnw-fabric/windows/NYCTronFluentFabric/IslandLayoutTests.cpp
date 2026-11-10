#include "IslandLayout.h"
#include <cassert>
#include <iostream>
#include <limits>

using nyctron::islands::LayoutOrigin;
using nyctron::islands::LayoutTranslation;
using nyctron::islands::UpdateLayoutTranslation;

static void Near(float actual, float expected) {
  assert(std::abs(actual - expected) < 0.0001f);
}

static void Reject(LayoutTranslation transform, LayoutOrigin previous, LayoutOrigin current) {
  bool rejected = false;
  try { static_cast<void>(UpdateLayoutTranslation(transform, previous, current)); }
  catch (std::invalid_argument const&) { rejected = true; }
  assert(rejected);
}

int main() {
  // Original d17: the native source's reported top was 266 screen pixels,
  // while its painted top was 311 after the stage buttons wrapped by one row.
  // The HWND client origin is 31; the live source's own origin moved 235->280.
  const auto wrapped = UpdateLayoutTranslation({64, 235}, {64, 235, 1}, {64, 280, 1});
  Near(wrapped.x + 8, 72);
  Near(wrapped.y + 31, 311);
  Near(wrapped.y + 31 + 28, 339); // Real button center, not the earlier phase text.

  // Parent scrolling is already present in RNW's fresh pre-layout matrix.
  // Preserve its -33 physical-pixel offset at 125% instead of summing ancestors.
  const auto scrolled = UpdateLayoutTranslation({56, 56}, {82.4f, 82.4f, 1.25f}, {105.6f, 105.6f, 1.25f});
  Near(scrolled.x, 79.2f);
  Near(scrolled.y, 79.2f);

  // A DPI transition must normalize the already-current parent physical offset.
  // Here that offset is (500, -40), independent of the old view's 100% scale.
  const auto scaled = UpdateLayoutTranslation({510, -20}, {10, 20, 1}, {10, 20, 2});
  Near(scaled.x, 260);
  Near(scaled.y, 0);
  const auto movedAndScaled = UpdateLayoutTranslation({510, -20}, {10, 20, 1}, {30, -10, 2});
  Near(movedAndScaled.x, 280);
  Near(movedAndScaled.y, -30);

  // No cached delta survives a later event or a replacement native connection.
  // A later parent scroll supplies a new baseline; use that exact baseline.
  const auto later = UpdateLayoutTranslation({-12, 8}, {10, 20, 2}, {15, 10, 2});
  Near(later.x, -7);
  Near(later.y, -2);
  const auto unchanged = UpdateLayoutTranslation({-12, 8}, {10, 20, 2}, {10, 20, 2});
  Near(unchanged.x, -12);
  Near(unchanged.y, 8);

  // RNW truncates its pre-layout physical coordinate to LONG. Keep that existing
  // quantization; this helper cannot recover a discarded fractional parent pixel.
  const auto quantized = UpdateLayoutTranslation({12, 12}, {12.25f, 12.25f, 1}, {40.25f, 40.25f, 1});
  Near(quantized.x, 40);
  Near(quantized.y, 40);

  const auto infinity = std::numeric_limits<float>::infinity();
  Reject({0, 0}, {0, 0, 0}, {0, 0, 1});
  Reject({0, 0}, {0, 0, 1}, {0, 0, -1});
  Reject({infinity, 0}, {0, 0, 1}, {0, 0, 1});
  Reject({0, 0}, {0, 0, 1}, {0, 0, infinity});
  Reject({std::numeric_limits<float>::max(), 0}, {0, 0, 2}, {0, 0, 0.5f});
  std::cout << "island layout regressions passed: observed wrap, scroll, DPI, new baseline, quantization, invalid inputs\n";
}
