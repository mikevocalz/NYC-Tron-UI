import { useRef } from 'react';
import { Appearance, Platform, ScrollView, StatusBar, Text, View, useColorScheme } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Uniwind } from 'uniwind';
import { Button } from '@nyc-tron/ui/components/Button';
import { useStore } from 'zustand';
import { ALIASES_MATCH, ButtonFixture, CardFixture, TextFieldFixture, NavigationRailFixture, NavigationShellFixture } from './fixtures';
import { createKitchenStore, type AppearanceChoice, type KitchenStore } from './model';
import './global.css';

const classes = (className: string) => ({ className });
export default function App() {
  const ref = useRef<KitchenStore | null>(null);
  if (!ref.current) ref.current = createKitchenStore();
  return <SafeAreaProvider><KitchenScreen store={ref.current} /></SafeAreaProvider>;
}
function KitchenScreen({ store }: { store: KitchenStore }) {
  const appearance = useStore(store, state => state.appearance);
  const importMode = useStore(store, state => state.importMode);
  const scheme = useColorScheme();
  const chooseAppearance = (choice: AppearanceChoice) => {
    store.getState().setAppearance(choice);
    Uniwind.setTheme(choice);
    // RN Web's Appearance export has no setColorScheme method. Uniwind owns
    // its CSS appearance; native hosts additionally receive the OS override.
    if (Platform.OS !== 'web') Appearance.setColorScheme(choice === 'system' ? 'auto' : choice);
  };
  return <SafeAreaView {...classes('flex-1 bg-surface')}>
    <StatusBar barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'} />
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ alignItems: 'center', padding: 20, paddingBottom: 48 }}>
      <View {...classes('w-full gap-9')} style={{ maxWidth: 960 }}>
        <View {...classes('gap-3')}>
          <Text accessibilityRole="header" {...classes('text-3xl font-semibold text-text')}>NYC-Tron component lab</Text>
          <Text {...classes('text-base leading-6 text-text-muted')}>Try the controls, compare their states, and keep your draft while the layout changes.</Text>
          <Text testID="stability-note" {...classes('text-sm leading-5 text-text-muted')}>Stability proposal pending owner confirmation. These fixtures are evidence targets, not a stable-release approval.</Text>
          <Text testID="alias-result" {...classes('text-sm text-text-muted')}>{ALIASES_MATCH ? '10 public imports resolve to 5 component identities.' : 'Import alias mismatch: validation failed.'}</Text>
          <View {...classes('flex-row flex-wrap gap-3')}>
            {(['direct', 'root'] as const).map(mode => <Button key={mode} title={mode === 'direct' ? 'Direct imports' : 'Root imports'} testID={`imports-${mode}`} variant={importMode === mode ? 'primary' : 'secondary'} onPress={() => store.getState().setImportMode(mode)} />)}
          </View>
          <Text testID="imports-result" {...classes('text-sm text-text-muted')}>Rendering: {importMode} imports</Text>
          <View {...classes('flex-row flex-wrap gap-3')}>
            {(['system', 'light', 'dark'] as const).map(choice => <Button key={choice} title={choice[0].toUpperCase() + choice.slice(1)} testID={`theme-${choice}`} variant={appearance === choice ? 'primary' : 'secondary'} onPress={() => chooseAppearance(choice)} />)}
          </View>
          <Text testID="theme-result" {...classes('text-sm text-text-muted')}>Appearance: {appearance}</Text>
        </View>
        <ButtonFixture store={store} /><CardFixture store={store} /><TextFieldFixture store={store} />
        <NavigationRailFixture store={store} /><NavigationShellFixture store={store} />
      </View>
    </ScrollView>
  </SafeAreaView>;
}
