import { KITCHEN_IOS_DEVICE, KITCHEN_IOS_RUNTIME, KITCHEN_IOS_VERSION } from './prepare-ios.mjs';

// Parse only the pinned CLI's simple JUnit suite start tag. Unsupported XML
// constructs fail closed instead of being interpreted as device evidence.
export function requireKitchenIosExecutionTarget(xml, udid) {
  if (typeof xml !== 'string' || Buffer.byteLength(xml, 'utf8') > 65536 || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(udid) || /<!--|<!|&/.test(xml)) throw new Error('Invalid or unsupported iOS JUnit target evidence');
  // The successful pinned report has one root, one suite and one self-closing
  // testcase. Anchor the entire document: no PI, text, hidden tag or nesting can
  // substitute for an executed suite. Only an initial XML declaration is allowed.
  const document = /^\s*(?:<\?xml\s+version=(?:"1\.0"|'1\.0')\s+encoding=(?:"UTF-8"|'UTF-8')\s*\?>\s*)?<testsuites>\s*<testsuite(\s[^<>]*?)>\s*<testcase(\s[^<>]*?)\/>(?:\s*)<\/testsuite>\s*<\/testsuites>\s*$/.exec(xml);
  if (!document) throw new Error('Unsupported or malformed pinned iOS JUnit document shape');
  const parseAttributes = attributes => {
    const values = new Map();
    while (attributes.trim()) {
      const attribute = /^\s+([A-Za-z_][\w.:-]*)\s*=\s*("[^"<>]*"|'[^'<>]*')/.exec(attributes);
      if (!attribute || values.has(attribute[1])) throw new Error('Malformed or duplicate iOS JUnit attribute');
      values.set(attribute[1], attribute[2].slice(1,-1));
      attributes = attributes.slice(attribute[0].length);
    }
    return values;
  };
  const values = parseAttributes(document[1]);
  const testcase = parseAttributes(document[2]);
  if (testcase.get('status') !== 'SUCCESS') throw new Error('iOS target identity requires an actual successful testcase');
  const expected = `${KITCHEN_IOS_DEVICE} - iOS ${KITCHEN_IOS_VERSION} - ${udid}`;
  if (values.get('device') !== expected) throw new Error('Executed iOS JUnit device differs from the exact selected model/runtime/UDID');
  return { name: KITCHEN_IOS_DEVICE, runtime: KITCHEN_IOS_RUNTIME, version: KITCHEN_IOS_VERSION, udid, observedDevice: values.get('device'), method: 'actual Maestro JUnit suite device' };
}
