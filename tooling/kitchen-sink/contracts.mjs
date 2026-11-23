export const COMPONENT_CONTRACTS = Object.freeze([
  { symbol: 'Button', directImport: '@nyc-tron/ui/components/Button', states: ['enabled press', 'disabled', 'loading', 'variants'] },
  { symbol: 'Card', directImport: '@nyc-tron/ui/components/Card', states: ['raised', 'sunken', 'transparent'] },
  { symbol: 'TextField', directImport: '@nyc-tron/ui/components/TextField', states: ['editable', 'helper', 'error', 'disabled', 'retained draft'] },
  { symbol: 'NavigationRail', directImport: '@nyc-tron/ui/components/NavigationRail', states: ['selected', 'disabled item', 'collapsed labels', 'explicit physical edge'] },
  { symbol: 'NavigationShell', directImport: '@nyc-tron/ui/components/NavigationRail', states: ['left edge', 'right edge', 'RTL', 'retained child draft'] },
]);
export const MODES = Object.freeze(['direct', 'root']);
export const APP_ID = 'com.nyctron.kitchensink';
export const DRAFT = 'Retained kitchen draft';
export function importFor(contract, mode) {
  if (!MODES.includes(mode)) throw new Error('Unknown fixture import mode');
  return mode === 'root' ? '@nyc-tron/ui' : contract.directImport;
}
