---
name: "UiRoot"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui"
tier: 2
docs: "generated"
platforms: []
category: "primitive"
tokens: []
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/Card", "@nyc-tron/NavigationRail", "@nyc-tron/TextField"]
a11yStatus: "unverified"
---

# UiRoot

## Purpose

<!-- generated:begin purpose source=packages/ui/src/index.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/index.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/Card, @nyc-tron/NavigationRail, @nyc-tron/TextField

### Registry install

```sh
npx shadcn@latest add @nyc-tron/root
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { Button, Card, NavigationRail, NavigationShell, TextField } from "@/components/nyc-tron/ui";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { Button, Card, NavigationRail, NavigationShell, TextField } from "@nyc-tron/ui";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/index.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `Button` | function | `function Button({ title, targetSize, numberOfLines, icon, variant, size, disabled, loading, className, unstyled, labelClassName, iconClassName, onPress, styl...` |
| `ButtonProps` | interface | `interface ButtonProps extends Omit<PressableProps, "children" \| "disabled"> { ref?: Ref<ComponentRef<typeof Pressable>>; title: string; targetSize?: number; ...` |
| `ButtonSize` | type | `type ButtonSize = "sm" \| "md" \| "lg";` |
| `ButtonVariant` | type | `type ButtonVariant = "primary" \| "secondary" \| "ghost" \| "danger";` |
| `Card` | function | `function Card({ children, surface, padded, unstyled, className, style, ...rest }: CardProps): import("react").JSX.Element;` |
| `CardProps` | interface | `interface CardProps extends Omit<ViewProps, "children"> { children?: ReactNode; surface?: CardSurface; padded?: boolean; className?: string; unstyled?: boole...` |
| `NavigationItem` | interface | `interface NavigationItem { readonly id: string; readonly label: string; readonly icon?: ReactNode; readonly disabled?: boolean; }` |
| `NavigationRail` | function | `function NavigationRail({ items, selectedId, onSelectionChange, collapsed, edge, className, unstyled, itemClassName, selectedItemClassName, labelClassName, s...` |
| `NavigationRailProps` | interface | `interface NavigationRailProps extends Omit<ViewProps, "children"> { items: readonly NavigationItem[]; selectedId: string \| null; onSelectionChange: (id: stri...` |
| `NavigationShell` | function | `function NavigationShell({ children, rail, edge, className, contentClassName, isRTL, style, ...props }: NavigationShellProps): import("react").JSX.Element;` |
| `NavigationShellProps` | interface | `interface NavigationShellProps extends Omit<ViewProps, "children"> { children: ReactNode; rail: ReactNode; edge: "left" \| "right"; className?: string; conten...` |
| `TextField` | function | `function TextField({ id, label, helperText, errorText, startAdornment, className, inputClassName, labelClassName, editable, unstyled, ...props }: TextFieldPr...` |
| `TextFieldProps` | interface | `interface TextFieldProps extends TextInputProps { id: string; label: string; helperText?: string; errorText?: string; startAdornment?: ReactNode; className?:...` |
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

<!-- generated:begin a11y source=packages/ui/src/index.ts -->
_Not documented._
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
