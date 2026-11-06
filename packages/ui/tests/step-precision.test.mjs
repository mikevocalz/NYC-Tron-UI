import test from 'node:test';
import assert from 'node:assert/strict';
import {stepDecimalPlaces,formatStepValue} from '../src/components/forge/inputs/precision.ts';
test('fractional mantissas and exponent steps retain exact display precision including fine adjustment',()=>{assert.equal(stepDecimalPlaces(.25),2);assert.equal(stepDecimalPlaces(2.5e-7),8);assert.equal(formatStepValue(.25,.25),'0.25');assert.equal(formatStepValue(2.5e-7,2.5e-7),'2.5e-7');assert.equal(formatStepValue(.025,.25),'0.025');assert.throws(()=>stepDecimalPlaces(0),RangeError);});
