# Versioning policy

Define the public contract before making a stability promise.

## Stable components

A confirmed stable API is covered by Semantic Versioning: compatible fixes are patches; compatible additions are minors; removals, renames, incompatible types or behavior require a major. Broader support claims require their own evidence.

Stable labels are not yet confirmed in the current proposed manifest. A label alone cannot satisfy release evidence.

## Preview components

Preview is an explicitly experimental API outside the stable component promise. It may change in a minor only when clearly labelled preview in the manifest, docs and changelog. Announce the old and new contract with a migration example.

Preview does not mean inaccessible, undocumented or safe to claim on unmeasured platforms. Preserve compatibility where practical and document all changes.

## Deprecation and distribution

Announce deprecation before removal, retain the old import where compatible and explain migration. Package versions remain synchronized across release archives. The owner approves any public export removal, rename or type change.

[Semantic Versioning 2.0.0](https://semver.org/)
