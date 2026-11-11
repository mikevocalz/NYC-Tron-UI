/** Pure source composition checks. No filesystem, compiler, native process or CI execution. */
export function reviewWindowsLifecycleComposition({ manifest, blobs, identity }) {
  const need = (condition, label) => { if (!condition) throw new Error(label); };
  const source = sha => {
    const text = blobs[sha];
    need(typeof text === "string", "Missing immutable source " + sha);
    need(identity(text).gitBlob === sha, "Source identity mismatch " + sha);
    return text;
  };
  const replaceOnce = (text, before, after, label) => {
    need(typeof before === "string" && before.length > 0 && text.split(before).length === 2, "Nonunique edit " + label);
    return text.replace(before, after);
  };
  need(manifest.baseNativeSource === "d7c28b5525ffe6ed5363460c70db62935c0bbee6", "Wrong native adoption boundary");
  let edits = 0;
  for (const file of manifest.files) {
    const before = source(file.preimage.gitBlob), after = source(file.candidate.gitBlob);
    for (const [text, expected] of [[before, file.preimage], [after, file.candidate]]) {
      const actual = identity(text);
      need(actual.bytes === expected.bytes && actual.sha256 === expected.sha256, "Source byte/hash mismatch " + file.path);
    }
    let value = before;
    for (const edit of file.transforms) { value = replaceOnce(value, edit.before, edit.after, edit.id); edits++; }
    need(value === after, "Native forward mismatch " + file.path);
    for (const edit of [...file.transforms].reverse()) value = replaceOnce(value, edit.after, edit.before, edit.id);
    need(value === before, "Native inverse mismatch " + file.path);
  }
  need(edits === 26, "Wrong native edit count");
  const aggregateSurface = source("d86f3b1454d93996606faa11d2f25fa7a9fea7d1");
  const externalSurface = source("d7c28b5525ffe6ed5363460c70db62935c0bbee6");
  need(aggregateSurface !== externalSurface, "External adoption must not be hidden as an identical preimage");
  const probe = text => {
    const begin = text.indexOf("// Diagnostic only. Bounded"), end = text.indexOf("struct DragDataObservation", begin);
    need(begin >= 0 && end > begin, "Probe boundaries missing");
    return text.slice(begin, end);
  };
  need(probe(source("c0e90062f6747c6d5dd216691c98de08d2d1eea8")) === probe(source("a2148fdc939011492f52df1b6899a613a17cddae")), "Approved bounded probe changed");
  const externalBefore = source("bc18f6a74b6237530fd570d5c4c7e3a22a9af5ec");
  const externalAfter = source("a6bfaccc3dcbdafcd398bd0d1c5bde63ba22ab23");
  let start = 0, end = 0;
  while (start < externalBefore.length && externalBefore[start] === externalAfter[start]) start++;
  while (end < externalBefore.length - start && externalBefore.at(-1 - end) === externalAfter.at(-1 - end)) end++;
  const beforeSelection = externalBefore.slice(start, end ? -end : undefined);
  const afterSelection = externalAfter.slice(start, end ? -end : undefined);
  need(identity(externalAfter).bytes - identity(externalBefore).bytes === 461, "External selection size changed");
  const aggregateUia = source("070424fa54f1645cc6be02187647f84732a6b53c");
  const candidateUia = source("aa54819df02c2decfba2fb19e3b4d2a5aaabd554");
  need(replaceOnce(aggregateUia, beforeSelection, afterSelection, "WindowPattern selection") === candidateUia, "UIA composition mismatch");
  need(replaceOnce(candidateUia, afterSelection, beforeSelection, "WindowPattern selection inverse") === aggregateUia, "UIA inverse mismatch");
  return { nativeTransforms: edits, nativeForwardAndInverse: true, approvedProbeExact: true,
    aggregateToExternalAdoptionExplicit: true, uiaSelectionDeltaBytes: 461, uiaForwardAndInverse: true,
    scope: "Pure UTF-8 source identity/composition checks only; no native or PowerShell execution" };
}
