module.exports = {
  project: {
    windows: {
      sourceDir: "windows",
      solutionFile: "NYCTronWindowsExample.sln",
      project: {projectFile: "NYCTronWindowsExample\\NYCTronWindowsExample.vcxproj"},
    },
  },
  // Explicit native ProjectReference/provider registration is exercised here.
  // Prevent automatic registration from adding a second copy.
  dependencies: {
    "@nyc-tron/windows-fluent-fabric": {platforms: {windows: null}},
  },
};
