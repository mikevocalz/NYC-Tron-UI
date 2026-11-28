# NYC-Tron documentation

This private documentation application builds one permalink for each public
component in `docs/library/components.json`, plus nine guides. The site uses
Tron's existing semantic web primitives and real React Native Web controls.
Its Tailwind theme belongs only to this app. The private host uses Tailwind’s
documented important import flag so utility recipes take precedence over React
Native Web’s unlayered reset; its className bridge preserves real RNW controls,
events and refs. This is not a change to the library styling contract. It does not alter a consuming
app's tokens, native window dimensions or orientation.

```sh
npm --prefix website ci --ignore-scripts
npm --prefix website run build
npm --prefix website test
npm --prefix website start
```

Open `http://127.0.0.1:4173`. Routes are static entry documents with lazy-loaded
per-component data, so the initial app does not download every props table.
The current bundle is built from the workspace's real component sources.
Native-only component examples name their required host; the docs do not
mount Windows or AppKit native controls in a web fallback.

```sh
node tooling/library-docs.mjs --check-examples
npm --prefix website exec playwright install chromium
npm --prefix website run test:browser
```

The compiler reads reviewed public declaration graphs and matching-version
React Native declarations to generate props tables and check all examples.
It is not a native build or runtime acceptance receipt. External native
contracts that cannot be flattened remain visible by exact declaration type.
Generated files are build outputs; `docs/library/documentation.json` is the
checked-in manifest-to-documentation map used by release tooling.

Stability labels remain proposals until owner confirmation. No documentation
build, automated accessibility result or example typecheck approves distribution.
