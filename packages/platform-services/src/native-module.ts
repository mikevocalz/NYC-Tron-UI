// Finds an Expo Modules 2 module by name. Android SDK 58 exposes v2 modules
// on globalThis.expoV2.modules; the Swift @ExpoModule is reachable through
// requireOptionalNativeModule. Not linked -> null, never a throw.
import {requireOptionalNativeModule} from "expo";

interface ExpoModulesV2Global {
  expoV2?:{modules?:Record<string,unknown>};
}

/** The native module registered as `name`, or null when this binary does not link it. */
export function findNativeModule<T>(name:string):T|null{
  const v2=(globalThis as typeof globalThis&ExpoModulesV2Global).expoV2?.modules?.[name] as T|undefined;
  return v2??requireOptionalNativeModule<T>(name)??null;
}

/** Cleanup handle for a native event listener. */
export interface Subscription {
  remove():void;
}
