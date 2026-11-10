import test from "node:test";
import assert from "node:assert/strict";
import { createWindowsNavigationBinding, navigationBindingOwner } from "../dist/navigation-binding.js";

test("focus requests belong only to the current mounted native host", () => {
  const binding = createWindowsNavigationBinding(), owner = navigationBindingOwner(binding), calls = [];
  assert.equal(binding.focusSettings(), false);
  const token = {};
  const detachFirst = owner.attach(token, target => { calls.push(["old", target]); return true; });
  assert.equal(binding.focusSettings(), true);
  detachFirst();
  assert.equal(binding.focusSelected(), false);
  const detachSecond = owner.attach(token, target => { calls.push(["new", target]); return true; });
  detachFirst();
  assert.equal(binding.focusSelected(), true);
  assert.deepEqual(calls, [["old", "settings"], ["new", "selected"]]);
  detachSecond();
  assert.equal(binding.focusSettings(), false);
  binding.dispose();
  assert.throws(() => binding.focusSelected(), /disposed/);
});
