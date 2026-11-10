# iOS runner allocation failure at 0a4f34b

Job `129916254993` in
[workflow 42841109908](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42841109908)
never acquired a hosted runner. The original job response has `runner_id: 0`,
an empty runner name and an empty steps list. Its conclusion is `cancelled`;
the overall workflow conclusion is `failure`.

The failure annotation reports that the hosted runner never acquired the job
after multiple attempts. Three accompanying notices identify capacity
constraints for macOS ARM runners. The job was created at 15:07:42 UTC and
cancelled at 15:24:22 UTC on 2026-11-10.

`job.json` and `annotations.json` preserve the original public GitHub REST
response bytes. `provenance.json` records their exact source URLs, retrieval
time and SHA-256 values. No iOS build, decoder, Settings, Editor or pointer
step executed, so this is infrastructure evidence and supplies no new iOS
runtime acceptance result.
