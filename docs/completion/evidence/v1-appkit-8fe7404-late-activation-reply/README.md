# AppKit activation reply arrived after the client deadline

[Run 42907095248](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42907095248)
passed all eleven source checks, clean installed-consumer/API verification, the
actual Foundation/socketpair probe and native compilation. Authentication and
the native main-queue ping replied. The first `tron.window` show/activation
request then exceeded the unchanged 35-second client deadline. No interaction
group completed and the menu-generation correction was not reached.

## Observed transport and process state

The native trace receives request 2 at 21:57:47.107557 and dispatches it on the
main thread at 21:57:47.110777. The client times out at 21:58:22.111. A main-thread
reply arrives at 21:58:22.597055, about 35.486278 seconds after dispatch. It then
serializes 157 bytes and sends 158 including the newline, with no replacement or
serialization failure. The late payload is not retained; its length cannot
establish its success/error fields or activation state.

PID 37118 remains present before and after sampling. The original process sample
contains 29 thread groups and begins at 21:58:22.394, after the client deadline
and shortly before the late reply. Its main thread shows AppKit event-loop
activity. Sampling does not describe the preceding 35 seconds or prove why the
reply was late. The existing trace does not distinguish stages inside the
NSWorkspace activation request and callback path.

The previous 3b run passed this startup sequence and native controls before
failing menu dismissal. This 8fe run does not invalidate that historical pass,
prove a menu regression or establish a transient host cause. Native deadlines,
single-session behavior, actual tooltip/drag requirements and all assertions
remain unchanged. No tested AppKit distribution was created.

## Original evidence and identity

Head `8fe7404827caa3f76a2e42e323caf4a1d9ef7504` and actual checkout
`44c46345761e6d15f847458dc85bb3cf2cc0810d` both have exact tree
`416e684b13c99709e1502a11f121bcf3124980d6`; trees and merge parents were verified.
Artifact `13806068903` retains 838,076 original ZIP bytes at SHA-256
`66f320c5e5ff4d1009c5f2ab8a989808f990cce17fdc257bdafd4de6a9b2e6f5`.
All 42 unique original members match the ZIP and original extraction. Forty-one
are also retained directly; the complete 12,299,645-byte compiler log remains
inside the unchanged ZIP. A separate 31-byte xcodebuild version-probe log is
also preserved. The member manifest records all sizes and hashes.

The complete source-job log is 19,322 bytes with SHA-256
`3b4eef0e10223bc881ddd67342de53ac483a5e2004a758ee48fbbcdcc9ea692c`
and matches a separate connector retrieval. Complete job/artifact snapshots,
original/private-patched source and license, all four exact checkout patch
inputs and original probe outputs are retained. The controlled probe cases
again passed within their Foundation/socketpair scope. Native-app payload and
probe-executable hashes remain producer-reported because their binaries are
absent from this artifact.
