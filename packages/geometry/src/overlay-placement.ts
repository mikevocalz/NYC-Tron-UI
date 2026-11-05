// Adapted from Floating UI computeCoordsFromPlacement (MIT).
// Copyright (c) 2021 Floating UI contributors.
// Source: floating-ui/floating-ui packages/core/src/computeCoordsFromPlacement.ts
// blob 43f6767bdcce4f791057e7a8bcb28f3207cd442c at commit e1e9f88993c19426563decfcc991feb706f1ac66
// Modifications: standalone types, inlined axis helpers and input validation.
export type Placement = `${'top' | 'bottom' | 'left' | 'right'}${'' | '-start' | '-end'}`;
export interface Rect { x: number; y: number; width: number; height: number }

/** Position only; the host owns clipping, focus, portals and native windows. */
export function computeOverlayPlacement(reference: Rect, floating: Pick<Rect, 'width' | 'height'>, placement: Placement, rtl = false): { x: number; y: number } {
  if (!/^(top|bottom|left|right)(-(start|end))?$/.test(placement)) throw new RangeError('Invalid placement');
  for (const value of [reference.x, reference.y, reference.width, reference.height, floating.width, floating.height]) {
    if (!Number.isFinite(value)) throw new RangeError('Geometry must be finite');
  }
  if (reference.width < 0 || reference.height < 0 || floating.width < 0 || floating.height < 0) throw new RangeError('Dimensions must be nonnegative');
  const [side, alignment] = placement.split('-');
  const vertical = side === 'top' || side === 'bottom';
  const sideAxis = vertical ? 'y' : 'x';
  const alignmentAxis = vertical ? 'x' : 'y';
  const sideLength = vertical ? 'height' : 'width';
  const alignLength = vertical ? 'width' : 'height';
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  const result = { x: 0, y: 0 };
  result[sideAxis] = side === 'top' || side === 'left'
    ? reference[sideAxis] - floating[sideLength]
    : reference[sideAxis] + reference[sideLength];
  result[alignmentAxis] = reference[alignmentAxis] + commonAlign +
    (alignment ? commonAlign * (alignment === 'end' ? 1 : -1) * (rtl && vertical ? -1 : 1) : 0);
  if (!Number.isFinite(result.x) || !Number.isFinite(result.y)) throw new RangeError('Geometry overflow');
  return result;
}
