# Distribution proposal

Keep GitHub Release tarballs for 1.0.0 while the owner considers npm separately.

## Recommendation

Retain GitHub Release tarballs for 1.0.0. All sixteen distributable packages are private, and current gates enforce that contract. npm distribution is an owner decision; this proposal publishes nothing.

## What npm would require

Confirm scope/package availability and publishing access; complete licensing and source-availability review; settle peer-range policy and supported runtime claims.

Coordinate private flags, package versions, dist-tags, provenance, release automation and rollback across sixteen packages. Preserve the exact independently tested desktop archives. Add clean npm consumers for each supported lane before claiming the path works.

Only the owner’s exact version/checksum GitHub comment satisfies stable distribution approval. These docs do not alter that record.
