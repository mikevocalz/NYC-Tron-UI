# Windows: requirements for the next supported-host acceptance run

Status: proposal only. No host was provisioned, launcher changed, privilege adjusted, or workflow retried for this document.

## Required existing host

The [057858 run](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42935377885) observed an elevated app and an elevated existing shell. It therefore did not establish an eligible shell for an unelevated activation route. The next run needs an already available interactive Windows x64 host where the acceptance session can run normally without elevation.

- Use a signed-in, unlocked input desktop with a non-elevated shell at Medium integrity and UIAccess 0. Run the UIA driver normally in that session. Keep its owned app windows visible and unobstructed.
- Confirm actual app and shell token observations in the new receipt. Session equality, input-desktop observations, stable identities and same-user equality must be observed for the conservative shell-review predicate. The current host deliberately skipped same-user queries after observing an unsupported elevated shell; it did not observe unequal users.
- A positive shell predicate permits review of an activation route only. It does not prove a later app's token, target event delivery or successful drag/drop. The actual app must itself be non-elevated; the matching automatic CanDrag path uses [StartDragAsync, whose documented contract excludes elevated/admin operation](https://learn.microsoft.com/en-us/windows/windows-app-sdk/api/winrt/microsoft.ui.xaml.uielement.startdragasync?view=windows-app-sdk-1.8).
- Provision the build and packaged-deployment prerequisites before this acceptance session: Visual Studio 2026 with the required C++/WinRT build tools, an installed compatible Windows SDK, Node 24.19.0, PowerShell 7 for build steps and Windows PowerShell Desktop 5.1 x64 for UIA. Keep RNW 0.85.0, RN 0.85.3, React 19.2.3 and Windows App SDK 1.8.260508005 as pinned by this lane.
- Package registration must already be permitted for the test account. Do not replace packaged activation with a bare executable. Do not elevate UIA to obtain optional crash dumps: the existing app-scoped WER helper records setup denial and continues.

The current helper workflow selects `windows-2025`; the observed host behind that selector failed the scalar shell prerequisites. An owner-provided eligible host and a separately reviewed way to route the job to it remain external setup requirements. Neither an unchanged retry nor a different label alone proves those conditions. This proposal contains no account, UAC, token manipulation, shell replacement or launcher-delegation procedure.

## Next run, using the existing repository gates

Use the exact reviewed candidate and record its actual checkout SHA/tree. Preserve the [current workflow's](https://github.com/mikevocalz/NYC-Tron-UI/blob/0578582686e483003db64e252e4ea65f0b48c093/.github/workflows/winui-fabric.yml) source, archive, compiler and assertion steps when routing the native job to the eligible host.

1. Keep the canonical shared-archive producer and verification. Install the original Ubuntu-produced core/windows-fluent archives, their SHA256SUMS, and the candidate Fabric archive into the fresh consumer through `packages/windows-fluent/rnw-fabric/scripts/prepare-consumer.mjs`. Do not repack shared peers on Windows. The combined release's canonical archive handoff must also remain intact.
2. Require the existing source/API checks and the full Windows PowerShell 5.1 compatibility step: copied-script parsing, production C# compilation, real scalar-token/borrowed-handle check, ten portable environment groups, seven portable input groups, and the three real self-token/session/SID-bounds groups. Compatibility-process evidence must remain separate from actual UIA-app evidence.
3. Run installed-package code generation, official cpp-app generation, host registration, type checks, consumer owner tests, native library build and consumer solution build. Preserve the release-bundle singleton check.
4. Deploy with the existing `react-native run-windows --release --arch x64 --no-launch --no-packager --no-autolink` workflow step and its existing SDK/MSBuild properties. Resolve the registered package's AUMID using `Get-AppxPackage`; keep the test under that package identity.
5. From the generated consumer, run the unchanged UIA command in Windows PowerShell 5.1:

   ```powershell
   & .\scripts\uia-smoke.ps1 -AppUserModelId $env:CONSUMER_AUMID -ProcessName NYCTronWindowsExample -OutDir "$env:RUNNER_TEMP\uia-smoke"
   ```

   The workflow supplies the real checkout's `GITHUB_SHA`. Do not substitute an unrelated revision or reuse a previous app/receipt. The driver's bounded app/shell observation remains before pointer movement and the final endpoint recheck.

6. Keep every native outcome strict: rejection retains ownership with zero transfers; Escape cancels; closing a target during delayed approval cannot permit a late transfer; the accepted native Move changes ownership exactly once. Preserve menu/tooltip, rapid inspector editing/rejection/remount, lifecycle and navigation assertions. The current driver also requires Settings focus return, resize/focus retention, explicit RTL with the physical-left pane, collapse/restore and high-contrast repaint/input.
7. Only after the complete UIA result passes, run the existing `retain-tested-package.mjs` step. It requires all 19 acceptance IDs and the five navigation checks from the same process/revision, verifies the original installed archive/file/lock bytes, and retains the tested Fabric archive, SHA256SUMS, preparation receipt, original package lock and tested-package receipt.

## Evidence and completion boundary

Retain complete source/native logs, exact head/merge/tree identities, original UIA trees/screenshots, app/shell environment receipts, native drag trace plus copy/hash receipt, process/crash observations and the passed-only package artifact. Preserve raw JSON bytes for FILETIME values above JavaScript's safe-integer range; use the ISO timestamps for derived summaries.

For 057858 specifically, the original log reports **40 uploaded files, 51 final descendants and 0 matching Application Error/WER records**. Its original ZIP remains unextracted here. The final drag label and target-event trace were not inspected; they must not be inferred from older runs.

A supported-host snapshot alone does not close native acceptance. Completion still requires the unchanged native gates and byte-bound tested distribution to pass for the actual reviewed candidate. Narrator speech, physical pointer/touch/pen and physical display/DPI evidence remain distinct from this synthetic OS-input CI run.

Repository sources: [UIA driver](https://github.com/mikevocalz/NYC-Tron-UI/blob/0578582686e483003db64e252e4ea65f0b48c093/packages/windows-fluent/rnw-fabric/example/scripts/uia-smoke.ps1), [environment helper](https://github.com/mikevocalz/NYC-Tron-UI/blob/0578582686e483003db64e252e4ea65f0b48c093/packages/windows-fluent/rnw-fabric/example/scripts/uia-drag-environment.ps1), [package retention](https://github.com/mikevocalz/NYC-Tron-UI/blob/0578582686e483003db64e252e4ea65f0b48c093/packages/windows-fluent/rnw-fabric/scripts/retain-tested-package.mjs), and [app-scoped crash diagnostics](https://github.com/mikevocalz/NYC-Tron-UI/blob/0578582686e483003db64e252e4ea65f0b48c093/packages/windows-fluent/rnw-fabric/example/scripts/uia-crash-dumps.ps1).
