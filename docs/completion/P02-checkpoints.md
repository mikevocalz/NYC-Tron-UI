# P02 checkpoint storage and SwiftPM integration

The new isolated `@nyc-tron/platform-services/checkpoints` subpath provides
generic binary checkpoint storage. It imports no Forge engine or UI state.
Forge owns NFD1 document snapshots, debounce/dirty revisions, undo notifications
and recovery into an unpublished engine session.

`createPlatformCheckpointStorage(namespace)` returns `read(key)`,
`write(key, bytes)`, `remove(key)` and `close()`. Names are bounded ASCII
identifiers; use document IDs rather than display names. The limit is 256 MiB
plus five bytes for the consuming snapshot's metadata. Input/output bytes are
owned copies. Close drains accepted work and rejects later operations.

Native iOS/Android storage uses Expo FileSystem 58.0.13 in the app documents
directory. It writes an immutable, checksummed generation to a temporary file,
then moves it to a new committed filename. Failed writes preserve the previous
checkpoint. Reads ignore temporary files and fall back to the last valid
generation on corruption; if all committed generations are corrupt, they throw
instead of silently opening an empty document. Retention keeps the prior valid
generation. This is process-interruption recovery, without a power-loss fsync
guarantee. Consumers must retain one autosave owner per document.

Web storage uses IndexedDB with a strict durability hint and resolves writes
on transaction completion. An aborted transaction preserves the prior record.
See the [IndexedDB specification](https://www.w3.org/TR/IndexedDB/) and
[Expo SDK 58 FileSystem API](https://docs.expo.dev/versions/v58.0.0/sdk/filesystem/).
Expo FileSystem is an optional peer so unrelated service imports do not pull
it in; native consumers of `/checkpoints` must install the compatible module.
The adapter and record/checksum code are original; the dependency ships under
its existing MIT license.

Executed: 25 platform-service tests, package typecheck/build, Swift manifest
parsing, and a local candidate pack containing the new exports, license and
Package.swift. Real Chrome 156.0.8078.81 acceptance passed buffer ownership,
abort-after-request-success, retained state, new connections, close and page
reload persistence. The linked Forge native lab passed disk write,
undo/redo, fresh-store recovery, torn-temporary-write isolation, corrupt-latest
fallback, real native I/O failure/retry and full process-relaunch persistence
on iOS 27.1 and Android 16/API 36 ARM64. Forge's completion reports retain
the native binary provenance and captured runtime results.

Native consumer integration also found missing SwiftPM linkage metadata in the
released platform-services package. Package.swift now preserves the Podspec's
iOS 16.4 floor and AVFoundation/CoreMedia/UniformTypeIdentifiers linkage. A
regression checks this parity and packaging. The consuming app's generated
SwiftPM manifest and fresh native build preserve these settings. No established
window/orientation or Android manifest entries were changed.

This is an implemented, tested P02 checkpoint. Full component acceptance still
requires remaining host/app lifecycle integration, performance/accessibility
and the other required platform targets in the canonical Forge ledger.
