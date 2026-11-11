# Windows native outcome: exact Raw Icon peer unavailable

[Native workflow 43011337384, attempt 1](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/43011337384) completed with a managed UI Automation failure on candidate `782ed3911dd35950797f7417fed813f5fa669c4e`. The installed native package, consumer executable and deployment passed. The first runtime failure was **`Native RTL witness: icon-peer-unavailable (icon)`**; the PowerShell process exited 1. The strict witness was not bypassed and no passed/tested archive was emitted.

## Exact checkout and retained originals

The native log records the complete checked-out SHA at line 111: `dad54be82f3912e4ab3fc7e1fff6f7db70ebb81b`. Its independently fetched immutable commit has tree `7eb00e6b03fdec748227d03db04b232eb93a28d8` and ordered parents `25a6af6d020e34d790f6a4f3d9f117738b252f1e`, `782ed3911dd35950797f7417fed813f5fa669c4e`. The executed navigation blob is `877c51ea1e16918968a6929e389c1f61f4a4e23d`. This result belongs to that exact candidate/merge.

| File | Git blob | UTF-8 bytes | SHA-256 |
|---|---|---:|---|
| `native-job.log` | `74e0086d59709bc6de9b8536e5100a1b99344737` | 396,613 | `f2c35f37f2a49c10844457e394e1af37de748838c9e4a99b66e27423a66538e5` |
| `rtl-witness.json` | `03b9a1a64661e9217ba00402a17d4d1d898f1070` | 724 | `bfec71de51d58df014082a38a3044e099574e31207039ad3b6c5405109fb1c33` |
| `rtl-witness-envelope.log` | `808c5442caa06205a9f1ed67436328863e913fa6` | 863 | `67576b542dd514d69a5093218944162cf341c3c571df50669d5fa3462788bc9a` |
| `workflow-metadata.json` | `bbf0ae0039349b66949f899adb2e1dd7a7ad7efa` | 15,116 | `a2e77b2630f99b520fe0526543a43142e4e2da47f0964f0e3bb07dfa453e5a73` |

The complete original native job log was fetched only after completion and retained without newline normalization. Its 1,984 LF-delimited records include the original CRLF. The unique RTL marker span is original lines 1906–1908, with no interleaved stderr. `rtl-witness.json` removes only the timestamp prefix from line 1907 and retains the original JSON text and trailing CRLF; it is not reserialized. `rtl-witness-envelope.log` preserves the complete timestamped three-line span. All four listed files were fetched back and matched their recorded byte counts, Git object IDs and SHA-256 hashes.

The workflow's source job `130491405238` completed successfully; native job `130491810736` ran from 11:22:50 to 11:33:26 UTC on November 11. The separate full-source workflow `43011337381` is retained by root and is outside this native receipt.

## What the actual witness observed

The typed envelope reports:

- Complete initial Raw-view traversal: **46 nodes discovered and read**, maximum depth **9**.
- Exactly **one toggle** and **one named navigation ancestor**, but **zero qualifying Icon peers**.
- Failure code `icon-peer-unavailable`, role `icon`, with `pollAttempts: 0`.
- `binding`, `ltr`, `latest` and the final discovery record are null.

This establishes that this complete bounded owned Raw-view search did not expose the required descendant with exact AutomationId `Icon`. It does **not** establish that the rendered icon is absent, invisible, misplaced or missing from the actual XAML visual tree. UIA peer availability and visual existence are different facts. The sequential traversal is not an atomic visual-tree or rendering snapshot.

The source calls initial binding before the “Use RTL navigation” action. That action, LTR/icon geometry capture, RTL geometry polling, and the later drawer/high-contrast assertions were therefore not reached. There is no actual RTL geometry result to promote or reinterpret.

## Earlier checks and preserved failure handling

The same native job log records 49 package tests passing with zero failures, the isolated API snapshot matching 1 package / 8 typed subpaths / 44 reachable declarations, and 5 reference owner tests passing. These are separate groups, not a new full repository suite. The diagnostic compatibility step also passed; its explicit parser list does not include the navigation script. The navigation script itself subsequently parsed and ran in Windows PowerShell, as the actual selection, resize, Raw search and finally records demonstrate.

The four strict native drag scenarios returned before the navigation fixture: rejection, Escape cancellation, target closure during delayed approval, and an accepted cross-window transfer. This is a control-flow inference from the unchanged exact `uia-smoke.ps1` blob `aa54819df02c2decfba2fb19e3b4d2a5aaabd554` and its sequential assertions at lines 632–677, together with the inspected screenshot-save and navigation-entry log records. The original per-drag files and PNGs remain uninspected; screenshots being saved is not image inspection.

Navigation entered, settings-focus selection remained committed, and resize selection checks at widths 992 → 772 → 992 returned. After the binding failure, the fixed catch/finally markers, contrast-restoration return, window-restoration return and result-serialization return were all logged. The original binding error remained the reported failure. The subsequent process observation recorded PID 5380 still active, HWND 524430 still present and owned by that PID; the existing scoped WER query reported zero matching records. This run shows a preserved managed assertion failure, not an observed heap-corruption exit or proof about earlier crashes.

## Host and artifact limits

All four existing drag-environment console projections observed app PID 5380 and shell PID 6340 with TokenElevation 1, elevation type 1, integrity RID 12288 and UIAccess 0. The shell eligibility check remained `observed-ineligible`: eight predicates observed true, two observed false and two unobserved. These observations do not establish a supported unelevated host or authorize a launcher/security change. The original environment-file sizes and hashes in those projections are producer-reported; the original files were not extracted.

The evidence artifact is `13851516736`, reported as 438,056 bytes, 51 files and SHA-256 `07f372aeb2a6691d17d4c8c4dceedce093f793ef3ff1fb7f367623be563a5a93`. The log and API metadata agree. The ZIP has not been downloaded, independently hashed or extracted here; no PNG or original navigation-result file was viewed. Its reported archive digest is separate from the independently verified original log and exact console-excerpt hashes.

Both “Retain the exact package that passed native acceptance” and “Upload tested Windows distribution” were skipped. No full native, final release, supported-host, or eight-platform acceptance is claimed. This receipt changes no source, test requirement, workflow, ref, PR, host setting or CI run.
