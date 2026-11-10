const path = require('node:path');
const {createRequire} = require('node:module');
const {getDefaultConfig} = require('expo/metro-config');
const {withUniwindConfig} = require('uniwind/metro');
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
if (['library', 'reference'].includes(process.env.NYC_TRON_ACCEPTANCE)) {
  const rewrite = config.server?.rewriteRequestUrl;
  config.server = {...config.server, rewriteRequestUrl(url) {
    const resolved = rewrite ? rewrite(url) : url;
    const parsed = new URL(resolved, 'http://metro.local');
    if (!/\/(?:index|\.expo\/\.virtual-metro-entry)\.bundle$/.test(parsed.pathname)) return resolved;
    const entry = process.env.NYC_TRON_ACCEPTANCE === 'reference' ? 'reference-app' : 'library-acceptance';
    const relative = path.relative(config.server.unstable_serverRoot ?? __dirname, path.join(__dirname, entry));
    parsed.pathname = '/' + relative.split(path.sep).join('/') + '.bundle';
    return /^https?:/.test(resolved) ? parsed.href : parsed.pathname + parsed.search;
  }};
}
module.exports = withUniwindConfig(config, {cssEntryFile: process.env.NYC_TRON_ACCEPTANCE === 'reference' ? './reference.css' : './global.css', dtsFile: './uniwind-types.d.ts'});
