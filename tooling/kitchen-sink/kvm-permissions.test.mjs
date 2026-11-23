import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const workflow = readFileSync(new URL('../../.github/workflows/kitchen-sink.yml', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const start = workflow.indexOf('      - name: Require writable KVM acceleration\n');
const block = workflow.slice(start, workflow.indexOf('\n      - ', start + 1));
const script = block.slice(block.indexOf('        run: |\n') + '        run: |\n'.length).split('\n').map(line => line.slice(10)).join('\n');
// Run the actual workflow block with shell doubles. Never invoke real sudo,
// udev, permission changes or /dev/kvm access on the developer's machine.
const doubles = `
sudo() {
  printf 'sudo %s\\n' "$*" >> "$KVM_TEST_LOG"
  case "$*" in
    'tee /etc/udev/rules.d/99-kvm4all.rules') cat >/dev/null ;;
    'udevadm control --reload-rules') if [[ "$KVM_TEST_FAILURE" = reload ]]; then return 22; fi ;;
    'chmod 0666 /dev/kvm')
      if [[ "$KVM_TEST_FAILURE" = chmod ]]; then return 23; fi
      : > "$KVM_TEST_MARKER" ;;
  esac
}
id() { printf 'synthetic CI runner\\n'; }
ls() { printf 'synthetic KVM diagnostics\\n'; }
test() {
  printf 'test %s\\n' "$*" >> "$KVM_TEST_LOG"
  if [[ "$1" = -c && "$KVM_TEST_FAILURE" = missing ]]; then return 1; fi
  if [[ "$1" = -r && "$KVM_TEST_FAILURE" = unreadable ]]; then return 1; fi
  if [[ "$1" = -w ]]; then
    if [[ "$KVM_TEST_FAILURE" = unwritable ]]; then return 1; fi
    builtin test -f "$KVM_TEST_MARKER"
  fi
}
`;
function execute(failure = '') {
  const directory = mkdtempSync(join(tmpdir(), 'tron-kvm-permission-test-')), log = join(directory, 'commands.log');
  try {
    const result = spawnSync('bash', ['--noprofile', '--norc'], { input: doubles + script, encoding: 'utf8', timeout: 5000,
      env: { ...process.env, KVM_TEST_FAILURE: failure, KVM_TEST_LOG: log, KVM_TEST_MARKER: join(directory, 'chmod-completed') } });
    assert.equal(result.error, undefined);
    return { ...result, commands: readFileSync(log, 'utf8') };
  } finally { rmSync(directory, { recursive: true, force: true }); }
}
test('synchronous chmod grants access after bounded udev settle and before the final permission gates', () => {
  const result = execute(); assert.equal(result.status, 0, result.stderr);
  const settle = result.commands.indexOf('sudo udevadm settle --timeout=10'), chmod = result.commands.indexOf('sudo chmod 0666 /dev/kvm');
  assert.ok(settle >= 0 && chmod > settle);
  assert.ok(result.commands.indexOf('test -w /dev/kvm') > chmod);
  assert.match(result.stderr, /\+ sudo chmod 0666 \/dev\/kvm/);
});
for (const [failure, status, assertion] of [
  ['missing', 1, 'test -c /dev/kvm'], ['unreadable', 1, 'test -r /dev/kvm'],
  ['unwritable', 1, 'test -w /dev/kvm'], ['chmod', 23, 'sudo chmod 0666 /dev/kvm'],
  ['reload', 22, 'sudo udevadm control --reload-rules'],
]) test('KVM setup fails closed with diagnostics for ' + failure, () => {
  const result = execute(failure); assert.equal(result.status, status, result.stderr);
  assert.match(result.stderr, new RegExp('KVM permission setup failed at line [0-9]+ \\(exit ' + status + '\\)'));
  assert.ok(result.commands.includes(assertion));
  if (failure === 'missing') assert.doesNotMatch(result.commands, /sudo /);
  if (failure === 'reload') assert.doesNotMatch(result.commands, /sudo chmod/);
});
