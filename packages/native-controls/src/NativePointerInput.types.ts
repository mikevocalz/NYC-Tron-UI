import type {PointerBatch, PointerKeyEvent} from './pointer-input.js';

/** Transparent native input layer. Place it over the app's drawing surface. */
export interface NativePointerInputProps {
  readonly width: number;
  readonly height: number;
  readonly label: string;
  /** Replaces the whole input batch; use createPointerRouter for palm policy. */
  readonly onBatch: (batch: PointerBatch) => void;
  readonly onKey?: (event: PointerKeyEvent) => void;
}
