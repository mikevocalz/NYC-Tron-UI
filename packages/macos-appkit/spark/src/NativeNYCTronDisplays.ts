import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  readDisplays(): Promise<string>;
  /**
   * JSON `{ leading, trailing, height }` in points, measured from the real
   * NSWindow standard button frames. `windowId` is the Spark window ID;
   * `main` resolves to the host-created `spark.main` window. Rejects with
   * `E_WINDOW_NOT_FOUND` when no such window exists.
   */
  readTitleBarInsets(windowId: string): Promise<string>;
}
export default TurboModuleRegistry.get<Spec>('NativeNYCTronDisplays');
