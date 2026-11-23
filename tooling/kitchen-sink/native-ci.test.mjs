import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const workflow = readFileSync(new URL('../../.github/workflows/kitchen-sink.yml', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const android = workflow.slice(workflow.indexOf('\n  android:\n'), workflow.indexOf('\n  ios:\n'));
test('the Ubuntu candidate job runs every kitchen startup, KVM and proof regression', () => {
  const candidate = workflow.slice(workflow.indexOf('\n  candidate:\n'), workflow.indexOf('\n  web:\n'));
  assert.match(candidate, /runs-on: ubuntu-latest/);
  assert.match(candidate, /- run: node --test tooling\/kitchen-sink\/\*\.test\.mjs\n/);
  assert.doesNotMatch(candidate, /- run: node --test tooling\/kitchen-sink\/proof\.test\.mjs/);
});
test('Android runner establishes writable KVM before starting its emulator', () => {
  const permissions = android.indexOf('name: Require writable KVM acceleration'), emulator = android.indexOf('uses: reactivecircus/android-emulator-runner@v2');
  assert.ok(permissions >= 0 && permissions < emulator);
  assert.ok(android.includes('MODE="0666"'));
  assert.match(android, /sudo udevadm control --reload-rules/);
  assert.match(android, /sudo udevadm trigger --name-match=kvm/);
  for (const permission of ['c', 'r', 'w']) assert.ok(android.includes(`test -${permission} /dev/kvm`));
});
test('Android action requires hardware acceleration and preflights the installed emulator', () => {
  assert.match(android, /disable-linux-hw-accel: 'false'/);
  assert.match(android, /emulator-options: .* -accel on\n/);
  assert.ok(android.includes('pre-emulator-launch-script: \'"$ANDROID_HOME/emulator/emulator" -accel-check\''));
  assert.doesNotMatch(android, /-accel off|ANDROID_I_WANT_MY_TCG|continue-on-error/);
  assert.match(android, /native-proof\.mjs --consumer .* --platform android /);
  assert.match(workflow, /native-proof\.mjs --consumer .* --platform ios /);
});
