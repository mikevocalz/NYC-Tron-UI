# P03 focused presentation-index facade checks

The user's selection of work groups 1–3 includes focused P02/P03 validation. This checkpoint executes decoder/index tests; it does not certify the full component/platform acceptance matrix or release.

Eight new facade tests cover old-binary/missing-module capability detection, independent frozen timestamp results, malformed/order/duplicate/duration/frame-budget rejection, native argument boundaries, cancellation before native admission, late completion/rejection draining after admitted work, and public native error codes. The nonuniform timestamps are controlled test inputs, not a native VFR media fixture. The cancellation case explicitly waits for native admission before aborting so it measures an in-flight result rather than an unstarted promise.

Executed with the installed Node runtime:

```sh
node --experimental-strip-types --test packages/platform-services/tests/presentation-index.test.mjs packages/platform-services/tests/media.test.mjs
```

Result: **13 passed, 0 failed**, including five existing decoder checks. TypeScript and whitespace checks also pass. Actual native sample enumeration, Expo bridge/module linking, player/decoded-frame acknowledgement, CFR/VFR/B-frame files, native resource/lifecycle behavior and the wider platform matrix remain separate gates. This source/unit checkpoint changes no acceptance field or release pin.
