import type {ReactNode} from "react";
import {Pressable,Text,View,type ViewProps} from "react-native";
import type {CommandMenuItem} from "../overlays/CommandPopover.tsx";
import type {Rect2D} from "../overlays/popover-position.ts";
import {joinClasses} from "../styles.ts";
import {MenuButton} from "./MenuButton.tsx";

/** Props for {@linkcode SplitButton}. */
export interface SplitButtonProps extends Omit<ViewProps,"children"> {
  /** Text of the primary action, e.g. "Export". */
  label:string;
  onPress:()=>void;
  /** Related actions in the flyout. */
  items:readonly CommandMenuItem[];
  onSelect:(id:string)=>void;
  /** Accessible name of the flyout button. @default "More <label> options" */
  menuLabel?:string;
  icon?:ReactNode;
  /** @default "secondary" */
  variant?:"primary"|"secondary";
  disabled?:boolean;
  /** Window-space regions the flyout may use. @default the whole window */
  usableRegions?:readonly Rect2D[];
  className?:string;
  unstyled?:boolean;
}

/**
 * A primary action with a separate flyout of related actions. The two parts
 * are separate 44pt hit targets and separate buttons for keyboards and
 * screen readers, so the primary action never opens the menu by accident.
 */
export function SplitButton({
  label,onPress,items,onSelect,menuLabel,icon,variant="secondary",disabled=false,usableRegions,
  className,unstyled=false,style,...rest
}:SplitButtonProps){
  const styled=!unstyled;
  const primary=variant==="primary";
  const ink=joinClasses(styled&&"text-sm font-semibold",styled&&(primary?"text-on-primary":"text-text"));
  const chevron=joinClasses(styled&&(primary?"border-on-primary":"border-text"));
  const hover=joinClasses(styled&&!primary&&"hover:bg-surface-sunken");
  // One rounded, bordered container clips both halves; a hairline divides them.
  return <View {...rest} {...{role:"group",className:joinClasses("flex-row self-start overflow-hidden",
    styled&&"rounded-control border",styled&&(primary?"border-primary bg-primary":"border-border bg-surface-raised"),className)}}
    accessibilityLabel={label} style={[{opacity:disabled?0.5:1},style]}>
    <Pressable accessibilityRole="button" accessibilityLabel={label} disabled={disabled} onPress={onPress}
      {...{className:joinClasses("min-h-11 min-w-11 flex-row items-center gap-2 px-3",hover,
        styled&&"focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus")}}>
      {icon?<View pointerEvents="none">{icon}</View>:null}
      <Text numberOfLines={1} {...{className:ink}}>{label}</Text>
    </Pressable>
    <View pointerEvents="none" {...{className:joinClasses(styled&&(primary?"border-on-primary":"border-border"))}}
      style={{width:0,borderLeftWidth:1,opacity:primary?0.4:1}}/>
    <MenuButton label={menuLabel??`More ${label} options`} items={items} onSelect={onSelect} disabled={disabled}
      usableRegions={usableRegions} unstyled
      {...{className:joinClasses(hover,styled&&"focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus")}}>
      <View pointerEvents="none" {...{className:chevron}}
        style={{width:8,height:8,borderRightWidth:1.5,borderBottomWidth:1.5,transform:[{rotate:"45deg"}],marginTop:-4}}/>
    </MenuButton>
  </View>;
}
