import { menu, categories } from './data/menu.js';
import { filterMenu, formatPrice, groupMenu } from './lib/catalog.js';
import { buildEnquiry } from './lib/composer.js';
import { observeDateValidity } from './lib/form-events.js';

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/** All user-controlled values remain text; no HTML injection or network calls. */
function renderMenu(items) {
  const fragment = document.createDocumentFragment();
  for (const group of groupMenu(items, categories)) {
    const section = element('section', 'menu-group');
    section.setAttribute('aria-labelledby', `group-${group.id}`);
    const heading = element('div', 'menu-group-heading');
    const title = element('h3', '', group.label);
    title.id = `group-${group.id}`;
    heading.append(element('span', '', group.number), title);
    const list = element('ul', 'menu-list');
    for (const item of group.items) {
      const row = element('li', 'menu-item');
      const top = element('div', 'menu-item-top');
      top.append(element('h4', '', item.name), element('span', 'item-price', formatPrice(item.price)));
      row.append(top, element('p', 'menu-item-description', item.description), element('p', 'item-portion', item.portion));
      list.append(row);
    }
    section.append(heading, list);
    fragment.append(section);
  }
  document.getElementById('menu-results').replaceChildren(fragment);
}

function initCatalog() {
  const search = document.getElementById('menu-search');
  const filters = [...document.querySelectorAll('[data-category]')];
  const reset = document.getElementById('reset-filters');
  const count = document.getElementById('results-count');
  let category = 'all';
  const apply = () => {
    const items = filterMenu(menu, category, search.value);
    renderMenu(items);
    document.getElementById('empty-state').hidden = items.length !== 0;
    reset.hidden = category === 'all' && !search.value;
    for (const button of filters) {
      const selected = button.dataset.category === category;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    }
    count.textContent = `${items.length} ${items.length === 1 ? 'item' : 'itens'} ${category === 'all' && !search.value ? 'no cardápio' : items.length === 1 ? 'encontrado' : 'encontrados'}`;
  };
  for (const button of filters) button.addEventListener('click', () => { category = button.dataset.category; apply(); });
  search.addEventListener('input', apply);
  const clear = () => {
    category = 'all';
    search.value = '';
    apply();
    search.focus();
  };
  reset.addEventListener('click', clear);
  document.getElementById('empty-reset').addEventListener('click', clear);
  document.getElementById('menu-controls').hidden = false;
}

function initComposer() {
  const dialog = document.getElementById('request-dialog');
  if (typeof dialog.showModal !== 'function') return;
  const form = document.getElementById('request-form');
  const preview = document.getElementById('enquiry-preview');
  const copy = document.getElementById('copy-enquiry');
  const status = document.getElementById('copy-status');
  const fields = ['occasion', 'people', 'date'];
  let trigger = null;
  let revision = 0;
  const refresh = () => {
    revision += 1;
    const values = Object.fromEntries(fields.map((name) => [name, form.elements.namedItem(name).value]));
    // Native inputs can have incomplete visible content while their value is empty.
    const result = buildEnquiry(values, {
      peopleBadInput: form.elements.namedItem('people').validity.badInput,
      dateBadInput: form.elements.namedItem('date').validity.badInput,
    });
    for (const name of fields) {
      const input = form.elements.namedItem(name);
      const error = document.getElementById(`${name}-error`);
      error.textContent = result.errors[name] || '';
      error.hidden = !result.errors[name];
      input.setAttribute('aria-invalid', String(Boolean(result.errors[name])));
      if (result.errors[name]) input.setAttribute('aria-describedby', error.id);
      else input.removeAttribute('aria-describedby');
    }
    preview.value = result.text;
    copy.disabled = !result.ok;
    status.textContent = result.ok ? 'Copiar não envia uma mensagem nem confirma um pedido.' : 'Revise os campos indicados para visualizar o exemplo.';
  };
  form.addEventListener('input', refresh);
  form.addEventListener('change', refresh);
  observeDateValidity(form.elements.namedItem('date'), refresh);
  form.addEventListener('submit', (event) => event.preventDefault());
  for (const button of document.querySelectorAll('[data-open-composer]')) {
    button.hidden = false;
    button.addEventListener('click', () => {
      if (dialog.open) return;
      trigger = button;
      form.reset();
      refresh();
      dialog.showModal();
      document.body.classList.add('dialog-open');
      form.elements.namedItem('occasion').focus();
    });
  }
  document.getElementById('close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    revision += 1;
    document.body.classList.remove('dialog-open');
    form.reset();
    preview.value = '';
    trigger?.focus({ preventScroll: true });
  });
  copy.addEventListener('click', async () => {
    if (copy.disabled || !preview.value || !dialog.open) return;
    const copiedRevision = revision;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(preview.value);
      if (dialog.open && copiedRevision === revision) status.textContent = 'Texto copiado. Nada foi enviado e nenhum pedido foi confirmado.';
    } catch {
      if (!dialog.open || copiedRevision !== revision) return;
      preview.focus();
      preview.select();
      status.textContent = 'A cópia automática não está disponível. O texto foi selecionado para você copiar manualmente.';
    }
  });
}

initCatalog();
initComposer();
