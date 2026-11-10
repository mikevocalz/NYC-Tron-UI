import assert from "node:assert/strict";
import { test } from "node:test";
import { diffSurface } from "../api-surface.mjs";

test("identical surfaces produce no problems", () => {
  const s = { "@a/x": [".", "./y"] };
  assert.deepEqual(diffSurface(s, s), []);
});

test("a removed export subpath fails the check", () => {
  const problems = diffSurface({ "@a/x": [".", "./y"] }, { "@a/x": ["."] });
  assert.equal(problems.length, 1);
  assert.match(problems[0], /removed.*\.\/y/);
});

test("an added export subpath also fails until the snapshot is updated", () => {
  const problems = diffSurface({ "@a/x": ["."] }, { "@a/x": [".", "./new"] });
  assert.match(problems[0], /added.*\.\/new/);
});

test("a removed package fails the check", () => {
  const problems = diffSurface({ "@a/x": ["."], "@a/z": ["."] }, { "@a/x": ["."] });
  assert.match(problems[0], /@a\/z/);
});
