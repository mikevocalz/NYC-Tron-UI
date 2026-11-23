import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { useStore } from 'zustand';
import { Button as DirectButton } from '@nyc-tron/ui/components/Button';
import { Card as DirectCard } from '@nyc-tron/ui/components/Card';
import { TextField as DirectTextField } from '@nyc-tron/ui/components/TextField';
import { NavigationRail as DirectRail, NavigationShell as DirectShell } from '@nyc-tron/ui/components/NavigationRail';
import { Button as RootButton, Card as RootCard, TextField as RootTextField,
  NavigationRail as RootRail, NavigationShell as RootShell } from '@nyc-tron/ui';
import type { KitchenStore } from './model';

export const ALIASES_MATCH = DirectButton === RootButton && DirectCard === RootCard &&
  DirectTextField === RootTextField && DirectRail === RootRail && DirectShell === RootShell;
const classes = (className: string) => ({ className });
type Props = { store: KitchenStore };
function useComponents(store: KitchenStore) {
  const mode = useStore(store, state => state.importMode);
  return mode === 'root'
    ? { Button: RootButton, Card: RootCard, TextField: RootTextField, NavigationRail: RootRail, NavigationShell: RootShell }
    : { Button: DirectButton, Card: DirectCard, TextField: DirectTextField, NavigationRail: DirectRail, NavigationShell: DirectShell };
}
function Section({ title, detail, children }: { title: string; detail: string; children: ReactNode }) {
  return <View testID={`fixture-${title}`} {...classes('gap-4')}>
    <View {...classes('gap-1')}>
      <Text accessibilityRole="header" {...classes('text-2xl font-semibold text-text')}>{title}</Text>
      <Text {...classes('text-base leading-6 text-text-muted')}>{detail}</Text>
    </View>
    {children}
  </View>;
}
export function ButtonFixture({ store }: Props) {
  const { Button, Card } = useComponents(store);
  const presses = useStore(store, state => state.presses);
  const press = useStore(store, state => state.press);
  return <Section title="Button" detail="Compare variants and states. Loading and disabled actions do not run.">
    <Card><View {...classes('gap-4')}>
      <View {...classes('flex-row flex-wrap gap-3')}>
        <Button title="Try button" testID="button-primary" onPress={press} />
        <Button title="Secondary" testID="button-secondary" variant="secondary" onPress={press} />
        <Button title="Ghost" testID="button-ghost" variant="ghost" onPress={press} />
        <Button title="Danger" testID="button-danger" variant="danger" onPress={press} />
      </View>
      <View {...classes('flex-row flex-wrap gap-3')}>
        <Button title="Disabled" testID="button-disabled" disabled onPress={press} />
        <Button title="Loading" testID="button-loading" loading onPress={press} />
        <Button title="Small target" testID="button-small" size="sm" targetSize={44} onPress={press} />
      </View>
      <Text testID="button-result" accessibilityLiveRegion="polite" {...classes('text-base text-text')}>Press count: {presses}</Text>
    </View></Card>
  </Section>;
}
export function CardFixture({ store }: Props) {
  const { Card } = useComponents(store);
  return <Section title="Card" detail="Raised, sunken and transparent surfaces share the app's tokens.">
    <View {...classes('flex-row flex-wrap gap-3')}>
      {(['raised', 'sunken', 'transparent'] as const).map(surface => <Card key={surface} testID={`card-${surface}`} surface={surface} style={{ flexGrow: 1, flexBasis: 220 }}>
        <Text {...classes('text-base font-semibold text-text')}>{surface[0].toUpperCase() + surface.slice(1)}</Text>
        <Text {...classes('text-base leading-6 text-text-muted')}>A presentational container. It adds no interaction or document state.</Text>
      </Card>)}
    </View>
  </Section>;
}
export function TextFieldFixture({ store }: Props) {
  const { Card, TextField } = useComponents(store);
  const draft = useStore(store, state => state.draft);
  const setDraft = useStore(store, state => state.setDraft);
  const errorDraft = useStore(store, state => state.errorDraft);
  const setErrorDraft = useStore(store, state => state.setErrorDraft);
  return <Section title="TextField" detail="Labels, helper text and errors remain visible. The draft survives layout changes.">
    <Card><View {...classes('gap-5')}>
      <TextField id="kitchen-name" testID="field-editable" label="Project name" value={draft} onChangeText={setDraft} placeholder="Name your project" helperText="Try entering a name, then change the shell's layout below." />
      <TextField id="kitchen-error" testID="field-error" label="Name with validation" value={errorDraft} onChangeText={setErrorDraft} placeholder="Project name" errorText={errorDraft.trim() ? undefined : 'Enter a project name before continuing.'} helperText="The error clears when this field has a value." />
      <TextField id="kitchen-disabled" testID="field-disabled" label="Read-only name" value="Reference project" editable={false} helperText="This example cannot be edited." />
      <Text testID="draft-result" {...classes('text-base text-text-muted')}>{draft ? `Draft: ${draft}` : 'No draft yet. Enter a project name above.'}</Text>
    </View></Card>
  </Section>;
}
const itemsFor = (selected: string) => [
  { id: 'library', label: 'Library', glyph: 'L' },
  { id: 'editor', label: 'Editor', glyph: 'E' },
  { id: 'unavailable', label: 'Unavailable', glyph: '—', disabled: true },
].map(item => ({ ...item, icon: <Text {...classes(`text-base ${item.id === selected ? 'text-on-primary' : 'text-text'}`)}>{item.glyph}</Text> }));
export function NavigationRailFixture({ store }: Props) {
  const { Button, Card, NavigationRail } = useComponents(store);
  const selected = useStore(store, state => state.selectedId);
  const select = useStore(store, state => state.select);
  const collapsed = useStore(store, state => state.collapsed);
  return <Section title="NavigationRail" detail="The edge is explicit. This is a contained component example, not a hardware detector.">
    <Card><View {...classes('gap-4')}>
      <Button title={collapsed ? 'Expand rail labels' : 'Collapse rail labels'} testID="rail-collapse" variant="secondary" onPress={() => store.getState().setCollapsed(!collapsed)} />
      <View {...classes('flex-row gap-4 items-start')}>
        <NavigationRail testID="rail-demo" edge="right" collapsed={collapsed} selectedId={selected} items={itemsFor(selected)} onSelectionChange={select} />
        <View {...classes('flex-1 gap-2')}><Text testID="rail-result" accessibilityLiveRegion="polite" {...classes('text-base text-text')}>Selected: {selected}</Text>
          <Text {...classes('text-base leading-6 text-text-muted')}>Unavailable stays disabled. Collapsing labels preserves each action's accessible name.</Text></View>
      </View>
    </View></Card>
  </Section>;
}
export function NavigationShellFixture({ store }: Props) {
  const { Button, Card, TextField, NavigationRail, NavigationShell } = useComponents(store);
  const edge = useStore(store, state => state.edge);
  const rtl = useStore(store, state => state.rtl);
  const draft = useStore(store, state => state.draft);
  const setDraft = useStore(store, state => state.setDraft);
  const selected = useStore(store, state => state.selectedId);
  const select = useStore(store, state => state.select);
  return <Section title="NavigationShell" detail="Change the physical edge or text direction without replacing the content or its draft.">
    <Card><View {...classes('gap-4')}>
      <View {...classes('flex-row flex-wrap gap-3')}>
        <Button testID="shell-edge" title={`Move rail ${edge === 'right' ? 'left' : 'right'}`} variant="secondary" onPress={() => store.getState().setEdge(edge === 'right' ? 'left' : 'right')} />
        <Button testID="shell-rtl" title={rtl ? 'Use left-to-right text' : 'Use right-to-left text'} variant="secondary" onPress={() => store.getState().setRtl(!rtl)} />
      </View>
      <NavigationShell testID="shell-demo" edge={edge} isRTL={rtl} style={{ minHeight: 240 }}
        rail={<NavigationRail testID="shell-rail" edge={edge} collapsed items={itemsFor(selected)} selectedId={selected} onSelectionChange={select} />}>
        <View {...classes('gap-3 p-3')}><Text {...classes('text-base font-semibold text-text')}>Retained content</Text>
          <TextField id="shell-draft" testID="shell-draft" label="Shared project name" value={draft} onChangeText={setDraft} />
          <Text testID="shell-result" {...classes('text-base text-text-muted')}>Physical edge: {edge}; text: {rtl ? 'RTL' : 'LTR'}</Text>
        </View>
      </NavigationShell>
    </View></Card>
  </Section>;
}
