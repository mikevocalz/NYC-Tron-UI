import type { ReactNode } from "react";
import { Platform, Text, View, type ViewProps } from "react-native";
import { joinClasses } from "./styles.ts";

export interface FieldGroupProps extends Omit<ViewProps,"children"> {
  children?:ReactNode;
  className?:string;
}
export interface FieldSectionProps extends Omit<ViewProps,"children"|"role"> {
  /** Section heading; also names the group for assistive tech. */
  title?:string;
  /** Optional line under the fields: a constraint or consequence. */
  footer?:string;
  children?:ReactNode;
  /** Uppercase the title. Default false. */
  titleUppercase?:boolean;
  className?:string;
  titleClassName?:string;
  bodyClassName?:string;
  unstyled?:boolean;
}

function FieldGroupRoot({children,className,...rest}:FieldGroupProps){
  return <View {...rest} {...{className:joinClasses("w-full min-w-0 gap-4",className)}}>{children}</View>;
}

/**
 * A titled block of related fields on a raised surface. The title is a level
 * 3 heading and names the group, so a screen reader announces "Document
 * details, group" when focus enters a field inside it.
 */
function FieldSection({
  title,footer,children,titleUppercase=false,className,titleClassName,bodyClassName,unstyled=false,...rest
}:FieldSectionProps){
  const styled=!unstyled;
  return <View {...rest} role="group" aria-label={title}
    {...{className:joinClasses("w-full min-w-0",
      styled&&"overflow-hidden rounded-control border border-border bg-surface-raised",className)}}>
    {title?<View {...{className:joinClasses(styled&&"border-b border-border px-3 py-2.5")}}>
      <Text accessibilityRole="header" {...(Platform.OS==="web"?{"aria-level":3}:{})}
        {...{className:joinClasses(styled&&"text-sm font-semibold text-text",
          titleUppercase&&"uppercase tracking-wide",titleClassName)}}>{title}</Text>
    </View>:null}
    <View {...{className:joinClasses("gap-3",styled&&"p-3",bodyClassName)}}>{children}</View>
    {footer?<Text {...{className:joinClasses(styled&&"px-3 pb-3 text-sm text-text-muted")}}>{footer}</Text>:null}
  </View>;
}

/** `FieldGroup` stacks sections; `FieldGroup.Section` is one titled block. */
export const FieldGroup=Object.assign(FieldGroupRoot,{Section:FieldSection});
export { FieldSection };
