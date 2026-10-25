/** Accent-insensitive, whitespace-normalized matching; no HTML interpretation. */
export function normalize(value = '') {
  return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').trim().replace(/\s+/g, ' ');
}

export function filterMenu(items, category = 'all', query = '') {
  const terms = normalize(query).split(' ').filter(Boolean);
  return items.filter((item) => {
    if (category !== 'all' && item.category !== category) return false;
    const haystack = normalize(`${item.name} ${item.description} ${item.portion}`);
    return terms.every((term) => haystack.includes(term));
  });
}

export function formatPrice(price) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
}

export function groupMenu(items, categories) {
  return categories.map((category) => ({ ...category, items: items.filter((item) => item.category === category.id) })).filter((group) => group.items.length);
}
