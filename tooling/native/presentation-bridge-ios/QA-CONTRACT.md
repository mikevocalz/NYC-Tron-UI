# Focused decoder bridge QA contract

App: ai.nyctron.p03bridge on iOS simulator. Start state: installed isolated host, own Metro at8081; each launch clears only this sandbox's decoder-owned cache and overwrites task-owned fixtures. Source is the actual checked-out NYC-Tron platform-services package; the player is absent.

| Action | Required outcome | Executable evidence |
| --- | --- | --- |
| Restart app | Decoder bridge screen opens | Visible p03-bridge-result |
| Deterministic native checks run | Native v1 capabilities exist | P03 BRIDGE PASS only after direct capability checks |
| Index and decode CFR/VFR/B-frame fixtures | All36 actual PTS and real nonempty JPEG files match expected | P03 BRIDGE PASS only after each native assertion |
| Clear cache and invalid requests | All36 JPEG files disappear; cap and missing timestamp reject with native codes | P03 BRIDGE PASS only after filesystem/error assertions |

No tap/gesture navigation is needed: this is a native integration test host. Final acceptance requires recorded first launch and two unchanged full runner passes. Fixtures and returned File handles remain imperative locals, never serialized Zustand state. This case does not cover the player, Android or broad format/performance acceptance.
