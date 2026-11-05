import { getGlyph } from "@nyc-tron/icons/glyphs";
import { searchIcons } from "@nyc-tron/icons/catalog";
import { resolveIconState } from "@nyc-tron/icons/state";
import { iconSizes } from "@nyc-tron/icons/tokens";
import type { TronIconProps } from "@nyc-tron/icons/native";
import type { TronIconButtonProps } from "@nyc-tron/icons/web";
// @ts-expect-error Catalog runtime does not export glyph helpers.
import { getGlyph as falseCatalogExport } from "@nyc-tron/icons/catalog";
// @ts-expect-error Glyph runtime does not export catalog helpers.
import { searchIcons as falseGlyphExport } from "@nyc-tron/icons/glyphs";
// @ts-expect-error State runtime does not export token constants.
import { iconSizes as falseStateExport } from "@nyc-tron/icons/state";
// @ts-expect-error Token runtime does not export state resolvers.
import { resolveIconState as falseTokenExport } from "@nyc-tron/icons/tokens";
const icon: TronIconProps = { name: "home", size: iconSizes.default };
const button: TronIconButtonProps = { ...icon, label: "Home", onPress() {} };
getGlyph(searchIcons("home")[0] ?? "home", resolveIconState().variant);
void button;
