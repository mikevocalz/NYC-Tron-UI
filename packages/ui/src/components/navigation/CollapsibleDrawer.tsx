import { useEffect, type ReactNode } from "react";
import {
  BackHandler, Pressable, ScrollView, Text, View, type ViewProps,
} from "react-native";
import { drawerGeometry, type DrawerMode } from "./drawer-model";
import { joinClasses } from "../styles";

export interface DrawerDestination {
  readonly id: string;
  readonly label: string;
  readonly icon?: ReactNode;
  readonly disabled?: boolean;
}
export interface CollapsibleDrawerProps extends Omit<ViewProps,"children"> {
  readonly children: ReactNode;
  readonly mode: DrawerMode;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly items: readonly DrawerDestination[];
  readonly footerItems?: readonly DrawerDestination[];
  readonly selectedId: string | null;
  readonly onSelectionChange: (id: string) => void;
  readonly title?: string;
  readonly expandedWidth?: number;
  readonly compactWidth?: number;
  readonly className?: string;
  readonly paneClassName?: string;
  readonly itemClassName?: string;
  readonly selectedItemClassName?: string;
  readonly contentClassName?: string;
  readonly unstyled?: boolean;
}
/**
 * Portable RN presentation for left-side native navigation. App keeps its
 * route in Expo Router/other router; this component owns no navigation stack.
 *
 * A genuine WinUI 3 adapter must replace only this pane's renderer, keeping
 * the controlled selection/open API. RNW Fabric/WinUI builds are not implied.
 */
export function CollapsibleDrawer({
  children, mode, open, onOpenChange, items, footerItems = [],
  selectedId, onSelectionChange, title, expandedWidth, compactWidth,
  className, paneClassName, itemClassName, selectedItemClassName,
  contentClassName, unstyled = false, style, ...rest
}: CollapsibleDrawerProps) {
  const pane = drawerGeometry({ mode, open, expandedWidth, compactWidth });
  useEffect(() => {
    if (!pane.overlay) return;
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      onOpenChange(false);
      return true;
    });
    return () => subscription.remove();
  }, [pane.overlay, onOpenChange]);

  const activate = (item: DrawerDestination) => {
    if (item.disabled) return;
    onSelectionChange(item.id);
    if (pane.overlay) onOpenChange(false);
  };
  const showToggle = mode !== "expanded";
  const toggle = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={pane.overlay ? "Close navigation" : "Open navigation"}
      accessibilityState={{ expanded: pane.overlay }}
      onPress={() => onOpenChange(!open)}
      {...{ className: joinClasses(
        "h-12 w-12 items-center justify-center",
        !unstyled && "rounded-control", itemClassName,
      ) }}
    >
      <Text aria-hidden style={{ fontSize: 22 }}>☰</Text>
    </Pressable>
  );
  const renderItems = (group: readonly DrawerDestination[]) =>
    group.map(item => {
      const selected = item.id === selectedId;
      return (
        <Pressable key={item.id}
          accessibilityRole="button"
          accessibilityLabel={item.label}
          accessibilityState={{ selected, disabled: !!item.disabled }}
          disabled={item.disabled}
          onPress={() => activate(item)}
          {...{ className: joinClasses(
            "flex-row items-center min-h-11 gap-3 px-3",
            !unstyled && "rounded-control",
            selected && !unstyled && "bg-primary",
            selected && selectedItemClassName, itemClassName,
            item.disabled && "opacity-40",
          ) }}
        >
          <View style={{ width: 36, alignItems: "center" }}
            accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            {item.icon ?? <Text>{item.label.slice(0, 1).toUpperCase()}</Text>}
          </View>
          {pane.showLabels ? (
            <Text numberOfLines={1} style={{ flex: 1 }}
              {...{ className: joinClasses(
                "text-sm", !unstyled && (selected ? "text-on-primary" : "text-text"),
              ) }}>
              {item.label}
            </Text>
          ) : null}
        </Pressable>
      );
    });

  return (
    <View {...rest}
      {...{ className: joinClasses("flex-1", className) }}
      // Preserve physical LEFT even in an RTL language. Child text direction
      // and reading order remain the app's own responsibility.
      style={[{ flex: 1, direction: "ltr", position: "relative" }, style]}
    >
      <View {...{ className: joinClasses("flex-1", contentClassName) }}
        style={{ marginLeft: pane.contentInsetLeft, minWidth: 0 }}>
        {children}
      </View>
      {pane.scrim ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close navigation menu"
          onPress={() => onOpenChange(false)}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0,
            zIndex: 2, backgroundColor: "rgba(0,0,0,0.25)" }}
        />
      ) : null}
      <View
        pointerEvents={pane.showPane ? "auto" : "none"}
        accessibilityElementsHidden={!pane.showPane}
        importantForAccessibility={pane.showPane ? "auto" : "no-hide-descendants"}
        {...{ className: joinClasses(
          "flex-col", !unstyled && "bg-surface-raised border-r border-border",
          paneClassName,
        ) }}
        style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: pane.paneWidth, display: pane.showPane ? "flex" : "none",
          zIndex: 3,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", minHeight: 56 }}>
          {showToggle ? toggle : null}
          {pane.showLabels && title ? (
            <Text numberOfLines={1} style={{ fontWeight: "700", flexShrink: 1 }}>
              {title}
            </Text>
          ) : null}
        </View>
        <ScrollView
          accessibilityLabel="Navigation destinations"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ gap: 4, paddingHorizontal: 6, paddingVertical: 8 }}
        >
          {renderItems(items)}
        </ScrollView>
        {footerItems.length ? (
          <View
            accessibilityLabel="Navigation footer"
            style={{ paddingHorizontal: 6, paddingVertical: 8 }}
          >{renderItems(footerItems)}</View>
        ) : null}
      </View>
      {mode === "minimal" && !open ? (
        <View style={{ position: "absolute", left: 0, top: 0, zIndex: 3 }}>
          {toggle}
        </View>
      ) : null}
    </View>
  );
}
