import { isMainModule } from '../library-components.mjs';
import { APP_ID, DRAFT, MODES } from './contracts.mjs';

export function nativeFlow(mode) {
  if (!MODES.includes(mode)) throw new Error('Choose direct or root imports');
  const flow = [`appId: ${APP_ID}`, `name: Kitchen sink ${mode} imports`, '---', '- launchApp:', '    clearState: true',
    '- extendedWaitUntil:', '    visible:', '      id: alias-result', '    timeout: 90000',
    '- assertVisible: "10 public imports resolve to 5 component identities."'];
  const visible = (id, text, extra = []) => flow.push('- assertVisible:', `    id: ${id}`, ...(text ? [`    text: ${JSON.stringify(text)}`] : []), ...extra.map(s => '    ' + s));
  const scroll = (id, direction = 'DOWN') => flow.push('- scrollUntilVisible:', '    element:', `      id: ${id}`, `    direction: ${direction}`, '    timeout: 30000', '    visibilityPercentage: 100', '    centerElement: false');
  const scrollRailItem = (text, direction = 'DOWN') => flow.push('- scrollUntilVisible:', '    element:', `      text: ${JSON.stringify(`^${text}$`)}`, `    direction: ${direction}`, '    timeout: 30000', '    visibilityPercentage: 100', '    centerElement: false');
  const tap = id => flow.push('- tapOn:', `    id: ${id}`);
  const position = side => flow.push('- assertVisible:', '    text: ^Shell Editor$', `    ${side}Of:`, '      id: shell-draft');
  tap(`imports-${mode}`); visible('imports-result', `Rendering: ${mode} imports`);
  scroll('button-primary'); tap('button-primary'); scroll('button-result'); visible('button-result', 'Press count: 1');
  // The result is below the button rows. Return to their start once, then
  // traverse forward in fixture order across wrapped phone layouts.
  scroll('button-primary', 'UP');
  for (const variant of ['secondary', 'ghost', 'danger']) { scroll(`button-${variant}`); visible(`button-${variant}`); }
  scroll('button-disabled'); visible('button-disabled', undefined, ['enabled: false']); scroll('button-loading'); visible('button-loading', undefined, ['enabled: false']);
  scroll('button-small'); visible('button-small');
  for (const surface of ['raised', 'sunken', 'transparent']) { scroll(`card-${surface}`); visible(`card-${surface}`); }
  scroll('field-editable'); tap('field-editable'); flow.push(`- inputText: ${JSON.stringify(DRAFT)}`,
    '- runFlow:', '    when:', '      platform: iOS', '    commands:',
    '      - tapOn:', '          id: ^Return$',
    '      - assertNotVisible:', '          id: ^UIKeyboardLayoutStar Preview$',
    '- runFlow:', '    when:', '      platform: Android', '    commands:', '      - hideKeyboard');
  scroll('draft-result'); visible('draft-result', `Draft: ${DRAFT}`);
  scroll('field-error'); visible('field-error'); flow.push('- assertVisible: "Enter a project name before continuing."');
  scroll('field-disabled'); visible('field-disabled', 'Reference project', ['enabled: false']);
  scrollRailItem('Editor'); flow.push('- tapOn:', '    text: ^Editor$'); scroll('rail-result'); visible('rail-result', 'Selected: editor'); scrollRailItem('Editor', 'UP'); flow.push('- assertVisible:', '    text: ^Editor$', '    selected: true');
  scrollRailItem('Unavailable'); flow.push('- assertVisible:', '    text: ^Unavailable$', '    enabled: false');
  scroll('rail-collapse', 'UP'); tap('rail-collapse'); scroll('rail-result'); visible('rail-result', 'Selected: editor');
  scroll('shell-edge'); tap('shell-edge'); scroll('shell-result'); visible('shell-result', 'Physical edge: left; text: LTR');
  scroll('shell-rtl', 'UP'); tap('shell-rtl'); scroll('shell-result'); visible('shell-result', 'Physical edge: left; text: RTL');
  scroll('shell-draft'); visible('shell-draft', DRAFT); position('left');
  scroll('shell-edge', 'UP'); tap('shell-edge'); scroll('shell-result'); visible('shell-result', 'Physical edge: right; text: RTL');
  scroll('shell-draft'); visible('shell-draft', DRAFT);
  position('right');
  flow.push(`- takeScreenshot: kitchen-${mode}-retained-shell`);
  return flow.join('\n') + '\n';
}
if (isMainModule(import.meta.url)) console.log(nativeFlow(process.argv[2]));
