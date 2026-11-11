#pragma once

#include <cmath>
#include <limits>
#include <stdexcept>

namespace nyctron::islands {

struct LayoutOrigin {
  float x, y, scale;
};
struct LayoutTranslation {
  float x, y;
};

// RNW 0.85 writes its island transform before committing this view's new
// metrics. Keep the ancestor/scroll offset from that freshly written transform
// and replace only the old view-origin contribution after the layout event.
// Its existing physical-pixel quantization is retained; no delta is cached.
inline LayoutTranslation UpdateLayoutTranslation(
    LayoutTranslation const& previousTransform,
    LayoutOrigin const& previous,
    LayoutOrigin const& current) {
  if (!std::isfinite(previousTransform.x) || !std::isfinite(previousTransform.y) ||
      !std::isfinite(previous.x) || !std::isfinite(previous.y) ||
      !std::isfinite(current.x) || !std::isfinite(current.y) ||
      !std::isfinite(previous.scale) || previous.scale <= 0 ||
      !std::isfinite(current.scale) || current.scale <= 0) {
    throw std::invalid_argument("Island layout requires finite coordinates and positive scales");
  }
  const auto axis = [&](float transform, float oldOrigin, float newOrigin) {
    const double ancestorPixels = static_cast<double>(transform) * previous.scale -
        static_cast<double>(oldOrigin) * previous.scale;
    const double result = (ancestorPixels +
        static_cast<double>(newOrigin) * current.scale) / current.scale;
    if (!std::isfinite(result) || std::abs(result) > std::numeric_limits<float>::max()) {
      throw std::invalid_argument("Island layout translation overflow");
    }
    return static_cast<float>(result);
  };
  return {axis(previousTransform.x, previous.x, current.x),
          axis(previousTransform.y, previous.y, current.y)};
}

} // namespace nyctron::islands
