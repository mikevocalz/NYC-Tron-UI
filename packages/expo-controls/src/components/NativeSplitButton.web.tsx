import { SplitButton } from "@nyc-tron/ui/components/shell/SplitButton";
import type { NativeSplitButtonProps } from "./NativeSplitButton.types.ts";
import { enabledMenuLeaves, normalizeMenuActions } from "./menu-model.ts";
export type { NativeSplitButtonProps } from "./NativeSplitButton.types.ts";

/** Web: the token-styled {@linkcode SplitButton} from `@nyc-tron/ui`. */
export function NativeSplitButton({label,onPress,actions,onAction,menuLabel,disabled,testID}:NativeSplitButtonProps){
  normalizeMenuActions(actions);
  const items=enabledMenuLeaves(actions).map(a=>({id:a.id,label:a.title,danger:a.destructive}));
  return <SplitButton label={label} onPress={onPress} items={items} onSelect={onAction}
    menuLabel={menuLabel} disabled={disabled} testID={testID}/>;
}
