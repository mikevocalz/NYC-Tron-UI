/** A platform sample in local logical pixels. Delivered by {@link PointerBatch}. */
export interface PointerSample {
  /** Stable only for the current pointer sequence. */
  readonly pointerId: number;
  /** The actual reported device category. */
  readonly kind: 'touch' | 'pen' | 'mouse';
  readonly x: number;
  readonly y: number;
  /** Monotonic platform event time in milliseconds, never wall time. */
  readonly timestampMs: number;
  /** Normalized force, including a valid zero; null means unavailable. */
  readonly pressure: number | null;
  /** Degrees from the surface normal; null when the device provides no tilt. */
  readonly tiltX: number | null;
  readonly tiltY: number | null;
  /** Platform button mask. Do not treat pen side buttons as tip contact. */
  readonly buttons: number;
}

/** One platform event and its collected samples. See {@link createPointerRouter}. */
export interface PointerBatch {
  readonly phase: 'down' | 'move' | 'up' | 'cancel' | 'hover' | 'hover-exit';
  /** Ordered observed samples, including the current sample exactly once. */
  readonly samples: readonly PointerSample[];
  /** Temporary predictions; replaced in full on the next batch. Never persist. */
  readonly predicted: readonly PointerSample[];
}

/** Hardware keyboard observation from the input surface. */
export interface PointerKeyEvent {
  readonly phase: 'down' | 'up';
  /** Character or platform key name. Navigation and app shortcuts remain app-owned. */
  readonly key: string;
  readonly code: string;
  readonly shift: boolean;
  readonly alt: boolean;
  readonly control: boolean;
  readonly meta: boolean;
  readonly repeat: boolean;
}

/** Observed stroke samples delivered by {@link PointerRouter}. */
export interface PointerStroke {
  readonly phase: 'down' | 'move' | 'up' | 'cancel';
  readonly samples: readonly PointerSample[];
}

/** Input routing policy. The document owner supplies the callbacks. */
export interface PointerRouterOptions {
  /** One continuous stroke; begin/commit/cancel the document transaction here. */
  readonly onStroke: (stroke: PointerStroke) => void;
  /** A replacement preview, cleared before every accepted actual batch and on disposal. */
  readonly onPrediction?: (samples: readonly PointerSample[]) => void;
  readonly onHover?: (sample: PointerSample | null) => void;
  readonly onKey?: (event: PointerKeyEvent) => void;
  /** Pen input cancels an active touch stroke and rejects new touch while the pen is present. */
  readonly palmRejection?: boolean;
}

/** Explicit input lifetime created by {@link createPointerRouter}. */
export interface PointerRouter {
  handleBatch(batch: PointerBatch): void;
  handleKey(event: PointerKeyEvent): void;
  /** Cancels current work, clears hover and predictions, and permits a fresh sequence. */
  cancel(): void;
  /** Idempotent cleanup. Subsequent events are ignored. */
  dispose(): void;
}

function validSample(sample: PointerSample): boolean {
  return Number.isSafeInteger(sample.pointerId) && ['touch','pen','mouse'].includes(sample.kind)
    && [sample.x, sample.y, sample.timestampMs].every(Number.isFinite) && sample.timestampMs >= 0
    && (sample.pressure === null || Number.isFinite(sample.pressure) && sample.pressure >= 0 && sample.pressure <= 1)
    && [sample.tiltX, sample.tiltY].every(value => value === null || Number.isFinite(value) && Math.abs(value) <= 90)
    && Number.isSafeInteger(sample.buttons) && sample.buttons >= 0;
}

/**
 * Routes one active stroke, pen hover, palm rejection and hardware keys.
 * Predictions have a separate callback and never enter onStroke. Pen contact
 * preempts touch; ignored palms cannot terminate the active pen. Coordinates
 * remain local: the app's camera/document adapter owns projection.
 */
export function createPointerRouter(options: PointerRouterOptions): PointerRouter {
  let active: PointerSample | undefined;
  const penHover = new Set<number>();
  let disposed = false;
  let generation = 0;
  const clearPrediction = () => options.onPrediction?.([]);
  function cancelStroke() {
    generation++;
    const previous = active;
    active = undefined;
    clearPrediction();
    if (previous) options.onStroke({phase: 'cancel', samples: [previous]});
  }
  function cancel() {
    penHover.clear();
    cancelStroke();
    options.onHover?.(null);
  }
  return {
    handleBatch(batch) {
      if (disposed || !['down','move','up','cancel','hover','hover-exit'].includes(batch.phase)) return;
      if (!batch.samples.length || batch.samples.length > 512 || batch.predicted.length > 128) return;
      if (!batch.samples.every(validSample) || !batch.predicted.every(validSample)) return;
      const first = batch.samples[0]!;
      if (![...batch.samples, ...batch.predicted].every(point => point.pointerId === first.pointerId && point.kind === first.kind)) return;
      if (batch.samples.some((point, i) => i > 0 && point.timestampMs < batch.samples[i-1]!.timestampMs)) return;
      const last = batch.samples[batch.samples.length-1]!;
      if (first.kind === 'pen') {
        if (batch.phase === 'hover') penHover.add(first.pointerId);
        if (batch.phase === 'hover-exit' || batch.phase === 'cancel') penHover.delete(first.pointerId);
        if (options.palmRejection !== false && (batch.phase === 'down' || batch.phase === 'hover') && active?.kind === 'touch') cancelStroke();
        if (disposed) return;
      }
      if (first.kind === 'touch' && (penHover.size > 0 || active?.kind === 'pen') && options.palmRejection !== false) return;
      if (batch.phase === 'hover' || batch.phase === 'hover-exit') {
        if (!active) options.onHover?.(batch.phase === 'hover-exit' ? null : last);
        return;
      }
      if (batch.phase === 'down') {
        if (active) return;
        active = last;
      } else {
        if (!active || first.pointerId !== active.pointerId || first.kind !== active.kind) return;
        if (last.timestampMs < active.timestampMs) return;
      }
      const floor = active?.timestampMs ?? 0;
      const observed = batch.phase === 'down' ? batch.samples : batch.samples.filter(point => point.timestampMs >= floor);
      if (!observed.length) return;
      active = batch.phase === 'up' || batch.phase === 'cancel' ? undefined : last;
      const delivery = ++generation;
      clearPrediction();
      if (disposed || generation !== delivery) return;
      options.onStroke({phase: batch.phase, samples: observed});
      if (disposed || generation !== delivery || active !== last || batch.phase !== 'move') return;
      const predictions = batch.predicted.filter(point => point.timestampMs > last.timestampMs);
      if (predictions.some((point, i) => i > 0 && point.timestampMs < predictions[i-1]!.timestampMs)) return;
      if (predictions.length) options.onPrediction?.(predictions);
    },
    handleKey(event) { if (!disposed) options.onKey?.(event); },
    cancel() { if (!disposed) cancel(); },
    dispose() { if (!disposed) { disposed = true; cancel(); } },
  };
}
