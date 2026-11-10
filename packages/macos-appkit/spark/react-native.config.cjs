// Spark's macOS autolinker uses the Apple (ios) discovery lane.
module.exports = { dependency: { platforms: { ios: process.env.SPARK_DESKTOP_AUTOLINK === 'macos' ? {} : null, android: null } } };
