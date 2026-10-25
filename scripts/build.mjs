import { mkdir, readFile, writeFile, cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { menu, categories } from '../src/data/menu.js';
import { formatPrice, groupMenu } from '../src/lib/catalog.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const escape = (text) => String(text).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const markup = groupMenu(menu, categories).map((group) => `<section class="menu-group" aria-labelledby="group-${group.id}"><div class="menu-group-heading"><span>${group.number}</span><h3 id="group-${group.id}">${escape(group.label)}</h3></div><ul class="menu-list">${group.items.map((item) => `<li class="menu-item"><div class="menu-item-top"><h4>${escape(item.name)}</h4><span class="item-price">${escape(formatPrice(item.price))}</span></div><p class="menu-item-description">${escape(item.description)}</p><p class="item-portion">${escape(item.portion)}</p></li>`).join('')}</ul></section>`).join('\n');
await mkdir(path.join(root, 'dist/assets/js'), { recursive: true });
const template = await readFile(path.join(root, 'src/index.html'), 'utf8');
if (!template.includes('<!-- MENU_ITEMS -->')) throw new Error('Menu placeholder missing');
await writeFile(path.join(root, 'dist/index.html'), template.replace('<!-- MENU_ITEMS -->', markup));
await cp(path.join(root, 'src/styles.css'), path.join(root, 'dist/assets/styles.css'));
for (const relative of ['app.js', 'lib', 'data']) await cp(path.join(root, 'src', relative), path.join(root, 'dist/assets/js', relative), { recursive: true });
// Existing approved image/font files stay untouched in dist/assets.
console.log(`Static build ready: dist/index.html; ${menu.length} readable menu items; no dependencies.`);
