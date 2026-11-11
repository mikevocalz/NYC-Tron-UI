# Combined mobile workflow: available originals and completed metadata

The combined PR64 native-controls workflow completed successfully. This receipt retains the complete source/pack and Android job logs. The iOS job is marked successful in completed job metadata, but two original-log retrieval attempts returned a transport-closed tool error. That retrieval failure is not a CI failure.

[Run 43015171227, attempt 1](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/43015171227/attempts/1) belongs to head `9a430338d8336283b230203a8555257798fcd62c`. Both retained original logs print generated checkout `e8f8c19db909a53f3054976449a7571b2a0524e9`. The tree and ordered parents are recorded in provenance.json. The iOS original checkout line has not been read.

| Lane | Available evidence |
| --- | --- |
| Source and canonical workspace pack | Complete original log; successful job and thirteen-archive producer metadata |
| Android | Complete original log; native build passed; log reports eleven decoder checks and four actual OS-driven UI flows passed |
| iOS | Completed metadata marks native build, decoder, XCTest-touch UI and artifact retention steps successful; complete original log unavailable |

Exact source/Android original sizes, Git blob identities, SHA-256 digests and line references are in provenance.json. Both were stored and independently read back unchanged. Completed job/step and artifact metadata, plus the precise iOS retrieval boundary, are in completed-metadata.json.

The available Android pass summary does not state a recovery count. No zero-recovery assertion is inferred. iOS check/flow/recovery counts remain unknown without its original evidence. The installed app ZIPs, runtime JSON, original UI-driver reports, screenshots and workspace archives have not been extracted or inspected; their API digests remain producer reports.

This receipt records the combined 9a candidate and does not transfer a pass to later source. It does not establish physical-device, assistive speech, performance, all-eight-platform acceptance, final original thirteen workspace plus two desktop archive verification, exact peer hashes or owner approval.
