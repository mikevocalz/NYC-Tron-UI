# Windows native drag-region peer compiler failure

[Run 42903675797](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42903675797)
passed the source/codegen/API/package job and failed installed native library
compilation. The actual checkout, merge parents and tree are independently
verified in `checkout.json`.

`TronDragSurface.cpp` line 39 calls `this->as<FrameworkElement>()` on the
composable implementation. C++/WinRT reports C2039 because that implementation
does not expose `as`; C2059 follows on the same line. The app compilation,
deployment, UI Automation gate and tested-package retention were skipped. The
only workflow artifact is the source job's canonical shared packages. No native
UI artifact or passed Windows distribution was created.

The complete original decoded job log is preserved byte for byte, including
its CRLF line endings. It is 81,561 bytes with SHA-256
`c9ec426e28e5092bec153799a4edb262535dc7c6a1ab02cba3a1635d53f6af98`.
Workflow jobs/artifacts are the complete connector metadata snapshots.

The independently reviewed one-line correction uses
`static_cast<Xaml::FrameworkElement>(*this)`, supported by the pinned C++/WinRT
2.0.230706.1 composable base's conversion operator. It is published separately
as `8effb2dbe2573c96032b20a835a517ce0d52df9c`. Portable tests had not compiled
this native code; the new native run must establish its own compilation and
interaction results. Native drag recognition, ownership, event/data lifecycle
and strict OS interaction assertions are unchanged by that conversion fix.
