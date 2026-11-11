# External AppKit 395: document focus assertion failed

This receipt preserves **attempt 1** of external head
`3950710601981e53960da6057b99721ecb43044c`. Its source changes have **not been
adopted** into the reviewed candidate. The actual native compile passed; full
native acceptance failed, and the tested distribution was not retained.

## Exact source and checkout

The external head follows `057b3aa7a28c12594f26dd4bc9baf9bc636610e8` through
`f0196b0ef8ee8408d6e30cf17bd0e4b7d365dc72`. Comparing both complete trees found
exactly two changed paths: `packages/macos-appkit/spark/macos/NYCTronPopover.mm`
and its README. Both 2,050-leaf maps and all 284 tree-object hashes were verified;
the other 2,048 leaves and modes are unchanged.

The first commit adds presentation-decision logging. The next tries the requested
and opposite vertical edges, then the two horizontal edges in layout-direction
order, retaining the first actual frame that fits. A shown popover starts from
its cached fitting edge. The final containment/rejection path remains. All owner,
dismissal, focus-restoration and recycling source after `viewDidMoveToWindow`
is byte-identical. Driver `353fa05f…`, verifier `f21e9349…`, activation behavior,
fixture and workflow are unchanged.

Apple's [show API documentation](https://developer.apple.com/documentation/appkit/nspopover/show(relativeto:of:preferrededge:).md)
supports updating the preferred edge while already shown. This does not establish
a successful placement in this run. New unconditional shipping logs include
generated tokens and geometry; their adoption requires separate review. The
external commits' previous-run frame and cause descriptions remain attributed
to their author because the underlying original files were not inspected here.

The actual checkout was `b130aa3710c01190c5a247ece9d0e1773df88caf`, with tree
`b50228fd5e3e5af0a0913828e09b96e278854b6f` and ordered parents
`ac5d69585a52a6e945dc996ea08030e190574699`, then the external 395 head.
Both original checkout logs and immutable Git metadata establish this identity.

## Actual result and control-flow boundary

[Run 42996616807, attempt 1](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42996616807/attempts/1)
completed with native job `130442369577` failing at 09:54:42 UTC on November 11.
The first error is `false !== true` at executed verifier line **1257**:

```js
assert.equal((await inspect(undefined, 'document-1')).key, true);
```

The preceding document-window show, main-inspector close command, dismissal
status wait and popover `shown=false` wait returned. The next `main.key === false`
assertion did not execute. Neither did the later document-inspector presentation
at line 1265, owner minimization, or subsequent real pointer/native drag gates.
This result therefore does not validate the new edge fallback for the prior
057 document-inspector failure.

The external verifier has no object-specific `didClose`/subsequent-main-turn
witness before the immediate focus assertion. That is an observation gap, not
proof of the false key value's cause. The reviewed e086/c4 witness and c4 diagnostic
are separate source candidates; this receipt does not claim their runtime result.

The canonical core job passed **13** source tests; the consumer passed **16**
source tests. The installed API check reported **15 subpaths / 33 declarations**,
and the native transport probe passed **7** cases. Standalone compilation passed.
The console tooltip summary reports passed. These separate successes do not
convert the failed native acceptance into a pass. General source workflow
42996616914 also reported all three jobs successful; only its metadata, rather
than those additional job logs, is recorded here.

## Originals and limits

[native-job.log](native-job.log) and [source-job.log](source-job.log) retain the
complete decoded GitHub logs, including their UTF-8 BOMs and original LF endings.
Their bytes, Git identities and SHA-256 values are in
[provenance.json](provenance.json). That file also binds the three unique raw
build/startup/tooltip JSON lines still present in the native log; none had
interleaved non-JSON lines.

Artifact **13844364651** reports **54 files / 1,675,818 bytes** and digest
`2365b722807c67dc39f9798d6196bb8be77a300a0a390287d33be9595fceac35`.
The producer log and artifact API agree. Original ZIP bytes, app-log snapshot,
commands file, compiler transcript, process/sample files and screenshots remain
uninspected; their reported hashes are producer claims. The inspected console
contains only selected typed command records, not the full late state values.

[completed-metadata.json](completed-metadata.json) keeps the completed first
attempt separate from an **external attempt 2 metadata observation at
10:11:24 UTC**. At that snapshot, job `130451500938` was compiling. No live log,
later result, owned retry or source/host/security mutation is claimed.
