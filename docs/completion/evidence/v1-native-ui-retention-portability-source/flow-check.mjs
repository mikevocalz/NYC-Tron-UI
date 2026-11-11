/** Source-only reproduction; mocked IO does not establish Windows filesystem behavior. */
export function reviewUiTransportRetention({ manifest, originals, candidates }) {
  const need = (condition, label) => { if (!condition) throw new Error(label); };
  const swap = (source, before, after) => {
    need(source.split(before).length === 2, "Transform is not unique");
    return source.replace(before, after);
  };
  for (const file of manifest.files) {
    let text = originals[file.file];
    const edits = manifest.edits.filter(edit => edit.file === file.file);
    for (const edit of edits) text = swap(text, edit.before, edit.after);
    need(text === candidates[file.file], "Forward mismatch: " + file.file);
    for (const edit of [...edits].reverse()) text = swap(text, edit.after, edit.before);
    need(text === originals[file.file], "Inverse mismatch: " + file.file);
  }
  const AsyncFunction = Object.getPrototypeOf(async function() {}).constructor;
  for (const [file, text] of Object.entries(candidates)) {
    if (!file.endsWith(".mjs")) continue;
    new AsyncFunction(text.replace(/^import[\s\S]*?;\n/gm, "").replace(/^export /gm, "").replaceAll("import.meta.url", '"file:///review-only.mjs"'));
  }
  const runner = candidates["tooling/native/run-ui-acceptance.mjs"];
  const begin = runner.indexOf("function flow("), end = runner.indexOf("\n\ntry {", begin);
  need(begin >= 0 && end > begin, "Actual flow boundaries missing");
  const flowCode = runner.slice(begin, end);
  const results = [];
  for (const sep of ["/", "\\"]) {
    const output = sep === "/" ? "/capture" : "C:\\capture", repo = sep === "/" ? "/repo" : "C:\\repo";
    const stages = [], calls = [], directories = new Set(), labels = ["Workspace name", "Native UI workspace"];
    const join = (...parts) => parts.join(sep);
    const make = Function("output", "repo", "join", "mkdirSync", "run", "maestro", "deviceId", "platform",
      "readFileSync", "requirePassedFlow", "hierarchy", "requireSemanticLabels", "requireReferenceHostBounds",
      "allFiles", "hash", "stages", "sep", flowCode + "\nreturn flow;");
    const flow = make(output, repo, join,
      path => { need(!directories.has(path), "Evidence directory reused"); directories.add(path); },
      (file, args, options) => { calls.push({ file, args, options }); }, "maestro", "owned-device", "android",
      path => path.endsWith(".png") ? { subarray: () => ({ toString: () => "89504e470d0a1a0a" }) } : "mock passing junit",
      () => ({ executed: 1, failures: 0, skipped: 0 }), name => ({ evidenceName: name }),
      (tree, observed) => { need(JSON.stringify(observed) === JSON.stringify(labels), "Semantic labels changed"); },
      tree => ({ mockGeometrySource: tree.evidenceName }),
      directory => [join(directory, "artifacts", "settings-saved.png")],
      path => "mock-sha:" + path, stages, sep);
    flow("settings", labels, ["settings-saved"]);
    flow("settings", labels, ["settings-saved"], "settings-retry");
    need(stages.length === 2 && stages.every(stage => stage.name === "settings"), "Logical stage identity changed");
    for (let index = 0; index < 2; index++) {
      const prefix = index ? "settings-retry" : "settings", stage = stages[index], call = calls[index];
      need(call.args.at(-1) === join(repo, "tooling/native/ui-flows", "settings.yaml"), "YAML changed");
      need(call.options.log === prefix + "-maestro.log", "Command log path changed incorrectly");
      need(stage.report === prefix + "/report.xml" && stage.reportSha256 === "mock-sha:" + join(output, prefix, "report.xml"), "Report identity mismatch");
      need(stage.hierarchy === prefix + "-hierarchy.json" && stage.hierarchySha256 === "mock-sha:" + join(output, prefix + "-hierarchy.json"), "Hierarchy identity mismatch");
      need(stage.geometry.mockGeometrySource === prefix && stage.images[0].file.startsWith(prefix + sep), "Geometry/image evidence mismatch");
    }
    results.push({ separator: sep, firstEvidence: "settings", retryEvidence: "settings-retry", logicalFlow: "settings" });
  }
  return { uniqueTransforms: manifest.edits.length, forwardAndInverse: true, parsedModules: 3, mockedFlow: results,
    scope: "V8 syntax/source and extracted actual flow with mocked IO only; no Node filesystem or native execution" };
}
