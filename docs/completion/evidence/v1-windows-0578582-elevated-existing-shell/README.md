# Windows: existing shell observed elevated; native drag gate still fails

The corrected diagnostic now runs successfully. It directly observes that **both the app and the exact existing desktop shell are elevated at High integrity**. The existing shell is ineligible for reviewing an unelevated activation route on this run. Native builds and deployment passed; the strict rejected-drop result still failed.

## Exact source and actual checks

[Run 42935377885](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42935377885) tested helper `0578582686e483003db64e252e4ea65f0b48c093` and tree `99a1e8463fd2f6aab907589aef37e3c59c557962` through actual PR merge `0a44cc99e8d7e1932235a463d4b1f3d82047fe8c`. Ordered parents are `0edd5f302e99877191ba9a412c5c060571a5f6c9` and `0578582686e483003db64e252e4ea65f0b48c093`. All 2,076 helper leaves and the actual merge's tree and parents were independently verified.

Source job 130244042064 passed the 13-check native-source invocation and the full 49-check suite containing those same 13 checks, with zero failures/skips, plus API 8/44. These remain 49 distinct source checks.

Native job 130244373435 passed the actual Windows PowerShell Desktop 5.1 x64 parser and production C# compilation. Its original log contains the real owned-process scalar-token check, all ten portable environment groups, all seven portable input groups, and three real native token-user/session/borrowed-handle/SID-bounds groups. The 21 actual PASS marker lines are retained; mocked environment/input cases remain distinct from real compatibility-process and app observations.

Native code generation, the library build, the actual consumer build and packaged deployment passed. The later UI Automation failure remains:

```text
UIA element named 'Native drag result: none/rejected' did not appear within 30 s
```

The required drag-start phase and checked pointer path were passed before this wait. The owned app remained alive, with PID 5464 and main HWND 852334, 51 final descendants and zero matching Application Error/WER records. Passed-only archive retention and upload were skipped. The actual final result label and target-event trace remain uninspected in the original ZIP; no older `none/cancelled` or zero-target-event observation is assigned to this run.

## Existing-shell observation

The source-bound snapshot was captured at `2026-11-11T01:07:09.5996127Z`.

| Observation | Actual result |
|---|---|
| App PID | 5464 |
| Driver PID | 2480 |
| Exact GetShellWindow HWND / PID / native TID | 65754 / 7940 / 7928 |
| App and shell TokenIsElevated | 1 / 1 |
| App and shell elevation type | 1 / 1 |
| App and shell integrity RID | 12288 / 12288, High |
| App and shell UIAccess | 0 / 0 |
| Shell-to-driver and shell-to-app session comparisons | Both observed equal; session 2 |
| App, driver and shell input desktops | All observed receiving input |
| Before/after owned identities and shell window/PID/TID | Stable |
| Native query/owned-handle close errors | None reported |
| Same-user comparisons | Not requested after unsupported shell scalar observations; unknown |
| Review-only eligibility | `observed-ineligible`, `eligibleForActivationReview: false` |

Eight predicates were observed true, two were observed false (not elevated and medium integrity), and two same-user predicates were unobserved. An unobserved predicate's placeholder `value: false` is not evidence of unequal users. The native comparison fields explicitly record `not-requested-unsupported-shell` and null values.

The existing source/binary review ties this automatic CanDrag path to [StartDragAsync's documented elevated-app restriction](https://learn.microsoft.com/en-us/windows/windows-app-sdk/api/winrt/microsoft.ui.xaml.uielement.startdragasync?view=windows-app-sdk-1.8). Microsoft also documents execution through an existing Explorer process, but the observed shell here is elevated too. That supported route's prerequisite is not met. No launcher, account, UAC, privilege/token setting, native drag code, pointer timing or required outcome was changed.

This is a supported-host boundary, not proof that elevation caused this exact timeout or that an internal null-operation guard executed. No conclusion is drawn about an unobserved host or another process.

## Preserved evidence and exact-byte limits

Root and the independent desktop reviewer separately retrieved matching complete original logs:

- Source: **31,778 UTF-8 bytes**, SHA256 `f84eacf2fafa050f5c356bf523ae7b903fdc12bea12721ec88136db191e7dfc5`.
- Native: **342,310 UTF-8 bytes**, SHA256 `42da2fe547a670dbecefc8be2e306558fbd7655a64adb78d1cd18ff17f1bc79f`.
- Exact selected environment JSON line: **14,447 UTF-8 bytes**, SHA256 `9779ce53637b511cee1799d541f491e8046ad859f2a93acb00596f68738df80a`.

The selected JSON is retained verbatim, with only its log timestamp prefix and line ending removed and no newline added. Its `creationFileTime` numbers exceed JavaScript's safe integer range, so the saved summary was **not parsed and reserialized**. Derived provenance uses the original ISO timestamps and observed identity result without copying rounded file-time numbers.

The producer reports the original `drag-environment-01.json` as **81,458 bytes**, SHA256 `a2979710a36cca878303ec7b210dde074b2fd92c5527cdf6cfceaf38ca66c5ac`. Artifact **13817948422** reports 40 files, **337,987 bytes**, SHA256 `89e4daac0a89fe272f2f3d5788ecc97b5f740e722aafa2e7119d60b37d70ff9b`. Those original file/ZIP/member bytes remain unextracted and unverified independently while the execution workspace is unavailable. The selected log summary is not the full original environment file.

The [preceding parser failure](../v1-windows-2566b2b-shell-fixture-parse-failure/README.md) remains separately retained. This new result establishes its one-line correction worked, but does not replace complete native acceptance, final combined-candidate testing, physical-device evidence or exact owner-approved distribution.
