import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => readFile(path.join(root, file), 'utf8');
async function filesIn(directory) {
  const entries = await readdir(path.join(root, directory), { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => entry.isDirectory() ? filesIn(`${directory}/${entry.name}`) : `${directory}/${entry.name}`))).flat();
}

test('published page has the entire menu even without JavaScript', async () => {
  const html = await read('dist/index.html');
  assert.equal((html.match(/class="menu-item"/g) || []).length, 10);
  assert.match(html, /<html lang="pt-BR">/);
  assert.match(html, /Demonstração de portfólio/);
  assert.match(html, /marca e cardápio fictícios/);
  assert.match(html, /não recebe pedidos/);
  assert.match(html, /Imagem ilustrativa gerada com IA/);
  assert.match(html, /Não informe dados pessoais/);
});
test('all local resource references and anchor targets exist', async () => {
  const html = await read('dist/index.html');
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
  for (const [, href] of html.matchAll(/\bhref="(#[^"]+)"/g)) assert.ok(ids.has(href.slice(1)), href);
  for (const [, src] of html.matchAll(/(?:href|src)="(\/assets\/[^"]+)"/g)) assert.ok((await stat(path.join(root, 'dist', src))).isFile(), src);
});
test('page has no real contact endpoint, external script, form destination or tracker', async () => {
  const html = await read('dist/index.html');
  assert.doesNotMatch(html, /(?:href|src|action)=["'](?:https?:|\/\/|mailto:|tel:)/i);
  assert.doesNotMatch(html, /iframe|googletagmanager|google-analytics|wa\.me|whatsapp|<form[^>]+action=/i);
  assert.match(html, /connect-src 'none'/);
  assert.match(html, /form-action 'none'/);
  assert.match(html, /object-src 'none'/);
  assert.doesNotMatch(html, /type="(?:email|tel|password)"/i);
});
test('client JavaScript has no network, persistence, telemetry or unsafe DOM sinks', async () => {
  const files = (await filesIn('dist/assets/js')).filter((file) => file.endsWith('.js'));
  const js = (await Promise.all(files.map(read))).join('\n');
  assert.doesNotMatch(js, /\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon|localStorage|sessionStorage|indexedDB|document\.cookie|\.innerHTML|insertAdjacentHTML|\beval\s*\(/);
  assert.match(js, /navigator\.clipboard/);
  assert.match(js, /textContent/);
});
test('build source is synced to shipped JavaScript and stylesheet', async () => {
  assert.equal(await read('src/app.js'), await read('dist/assets/js/app.js'));
  assert.equal(await read('src/styles.css'), await read('dist/assets/styles.css'));
  for (const file of ['data/menu.js', 'lib/catalog.js', 'lib/composer.js', 'lib/form-events.js']) assert.equal(await read(`src/${file}`), await read(`dist/assets/js/${file}`));
});
test('hosting identity is retained and images/fonts are bundled', async () => {
  const manifest = JSON.parse(await read('.openai/hosting.json'));
  assert.equal(manifest.project_id, 'appgprj_6ade832c56b4819185a2f0a82654e9e3');
  assert.equal(manifest.static.directory, 'dist');
  for (const file of ['hero-padaria.webp', 'hero-padaria-800.webp', 'fonts/inter-latin-wght-normal.woff2']) assert.ok((await stat(path.join(root, 'dist/assets', file))).size > 1000);
  assert.match(await read('dist/assets/fonts/Inter-LICENSE.txt'), /SIL OPEN FONT LICENSE Version 1.1/);
});
test('mobile, reduced motion, visible focus and dialog affordances are present', async () => {
  const css = await read('dist/assets/styles.css');
  const html = await read('dist/index.html');
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media\(max-width:600px\)/);
  assert.match(html, /<dialog[^>]+aria-labelledby="dialog-title"/);
  assert.match(html, /aria-label="Fechar simulação"/);
  assert.match(html, /role="status"/);
});

test('decorative interface icons use inline SVG, independent of font glyph coverage', async () => {
  const html = await read('dist/index.html');
  assert.doesNotMatch(html, /[↗→↑↺∅×]/u);
  assert.doesNotMatch(html, /<span[^>]*>\+<\/span>/);
  const icons = [...html.matchAll(/<svg class="icon-svg(?: empty-mark)?"[^>]*>/g)].map((match) => match[0]);
  assert.equal(icons.length, 12);
  for (const icon of icons) {
    assert.match(icon, /aria-hidden="true"/);
    assert.match(icon, /focusable="false"/);
    assert.match(icon, /viewBox="0 0 24 24"/);
  }
  assert.match(html, /Explorar cardápio <svg class="icon-svg"/);
  assert.match(html, /Simular solicitação <svg class="icon-svg"/);
});

test('tablet and mobile menu use readable names and descriptions without shrinking desktop', async () => {
  const css = await read('dist/assets/styles.css');
  const lines = css.split('\n');
  for (const width of [1150, 800]) {
    const media = lines.find((line) => line.startsWith(`@media(max-width:${width}px)`));
    assert.ok(media);
    assert.match(media, /\.menu-item h4\{font-size:15px\}/);
    assert.match(media, /\.menu-item-description\{font-size:14px\}/);
  }
  assert.doesNotMatch(css, /\.menu-item-description\{font-size:11px/);
  assert.match(css, /\.menu-item h4\{font-size:16px;font-weight:550/);
  const mobile = lines.find((line) => line.startsWith('@media(max-width:600px)'));
  assert.match(mobile, /\.menu-item h4\{font-size:15px\}/);
  assert.match(mobile, /\.menu-item-description\{font-size:14px;/);
});

test('functional copy and demo qualifications have explicit readable type at every breakpoint', async () => {
  const css = await read('dist/assets/styles.css');
  const requirements = {
    '.button': 14, '.text-link': 14, '.filter': 14, '.copy-button': 14,
    '.site-header nav a': 13, '.search-box input': 14,
    '.demo-notice': 12, '.example-note': 12, '.hero-figure figcaption': 12,
    '.gathering-caption': 12, '.results-line': 12, '.reset-link': 12,
    '.form-field label': 14, '.form-field label>span': 12,
    '.field-error': 12, '.preview-heading label': 14, '.preview-heading span': 12,
    '#copy-status': 12, '.menu-bottom-note': 12, '.footer-bottom': 12,
  };
  for (const [selector, minimum] of Object.entries(requirements)) {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const rules = [...css.matchAll(new RegExp(`${escaped}\\{([^{}]*)\\}`, 'g'))];
    const sizes = rules.flatMap(([, body]) => [...body.matchAll(/font-size:(\d+)px/g)].map(([, size]) => Number(size)));
    assert.ok(sizes.length, `${selector} should have an explicit font size`);
    for (const size of sizes) assert.ok(size >= minimum, `${selector}: ${size}px is smaller than ${minimum}px`);
  }
  const mobile = css.split('\n').find((line) => line.startsWith('@media(max-width:600px)'));
  assert.match(mobile, /\.search-box input\{font-size:16px\}/);
  assert.match(mobile, /\.form-field input,\.form-field select\{font-size:16px;/);
  assert.match(mobile, /#enquiry-preview\{font-size:16px;/);
  assert.match(mobile, /\.text-link\{font-size:14px;min-height:44px;/);
});

test('mobile menu introduction is compact while controls, disclaimer and item order remain', async () => {
  const css = await read('dist/assets/styles.css');
  const html = await read('dist/index.html');
  const mobile = css.split('\n').find((line) => line.startsWith('@media(max-width:600px)'));
  assert.match(mobile, /\.menu-section\{padding-top:24px\}/);
  assert.match(mobile, /\.menu-section \.section-heading\{margin-bottom:16px\}/);
  assert.match(mobile, /\.menu-intro-copy\{display:none\}/);
  assert.match(mobile, /\.menu-controls\{gap:12px;padding-block:12px\}/);
  assert.doesNotMatch(mobile, /\.(?:menu-controls|filter-buttons|search-box)\{[^}]*display:none/);
  assert.match(html, /Itens e preços fictícios, sem oferta de venda\./);
  assert.match(html, /aria-label="Sobre esta demonstração">Sobre<\/a>/);
  assert.ok(html.indexOf('id="menu-controls"') < html.indexOf('id="menu-results"'));
  assert.ok(html.indexOf('id="menu-results"') < html.indexOf('Pão de fermentação natural'));
});
