// This nested Windows-only package is deliberately OUTSIDE the root pnpm
// workspace's runtime dependency graph.
module.exports = {
  project: {
    windows: {
      sourceDir: "windows",
      solutionFile: "NYCTronFluentFabric.sln",
      project: { projectFile: "NYCTronFluentFabric/NYCTronFluentFabric.vcxproj" },
    },
  },
};
