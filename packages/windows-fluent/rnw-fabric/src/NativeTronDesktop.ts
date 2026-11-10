import type { TurboModule, CodegenTypes } from "react-native";
import { TurboModuleRegistry } from "react-native";

/** Internal generated RNW protocol. Public callers use the window host. */
export interface Spec extends TurboModule {
  connect(primaryWindowId: string, componentName: string): Promise<string>;
  read(ownerToken: string): Promise<string>;
  open(ownerToken: string, request: string): Promise<string>;
  move(ownerToken: string, id: string, request: string): Promise<string>;
  focus(ownerToken: string, id: string): Promise<string>;
  minimize(ownerToken: string, id: string): Promise<string>;
  restore(ownerToken: string, id: string): Promise<string>;
  requestClose(ownerToken: string, id: string): Promise<string>;
  resolveClose(ownerToken: string, id: string, generation: string, token: string, accepted: boolean): Promise<string>;
  dispose(ownerToken: string): Promise<void>;
  readonly onSnapshot: CodegenTypes.EventEmitter<string>;
  readonly onError: CodegenTypes.EventEmitter<string>;
  startNativeDrag(ownerToken: string, sourceId: string, token: string, requestId: string): Promise<string>;
  resolveNativeDrop(ownerToken: string, token: string, requestId: string, accepted: boolean): Promise<boolean>;
  cancelNativeDrag(ownerToken: string, requestOrToken: string): Promise<void>;
  readonly onNativeDrag: CodegenTypes.EventEmitter<string>;
}
export default TurboModuleRegistry.getEnforcing<Spec>("TronDesktop");
