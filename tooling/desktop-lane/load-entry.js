// Loads one @nyc-tron/ui export for the desktop lane coverage harness (gate T4).
// Copied unchanged next to harness-runtime.js. No imports, so the unit tests
// can load it without React Native.
//
// Metro's require polyfill runs a top-level require through guardedLoadModule.
// When the harness calls entry.load() from a render, no module factory is on
// the stack, so an exception while evaluating the export (for example a stub
// for a peer the lane cannot resolve) is caught by Metro and handed to
// ErrorUtils.reportFatalError instead of being rethrown. The caller's
// try/catch never sees it. In a release build React Native macOS turns that
// report into RCTFatalException and aborts the app; React Native Windows
// logs it and require returns undefined, which reads as an export with no
// components. Both lose the result. This routes reports made during the
// require back to the caller as a thrown error.

export function loadEntry(load, errorUtils = globalThis.ErrorUtils) {
  const canIntercept = !!(errorUtils && errorUtils.setGlobalHandler && errorUtils.getGlobalHandler);
  const previous = canIntercept ? errorUtils.getGlobalHandler() : undefined;
  let reported;
  let hasReport = false;
  if (canIntercept) {
    errorUtils.setGlobalHandler(error => {
      if (!hasReport) { reported = error; hasReport = true; }
    });
  }
  let module;
  try {
    module = load();
  } finally {
    if (canIntercept) errorUtils.setGlobalHandler(previous);
  }
  if (hasReport) throw reported;
  if (module === undefined || module === null) {
    throw new Error("NYCTRON_EMPTY_MODULE the export evaluated to no module object");
  }
  return module;
}
