/** Rows overlapping a viewport; `end` is exclusive. */
export interface RowHeightWindow {
  readonly start: number;
  readonly end: number;
}

/**
 * Offsets for rows whose height is only known after layout. Unmeasured rows
 * count as `estimate`; each `setHeight` costs O(log n), so a list can report
 * measurements as rows mount without rebuilding every offset below them.
 */
export interface RowHeightIndex {
  readonly count: number;
  /** Returns true when the stored height or measured state changed. */
  setHeight(index: number, height: number): boolean;
  heightOf(index: number): number;
  isMeasured(index: number): boolean;
  /** Top edge of a row; `offsetOf(count)` is the total height. */
  offsetOf(index: number): number;
  totalHeight(): number;
  /** Row containing `offset`, clamped to the first and last row; -1 when empty. */
  indexAtOffset(offset: number): number;
  visibleRange(offset: number, viewportHeight: number): RowHeightWindow;
  /** Keeps measurements of surviving rows by position. */
  resize(count: number): void;
  /** Forgets every measurement. */
  reset(estimate?: number): void;
}

const checkCount = (count: number) => {
  if (!Number.isSafeInteger(count) || count < 0) throw new RangeError("Invalid row count");
};
const checkHeight = (height: number) => {
  if (!Number.isFinite(height) || height <= 0) throw new RangeError("Invalid row height");
};

export function createRowHeightIndex(count: number, estimate: number): RowHeightIndex {
  checkCount(count);
  checkHeight(estimate);
  let n = count;
  let guess = estimate;
  let heights = new Float64Array(n);
  let measured = new Uint8Array(n);
  let tree = new Float64Array(n + 1);

  const rebuild = () => {
    tree = new Float64Array(n + 1);
    for (let i = 1; i <= n; i++) {
      tree[i]! += heights[i - 1]!;
      const parent = i + (i & -i);
      if (parent <= n) tree[parent]! += tree[i]!;
    }
  };
  const fill = () => {
    heights = new Float64Array(n).fill(guess);
    measured = new Uint8Array(n);
    rebuild();
  };
  const row = (index: number) => {
    if (!Number.isSafeInteger(index) || index < 0 || index >= n) throw new RangeError("Row out of range");
  };
  const prefix = (end: number) => {
    let sum = 0;
    for (let i = end; i > 0; i -= i & -i) sum += tree[i]!;
    return sum;
  };
  fill();

  const self: RowHeightIndex = {
    get count() { return n; },
    setHeight(index, height) {
      row(index);
      checkHeight(height);
      const delta = height - heights[index]!;
      const changed = delta !== 0 || measured[index] === 0;
      measured[index] = 1;
      if (delta !== 0) {
        heights[index] = height;
        for (let i = index + 1; i <= n; i += i & -i) tree[i]! += delta;
      }
      return changed;
    },
    heightOf(index) { row(index); return heights[index]!; },
    isMeasured(index) { row(index); return measured[index] === 1; },
    offsetOf(index) {
      if (!Number.isSafeInteger(index) || index < 0 || index > n) throw new RangeError("Row out of range");
      return prefix(index);
    },
    totalHeight() { return prefix(n); },
    indexAtOffset(offset) {
      if (n === 0) return -1;
      if (!(offset > 0)) return 0;
      let pos = 0;
      let remaining = offset;
      for (let step = 2 ** Math.floor(Math.log2(n)); step > 0; step >>= 1) {
        const next = pos + step;
        if (next <= n && tree[next]! <= remaining) { pos = next; remaining -= tree[next]!; }
      }
      return Math.min(pos, n - 1);
    },
    visibleRange(offset, viewportHeight) {
      if (n === 0) return { start: 0, end: 0 };
      const bottom = Math.max(0, offset) + Math.max(0, viewportHeight);
      const start = self.indexAtOffset(offset);
      if (bottom >= self.totalHeight()) return { start, end: n };
      const at = self.indexAtOffset(bottom);
      return { start, end: Math.max(start + 1, self.offsetOf(at) === bottom ? at : at + 1) };
    },
    resize(next) {
      checkCount(next);
      const keep = Math.min(n, next);
      const oldHeights = heights;
      const oldMeasured = measured;
      n = next;
      heights = new Float64Array(n).fill(guess);
      measured = new Uint8Array(n);
      heights.set(oldHeights.subarray(0, keep));
      measured.set(oldMeasured.subarray(0, keep));
      rebuild();
    },
    reset(next) {
      if (next !== undefined) { checkHeight(next); guess = next; }
      fill();
    },
  };
  return self;
}
