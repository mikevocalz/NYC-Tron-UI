import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
for (const file of ['README.md', 'LICENSE', 'THIRD_PARTY_NOTICES.md', 'NYCTronAppKit.podspec', 'macos/NYCTronDisplays.mm', 'macos/NYCTronDisplays.h', 'src/NativeNYCTronDisplays.ts', 'macos/NYCTronPopover.mm', 'macos/NYCTronPopover.h', 'macos/NYCTronPopoverComponentDescriptor.h', 'src/NYCTronPopoverNativeComponent.ts', 'react-native.config.cjs']) {
  assert.ok(existsSync(join(root, file)), `Required package file missing: ${file}`);
}
for (const [subpath, condition] of Object.entries(pkg.exports)) {
  if (typeof condition === 'string') continue;
  for (const path of Object.values(condition)) assert.ok(existsSync(join(root, path)), `${subpath} export missing: ${path}`);
}
assert.equal(pkg.peerDependencies['@legendapp/spark'], '0.0.2');
assert.equal(pkg.peerDependencies['react-native'], '0.83.10');
assert.equal(pkg.peerDependencies['react-native-macos'], '0.83.0');
assert.equal(pkg.peerDependencies.expo, '55.0.32');
assert.equal(pkg.peerDependencies['react-native-nitro-modules'], '0.37.0');
assert.equal(pkg.codegenConfig.type, 'all');
assert.equal(pkg.codegenConfig.ios.componentProvider.NYCTronPopover, 'NYCTronPopoverComponentView');
console.info('AppKit package exports, native source, notices and isolated peers verified.');
