// Behaviour test for the pure style helper behind Stack and Row.
// stackStyle() imports no react-native at runtime (its react-native and Stack imports are type-only and
// erased by Node's type stripping), so this runs without react-native. It does not render anything:
// the Stack and Row components themselves are checked only by the source-text tests in
// layout-primitives.test.mjs.
import test from "node:test";
import assert from "node:assert/strict";
import { stackStyle } from "../src/components/layout/stack-style.ts";
import { space } from "../src/tokens.ts";

test("defaults to gap 2 and sets only direction and gap", () => {
  assert.deepEqual(stackStyle("column", {}), { flexDirection: "column", gap: space[2] });
  assert.deepEqual(stackStyle("row", {}), { flexDirection: "row", gap: space[2] });
});

test("every space key resolves to its token value for gap, padding, paddingX and paddingY", () => {
  for (const key of Object.keys(space)) {
    const k = Number(key);
    const s = stackStyle("column", { gap: k, padding: k, paddingX: k, paddingY: k });
    assert.equal(s.gap, space[k], `gap ${key}`);
    assert.equal(s.padding, space[k], `padding ${key}`);
    assert.equal(s.paddingHorizontal, space[k], `paddingX ${key}`);
    assert.equal(s.paddingVertical, space[k], `paddingY ${key}`);
  }
});

test("a zero value is kept, not dropped as falsy", () => {
  const s = stackStyle("row", { gap: 0, padding: 0, paddingX: 0, paddingY: 0 });
  assert.equal(s.gap, 0);
  assert.equal(s.padding, 0);
  assert.equal(s.paddingHorizontal, 0);
  assert.equal(s.paddingVertical, 0);
});

test("unset optional props add no keys", () => {
  const s = stackStyle("column", { gap: 1 });
  assert.deepEqual(Object.keys(s).sort(), ["flexDirection", "gap"]);
});

test("align, justify and wrap map to flexbox properties", () => {
  const s = stackStyle("row", { align: "center", justify: "space-between", wrap: true });
  assert.equal(s.alignItems, "center");
  assert.equal(s.justifyContent, "space-between");
  assert.equal(s.flexWrap, "wrap");
  assert.equal(stackStyle("row", { wrap: false }).flexWrap, undefined);
  assert.equal(stackStyle("row", {}).flexWrap, undefined);
});

test("does not mutate its input and returns a fresh object each call", () => {
  const input = Object.freeze({ gap: 3, padding: 2 });
  const a = stackStyle("column", input);
  const b = stackStyle("column", input);
  assert.notStrictEqual(a, b);
  assert.deepEqual(a, b);
});
