import {useStore} from "zustand";
import type {Haptics} from "./haptics.ts";

/**
 * The person's haptics choice and its setter, for a settings row:
 * `const [on, setOn] = useHapticsEnabled(haptics)` bound to the app's Switch.
 */
export function useHapticsEnabled(haptics:Haptics):readonly [boolean,(enabled:boolean)=>void]{
  const enabled=useStore(haptics.store,s=>s.enabled);
  return [enabled,haptics.setEnabled] as const;
}
