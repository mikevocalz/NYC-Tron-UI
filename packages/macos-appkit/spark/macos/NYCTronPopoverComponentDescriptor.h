#pragma once

#include <react/renderer/components/NYCTronAppKitSpec/ShadowNodes.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>
#ifdef RN_SERIALIZABLE_STATE
#include <folly/dynamic.h>
#endif

namespace facebook::react {

// Fabric keeps the same surface and event targets. This state describes only
// the detached AppKit window's coordinate space, including its native chrome.
class NYCTronPopoverRootStateData final {
 public:
  NYCTronPopoverRootStateData() = default;
  NYCTronPopoverRootStateData(Point origin, Size size) : contentOrigin(origin), viewportSize(size) {}
  Point contentOrigin{};
  Size viewportSize{};

#ifdef RN_SERIALIZABLE_STATE
  NYCTronPopoverRootStateData(const NYCTronPopoverRootStateData &, folly::dynamic data)
      : contentOrigin{(Float)data["contentX"].getDouble(), (Float)data["contentY"].getDouble()},
        viewportSize{(Float)data["viewportWidth"].getDouble(), (Float)data["viewportHeight"].getDouble()} {}
  folly::dynamic getDynamic() const {
    return folly::dynamic::object("contentX", contentOrigin.x)("contentY", contentOrigin.y)
        ("viewportWidth", viewportSize.width)("viewportHeight", viewportSize.height);
  }
#endif
};

class NYCTronPopoverRootShadowNode final : public ConcreteViewShadowNode<
    NYCTronPopoverComponentName, NYCTronPopoverProps, NYCTronPopoverEventEmitter, NYCTronPopoverRootStateData> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;
  static ShadowNodeTraits BaseTraits() {
    auto traits = ConcreteViewShadowNode::BaseTraits();
    // The same measurement boundary used by RN's ModalHostViewShadowNode:
    // DOM::measure must stop at this window, not the old native ancestors.
    traits.set(ShadowNodeTraits::Trait::RootNodeKind);
    traits.set(ShadowNodeTraits::Trait::Unstable_uncullableView);
    return traits;
  }
};

class NYCTronPopoverRootComponentDescriptor final : public ConcreteComponentDescriptor<NYCTronPopoverRootShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;
  void adopt(ShadowNode &shadowNode) const override {
    auto &node = static_cast<NYCTronPopoverRootShadowNode &>(shadowNode);
    const auto &state = node.getStateData();
    const auto &props = node.getConcreteProps();
    node.setSize(state.viewportSize.width > 0 && state.viewportSize.height > 0
        ? state.viewportSize : Size{props.popupWidth, props.popupHeight});
    node.setPositionType(YGPositionTypeAbsolute);
    RectangleEdges<Float> padding{};
    padding.left = state.contentOrigin.x;
    padding.top = state.contentOrigin.y;
    node.setPadding(padding);
    ConcreteComponentDescriptor::adopt(shadowNode);
  }
};

} // namespace facebook::react
