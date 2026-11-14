const path = require('node:path');

/** Select an authored acceptance entry without changing package resolution. */
function withAcceptanceEntry(config, directory) {
  const entry = {
    library: 'library-acceptance',
    reference: 'reference-app',
    media: 'media-acceptance',
    pointer: 'pointer-acceptance',
  }[process.env.NYC_TRON_ACCEPTANCE];
  if (!entry) return config;
  const rewrite = config.server?.rewriteRequestUrl;
  config.server = {...config.server, rewriteRequestUrl(url) {
    const resolved = rewrite ? rewrite(url) : url;
    const parsed = new URL(resolved, 'http://metro.local');
    if (!/\/(?:index|reference-app|\.expo\/\.virtual-metro-entry)\.bundle$/.test(parsed.pathname)) return resolved;
    const relative = path.relative(config.server.unstable_serverRoot ?? directory, path.join(directory, entry));
    parsed.pathname = '/' + relative.split(path.sep).join('/') + '.bundle';
    return /^https?:/.test(resolved) ? parsed.href : parsed.pathname + parsed.search;
  }};
  return config;
}
/** Match each authored entry's CSS import; the host retains palette ownership. */
function acceptanceCssEntry(mode = process.env.NYC_TRON_ACCEPTANCE) {
  return ['reference', 'media', 'pointer'].includes(mode) ? './reference.css' : './global.css';
}
module.exports = {withAcceptanceEntry, acceptanceCssEntry};
