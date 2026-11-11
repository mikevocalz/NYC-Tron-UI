# AppKit a685 native outcome: help-tag text predicate failed

This receipt preserves the completed first native run of the startup-reporter candidate. Native compilation passed. Runtime acceptance stopped at the exact tooltip-text predicate. The selected native observation contains one nonempty `AXHelpTag`; it does **not** establish absence of a native help tag or prove that the displayed text was wrong.

## Source and run

- Repository: `mikevocalz/NYC-Tron-UI`; [PR 59](https://github.com/mikevocalz/NYC-Tron-UI/pull/59).
- [Workflow run 42944976627](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42944976627), attempt 1, completed with failure.
- Candidate head: `a685bd17d3023307181371a9c042bfbc1530c232`.
- Actual checkout in both complete job logs: `778ab991afb4dfe48b405800dc4b79e4bca97939`.
- Actual tree: `0b3c93477329d5db0076e0f6a54c6afa2dbcd3b8`.
- Ordered merge parents: `0edd5f302e99877191ba9a412c5c060571a5f6c9`, then the candidate head.
- Source job: `130275485575`; native job: `130275751812`.

The candidate added bounded failure reporting. This receipt introduces no native behavior, deadline, permission, assertion, launcher, cleanup, or retry change.

## Completed checks and first failure

The complete source log reports **11 tests passed**, with zero failed, skipped, or cancelled. The native consumer reports **16 tests passed**, also with zero failed, skipped, or cancelled. Installed public API verification, the seven-case native Foundation/socketpair transport probe, and standalone native compilation passed. The transport probe is separate from application acceptance.

The native acceptance step failed with:

> Timed out waiting for new visible native help-tag text after the posted pointer reaches the trigger

The original stack identifies `verify-native.mjs:394:9` and its call at `540:29`. Evidence upload succeeded; the passed-only tested-distribution step was skipped. No native acceptance success or tested package is claimed.

## What this run observed

Both selected summaries identify process **30952** and the actual merge revision.

Initial activation completed in this run. Client request 2 (`tron.window`) received a matching successful response. The native activation trace recorded `sameProcess: true`, `sameBundle: true`, and a prepared successful reply with policy 0 and active, key, visible state. This observation does **not** explain or resolve the earlier f157 startup timeout; the candidate did not change activation behavior.

At the failing tooltip gate, the selected summary reports:

- `postEventsAllowed` and `accessibilityTrusted` were true.
- The owner was visible, key, and active; accessibility traversal was not truncated.
- The cursor was at `(329, 384)`, inside trigger frame `(249, 366, 160, 36)`; pointer motion was no longer running.
- The outside baseline contained zero help tags.
- The last hover observation contained one `AXHelpTag`, window 41, with nonempty tag and window frame `(329, 347, 213, 18)`. The corresponding window observation was visible and onscreen.
- `textMatchesExpected` was false, and `matchingShownTagPredicateCount` was zero.

The reviewed projection computes that Boolean from the captured strings' exact membership of the expected tooltip text. The verifier had already asserted the trigger's tooltip/help property against that same expected text. The original captured strings and rendered pixels have not been inspected here. This receipt therefore records an **unmet captured-strings predicate**, without deciding whether the displayed text, accessibility extraction, or another part of the observation path caused it.

The shown-text wait precedes the tooltip capture and dismissal checks. Those checks and later acceptance gates are not promoted by this receipt.

## Original retrieved content

The following files retain the retrieved text without reserialization. Byte counts and independently computed SHA-256/Git blob identities are in [provenance.json](provenance.json).

| File | UTF-8 bytes | Retention scope |
|---|---:|---|
| [source-job.log](source-job.log) | 19,151 | Complete decoded source-job log |
| [native-job.log](native-job.log) | 79,188 | Complete decoded native-job log |
| [build-result.raw.json](build-result.raw.json) | 318 | Exact timestamp-stripped build JSON line |
| [startup-summary.raw.json](startup-summary.raw.json) | 22,624 | Exact timestamp-stripped startup JSON line |
| [tooltip-summary.raw.json](tooltip-summary.raw.json) | 2,931 | Exact timestamp-stripped tooltip JSON line |
| [tooltip-envelope.log](tooltip-envelope.log) | 3,801 | Original timestamped tooltip marker-to-marker block |

Extraction requires unique standalone marker lines after removing only the GitHub timestamp prefix. Each JSON file contains its original single JSON line with no added newline. The tooltip block has one complete JSON line and **nine interleaved Node stderr lines** before its end marker. All nine lines remain in `tooltip-envelope.log`; they are not additional JSON records. Their placement is preserved without assigning a cross-stream execution order.

[github-metadata.json](github-metadata.json) is explicitly normalized completed run/job/step/artifact metadata, not a verbatim API response.

## Producer-reported originals and remaining inspection boundary

The independently hashed items above are the retrieved decoded logs and extracted log strings. File hashes contained inside those strings remain **producer-reported** until their original bytes can be inspected:

- Compiler transcript: `build-console.log`, 12,329,230 bytes, reported complete and unnormalized.
- Live-log snapshot: `startup-app-log-snapshot.log`, 474,945 bytes, reported retained by an exclusive `wx` write. Its hash describes that fixed read-time prefix, **not** the eventual original `app.log`.
- Original process receipt: `native-process-failure.json`, 1,320 bytes, reported as a complete stable read.
- Sample: `native-process-sample.txt`; its digest was copied from the producer receipt. The reporter did not reread that sample. Seven reported thread groups do not establish application health.
- Original tooltip receipt: `tooltip-hover.json`, 6,042 bytes, reported as a complete read for the typed summary.

The command file was 555,041 bytes at the sampled reads. The bounded reader read 262,145 bytes and projected at most 262,144 bytes. It explicitly marked the read truncated/incomplete, emitted no whole-file commands hash, and retained 32 selected records from 424 complete scanned lines in that prefix. Those records are not the complete command tail.

The native artifact upload reported **46 files**, artifact **13822004903**, size **1,472,767 bytes**, and SHA-256:

`3181f50de6d97d31d2fb2942e5225e4fc851dc2542c4ea4f6f5813d131265b3b`

The connector returned a reusable ZIP file reference, but the execution environment remains unavailable. The original ZIP/member bytes, screenshots, raw help-tag strings, complete commands file, compiler transcript, and process sample have not been independently inspected. No raw ZIP is embedded in this receipt, and its producer digest is not presented as an independently recomputed hash.

Full producer-reported hashes, their scopes, and all verified retrieved-content identities are retained in [provenance.json](provenance.json). No retry, source change, reference movement, PR update, or release action is part of this evidence preparation.
