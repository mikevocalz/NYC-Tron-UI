---
name: "HtmlModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/html"
tier: 2
docs: "generated"
platforms: ["ios", "android", "web"]
category: "primitive"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# HtmlModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/html/semantic.native.tsx,packages/ui/src/components/html/semantic.web.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/html/semantic.native.tsx,packages/ui/src/components/html/semantic.web.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/html
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { Page, Main, Header, Footer, Section, Nav, Article, Aside } from "@/components/nyc-tron/ui/components/html/semantic";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { Page, Main, Header, Footer, Section, Nav, Article, Aside } from "@nyc-tron/ui/components/html";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/html/semantic.native.tsx,packages/ui/src/components/html/semantic.web.tsx -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `Article` | const | `const Article: (props: SemanticBlockProps) => ReactElement<unknown, string \| import("react").JSXElementConstructor<any>>;` |
| `Aside` | const | `const Aside: (props: SemanticBlockProps) => ReactElement<unknown, string \| import("react").JSXElementConstructor<any>>;` |
| `Footer` | const | `const Footer: (props: SemanticBlockProps) => ReactElement<unknown, string \| import("react").JSXElementConstructor<any>>;` |
| `Header` | const | `const Header: (props: SemanticBlockProps) => ReactElement<unknown, string \| import("react").JSXElementConstructor<any>>;` |
| `Heading` | function | `function Heading({ level, numberOfLines: _n, selectable: _s, ...props }: HeadingProps): ReactElement<unknown, string \| import("react").JSXElementConstructor<...` |
| `HeadingLevel` | type | `type HeadingLevel = 1 \| 2 \| 3 \| 4 \| 5 \| 6;` |
| `HeadingProps` | type | `type HeadingProps = SemanticTextProps & { level?: HeadingLevel; };` |
| `Input` | function | `function Input({ type, id, className, ...props }: InputProps): import("react").JSX.Element;` |
| `InputProps` | type | `type InputProps = Omit<TextInputProps, "id"> & { id?: string; type?: InputType; className?: string; "aria-label"?: string; };` |
| `InputType` | type | `type InputType = "text" \| "search" \| "email" \| "url" \| "tel" \| "number" \| "password";` |
| `Link` | function | `function Link({ href, target, rel, onPress, numberOfLines: _n, selectable: _s, ...props }: LinkProps): ReactElement<unknown, string \| import("react").JSXElem...` |
| `LinkProps` | type | `type LinkProps = SemanticTextProps & { href?: string; target?: "_blank" \| "_self" \| "_parent" \| "_top"; rel?: string; onPress?: (event: GestureResponderEvent...` |
| `Main` | const | `const Main: (props: SemanticBlockProps) => ReactElement<unknown, string \| import("react").JSXElementConstructor<any>>;` |
| `Nav` | const | `const Nav: (props: SemanticBlockProps) => ReactElement<unknown, string \| import("react").JSXElementConstructor<any>>;` |
| `Page` | const | `const Page: (props: SemanticBlockProps) => ReactElement<unknown, string \| import("react").JSXElementConstructor<any>>;` |
| `Paragraph` | const | `const Paragraph: ({ numberOfLines: _n, selectable: _s, ...props }: SemanticTextProps) => ReactElement<unknown, string \| import("react").JSXElementConstructor...` |
| `Section` | const | `const Section: (props: SemanticBlockProps) => ReactElement<unknown, string \| import("react").JSXElementConstructor<any>>;` |
| `SemanticBaseProps` | type | `type SemanticBaseProps = DataAttributes & { children?: ReactNode; className?: string; id?: string; hidden?: boolean; title?: string; dataSet?: Readonly<Recor...` |
| `SemanticBlockProps` | type | `type SemanticBlockProps = SemanticBaseProps & { style?: StyleProp<ViewStyle>; };` |
| `SemanticTextProps` | type | `type SemanticTextProps = SemanticBaseProps & { style?: StyleProp<TextStyle>; numberOfLines?: number; selectable?: boolean; };` |
| `Text` | const | `const Text: ({ numberOfLines: _n, selectable: _s, ...props }: SemanticTextProps) => ReactElement<unknown, string \| import("react").JSXElementConstructor<any>>;` |
<!-- generated:end props -->

## Variants

<!-- generated:begin variants source=docs/api-signatures.json -->
none
<!-- generated:end variants -->

## States

<!-- generated:begin states source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end states -->

## A11y

<!-- generated:begin a11y source=packages/ui/src/components/html/semantic.native.tsx,packages/ui/src/components/html/semantic.web.tsx -->
- `role`: "banner", "heading"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
