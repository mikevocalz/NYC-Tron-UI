# Chromium overlay acceptance: helper 1283fd6

## Result

GitHub Actions run **42977406729**, job **130379593658** (`chromium`), completed successfully on November 11, 2026. The complete original job log reports **32 tests using two workers** and **32 passed in 9.3 seconds**. Independent parsing found exactly 32 unique case keys and reported ordinals covering 1–32: **12 menu/interaction cases** and **20 rendered viewport cases** across light/dark themes and phone/tablet sizes.

The interaction cases include keyboard selection, disabled actions, focus return, Tab containment, popovers, command-palette filtering, and tooltip focus/dismissal. These are the actual fixture results reported by Chromium, not a native desktop or screen-reader acceptance result.

## Actual checked-out source

The run API identifies helper head `1283fd6dea6cead03be7d0eb22863e02dbe648fd`. The original log's `git log -1 --format=%H` output identifies the actual generated merge checkout as **`039390442b53ef8a44ca413246cb56ae29f3e095`**. Independent retrieval of that commit confirms:

- Tree: `8bafabc7750c8a087a56a9a309fbd04f5ea0d377`, identical to the reviewed helper tree.
- Ordered parents: `ac5d69585a52a6e945dc996ea08030e190574699`, then `1283fd6dea6cead03be7d0eb22863e02dbe648fd`.

## Retained evidence and limits

[`chromium-job.log`](chromium-job.log) preserves the complete tool-returned original decoded log, including its initial BOM. Its **43,805 UTF-8 bytes** were independently rehashed: SHA-256 **`8dd0c46add455c45b19ff7963d2932895859c311c5466239ea2d39f2a4c188d6`**, Git blob **`fc1480d8226280181eac23f7dd73a19cee0ed754`**.

[`provenance.json`](provenance.json) retains every reported case, its derived case key and original log location, along with checkout and artifact boundaries. [`completed-metadata.json`](completed-metadata.json) records the completed run, job steps, and artifact metadata. Job timestamps unavailable from the successful jobs wrapper remain unknown.

The producer reports **20 uploaded PNG files** in artifact **13835573308**, `overlay-renders`, size **280,598 bytes**. The upload log and artifact API agree on SHA-256 **`65957a16752b1020c3ddefbfecffbecdb64bf112be66b1c39466a033c3b4fd68`**. That archive hash and member count are **producer-reported**: archive bytes were not retrieved or extracted, and no screenshot pixels were inspected.

The passing browser fixture does not resolve the separately held native acceptance gates or establish behavior of the modified Expo native consumer. No unchanged retry, dispatch, or repository reference update was performed.

[Completed run](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42977406729) · [Job](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42977406729/job/130379593658)
