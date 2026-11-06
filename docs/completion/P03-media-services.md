# Reusable media decoder checkpoint

NYC-Tron's decoder is independent of Forge's player port. Its public entry is
`@nyc-tron/platform-services/media`. Android and iOS expose real frame/PCM output;
the web path now uses WebCodecs through unmodified Mediabunny 1.65.2 for real
presentation timestamps. Browsers without WebCodecs retain the explicitly
marked `seek-target` fallback. That fallback cannot satisfy an exact-frame check.

Browser acceptance on November 6, 2026 decoded the generated H.264/AAC fixture:

- Request 125000µs returned the actual 100000µs frame at 96×64, with decoded
  pixel values spanning 0–255.
- The indexed 750000µs request returned 750000µs.
- A 500000µs audio span returned 12000 mono sample frames at 24000Hz, with
  440 sign crossings from the generated 440Hz tone.
- Past-end, denied access, oversized input and corrupt media rejected with
  their typed errors.
- Aborting a stalled request settled with `cancelled` and closed its HTTP
  connection. Native cancellation detaches the caller; already-submitted codec
  work drains on its native owner. The AbortSignal never crosses the bridge.

Run the reproducible harness with `pnpm --filter @nyc-tron/platform-services build`
and `node tooling/serve-media-acceptance.mjs`, then open `http://127.0.0.1:4189`.
The page uses actual browser codecs, pixels and PCM. It publishes its result at
`globalThis.__mediaAcceptance` for automation. It does not mock a decoder.
The generated source fixture SHA256 is
`4c9905522ec7710bbe0a7f02404cc2a957b037c2de3c67c4469df904b7207b0a`.

The browser complete-file path is capped at 64MiB and 30 seconds per frame
request. Native media acceptance is recorded in the companion program's P03
report for the same fixture. Codec, hardware, accessibility and other host
coverage beyond those observations remain separate gates.

Dependency/source availability and license review are shipped in
`packages/platform-services/THIRD_PARTY.md`. No Forge engine or player package
is a dependency of NYC-Tron.
