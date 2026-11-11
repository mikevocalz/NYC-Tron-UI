# Media decoder dependency

The web frame decoder imports unmodified Mediabunny 1.65.2, licensed under
MPL-2.0. Its license is included at `third-party/mediabunny/LICENSE`.

The complete Source Code Form, including original notices, is available in the
[exact npm source package](https://registry.npmjs.org/mediabunny/-/mediabunny-1.65.2.tgz)
and at [upstream commit 173f6b70765fa3a6ffc1c82737514416fa559ef5](https://github.com/Vanilagy/mediabunny/tree/173f6b70765fa3a6ffc1c82737514416fa559ef5).
The npm archive includes `src/`, `dist/`, and `LICENSE`; its SHA512 integrity is
`sha512-goZpibvo/5hkc/56WVNm93Ini+o7K4y8aXA20c/BN1B+m3L5aHQa8MTvO+S1APg/YI8kMILtrX6QCqUtxLW7bA==`.

Review scope: MPL sections 3.1–3.4 permit a larger work under separate terms,
require covered source availability, and preserve notices. NYC-Tron's adapter
imports the dependency and does not modify or copy its source. Consumers that
bundle its executable code must retain its license/copyright notices and this
source-availability notice. This review does not cover other dependencies or apps.

The dependency closure also installs `@types/dom-mediacapture-transform` 0.1.12
and `@types/dom-webcodecs` 0.1.13. Both shipped LICENSE files were inspected:
MIT, copyright Microsoft Corporation. They are declaration packages; their
original licenses remain with the installed dependencies.
