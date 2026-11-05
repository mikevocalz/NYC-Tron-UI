const fs = require("node:fs");
const path = require("node:path");
const projectFile = "NYCTronWindowsExample\\NYCTronWindowsExample.vcxproj";
const initialized = fs.existsSync(path.join(__dirname, "windows", projectFile));
module.exports = {
  // init-windows needs an empty discovery result before the project exists.
  // This local file still prevents discovery of the parent library config.
  ...(initialized ? {project: {windows: {
    sourceDir: "windows",
    solutionFile: "NYCTronWindowsExample.sln",
    project: {projectFile},
  }}} : {}),
  dependencies: {
    "@nyc-tron/windows-fluent-fabric": {platforms: {windows: null}},
  },
};
