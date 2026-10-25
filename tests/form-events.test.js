import test from 'node:test';
import assert from 'node:assert/strict';
import { observeDateValidity } from '../src/lib/form-events.js';
import { buildEnquiry } from '../src/lib/composer.js';

test('date segment clearing refreshes when badInput changes but value stays empty', () => {
  const control = Object.assign(new EventTarget(), { value: '', validity: { badInput: true } });
  let result = buildEnquiry({ date: control.value }, { dateBadInput: control.validity.badInput });
  const refresh = () => { result = buildEnquiry({ date: control.value }, { dateBadInput: control.validity.badInput }); };
  const stop = observeDateValidity(control, refresh);
  assert.equal(result.ok, false);
  // Clear the remaining month/year segments: no new value or input event.
  control.validity.badInput = false;
  const keyup = new Event('keyup', { cancelable: true });
  control.dispatchEvent(keyup);
  assert.equal(keyup.defaultPrevented, false);
  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, {});
  assert.match(result.text, /data a combinar/);
  stop();
});

test('leaving the date control also synchronizes validity without trapping focus', () => {
  const control = Object.assign(new EventTarget(), { value: '', validity: { badInput: true } });
  let result;
  const stop = observeDateValidity(control, () => {
    result = buildEnquiry({ date: control.value }, { dateBadInput: control.validity.badInput });
  });
  control.dispatchEvent(new Event('blur'));
  assert.equal(result.ok, false);
  control.validity.badInput = false;
  const blur = new Event('blur', { cancelable: true });
  control.dispatchEvent(blur);
  assert.equal(blur.defaultPrevented, false);
  assert.equal(result.ok, true);
  stop();
});
