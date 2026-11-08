import test from "node:test";
import assert from "node:assert/strict";
import { createLongTaskScheduler, TaskCancelledError } from "../src/scheduler/scheduler.ts";

const tick = () => new Promise(resolve => setTimeout(resolve, 0));
async function waitFor(check, tries = 50) {
  for (let i = 0; i < tries; i++) { if (check()) return; await tick(); }
  assert.ok(check(), "condition was not reached");
}

test("scheduler runs tasks FIFO one at a time and reports clamped progress", async () => {
  const scheduler = createLongTaskScheduler();
  const order = [];
  const progress = [];
  const first = scheduler.submit(async context => {
    order.push("first-start");
    context.reportProgress(0.5);
    context.reportProgress(1.7); // clamped to 1
    context.reportProgress(NaN); // ignored
    await context.checkpoint();
    order.push("first-end");
    return "one";
  }, { label: "decode", onProgress: f => progress.push(f) });
  const second = scheduler.submit(async () => { order.push("second"); return 2; });
  assert.equal(await first.done, "one");
  assert.equal(await second.done, 2);
  assert.deepEqual(order, ["first-start", "first-end", "second"]);
  assert.deepEqual(progress, [0.5, 1]);
  const stats = scheduler.stats();
  assert.equal(stats.queued, 0);
  assert.equal(stats.settled, 2);
  assert.equal(stats.failed, 0);
  assert.equal(first.state, "done");
  await scheduler.close();
});

test("cancelling a queued task rejects it without running the work", async () => {
  const scheduler = createLongTaskScheduler();
  let release;
  const blocker = scheduler.submit(async context => {
    await new Promise(resolve => { release = resolve; });
    await context.checkpoint();
  });
  await waitFor(() => scheduler.stats().running === 1);
  let ran = false;
  const queued = scheduler.submit(async () => { ran = true; return "never"; });
  assert.equal(queued.state, "queued");
  assert.equal(scheduler.cancel(queued.id), true);
  await assert.rejects(queued.done, TaskCancelledError);
  release();
  await blocker.done;
  await tick();
  assert.equal(ran, false);
  assert.equal(queued.state, "cancelled");
  await scheduler.close();
});

test("a running task observes cancellation at its next checkpoint", async () => {
  const scheduler = createLongTaskScheduler();
  const task = scheduler.submit(async context => {
    await context.checkpoint();
    await context.checkpoint();
    return "finished";
  });
  await waitFor(() => task.state === "running");
  assert.equal(scheduler.cancel(task.id), true);
  await assert.rejects(task.done, TaskCancelledError);
  assert.equal(task.state, "cancelled");
  await scheduler.close();
});

test("throwIfCancelled surfaces TaskCancelledError inside work", async () => {
  const scheduler = createLongTaskScheduler();
  const task = scheduler.submit(async context => {
    scheduler.cancel("self-cancel");
    context.throwIfCancelled();
    return "unreachable";
  }, { id: "self-cancel" });
  await assert.rejects(task.done, TaskCancelledError);
  await scheduler.close();
});

test("work errors reject as failures and do not cancel siblings", async () => {
  const scheduler = createLongTaskScheduler();
  const bad = scheduler.submit(async () => { throw new Error("decode exploded"); });
  const good = scheduler.submit(async () => "fine");
  await assert.rejects(bad.done, /decode exploded/);
  assert.equal(await good.done, "fine");
  assert.equal(bad.state, "failed");
  assert.equal(scheduler.stats().failed, 1);
  await scheduler.close();
});

test("pending bound rejects overflow and duplicate ids are refused", async () => {
  const scheduler = createLongTaskScheduler({ maxPending: 2 });
  let release;
  const blocker = scheduler.submit(() => new Promise(resolve => { release = resolve; }));
  await waitFor(() => scheduler.stats().running === 1);
  scheduler.submit(async () => "queued");
  assert.throws(() => scheduler.submit(async () => "over"), RangeError);
  assert.throws(() => scheduler.submit(async () => "dup", { id: blocker.id }), /Duplicate task id/);
  release();
  await blocker.done;
  await scheduler.close();
});

test("close rejects queued work, cancels the running task and is idempotent", async () => {
  const scheduler = createLongTaskScheduler();
  const running = scheduler.submit(async context => {
    await context.checkpoint();
    await context.checkpoint();
    return "late";
  });
  const queued = scheduler.submit(async () => "never");
  await waitFor(() => scheduler.stats().running === 1);
  const first = scheduler.close();
  assert.equal(scheduler.close(), first);
  await assert.rejects(queued.done, TaskCancelledError);
  await assert.rejects(running.done, TaskCancelledError);
  await first;
  const late = scheduler.submit(async () => "nope");
  await assert.rejects(late.done, /Scheduler is closed/);
});
