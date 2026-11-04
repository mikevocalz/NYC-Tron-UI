import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
test('semantic text input is app-theme neutral and RN native',()=>{
 const text=readFileSync(new URL('../src/components/TextField.tsx',import.meta.url),'utf8');
 assert.match(text,/<TextInput/);
 // The visible label is the accessible name and is linked by nativeID.
 assert.match(text,/accessibilityLabel=\{label\}/);
 assert.match(text,/nativeID=\{id\+'-label'\}/);
 assert.match(text,/accessibilityLabelledBy=\{id\+'-label'\}/);
 // Errors are announced, and only one border token applies at a time.
 assert.match(text,/accessibilityRole="alert"/);
 assert.match(text,/errorText\?'border-danger':'border-border'/);
 assert.doesNotMatch(text,/<input\b|from ['"]react-dom/);
});
