import test from "node:test";
import assert from "node:assert/strict";
// Exercise the peer-free owner directly so source tests do not depend on dist.
import {
  MAX_WINDOWS,
  createWindowRegistry,
  openWindow,
  focusWindow,
  closeWindow,
  minimizeWindow,
  restoreWindow,
  moveWindow,
  beginDrag,
  dragOver,
  dropDrag,
  resolveDrop,
  cancelDrag,
  snapshotLayout,
  parseLayoutSnapshot,
  restoreLayout,
  reflowWindows,
  reservedFromFolds,
} from "../src/window-lifecycle.ts";

const R = (x, y, width, height) => ({ x, y, width, height });
const D1 = { id: "d1", bounds: R(0, 0, 1000, 800), primary: true };
const D2 = { id: "d2", bounds: R(1000, 0, 1000, 800) };

function withWindows(...ids) {
  let state = createWindowRegistry();
  for (const id of ids) {
    const out = openWindow(state, { id, displayId: "d1", rect: R(10, 10, 200, 150) });
    assert.equal(out.ok, true, `open ${id}`);
    state = out.state;
  }
  return state;
}
const ids = state => state.windows.map(w => w.id);
const get = (state, id) => state.windows.find(w => w.id === id);

// Registry -------------------------------------------------------------

test("open adds a window on top and focuses it", () => {
  const state = withWindows("a", "b");
  assert.deepEqual(ids(state), ["a", "b"]);
  assert.equal(state.focusedId, "b");
  assert.equal(get(state, "a").status, "open");
});

test("duplicate ids are rejected without changing state, even when minimized", () => {
  let state = withWindows("a");
  state = minimizeWindow(state, "a").state;
  const out = openWindow(state, { id: "a", displayId: "d1", rect: R(0, 0, 10, 10) });
  assert.equal(out.ok, false);
  assert.equal(out.reason, "duplicate-id");
  assert.equal(out.state, state);
});

test("invalid ids, rects, display ids and the window budget are rejected", () => {
  const state = createWindowRegistry();
  const spec = over => ({ id: "a", displayId: "d1", rect: R(0, 0, 10, 10), ...over });
  assert.equal(openWindow(state, spec({ id: "" })).reason, "invalid-id");
  assert.equal(openWindow(state, spec({ id: "   " })).reason, "invalid-id");
  assert.equal(openWindow(state, spec({ id: "x".repeat(257) })).reason, "invalid-id");
  assert.equal(openWindow(state, spec({ id: 5 })).reason, "invalid-id");
  assert.equal(openWindow(state, spec({ id: undefined })).reason, "invalid-id");
  assert.equal(openWindow(state, spec({ displayId: "" })).reason, "invalid-id");
  assert.equal(openWindow(state, spec({ rect: R(0, 0, 0, 10) })).reason, "invalid-rect");
  assert.equal(openWindow(state, spec({ rect: R(NaN, 0, 10, 10) })).reason, "invalid-rect");
  assert.equal(openWindow(state, spec({ rect: R(0, 0, Infinity, 10) })).reason, "invalid-rect");
  assert.equal(openWindow(state, spec({ rect: null })).reason, "invalid-rect");
  let full = state;
  for (let i = 0; i < MAX_WINDOWS; i++) full = openWindow(full, spec({ id: `w${i}` })).state;
  assert.equal(full.windows.length, MAX_WINDOWS);
  assert.equal(openWindow(full, spec({ id: "extra" })).reason, "budget");
});

test("unicode, emoji and SQL-looking ids are opaque strings", () => {
  const odd = ["窗口", "🪟-1", "a'; DROP TABLE windows;--", "‮evil"];
  let state = createWindowRegistry();
  for (const id of odd) state = openWindow(state, { id, displayId: "d1", rect: R(0, 0, 5, 5) }).state;
  assert.deepEqual(ids(state), odd);
});

test("focus raises a window; unknown and minimized windows are rejected", () => {
  let state = withWindows("a", "b", "c");
  const out = focusWindow(state, "a");
  assert.equal(out.ok, true);
  assert.deepEqual(ids(out.state), ["b", "c", "a"]);
  assert.equal(out.state.focusedId, "a");
  assert.equal(focusWindow(state, "nope").reason, "unknown-window");
  state = minimizeWindow(state, "b").state;
  const rejected = focusWindow(state, "b");
  assert.equal(rejected.reason, "minimized");
  assert.equal(rejected.state, state);
});

test("closing the focused window focuses the topmost open window", () => {
  let state = withWindows("a", "b", "c");
  state = minimizeWindow(state, "b").state; // focus falls to c
  assert.equal(state.focusedId, "c");
  state = closeWindow(state, "c").state;
  assert.equal(state.focusedId, "a", "skips minimized b");
  state = closeWindow(state, "a").state;
  assert.equal(state.focusedId, null, "only a minimized window is left");
  assert.deepEqual(ids(state), ["b"]);
  assert.equal(closeWindow(state, "zzz").reason, "unknown-window");
});

test("closing an unfocused window keeps focus", () => {
  const state = closeWindow(withWindows("a", "b"), "a").state;
  assert.equal(state.focusedId, "b");
});

test("minimize and restore", () => {
  let state = withWindows("a", "b");
  state = minimizeWindow(state, "b").state;
  assert.equal(get(state, "b").status, "minimized");
  assert.equal(state.focusedId, "a");
  assert.equal(minimizeWindow(state, "b").reason, "already-minimized");
  assert.equal(minimizeWindow(state, "nope").reason, "unknown-window");
  const restored = restoreWindow(state, "b");
  assert.equal(restored.ok, true);
  assert.equal(get(restored.state, "b").status, "open");
  assert.equal(restored.state.focusedId, "b");
  assert.deepEqual(ids(restored.state), ["a", "b"]);
  assert.equal(restoreWindow(restored.state, "b").reason, "not-minimized");
  assert.equal(restoreWindow(state, "nope").reason, "unknown-window");
});

test("transitions never mutate the previous state", () => {
  const before = withWindows("a", "b");
  const json = JSON.stringify(before);
  focusWindow(before, "a");
  minimizeWindow(before, "a");
  closeWindow(before, "a");
  beginDrag(before, { sourceId: "a", payload: { n: 1 } });
  assert.equal(JSON.stringify(before), json);
});

test("moveWindow validates and updates display and rect", () => {
  const state = withWindows("a");
  const out = moveWindow(state, "a", { displayId: "d2", rect: R(1100, 50, 200, 150) });
  assert.equal(out.ok, true);
  assert.equal(get(out.state, "a").displayId, "d2");
  assert.equal(moveWindow(state, "a", { displayId: "d2", rect: R(0, 0, -1, 1) }).reason, "invalid-rect");
  assert.equal(moveWindow(state, "nope", { displayId: "d2", rect: R(0, 0, 1, 1) }).reason, "unknown-window");
});

// Drag between windows -------------------------------------------------

test("begin, over, drop, host accepts: transfer carries the payload and nothing else changes", () => {
  const payload = Object.freeze({ kind: "asset", id: 42 });
  const state0 = withWindows("a", "b");
  const begun = beginDrag(state0, { sourceId: "a", payload });
  assert.equal(begun.ok, true);
  assert.equal(typeof begun.token, "string");
  assert.equal(begun.state.drag.phase, "dragging");

  const hovered = dragOver(begun.state, begun.token, "b");
  assert.equal(hovered.ok, true);
  assert.equal(hovered.state.drag.targetId, "b");

  const dropped = dropDrag(hovered.state, begun.token, "b");
  assert.equal(dropped.ok, true);
  assert.equal(dropped.state.drag.phase, "dropping");
  assert.deepEqual(dropped.offer, { sourceId: "a", targetId: "b", payload });

  const resolved = resolveDrop(dropped.state, begun.token, true);
  assert.equal(resolved.ok, true);
  assert.equal(resolved.accepted, true);
  assert.equal(resolved.transfer.payload, payload, "payload passes through by reference");
  assert.equal(resolved.transfer.sourceId, "a");
  assert.equal(resolved.transfer.targetId, "b");
  assert.equal(resolved.state.drag, null);
  assert.equal(resolved.state.focusedId, "b");
});

test("host rejection ends the drag without a transfer", () => {
  const begun = beginDrag(withWindows("a", "b"), { sourceId: "a", payload: 1 });
  const dropped = dropDrag(begun.state, begun.token, "b");
  const resolved = resolveDrop(dropped.state, begun.token, false);
  assert.equal(resolved.ok, true);
  assert.equal(resolved.accepted, false);
  assert.equal(resolved.transfer, undefined);
  assert.equal(resolved.state.drag, null);
});

test("begin is rejected for unknown, minimized sources and while another drag runs", () => {
  let state = withWindows("a", "b");
  assert.equal(beginDrag(state, { sourceId: "nope", payload: 1 }).reason, "unknown-window");
  const first = beginDrag(state, { sourceId: "a", payload: 1 });
  const second = beginDrag(first.state, { sourceId: "b", payload: 2 });
  assert.equal(second.reason, "drag-active");
  assert.equal(second.state, first.state);
  state = minimizeWindow(state, "b").state;
  assert.equal(beginDrag(state, { sourceId: "b", payload: 1 }).reason, "minimized");
});

test("stale tokens are rejected for every drag event", () => {
  const s0 = withWindows("a", "b");
  const first = beginDrag(s0, { sourceId: "a", payload: 1 });
  const cancelled = cancelDrag(first.state, first.token);
  const second = beginDrag(cancelled.state, { sourceId: "a", payload: 2 });
  assert.notEqual(second.token, first.token);
  for (const out of [
    dragOver(second.state, first.token, "b"),
    dropDrag(second.state, first.token, "b"),
    resolveDrop(second.state, first.token, true),
    cancelDrag(second.state, first.token),
  ]) {
    assert.equal(out.ok, false);
    assert.equal(out.reason, "stale-token");
    assert.equal(out.state, second.state);
  }
  assert.equal(dragOver(s0, "anything", "b").reason, "stale-token", "no drag at all");
  assert.equal(dragOver(second.state, undefined, "b").reason, "stale-token");
});

test("resolveDrop is rejected before drop and dropDrag twice is rejected", () => {
  const begun = beginDrag(withWindows("a", "b"), { sourceId: "a", payload: 1 });
  assert.equal(resolveDrop(begun.state, begun.token, true).reason, "wrong-phase");
  const dropped = dropDrag(begun.state, begun.token, "b");
  assert.equal(dropDrag(dropped.state, begun.token, "b").reason, "wrong-phase");
  assert.equal(dragOver(dropped.state, begun.token, "b").reason, "wrong-phase");
});

test("cancel mid-drag: late over, drop and resolve events are rejected", () => {
  const begun = beginDrag(withWindows("a", "b"), { sourceId: "a", payload: 1 });
  const hovered = dragOver(begun.state, begun.token, "b");
  const cancelled = cancelDrag(hovered.state, begun.token);
  assert.equal(cancelled.ok, true);
  assert.equal(cancelled.state.drag, null);
  const late = dropDrag(cancelled.state, begun.token, "b");
  assert.equal(late.ok, false);
  assert.equal(late.reason, "stale-token");
  assert.equal(resolveDrop(cancelled.state, begun.token, true).transfer, undefined);
});

test("cancel while the host is deciding invalidates the pending resolve", () => {
  const begun = beginDrag(withWindows("a", "b"), { sourceId: "a", payload: 1 });
  const dropped = dropDrag(begun.state, begun.token, "b");
  const cancelled = cancelDrag(dropped.state, begun.token);
  assert.equal(cancelled.ok, true);
  const late = resolveDrop(cancelled.state, begun.token, true);
  assert.equal(late.ok, false);
  assert.equal(late.transfer, undefined);
});

test("target closed during drag: hover clears, drop on it is rejected, drag survives", () => {
  const begun = beginDrag(withWindows("a", "b", "c"), { sourceId: "a", payload: 1 });
  const hovered = dragOver(begun.state, begun.token, "b");
  const closed = closeWindow(hovered.state, "b");
  assert.equal(closed.state.drag.targetId, null);
  assert.equal(closed.state.drag.token, begun.token);
  assert.equal(closed.cancelledToken, undefined);
  const drop = dropDrag(closed.state, begun.token, "b");
  assert.equal(drop.ok, false);
  assert.equal(drop.reason, "invalid-target");
  assert.equal(drop.state, closed.state);
  const retry = dropDrag(closed.state, begun.token, "c");
  assert.equal(retry.ok, true);
});

test("target closed while the host is deciding cancels the drag", () => {
  const begun = beginDrag(withWindows("a", "b"), { sourceId: "a", payload: 1 });
  const dropped = dropDrag(begun.state, begun.token, "b");
  const closed = closeWindow(dropped.state, "b");
  assert.equal(closed.state.drag, null);
  assert.equal(closed.cancelledToken, begun.token);
  const late = resolveDrop(closed.state, begun.token, true);
  assert.equal(late.ok, false);
  assert.equal(late.transfer, undefined, "no transfer into a closed window");
});

test("source closed or minimized during drag cancels it", () => {
  const begun = beginDrag(withWindows("a", "b"), { sourceId: "a", payload: 1 });
  const closed = closeWindow(begun.state, "a");
  assert.equal(closed.state.drag, null);
  assert.equal(closed.cancelledToken, begun.token);
  assert.equal(dropDrag(closed.state, begun.token, "b").reason, "stale-token");

  const minimized = minimizeWindow(begun.state, "a");
  assert.equal(minimized.state.drag, null);
  assert.equal(minimized.cancelledToken, begun.token);
});

test("minimizing the hover target clears hover", () => {
  const begun = beginDrag(withWindows("a", "b"), { sourceId: "a", payload: 1 });
  const hovered = dragOver(begun.state, begun.token, "b");
  const out = minimizeWindow(hovered.state, "b");
  assert.equal(out.state.drag.targetId, null);
});

test("hovering the source, an unknown or a minimized window clears hover", () => {
  let state = withWindows("a", "b", "c");
  state = minimizeWindow(state, "c").state;
  const begun = beginDrag(state, { sourceId: "a", payload: 1 });
  let cur = dragOver(begun.state, begun.token, "b").state;
  assert.equal(cur.drag.targetId, "b");
  for (const target of ["a", "nope", "c", null]) {
    cur = dragOver(dragOver(cur, begun.token, "b").state, begun.token, target).state;
    assert.equal(cur.drag.targetId, null, `target ${target}`);
  }
});

test("dropping on the source or a minimized window is rejected", () => {
  let state = withWindows("a", "b");
  state = minimizeWindow(state, "b").state;
  const begun = beginDrag(state, { sourceId: "a", payload: 1 });
  assert.equal(dropDrag(begun.state, begun.token, "a").reason, "invalid-target");
  assert.equal(dropDrag(begun.state, begun.token, "b").reason, "invalid-target");
  assert.equal(dropDrag(begun.state, begun.token, null).reason, "invalid-target");
});

// Persistence ----------------------------------------------------------

function layoutState() {
  let state = createWindowRegistry();
  state = openWindow(state, { id: "a", displayId: "d1", rect: R(100, 100, 300, 200) }).state;
  state = openWindow(state, { id: "b", displayId: "d2", rect: R(1200, 100, 400, 300) }).state;
  state = openWindow(state, { id: "c", displayId: "d1", rect: R(500, 300, 300, 200) }).state;
  state = minimizeWindow(state, "c").state;
  return state;
}

test("snapshot is JSON-safe, excludes drag state, and round-trips on the same displays", () => {
  let state = layoutState();
  state = beginDrag(state, { sourceId: "a", payload: { secret: 1 } }).state;
  const snap = snapshotLayout(state);
  const json = JSON.stringify(snap);
  assert.equal(json.includes("secret"), false);
  const parsed = parseLayoutSnapshot(JSON.parse(json));
  assert.deepEqual(parsed, snap);
  const { state: restored, relocated } = restoreLayout(parsed, [D1, D2]);
  assert.deepEqual(relocated, []);
  assert.deepEqual(restored.windows, layoutState().windows);
  assert.equal(restored.focusedId, layoutState().focusedId);
  assert.equal(restored.drag, null);
});

test("parseLayoutSnapshot rejects malformed or hostile input", () => {
  const good = snapshotLayout(layoutState());
  const clone = () => JSON.parse(JSON.stringify(good));
  assert.equal(parseLayoutSnapshot(null), null);
  assert.equal(parseLayoutSnapshot(undefined), null);
  assert.equal(parseLayoutSnapshot("{}"), null);
  assert.equal(parseLayoutSnapshot([]), null);
  assert.equal(parseLayoutSnapshot({ ...clone(), version: 2 }), null);
  assert.equal(parseLayoutSnapshot({ ...clone(), windows: "x" }), null);
  const dup = clone(); dup.windows[1].id = dup.windows[0].id;
  assert.equal(parseLayoutSnapshot(dup), null, "duplicate ids");
  const nan = clone(); nan.windows[0].rect.width = NaN;
  assert.equal(parseLayoutSnapshot(nan), null);
  const neg = clone(); neg.windows[0].rect.height = -5;
  assert.equal(parseLayoutSnapshot(neg), null);
  const status = clone(); status.windows[0].status = "maximized";
  assert.equal(parseLayoutSnapshot(status), null);
  const focus = clone(); focus.focusedId = "ghost";
  assert.equal(parseLayoutSnapshot(focus), null, "focused id must exist");
  const focusMin = clone(); focusMin.focusedId = "c";
  assert.equal(parseLayoutSnapshot(focusMin), null, "focused window cannot be minimized");
  const many = clone(); many.windows = Array.from({ length: MAX_WINDOWS + 1 }, (_, i) => ({ id: `w${i}`, displayId: "d1", rect: R(0, 0, 1, 1), status: "open" }));
  many.focusedId = null;
  assert.equal(parseLayoutSnapshot(many), null, "budget");
  const proto = JSON.parse('{"version":1,"focusedId":null,"windows":[{"id":"__proto__","displayId":"d1","rect":{"x":0,"y":0,"width":1,"height":1},"status":"open"}]}');
  assert.equal(parseLayoutSnapshot(proto).windows[0].id, "__proto__");
});

test("restore onto fewer displays moves windows to the primary display and clamps them", () => {
  const snap = snapshotLayout(layoutState());
  const { state, relocated } = restoreLayout(snap, [D1]);
  assert.deepEqual(relocated, ["b"]);
  const b = get(state, "b");
  assert.equal(b.displayId, "d1");
  assert.deepEqual(b.rect, R(600, 100, 400, 300), "x clamped so the right edge sits on the display edge");
  assert.deepEqual(b.home, { displayId: "d2", rect: R(1200, 100, 400, 300) });
  assert.deepEqual(get(state, "a").rect, R(100, 100, 300, 200));
  assert.equal(get(state, "a").home, undefined);
});

test("a window returns to its home display and rect when that display comes back", () => {
  const snap = snapshotLayout(layoutState());
  const fewer = restoreLayout(snap, [D1]).state;
  const resnap = parseLayoutSnapshot(JSON.parse(JSON.stringify(snapshotLayout(fewer))));
  assert.deepEqual(resnap.windows.find(w => w.id === "b").home, { displayId: "d2", rect: R(1200, 100, 400, 300) });
  const more = restoreLayout(resnap, [D1, D2]);
  assert.deepEqual(more.relocated, ["b"]);
  assert.equal(get(more.state, "b").displayId, "d2");
  assert.deepEqual(get(more.state, "b").rect, R(1200, 100, 400, 300));
  assert.equal(get(more.state, "b").home, undefined);
});

test("display removal while running reflows and keeps the original home through two relocations", () => {
  const state = layoutState();
  const d3 = { id: "d3", bounds: R(0, 0, 500, 400) };
  const one = reflowWindows(state, [D1]);
  assert.deepEqual(one.relocated, ["b"]);
  const two = reflowWindows(one.state, [d3]);
  assert.ok(two.relocated.includes("a") && two.relocated.includes("b"));
  const b = get(two.state, "b");
  assert.equal(b.displayId, "d3");
  assert.deepEqual(b.home, { displayId: "d2", rect: R(1200, 100, 400, 300) });
  assert.deepEqual(b.rect, R(100, 100, 400, 300));
  const back = reflowWindows(two.state, [D1, D2]);
  assert.deepEqual(get(back.state, "b").rect, R(1200, 100, 400, 300));
});

test("a window larger than the display shrinks to fit; off-screen windows come back in", () => {
  let state = createWindowRegistry();
  state = openWindow(state, { id: "big", displayId: "d1", rect: R(-50, -50, 5000, 4000) }).state;
  state = openWindow(state, { id: "far", displayId: "d1", rect: R(9000, 9000, 100, 100) }).state;
  state = openWindow(state, { id: "neg", displayId: "d1", rect: R(-500, 20, 100, 100) }).state;
  const out = reflowWindows(state, [D1]);
  assert.deepEqual(get(out.state, "big").rect, R(0, 0, 1000, 800));
  assert.deepEqual(get(out.state, "far").rect, R(900, 700, 100, 100));
  assert.deepEqual(get(out.state, "neg").rect, R(0, 20, 100, 100));
});

test("windows are moved off an occluding hinge, to the nearer side", () => {
  const display = { ...D1, reserved: [R(490, 0, 20, 800)] };
  let state = openWindow(createWindowRegistry(), { id: "a", displayId: "d1", rect: R(410, 100, 200, 200) }).state;
  state = openWindow(state, { id: "b", displayId: "d1", rect: R(300, 100, 200, 200) }).state;
  const out = reflowWindows(state, [display]);
  assert.deepEqual(get(out.state, "a").rect, R(510, 100, 200, 200), "center is right of the hinge: moves right");
  assert.deepEqual(get(out.state, "b").rect, R(290, 100, 200, 200), "moves left");
  assert.deepEqual(out.relocated, ["a", "b"]);
});

test("a zero-width separating fold is not straddled; a window clear of it is untouched", () => {
  const display = { ...D1, reserved: [R(500, 0, 0, 800)] };
  let state = openWindow(createWindowRegistry(), { id: "a", displayId: "d1", rect: R(460, 50, 100, 100) }).state;
  state = openWindow(state, { id: "edge", displayId: "d1", rect: R(400, 50, 100, 100) }).state;
  const out = reflowWindows(state, [display]);
  assert.deepEqual(get(out.state, "a").rect, R(500, 50, 100, 100));
  assert.deepEqual(get(out.state, "edge").rect, R(400, 50, 100, 100), "touching the fold is allowed");
});

test("a window too wide for either side of a hinge shrinks into the larger side", () => {
  const display = { ...D1, reserved: [R(490, 0, 20, 800)] };
  const state = openWindow(createWindowRegistry(), { id: "a", displayId: "d1", rect: R(100, 50, 900, 300) }).state;
  const out = reflowWindows(state, [display]);
  const rect = get(out.state, "a").rect;
  assert.deepEqual(rect, R(0, 50, 490, 300), "left strip is 490 wide and nearer: shrink into it");
});

test("horizontal hinge (tabletop) is respected", () => {
  const display = { ...D1, reserved: [R(0, 390, 1000, 20)] };
  const state = openWindow(createWindowRegistry(), { id: "a", displayId: "d1", rect: R(100, 320, 200, 200) }).state;
  const out = reflowWindows(state, [display]);
  assert.deepEqual(get(out.state, "a").rect, R(100, 410, 200, 200));
});

test("reservedFromFolds keeps occluding and separating features only", () => {
  const f = (bounds, separating, occlusion) => ({ bounds, orientation: "vertical", separating, occlusion });
  const rects = reservedFromFolds([
    f(R(1, 0, 2, 5), false, "full"),
    f(R(3, 0, 0, 5), true, "none"),
    f(R(5, 0, 2, 5), false, "none"),
  ]);
  assert.deepEqual(rects, [R(1, 0, 2, 5), R(3, 0, 0, 5)]);
  assert.deepEqual(reservedFromFolds([]), []);
});

test("reflow with nothing to change returns the same state", () => {
  const state = layoutState();
  const out = reflowWindows(state, [D1, D2]);
  assert.equal(out.state, state);
  assert.deepEqual(out.relocated, []);
});

test("restore continues the token sequence so pre-restore drag events stay stale", () => {
  const before = withWindows("a", "b");
  const begun = beginDrag(before, { sourceId: "a", payload: 1 });
  const snap = snapshotLayout(begun.state);
  const { state } = restoreLayout(snap, [D1], begun.state);
  const again = beginDrag(state, { sourceId: "a", payload: 1 });
  assert.notEqual(again.token, begun.token);
  assert.equal(dropDrag(again.state, begun.token, "b").reason, "stale-token");
});

test("restore and reflow reject unusable display lists", () => {
  const snap = snapshotLayout(layoutState());
  assert.throws(() => restoreLayout(snap, []), RangeError);
  assert.throws(() => restoreLayout(snap, [D1, { ...D1 }]), RangeError, "duplicate display ids");
  assert.throws(() => restoreLayout(snap, [{ id: "x", bounds: R(0, 0, 0, 10) }]), RangeError);
  assert.throws(() => reflowWindows(layoutState(), [{ id: "", bounds: R(0, 0, 10, 10) }]), RangeError);
});

test("without a primary flag the first display is the fallback", () => {
  const { state } = restoreLayout(snapshotLayout(layoutState()), [{ id: "x", bounds: R(0, 0, 2000, 1000) }]);
  assert.ok(state.windows.every(w => w.displayId === "x"));
});

test("reflowing 256 windows against several reserved regions stays fast and valid", () => {
  let state = createWindowRegistry();
  for (let i = 0; i < MAX_WINDOWS; i++) {
    state = openWindow(state, { id: `w${i}`, displayId: "gone", rect: R(i * 7, i * 3, 300, 200) }).state;
  }
  const display = { ...D1, reserved: [R(300, 0, 20, 800), R(0, 390, 1000, 20), R(700, 0, 0, 800)] };
  const started = performance.now();
  const out = reflowWindows(state, [display]);
  assert.ok(performance.now() - started < 1000);
  for (const w of out.state.windows) {
    assert.ok(w.rect.x >= 0 && w.rect.y >= 0 && w.rect.x + w.rect.width <= 1000 && w.rect.y + w.rect.height <= 800);
    for (const r of display.reserved) {
      const crosses = w.rect.x < r.x + r.width && r.x < w.rect.x + w.rect.width && w.rect.y < r.y + r.height && r.y < w.rect.y + w.rect.height;
      assert.equal(crosses, false, `${w.id} overlaps a reserved region`);
    }
  }
});
