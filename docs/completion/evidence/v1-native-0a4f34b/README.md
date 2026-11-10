# Native workflow at 0a4f34b

[Workflow 42841109908](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42841109908)
tested PR head `0a4f34b9334814f5bfd9b1568402a2a131faedd8` on 2026-11-10.

| Job | Result | Meaning |
| --- | --- | --- |
| Native source/contracts/pack | Passed | The native source and package gates completed. |
| Android installed consumer, `129916255586` | Passed | All eleven media checks and four OS-driven UI flows completed. See [Android evidence](android/README.md). |
| iOS installed consumer, `129916254993` | Runner allocation failed | No runner acquired the job and no build or UI step ran. See [original job and annotations](ios/README.md). |

The overall workflow failed because of the iOS runner allocation failure. This
run neither validates nor rejects the corrected iOS keyboard actions. The
earlier actual keyboard failure remains in
[`v1-native-e8a7efb/ios`](../v1-native-e8a7efb/ios/README.md).
