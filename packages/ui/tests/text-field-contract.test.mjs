import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
test('semantic text input is app-theme neutral and RN native',()=>{
 const text=readFileSync(new URL('../src/components/TextField.tsx',import.meta.url),'utf8');
 assert.match(text,/TextInput/);assert.match(text,/accessibilityLabel/);assert.match(text,/label=/);
 assert.doesNotMatch(text,/<input\b|from ['"]react-dom/);
});
