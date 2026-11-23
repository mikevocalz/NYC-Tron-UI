import strictAssert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Text, View } from 'react-native';
import * as Root from '@nyc-tron/ui';
import { Button } from '@nyc-tron/ui/components/Button';
import { Card } from '@nyc-tron/ui/components/Card';
import { TextField } from '@nyc-tron/ui/components/TextField';
import { NavigationRail, NavigationShell } from '@nyc-tron/ui/components/NavigationRail';
import { createKitchenStore } from '../../examples/kitchen-sink/model';

let passed = 0;
const assert = new Proxy(strictAssert, { get(target, key) {
  const fn = Reflect.get(target, key);
  return typeof fn === 'function' ? (...args: any[]) => { const result = fn(...args); passed++; return result; } : fn;
} });
const html = (element: React.ReactElement) => renderToStaticMarkup(element);
const completed: string[] = [];
for (const mode of ['direct', 'root'] as const) {
  const components = mode === 'root' ? Root : { Button, Card, TextField, NavigationRail, NavigationShell };
  for (const name of ['Button', 'Card', 'TextField', 'NavigationRail', 'NavigationShell'] as const) assert.equal(components[name], Root[name]);
  const { Button: Action, Card: Surface, TextField: Field, NavigationRail: Rail, NavigationShell: Shell } = components;
  const busy = html(<Action title="Save" loading />);
  assert.match(busy, /aria-busy="true"/); assert.match(busy, /aria-disabled="true"/);
  assert.match(html(<Action title="Save" disabled />), /aria-disabled="true"/);
  assert.match(html(<Action title="Save" />), /aria-busy="false"/);
  assert.throws(() => html(<Action title="Invalid target" targetSize={12} />), /at least 44/);
  for (const surface of ['raised', 'sunken', 'transparent'] as const) {
    const output = html(<Surface surface={surface}><Text>Content</Text></Surface>);
    assert.match(output, /Content/);
    assert.match(output, new RegExp(surface === 'transparent' ? 'bg-transparent' : `bg-surface-${surface}`));
  }
  const error = html(<Field id="unit-name" label="Project name" value="" errorText="Enter a name." />);
  assert.match(error, /aria-invalid="true"/); assert.match(error, /aria-describedby="unit-name-description"/); assert.match(error, /id="unit-name-description"/);
  const helper = html(<Field id="unit-name" label="Project name" value="Draft" helperText="Choose a name." editable={false} />);
  assert.match(helper, /aria-disabled="true"/); assert.match(helper, /aria-invalid="false"/); assert.doesNotMatch(helper, /Enter a name/);
  const rail = html(<Rail edge="right" items={[{ id: 'a', label: 'Alpha' }, { id: 'b', label: 'Beta', disabled: true }]} selectedId="a" onSelectionChange={() => {}} />);
  assert.match(rail, /aria-selected="true"/); assert.match(rail, /aria-selected="false"/); assert.match(rail, /aria-disabled="true"/);
  const child = <View><Text>Canonical child</Text></View>, railChild = <View><Text>Physical rail</Text></View>;
  for (const edge of ['left', 'right'] as const) for (const isRTL of [false, true]) {
    const output = html(<Shell edge={edge} isRTL={isRTL} rail={railChild}>{child}</Shell>);
    assert.equal(output.indexOf('Physical rail') < output.indexOf('Canonical child'), edge === 'left');
    assert.match(output, new RegExp(`direction:${isRTL ? 'rtl' : 'ltr'}`));
  }
  const store = createKitchenStore(); store.getState().setDraft('Owned draft');
  store.getState().setEdge('left'); store.getState().setRtl(true); store.getState().setImportMode(mode); store.getState().setAppearance('dark');
  assert.equal(store.getState().draft, 'Owned draft');
  store.getState().select('unavailable'); assert.equal(store.getState().selectedId, 'library');
  assert.equal(createKitchenStore().getState().draft, '', 'new fixture instances do not share state');
  completed.push(mode);
}
console.log(JSON.stringify({ status: 'passed', modes: completed, components: ['Button', 'Card', 'TextField', 'NavigationRail', 'NavigationShell'], assertions: { passed, failed: 0, skipped: 0 } }));
