import { AppRegistry, Text, View } from 'react-native';
import { create } from 'zustand';
import { Button } from '../../../src/components/Button.tsx';
import { NavigationRail } from '../../../src/components/NavigationRail.tsx';
import { TextField } from '../../../src/components/TextField.tsx';

const useFixture = create<{ loading: boolean; selected: string; invalid: boolean; presses: number }>(() => ({
  loading: true, selected: 'first', invalid: true, presses: 0,
}));
function App() {
  const state = useFixture();
  return <View style={{ padding: 24, gap: 16 }}>
    <Button testID="busy-action" title="Save fixture" loading={state.loading} onPress={() => useFixture.setState(s => ({ presses: s.presses + 1 }))} />
    <Button title="Finish loading" onPress={() => useFixture.setState({ loading: false })} />
    <Text testID="fixture-count">{state.presses}</Text>
    <NavigationRail edge="right" selectedId={state.selected} onSelectionChange={selected => useFixture.setState({ selected })}
      items={[{ id: 'first', label: 'First', icon: <Text testID="decorative-rail-icon">F</Text> }, { id: 'second', label: 'Second' }, { id: 'disabled', label: 'Disabled destination', disabled: true }]} />
    <TextField testID="validated-field" id="validated" label="Project" value="" onChangeText={() => {}}
      helperText="Use a descriptive name." errorText={state.invalid ? 'A project name is required.' : undefined} />
    <TextField testID="disabled-field" id="disabled" label="Disabled project" value="Read-only" editable={false} />
    <Button title="Clear field error" onPress={() => useFixture.setState({ invalid: false })} />
  </View>;
}
document.body.style.margin = '0';
AppRegistry.registerComponent('basic-accessibility', () => App);
AppRegistry.runApplication('basic-accessibility', { rootTag: document.getElementById('root') });
