# Independent Android900d fresh-run evidence inspection

Result: the broader native-controls Android retry passed its recorded decoder and OS-driven UI acceptance. This is not kitchen-specific acceptance or release approval.

Reviewer: skill_discovery. No code or device actions. Inspected successful job137512752637 in run45113034787 through GitHub job-step summaries and the fresh artifact14794710821, created2026-11-23T06:15:04Z. This is distinct from the earlier failed same-name artifact14791042061. All listed job steps, including native build and installed decoder/UI execution, report success.

Artifact source is900d8ca3ff4f0c111f1b3b1c75879beadb584597. Receipts record57ca6645d01b0895359e6f0d329a4c14f24fdc03; independent git tree comparison proves both have tree f8773365df73e32e16edb02919f35cb81787405c. The decoder receipt passes all11 named checks in4730ms on emulator-5554/API35. Settings, Editor, Pointer and Pointer-cancel each have one executed SUCCESS JUnit case, with no failures/skips. No transport recovery was recorded on this fresh successful UI run.

| UI stage | Executed | Failures | Skips | JUnit |
| --- | ---: | ---: | ---: | --- |
| settings | 1 | 0 | 0 | SUCCESS |
| editor | 1 | 0 | 0 | SUCCESS |
| pointer | 1 | 0 | 0 | SUCCESS |
| pointer-cancel | 1 | 0 | 0 | SUCCESS |

Independently recomputed every stage's referenced JUnit, hierarchy and screenshot SHA256 and both native-artifact-manifest references; all match receipts. Decoder and UI agree on APK identity4f007f4b9fb49c2bc85799dd111ac71bb5aa8a3e82bfe9a01e214ec6f7ae3941 and installed rc.3 package provenance, with no absent peers. The UI receipt also retains pinned Maestro2.12.1 metadata. APK identity is recorded and mutually consistent, not independently rehashed: the APK was deliberately not downloaded.

Used bounded ZIP byte ranges:55 small text/JSON/XML/log entries plus7 PNGs,462441 downloaded bytes total including repeated directory ranges, excluding the122151851-byte ZIP and its APK. ZIP entries passed size/CRC checks; extracted receipt references passed SHA256 checks. Advertised full ZIP digest beaffd882f5ee6567d0d205a4e4ceb80f23ab2c931134e1e33dca46ff553eed6 was obtained from GitHub metadata, not recomputed from the entire archive.

Limits: this confirms the broader shared Android simulator acceptance for that exact source tree and artifact. It does not certify the latest kitchen candidate, all478 component imports, physical pen/palm behavior, TalkBack speech, owner labels/distribution approval or release eligibility. Receipt manual gates retain physical pen pressure/tilt/hover, physical palm rejection and VoiceOver/TalkBack spoken output. Dependent Android launcher job137520398405 was still running when assigned and is not claimed passed here. Prior failed attempts remain failed historical evidence.

## Inspected receipt/JUnit SHA256

Paths are artifact-relative under nyc-tron-native-consumer.

```json
{
  "runtime-android/result.json": "e5c40076ae9e78396c9cba7d5eb7028e505c07089e84a5f6d5002a5b0abbcb81",
  "runtime-android/native-artifact.json": "cb56aeb579b5dcc8b5c1bc45295fe2f75219cd5fd9d00a5e77c0c43a68059e79",
  "runtime-ui-android/result.json": "ea1c8235f94d696b721a8ca69ece4a56c22de50bd3e1c454e60cf6816d388a72",
  "runtime-ui-android/native-artifact.json": "cb56aeb579b5dcc8b5c1bc45295fe2f75219cd5fd9d00a5e77c0c43a68059e79",
  "runtime-ui-android/settings/report.xml": "1da62cc5800b6c300949aab9bd9c46258f5dbd77d5e331f00f1d989feb523f76",
  "runtime-ui-android/editor/report.xml": "2e30ac66b5f646fdbf1b09f2a557c1e8dfeab89c9a08253d1eb524f8411e1abb",
  "runtime-ui-android/pointer/report.xml": "ee0fdcde4da8921ae2f1755022126cd7bad9f9559ff6c9511d495428706b8f0e",
  "runtime-ui-android/pointer-cancel/report.xml": "f420108d3502a5851fc12dd11825f6f02c02c5f7cc30c73aa8a2165755b05515"
}
```
