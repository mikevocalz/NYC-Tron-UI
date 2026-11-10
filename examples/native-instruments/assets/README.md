# Reference media

`reference.mp4` is a byte-for-byte copy of this repository's
`packages/platform-services/tests/fixtures/decoder.mp4`. It is a generated
test clip, with no third-party footage. The reference uses its decoded frames
to exercise media loading, review position, error recovery and note ownership.
It is bundled through Expo Asset so a native run does not depend on an external
video service.

The browser fixture uses the existing VP9/Opus `decoder.webm` generated from
FFmpeg testsrc and sine sources. Codec and timestamp results belong to their
respective host; the reference does not infer one platform's result from another.
