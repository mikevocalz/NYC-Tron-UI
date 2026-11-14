const path = require('node:path');
const {createRequire} = require('node:module');
const {getDefaultConfig} = require('expo/metro-config');
const {withUniwindConfig} = require('uniwind/metro');
const {withAcceptanceEntry, acceptanceCssEntry} = require('./acceptance-entry.cjs');
const appRequire = createRequire(path.join(__dirname, 'package.json'));
const config = getDefaultConfig(__dirname);
config.watchFolders = [...new Set([...(config.watchFolders ?? []), path.resolve(__dirname, '../../packages'), path.resolve(__dirname, '../native-feel')])];
// Workspace sources use the same runtime as the app's native build.
const shared = ['react', 'react-native', 'expo', 'expo-modules-core', '@expo/ui', 'zustand', 'uniwind', 'react-native-safe-area-context', 'react-native-gesture-handler', 'react-native-skia'];
const resolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, name, platform) => {
  const root = shared.find(value => name === value || name.startsWith(value + '/'));
  const origin = root === 'expo-modules-core' ? appRequire.resolve('expo/package.json') : appRequire.resolve('./package.json');
  const appContext = root ? {...context, originModulePath: origin} : context;
  return resolveRequest ? resolveRequest(appContext, name, platform) : context.resolveRequest(appContext, name, platform);
};
module.exports = withUniwindConfig(withAcceptanceEntry(config, __dirname), {cssEntryFile: acceptanceCssEntry(), dtsFile: './uniwind-types.d.ts'});
