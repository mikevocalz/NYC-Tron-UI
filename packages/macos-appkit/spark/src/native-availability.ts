import { Platform } from 'react-native';
import type { Availability } from '@legendapp/spark/contracts';

/** No RN fallback is advertised as AppKit. Render an app-owned error boundary. */
export function requireAppKit(kind: string, availability: Availability): void {
  if (Platform.OS !== 'macos' || !availability.available) {
    throw new Error(`${kind} requires the isolated Spark 0.0.3 macOS native host (${availability.available ? 'unsupported-platform' : availability.reason}).`);
  }
}
