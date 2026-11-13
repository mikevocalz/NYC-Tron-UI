"""Records the name table of the emulator's RobotoStatic-Regular.ttf and
whether its advance widths match the committed table. CI only.

usage: roboto-provenance.py <font.ttf> <committed table.json> <out.json>
"""
import hashlib
import json
import sys

from fontTools.ttLib import TTFont

font_path, table_path, out_path = sys.argv[1:4]
font = TTFont(font_path)
names = {}
for record in font["name"].names:
    if record.platformID == 3 and record.langID == 0x409 and record.nameID in (0, 1, 2, 5, 6, 7, 13, 14):
        names[str(record.nameID)] = record.toUnicode()
table = json.load(open(table_path))
cmap = font.getBestCmap()
hmtx = font["hmtx"].metrics
mismatch = []
for hexcode, advance in table["advances"].items():
    glyph = cmap.get(int(hexcode, 16))
    actual = hmtx[glyph][0] if glyph else None
    if actual != advance:
        mismatch.append({"codepoint": hexcode, "committed": advance, "font": actual})
result = {
    "file": "/system/fonts/RobotoStatic-Regular.ttf",
    "sha256": hashlib.sha256(open(font_path, "rb").read()).hexdigest(),
    "unitsPerEm": font["head"].unitsPerEm,
    "names": names,
    "advancesCompared": len(table["advances"]),
    "advancesMismatched": mismatch,
}
json.dump(result, open(out_path, "w"), indent=2)
print(json.dumps(result, indent=2))
