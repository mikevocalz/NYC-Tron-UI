# T5 documentation design and handoff

Scope: a runnable documentation site for all 478 public component exports, declaration-derived props, examples, nine guides and contributor/distribution policies. Stability remains proposed until owner confirmation. This report records implementation decisions and measured limits; it is not owner approval or publication.

## 1. User research output

Three inferred developer needs guided the work: a first-time Expo developer needs one exact install and copy path; an experienced consumer needs the precise root or direct import and full inherited props; a maintainer needs platform evidence and stability separated from proposals. These are hypotheses from the brief and repository, not interview findings. The primary task is installation → Button lookup → copy example → inspect platform limits.

Mobbin was consulted before implementation. [GitBook documentation screen](https://mobbin.com/screens/09b79d8f-f3cc-40cd-bc47-374899eb9ff2) informed a persistent directory and explicit current-page context. [OpenAI Platform documentation screen](https://mobbin.com/screens/1b39571a-c929-4ba6-934c-9786fc50681d) informed task-oriented entry cards and a clear code-reading hierarchy. The index/search template uses the first pattern; component/reference and guide templates use the second. Assets and source were not copied.

## 2. Design system output

Reused the library semantic Page, Header, Nav, Aside, Main, Section, Text and code primitives and actual Button/Card/TextField/NavigationRail/NavigationShell examples. App-owned theme values live in website/src/theme.css: primary #3156a3, ink #203047, muted #526176, borders #77869c and white surfaces. Documentation chrome is a web header with a directory, not a native rail application shell. Existing public APIs and native window contracts are preserved. Gluestack installation, Tamagui tokens, Paper Button and shadcn documentation were reviewed for installation, token and API reference conventions.

## 3. UX copy output

Actions identify their result: “Search components”, “Try Button”, and “Getting started”. Empty search explains that no components match. Root/direct imports have distinct secondary labels and precise accessible names. “Proposed stable” and “Proposed preview” are visibly distinct from owner-confirmed labels. Platform notes distinguish declaration checks, actual measurements and unmeasured native hosts. Confirmed-manifest rendering has a synthetic fixture test without changing real owner records.

## 4. Frontend design output

The site separates navigation, reading and live demonstration. Desktop reserves a directory beside the reading pane; phone layouts stack navigation and content, with wrapping code and horizontally scrollable focusable props tables. Aptos/Segoe UI/system typography, quiet surfaces, blue actions and a compact code hierarchy support reference reading. The private RNWeb class adapter preserves actual component events/refs while forwarding app-owned compiled classes. Tailwind’s documented important import resolves RNWeb unlayered reset precedence.

## 5. Design critique output

Independent live Argent review caught two material defects: the main pane initially fell below the directory, and real Button variants initially inherited unstyled RNWeb defaults. Both were fixed. The lead reloaded the site and verified a blue primary Button with white label, horizontal loading indicator, 44px control, successful press-count update, and exact-name search ordering with UI direct/root entries first. Route assertions now check the exact import and component ID to prevent alias false positives. This does not claim live interaction testing of every native component.

## 6. Accessibility review output

Semantic landmarks/headings, named navigation/search, explicit pending labels, disabled/loading states, keyboard-focusable overflow tables, responsive reflow and reduced-motion rules are implemented. Calculated white-background contrast is 7.02:1 for primary, 6.31:1 for muted text and 3.70:1 for control borders. Automated axe checks cover four shared templates at 1440px and 390px with WCAG 2 A/AA and 2.1 A/AA tags. The verification receipt records the actual latest outcome. Full manual screen-reader speech, complete keyboard traversal, actual browser 200% zoom, all native widget behavior, hardware testing and complete WCAG conformance are NOT RUN or not claimed. Responsive viewport checks are not substituted for browser zoom.

## 7. Design handoff output

Desktop reading/directory layout changes at 1000px; phone composition changes at 700px; narrow headers wrap below 360px. Zustand retains counter, selected example and text draft across responsive resizing. Public component routes are /components/<generated-slug>/, with exact IDs/imports bound in docs/library/documentation.json. Data, page, source and example raw SHA256 values bind review evidence to source. The generated verification receipt and route-results.json record exact browser-rendered import/label coverage. Native-only examples require their documented host; typed examples are not native runtime proof.

## 8. Code review and verification handoff

The independent reviewer identified and prompted fixes for pending-label assumptions, same-symbol alias assertions, and the confirmed-guide build branch. The site uses Zustand and existing semantic primitives. npm --prefix website run verify builds the site, checks all declaration examples, runs catalog tests, runs Chromium routes/interactions and automated accessibility, and emits hashed evidence only after successful commands. The clean-runner workflow additionally creates an Expo app and runs the exact installation-guide example from the specified release tarballs. That remote clean install is not reported as locally passed. No npm publication, merge or stability promotion is performed here.

Final local verification: npm --prefix website run verify completed successfully after the installed Chromium was permitted outside the sandbox. Build generated 478 component routes and nine guides. All 478 declaration examples passed with zero errors and no unresolved required-prop placeholders. Four catalog tests and five browser tests passed with zero skips/failures. Exact route/import/component-ID/stability assertions covered 478 exports; automated accessibility covered eight template/viewport combinations with zero violations. Browser time was 36.7 seconds. Machine-readable receipts and command logs are generated under website/generated and included in the workflow artifact; they are not source-controlled approval records. The new clean-runner install job still needs its actual remote result.
