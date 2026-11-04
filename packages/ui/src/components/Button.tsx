import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, Text, View, type PressableProps } from "react-native";
import { joinClasses } from "./styles.ts";

/**
 * Brand-neutral accessible press control. Native Chrome/Fluent/SwiftUI
 * wrappers are separate future adapters; this base is an RN presentational
 * component and does not pretend to be AppKit/WinUI.
 *
 * The consumer owns its --color-* / --radius-* / --shadow-* Tailwind values.
 */
export type ButtonVariant="primary"|"secondary"|"ghost"|"danger";
export type ButtonSize="sm"|"md"|"lg";
export interface ButtonProps extends Omit<PressableProps,"children"|"disabled"> {
  title:string;
  icon?:ReactNode;
  variant?:ButtonVariant;
  size?:ButtonSize;
  disabled?:boolean;
  loading?:boolean;
  className?:string;
  /** Complete visual override: app supplies its own Tailwind recipe. */
  unstyled?:boolean;
  labelClassName?:string;
  iconClassName?:string;
}
const variants:Record<ButtonVariant,{root:string;label:string}>={
 primary:{root:"bg-primary border-border text-on-primary",label:"text-on-primary"},
 secondary:{root:"bg-surface-raised border-border",label:"text-text"},
 ghost:{root:"bg-transparent border-transparent",label:"text-text"},
 danger:{root:"bg-danger border-danger",label:"text-on-danger"}
};
const sizes:Record<ButtonSize,string>={
 sm:"min-h-10 gap-2 px-3 py-2",
 md:"min-h-11 gap-2 px-4 py-2.5",
 lg:"min-h-12 gap-3 px-5 py-3"
};
export function Button({
  title,icon,variant="primary",size="md",disabled=false,loading=false,
  className,unstyled=false,labelClassName,iconClassName,onPress,style,...rest
}:ButtonProps) {
  const off=disabled||loading;
  const selected=variants[variant];
  return (
    <Pressable
      {...rest}
      {...{className:joinClasses(
        "flex-row items-center justify-center",
        !unstyled&&"rounded-control border active:opacity-80 focus-visible:ring-2 focus-visible:ring-focus motion-reduce:transition-none",
        !unstyled&&sizes[size],!unstyled&&selected.root,
        off&&"opacity-50",className
      )}}
      style={style}
      disabled={off}
      accessibilityRole="button"
      accessibilityLabel={rest.accessibilityLabel??title}
      accessibilityState={{...rest.accessibilityState,disabled:off,busy:loading}}
      onPress={onPress}
    >
      {loading ? <ActivityIndicator accessibilityLabel="Loading" /> : null}
      {icon ? <View {...{className:joinClasses("items-center justify-center",iconClassName)}}>{icon}</View> : null}
      <Text {...{className:joinClasses(!unstyled&&"font-semibold",!unstyled&&selected.label,labelClassName)}}>{title}</Text>
    </Pressable>
  );
}
