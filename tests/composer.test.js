import test from 'node:test';
import assert from 'node:assert/strict';
import { buildEnquiry, validateRequest, occasions } from '../src/lib/composer.js';

test('a complete example is available without optional fields', () => {
  const result = buildEnquiry();
  assert.equal(result.ok, true);
  assert.match(result.text, /coffee break/);
  assert.match(result.text, /quantidade de pessoas a combinar/);
  assert.match(result.text, /data a combinar/);
  assert.match(result.text, /Não é um pedido e não foi enviado/);
});
test('all supported occasions produce a template and optional values format correctly', () => {
  for (const occasion of Object.keys(occasions)) assert.equal(buildEnquiry({ occasion }).ok, true);
  const { text } = buildEnquiry({ occasion: 'cafe-da-manha', people: '12', date: '2026-12-03' });
  assert.match(text, /café da manhã para 12 pessoas, no dia 03\/12\/2026/);
  assert.match(buildEnquiry({ people: 1 }).text, /para 1 pessoa e/);
});
test('invalid and untrusted occasions never enter the preview', () => {
  for (const occasion of ['<img src=x onerror=alert(1)>', '__proto__', 'constructor', '']) {
    const result = buildEnquiry({ occasion });
    assert.equal(result.ok, false);
    assert.equal(result.text, '');
    assert.ok(result.errors.occasion);
  }
});
test('people must be integer 1–300 or blank', () => {
  for (const people of ['', 1, '12', 300]) assert.deepEqual(validateRequest({ people }), {});
  for (const people of [0, -1, 301, 1.5, '1e2', '01', 'NaN', '12345678901', 'someone@example.test']) assert.ok(validateRequest({ people }).people);
});
test('date format, impossible dates and year bounds are validated', () => {
  for (const date of ['', '2028-02-29', '2026-10-25']) assert.deepEqual(validateRequest({ date }), {});
  for (const date of ['25/10/2026', '2026-02-29', '2026-04-31', '2026-13-01', '1899-01-01', '2101-01-01', '<script>']) assert.ok(validateRequest({ date }).date, date);
});
test('invalid inputs never produce a partial or misleading request', () => {
  const result = buildEnquiry({ occasion: 'unknown', people: '0', date: 'tomorrow' });
  assert.equal(result.ok, false);
  assert.equal(result.text, '');
  assert.equal(Object.keys(result.errors).length, 3);
});
test('template is deterministic and never contains a binding quote or confirmation', () => {
  const input = { occasion: 'encontro', people: 20, date: '2026-11-14' };
  assert.deepEqual(buildEnquiry(input), buildEnquiry(input));
  assert.doesNotMatch(buildEnquiry(input).text, /R\$|confirmado|reserva efetuada|pagamento aprovado/i);
  assert.match(buildEnquiry(input).text, /consultar opções/);
});

test('partially cleared native date is invalid even when its exposed value is empty', () => {
  // Browser reproduction: 2026-11-12 -> delete day -> visible dd/11/2026,
  // input.value === '' and input.validity.badInput === true.
  const result = buildEnquiry({ date: '' }, { dateBadInput: true });
  assert.equal(result.ok, false);
  assert.ok(result.errors.date);
  assert.equal(result.text, '');
});

test('date recovers from complete to partial to valid and intentionally blank', () => {
  const initial = buildEnquiry({ date: '2026-11-12' }, { dateBadInput: false });
  assert.equal(initial.ok, true);
  assert.match(initial.text, /12\/11\/2026/);
  assert.equal(buildEnquiry({ date: '' }, { dateBadInput: true }).ok, false);
  const corrected = buildEnquiry({ date: '2026-11-13' }, { dateBadInput: false });
  assert.equal(corrected.ok, true);
  assert.deepEqual(corrected.errors, {});
  assert.match(corrected.text, /13\/11\/2026/);
  const empty = buildEnquiry({ date: '' }, { dateBadInput: false });
  assert.equal(empty.ok, true);
  assert.deepEqual(empty.errors, {});
  assert.match(empty.text, /data a combinar/);
});

test('native number badInput keeps its validation behavior and recovers', () => {
  const partial = buildEnquiry({ people: '' }, { peopleBadInput: true });
  assert.equal(partial.ok, false);
  assert.ok(partial.errors.people);
  assert.equal(partial.text, '');
  assert.equal(buildEnquiry({ people: '12' }, { peopleBadInput: false }).ok, true);
  assert.equal(buildEnquiry({ people: '' }, { peopleBadInput: false }).ok, true);
});
