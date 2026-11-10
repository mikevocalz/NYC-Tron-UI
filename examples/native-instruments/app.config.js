module.exports = ({ config }) => ({
  ...config,
  ...(process.env.NYC_TRON_ACCEPTANCE === 'reference' ? { userInterfaceStyle: 'automatic' } : {}),
});
