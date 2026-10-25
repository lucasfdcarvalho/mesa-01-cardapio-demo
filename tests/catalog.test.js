import test from 'node:test';
import assert from 'node:assert/strict';
import { menu, categories } from '../src/data/menu.js';
import { normalize, filterMenu, groupMenu, formatPrice } from '../src/lib/catalog.js';

test('normalization ignores accents, case and repeated spaces', () => {
  assert.equal(normalize('  CAFÉ   coado  '), 'cafe coado');
  assert.equal(normalize('PÃES'), 'paes');
});
test('all ten items are available with no filters', () => {
  assert.equal(menu.length, 10);
  assert.equal(filterMenu(menu).length, 10);
  assert.equal(new Set(menu.map(({ id }) => id)).size, menu.length);
});
test('category filters return the exact categories', () => {
  assert.equal(filterMenu(menu, 'paes').length, 4);
  assert.equal(filterMenu(menu, 'doces').length, 3);
  assert.equal(filterMenu(menu, 'cafes').length, 3);
  assert.equal(filterMenu(menu, 'unknown').length, 0);
});
test('search is accent insensitive and combines terms and category', () => {
  assert.equal(filterMenu(menu, 'all', 'FERMENTACAO')[0].id, 'pao-natural');
  assert.equal(filterMenu(menu, 'all', 'pao queijo')[0].id, 'pao-queijo');
  assert.equal(filterMenu(menu, 'doces', 'pão').length, 0);
  assert.equal(filterMenu(menu, 'cafes', 'coado')[0].id, 'coado');
});
test('empty searches and reset recover every item; special text is literal', () => {
  assert.equal(filterMenu(menu, 'all', '  ').length, 10);
  assert.equal(filterMenu(menu, 'all', 'zzzznotfound').length, 0);
  assert.equal(filterMenu(menu, 'all', '<script>alert(1)</script>').length, 0);
  assert.equal(filterMenu(menu, 'all', '[').length, 0);
  assert.equal(filterMenu(menu, 'all', '').length, 10);
});
test('grouping preserves menu order and excludes empty categories', () => {
  const grouped = groupMenu(filterMenu(menu, 'cafes'), categories);
  assert.deepEqual(grouped.map(({ id }) => id), ['cafes']);
  assert.deepEqual(grouped[0].items.map(({ id }) => id), ['espresso', 'coado', 'cappuccino']);
});
test('Brazilian prices have two decimals', () => {
  assert.match(formatPrice(6), /^R\$\s6,00$/u);
  assert.match(formatPrice(22), /^R\$\s22,00$/u);
});
