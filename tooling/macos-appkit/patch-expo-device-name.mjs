import { readFile, writeFile, lstat, realpath, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, sep } from 'node:path';

// Acceptance-only repair for the private native acceptance consumer.
//
// expo-modules-core 55.0.27 builds its constants on the main thread and reads
// the macOS device name with ProcessInfo.hostName. That calls -[NSHost name],
// which reverse-resolves every local address through getnameinfo/mDNS. In run
// 42973159971 the AppKit app's main thread sat in that call from 06:50:54 to
// 06:51:29 (35 s) while the same call in a plain process on the same runner
// took 0.03 s. Every main-queue driver command queued behind it and the
// tron.window reply missed the client's 35 s limit. gethostname(3) returns the
// kernel host name without any lookup. Nothing in this acceptance suite reads
// the device name, and no timeout or assertion changes.
export const pinnedConstantsProviderSha256 = '16d30e5eafc45074426b770c1b8d0330c754e6b424213595c1fd9c5c673a884a';
export const constantsProviderRelativePath = 'node_modules/expo-modules-core/ios/Utilities/ConstantsProvider.swift';
const hash = value => createHash('sha256').update(value).digest('hex');
export const before = '  return ProcessInfo.processInfo.hostName\n';
export const after = [
  '  // NYC-Tron acceptance: kernel host name, no NSHost reverse lookup on the main thread.',
  '  var buffer = [UInt8](repeating: 0, count: 256)',
  '  let status = buffer.withUnsafeMutableBytes { gethostname($0.baseAddress!.assumingMemoryBound(to: CChar.self), 255) }',
  '  return status == 0 ? String(decoding: buffer.prefix { $0 != 0 }, as: UTF8.self) : "Mac"',
  ''
].join('\n');
export function patchConstantsProvider(original) {
  if (original.split(before).length !== 2) throw new Error('Pinned Expo ConstantsProvider patch context changed');
  return original.replace(before, after);
}
export async function patchExpoDeviceName(consumer) {
  const manifest = JSON.parse(await readFile(join(consumer, 'package.json'), 'utf8'));
  const expo = JSON.parse(await readFile(join(consumer, 'node_modules/expo-modules-core/package.json'), 'utf8'));
  if (manifest.name !== 'nyc-tron-appkit-reference' || !manifest.private || expo.version !== '55.0.27') throw new Error('The Expo device-name repair requires the private acceptance consumer with expo-modules-core 55.0.27');
  const target = join(consumer, constantsProviderRelativePath);
  if ((await lstat(target)).isSymbolicLink()) throw new Error('Cannot patch a linked Expo constants provider');
  if (!(await realpath(target)).startsWith((await realpath(consumer)) + sep)) throw new Error('Expo constants provider resolves outside the private consumer');
  const originalBytes = await readFile(target);
  if (hash(originalBytes) !== pinnedConstantsProviderSha256) throw new Error('Pinned Expo ConstantsProvider preimage SHA-256 changed; preparation stopped without patching');
  const patched = patchConstantsProvider(originalBytes.toString('utf8'));
  await writeFile(target, patched);
  if (hash(await readFile(target)) !== hash(patched)) throw new Error('Patched Expo constants provider bytes changed during preparation');
  const proof = join(consumer, 'acceptance-device-name');
  await mkdir(proof);
  const receipt = {
    schemaVersion: 1, scope: 'private-native-acceptance-consumer-only', patch: 'nyc-tron-expo-55.0.27-device-name-no-reverse-lookup-v1',
    packageName: 'expo-modules-core', version: expo.version, file: constantsProviderRelativePath,
    before: { sha256: pinnedConstantsProviderSha256 }, after: { sha256: hash(patched) },
    boundaries: ['No modification to the shipped NYC-Tron adapter, core archive or Spark distribution archive.', 'No timeout, retry, assertion or command change.']
  };
  await writeFile(join(proof, 'patch-receipt.json'), JSON.stringify(receipt, null, 2) + '\n');
  return receipt;
}
