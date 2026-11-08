const { makeMetroConfig } = require("expo-desktop-metro-config");
const { withDesktop } = require("@legendapp/spark/metro");
const { withUniwindConfig } = require("uniwind/metro");

// withUniwindConfig must be the outermost wrapper (uniwind docs).
module.exports = withUniwindConfig(withDesktop(makeMetroConfig(__dirname)), {
  cssEntryFile: "./global.css",
  dtsFile: "./uniwind-types.d.ts",
});
