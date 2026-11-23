import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { RECEIPT_FILES } from '../collect-library-evidence.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const read = path => readFileSync(join(root, path), 'utf8').replace(/\r\n/g, '\n');
const release = read('.github/workflows/release.yml');
const kitchen = read('.github/workflows/kitchen-sink.yml');
const step = name => {
  const start = release.indexOf('      - name: ' + name + '\n');
  assert.ok(start >= 0, 'Missing required release step: ' + name);
  const next = release.indexOf('\n      - ', start + 1);
  return { start, text: release.slice(start, next < 0 ? undefined : next) };
};
const gateName = 'Require actual stable-release acceptance and owner distribution review';
test('publication requires the reusable installed-library producer with all native/web jobs', () => {
  assert.match(release, /kitchen-sink:\n\s+name: installed-archive library evidence\n\s+uses: \.\/\.github\/workflows\/kitchen-sink\.yml/);
  const header = release.slice(release.indexOf('\n  release:\n'), release.indexOf('\n    steps:', release.indexOf('\n  release:\n')));
  const needs = header.match(/needs: \[([^\]]+)\]/)?.[1].split(',').map(value => value.trim());
  assert.ok(needs?.includes('kitchen-sink'));
  assert.equal(needs.length, 9);
  assert.doesNotMatch(header, /\n\s+(?:if|continue-on-error):/);
  assert.match(kitchen, /^  workflow_call:\s*$/m);
  for (const job of ['candidate', 'web', 'android', 'ios']) assert.match(kitchen, new RegExp('^  ' + job + ':$', 'm'));
});
test('only the twelve untested workspace packages may be freshly packed for publication', () => {
  const actual = step('Pack and check every tarball').text.match(/--packages ([a-z0-9,-]+)/)?.[1].split(',').sort();
  const expected = readdirSync(join(root, 'packages')).filter(name => existsSync(join(root, 'packages', name, 'package.json')) && !['core', 'ui'].includes(name)).sort();
  assert.equal(expected.length, 12);
  assert.deepEqual(actual, expected);
  assert.equal(new Set(actual).size, 12);
});
test('downloaded artifact names and the seven expected receipt paths match actual producers', () => {
  const names = ['kitchen-candidate-archives', 'kitchen-proof-web', 'kitchen-proof-ios', 'kitchen-proof-android'];
  for (const name of names) {
    assert.ok(kitchen.includes('name: ' + name), 'Producer missing artifact ' + name);
    assert.ok(release.includes('name: ' + name), 'Release missing artifact ' + name);
  }
  assert.deepEqual([...RECEIPT_FILES].sort(), ['web/unit.json', 'web/unit-exports.json', 'web/unit-declarations.json', 'web/web.json', 'web/web-accessibility.json', 'ios/ios.json', 'android/android.json'].sort());
  assert.match(step('Index actual collector outputs without promoting a pass').text, /collect-library-evidence\.mjs index "\$RUNNER_TEMP\/tested-library" "\$RUNNER_TEMP\/tested-library\/evidence\.json"/);
});
test('exact tested library and desktop archive merges bind this version and source before the gate', () => {
  const gate = step(gateName), library = step('Reuse the installed core and UI archive bytes'), desktop = step('Verify and retain the exact tested desktop archives');
  assert.match(library.text, /collect-library-evidence\.mjs merge "\$RUNNER_TEMP\/tested-library\/archives" "\$RUNNER_TEMP\/release" "\$VERSION" "\$GITHUB_SHA"/);
  for (const [directory, name] of [['tested-windows', 'windows-fluent-fabric'], ['tested-macos', 'macos-appkit']]) {
    assert.ok(desktop.text.includes(`merge-tested-package.mjs "$RUNNER_TEMP/${directory}" "$RUNNER_TEMP/release" @nyc-tron/${name} "$VERSION" "$GITHUB_SHA"`));
  }
  assert.ok(library.start < gate.start && desktop.start < gate.start);
  assert.ok(step('Build and verify exact-source component documentation').start < gate.start);
  assert.match(step('Build and verify exact-source component documentation').text, /npm --prefix website run verify/);
  const installation = step('Follow the published installation guide and run its copied example');
  assert.ok(installation.start < gate.start);
  assert.match(installation.text, /node tooling\/docs-clean-consumer\.mjs --output "\$RUNNER_TEMP\/tron-docs-consumer"/);
  assert.match(installation.text, /node website\/tests\/clean-consumer\.mjs "\$RUNNER_TEMP\/tron-docs-consumer"/);
  assert.match(release, /\$\{\{ runner\.temp \}\}\/tron-docs-consumer\/docs-consumer-proof\.json/);
});
test('prereleases and stable releases both require the nonoptional library gate before publication', () => {
  const gate = step(gateName), publish = step('Create release and upload tarballs');
  assert.match(gate.text, /release-readiness\.mjs --version "\$VERSION" --artifacts "\$RUNNER_TEMP\/release" --require-library --evidence "\$RUNNER_TEMP\/tested-library\/evidence\.json"/);
  assert.doesNotMatch(gate.text, /\n\s+(?:if|continue-on-error):|\|\|\s*(?:true|:)|case\s|\bthen\b/);
  assert.ok(gate.start < publish.start);
  assert.ok(publish.text.includes('gh release create'));
  assert.ok(step('Retain the candidate archives and checksums for distribution review').start < gate.start);
});
