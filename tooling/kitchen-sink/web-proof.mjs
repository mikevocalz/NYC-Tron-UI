import strictAssert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isMainModule, sourceFingerprint } from '../library-components.mjs';
import { COMPONENT_CONTRACTS, DRAFT, MODES, importFor } from './contracts.mjs';
import { verifyInstalledConsumer } from './prepare-consumer.mjs';

export async function proveWeb({ consumer, webDirectory, tools, output, channel }) {
  const assertions = { passed: 0, failed: 0, skipped: 0 };
  const assert = new Proxy(strictAssert, { get(target, key) {
    const fn = Reflect.get(target, key);
    return typeof fn === 'function' ? (...args) => { try { const result = fn(...args); assertions.passed++; return result; } catch (error) { assertions.failed++; throw error; } } : fn;
  } });
  consumer = realpathSync(resolve(consumer)); webDirectory = realpathSync(resolve(webDirectory)); output = resolve(output);
  if (!webDirectory.startsWith(consumer + sep)) throw new Error('The rendered export must belong to the installed-archive consumer');
  const candidate = verifyInstalledConsumer(consumer);
  const require = createRequire(join(resolve(tools), 'package.json'));
  const { chromium } = require('playwright'), handler = require('serve-handler'), axe = require('axe-core');
  mkdirSync(dirname(output), { recursive: true });
  const server = createServer((request, response) => handler(request, response, { public: webDirectory }));
  await new Promise((yes, no) => { server.once('error', no); server.listen(0, '127.0.0.1', yes); });
  const url = `http://127.0.0.1:${server.address().port}`;
  let browser, evidence;
  const cases = [], screenshots = [], layoutCases = [];
  try {
    browser = await chromium.launch({ headless: true, ...(channel ? { channel } : {}) });
    for (const mode of MODES) {
      const page = await browser.newPage({ viewport: { width: 1100, height: 900 } });
      const errors = []; page.on('pageerror', error => errors.push(error.message));
      await page.goto(url); await page.getByTestId('alias-result').waitFor();
      assert.match(await page.getByTestId('alias-result').innerText(), /^10 public imports resolve to 5 component identities\.$/);
      await page.getByTestId(`imports-${mode}`).click();
      assert.equal(await page.getByTestId('imports-result').innerText(), `Rendering: ${mode} imports`);
      await page.getByTestId('button-primary').click();
      await page.getByTestId('button-primary').focus(); await page.keyboard.press('Enter');
      assert.equal(await page.getByTestId('button-result').innerText(), 'Press count: 2');
      assert.equal(await page.getByTestId('button-disabled').isDisabled(), true);
      assert.equal(await page.getByTestId('button-loading').isDisabled(), true);
      assert.equal(await page.getByTestId('button-loading').getAttribute('aria-busy'), 'true');
      for (const variant of ['secondary', 'ghost', 'danger', 'small']) assert.equal(await page.getByTestId(`button-${variant}`).count(), 1);
      const target = await page.getByTestId('button-small').boundingBox(); assert.ok(target.width >= 44 && target.height >= 44);
      const surfaces = [];
      for (const surface of ['raised', 'sunken', 'transparent']) surfaces.push(await page.getByTestId(`card-${surface}`).evaluate(element => getComputedStyle(element).backgroundColor));
      assert.equal(new Set(surfaces).size, 3, 'Card surfaces must actually render differently');
      await page.getByTestId('field-editable').fill(DRAFT);
      assert.equal(await page.getByTestId('draft-result').innerText(), `Draft: ${DRAFT}`);
      assert.equal(await page.getByRole('alert').innerText(), 'Enter a project name before continuing.');
      await page.getByTestId('field-error').fill('Valid project'); assert.equal(await page.getByRole('alert').count(), 0);
      assert.equal(await page.getByTestId('field-disabled').isDisabled(), true);
      const rail = page.getByTestId('rail-demo');
      await rail.getByRole('tab', { name: 'Editor', exact: true }).click();
      assert.equal(await rail.getByRole('tab', { name: 'Editor', exact: true }).getAttribute('aria-selected'), 'true');
      assert.equal(await rail.getByRole('tab', { name: 'Unavailable', exact: true }).isDisabled(), true);
      const wideRail = await rail.boundingBox(), wideStatus = await page.getByTestId('rail-status').boundingBox();
      assert.ok(wideStatus.x >= wideRail.x + wideRail.width, 'Wide container keeps the status beside the rail');
      layoutCases.push({ importMode: mode, state: 'expanded wide', viewportWidth: 1100, rail: wideRail, status: wideStatus });
      await page.setViewportSize({ width: 320, height: 900 });
      const expandedRail = await rail.boundingBox(), narrowStatus = await page.getByTestId('rail-status').boundingBox();
      const phoneContainer = await page.getByTestId('rail-layout').boundingBox();
      assert.ok(narrowStatus.y >= expandedRail.y + expandedRail.height, 'Narrow expanded rail wraps status onto its own row');
      assert.ok(narrowStatus.width >= 160, 'Narrow status keeps a readable minimum measure');
      assert.ok(narrowStatus.x >= phoneContainer.x && narrowStatus.x + narrowStatus.width <= phoneContainer.x + phoneContainer.width + 1, 'Phone status remains inside the fixture container');
      const labelLines = await page.getByTestId('rail-result').evaluate(element => { const range = document.createRange(); range.selectNodeContents(element); return new Set([...range.getClientRects()].map(rect => Math.round(rect.y))).size; });
      assert.equal(labelLines, 1, 'Selected destination remains one readable line at 320px');
      assert.equal(await page.getByTestId('rail-instructions').evaluate(element => element.scrollWidth > element.clientWidth + 1), false, 'Instructions do not overflow their readable measure');
      assert.equal(await page.getByTestId('rail-result').innerText(), 'Selected: editor');
      assert.equal(await page.getByTestId('field-editable').inputValue(), DRAFT);
      layoutCases.push({ importMode: mode, state: 'expanded phone', viewportWidth: 320, rail: expandedRail, status: narrowStatus, labelLines });
      const railScreenshot = `kitchen-${mode}-rail-expanded-320.png`;
      await page.getByTestId('rail-layout').screenshot({ path: join(dirname(output), railScreenshot) }); screenshots.push(railScreenshot);
      await page.getByTestId('rail-collapse').click();
      const collapsedStatus = await page.getByTestId('rail-status').boundingBox();
      assert.ok(collapsedStatus.width >= 160, 'Collapsed rail retains readable status width');
      layoutCases.push({ importMode: mode, state: 'collapsed phone', viewportWidth: 320, rail: await rail.boundingBox(), status: collapsedStatus });
      assert.equal(await rail.getByRole('tab', { name: 'Editor', exact: true }).count(), 1);
      assert.equal(await page.getByTestId('rail-result').innerText(), 'Selected: editor');
      await page.setViewportSize({ width: 1100, height: 900 });
      await page.getByTestId('rail-collapse').click();
      await page.getByTestId('rail-layout').evaluate(element => { element.style.width = '248px'; });
      const paneRail = await rail.boundingBox(), paneStatus = await page.getByTestId('rail-status').boundingBox();
      assert.ok(paneStatus.y >= paneRail.y + paneRail.height && paneStatus.width >= 160, 'A narrow pane wraps even on a wide viewport');
      const paneContainer = await page.getByTestId('rail-layout').boundingBox();
      assert.ok(paneStatus.x >= paneContainer.x && paneStatus.x + paneStatus.width <= paneContainer.x + paneContainer.width + 1, 'Wide-window narrow-pane status remains inside its actual container');
      layoutCases.push({ importMode: mode, state: 'expanded narrow pane', viewportWidth: 1100, containerWidth: 248, rail: paneRail, status: paneStatus });
      await page.getByTestId('rail-layout').evaluate(element => { element.style.removeProperty('width'); });
      await page.getByTestId('rail-collapse').click();
      await page.getByTestId('shell-edge').click();
      assert.equal(await page.getByTestId('shell-result').innerText(), 'Physical edge: left; text: LTR');
      const left = await page.getByTestId('shell-rail').boundingBox(), content = await page.getByTestId('shell-draft').boundingBox();
      assert.ok(left.x < content.x, 'Explicit left rail must be physically left');
      await page.getByTestId('shell-rtl').click();
      assert.equal(await page.getByTestId('shell-result').innerText(), 'Physical edge: left; text: RTL');
      assert.equal(await page.getByTestId('shell-draft').inputValue(), DRAFT);
      await page.getByTestId('shell-edge').click();
      const right = await page.getByTestId('shell-rail').boundingBox(), rtlContent = await page.getByTestId('shell-draft').boundingBox();
      assert.ok(right.x > rtlContent.x, 'RTL must not mirror the explicit right edge');
      assert.equal(await page.getByTestId('shell-draft').inputValue(), DRAFT);
      const palettes = [];
      for (const appearance of ['light', 'dark']) {
        await page.getByTestId(`theme-${appearance}`).click();
        assert.equal(await page.getByTestId('theme-result').innerText(), `Appearance: ${appearance}`);
        const selected = await page.getByTestId(`theme-${appearance}`).evaluate(element => getComputedStyle(element).backgroundColor);
        const other = await page.getByTestId(`theme-${appearance === 'light' ? 'dark' : 'light'}`).evaluate(element => getComputedStyle(element).backgroundColor);
        assert.notEqual(selected, other, 'Appearance selection must agree with the selected button treatment');
        assert.equal(await page.getByTestId('button-result').innerText(), 'Press count: 2');
        palettes.push(await page.getByTestId('card-raised').evaluate(element => getComputedStyle(element).backgroundColor));
        await page.setViewportSize({ width: 320, height: 900 });
        assert.equal(await page.getByTestId('field-editable').inputValue(), DRAFT);
        assert.equal(await page.getByTestId('shell-draft').inputValue(), DRAFT);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
        assert.equal(overflow, false, 'The component lab must not overflow a narrow viewport');
        await page.addScriptTag({ content: axe.source });
        const a11y = await page.evaluate(async () => window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } }));
        if (a11y.violations.length) writeFileSync(output.replace(/\.json$/, '') + `-${mode}-${appearance}-axe.json`, JSON.stringify(a11y.violations, null, 2));
        assert.deepEqual(a11y.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), [], 'Automated WCAG-tagged checks must pass');
        const filename = `kitchen-${mode}-${appearance}-320.png`; await page.screenshot({ path: join(dirname(output), filename), fullPage: true }); screenshots.push(filename);
        cases.push({ importMode: mode, appearance, viewport: { width: 320, height: 900 }, assertions: 'five component state contracts plus retained draft, physical edge and theme selection', axeViolations: 0 });
        await page.setViewportSize({ width: 1100, height: 900 });
      }
      assert.notEqual(palettes[0], palettes[1], 'Light/dark must change the actual component palette');
      assert.deepEqual(errors, [], 'No browser runtime errors are accepted');
      await page.close();
    }
    const testSource = 'tooling/kitchen-sink/web-proof.mjs';
    const testSha256 = createHash('sha256').update(readFileSync(new URL('./web-proof.mjs', import.meta.url))).digest('hex');
    const resultsPath = basename(output).replace(/\.json$/, '') + '-results.json';
    const logPath = basename(output).replace(/\.json$/, '') + '.log';
    const components = COMPONENT_CONTRACTS.map(contract => ({ symbol: contract.symbol, status: 'passed', imports: MODES.map(mode => ({ path: importFor(contract, mode), symbol: contract.symbol, rendered: true, assertedStates: contract.states })) }));
    const results = { status: 'passed', platform: 'web', evidenceKinds: ['web', 'accessibility'], cases, assertions, components, layoutCases };
    writeFileSync(join(dirname(output), resultsPath), JSON.stringify(results, null, 2) + '\n');
    writeFileSync(join(dirname(output), logPath), cases.map(c => `PASS ${c.importMode} imports / ${c.appearance} / five component state contracts`).join('\n') + `\nAssertions passed: ${assertions.passed}; failed: 0; skipped: 0\n`);
    const artifact = path => ({ path, sha256: createHash('sha256').update(readFileSync(join(dirname(output), path))).digest('hex') });
    evidence = { schemaVersion: 1, kind: 'nyc-tron-library-render-evidence', platform: 'web', status: 'passed',
      manifestSha256: sourceFingerprint(readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../docs/library/components.json'))),
      candidate, runner: { name: 'playwright', version: require('playwright/package.json').version, browser: browser.version(), node: process.version,
        command: 'node tooling/kitchen-sink/web-proof.mjs --consumer <installed-consumer> --web-dir <consumer-web-export> --tools <browser-tools> --output <evidence.json>',
        testSource, testSha256, exitCode: 0, log: artifact(logPath), screenshots: screenshots.map(artifact) },
      testCommand: 'node tooling/kitchen-sink/web-proof.mjs --consumer <installed-consumer> --web-dir <consumer-web-export> --tools <browser-tools> --output <evidence.json>',
      testSourceSha256: createHash('sha256').update(readFileSync(new URL('./web-proof.mjs', import.meta.url))).digest('hex'),
      assertions, artifacts: [artifact(resultsPath)], cases, screenshots, components,
      limits: ['Automated accessibility scan is not a complete WCAG audit or screen-reader speech proof.', 'Dirty local source is not release-candidate evidence.'] };
  } finally { if (browser) await browser.close(); await new Promise(yes => server.close(yes)); }
  writeFileSync(output, JSON.stringify(evidence, null, 2) + '\n');
  writeFileSync(output.replace(/\.json$/, '') + '-accessibility.json', JSON.stringify({ ...evidence,
    kind: 'accessibility', platform: 'static', violations: 0, standards: ['WCAG 2.1 AA'],
    scope: 'Four actual rendered import/appearance cases scanned with WCAG 2.1 A/AA axe tags; manual and speech limits remain explicit.' }, null, 2) + '\n');
  console.log(`Kitchen web proof: ${COMPONENT_CONTRACTS.length} identities; 10 direct/root exports; ${cases.length} appearance/import cases; ${assertions.passed} assertions passed; actual installed archives verified; source clean: ${!candidate.sourceDirty}.`);
  return evidence;
}
if (isMainModule(import.meta.url)) {
  const args = process.argv.slice(2), values = {};
  for (let i = 0; i < args.length; i += 2) {
    if (!['--consumer', '--web-dir', '--tools', '--output', '--channel'].includes(args[i]) || !args[i + 1] || values[args[i]]) throw new Error('Usage: --consumer <dir> --web-dir <dir> --tools <dir> --output <json> [--channel chrome]');
    values[args[i]] = args[i + 1];
  }
  for (const key of ['--consumer', '--web-dir', '--tools', '--output']) if (!values[key]) throw new Error(key + ' is required');
  await proveWeb({ consumer: values['--consumer'], webDirectory: values['--web-dir'], tools: values['--tools'], output: values['--output'], channel: values['--channel'] });
}
