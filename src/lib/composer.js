export const occasions = Object.freeze({
  'coffee-break': 'um coffee break',
  'cafe-da-manha': 'um café da manhã',
  'encontro': 'um encontro à mesa',
});

export function validateRequest({ occasion = 'coffee-break', people = '', date = '' } = {}) {
  const errors = {};
  if (!Object.hasOwn(occasions, occasion)) errors.occasion = 'Escolha uma das ocasiões da lista.';
  if (people !== '' && !/^(?:[1-9]\d{0,2})$/.test(String(people))) errors.people = 'Use um número inteiro entre 1 e 300.';
  if (people !== '' && Number(people) > 300) errors.people = 'Use um número inteiro entre 1 e 300.';
  if (date !== '') {
    const parsed = /^\d{4}-\d{2}-\d{2}$/.test(String(date)) ? new Date(`${date}T12:00:00Z`) : null;
    if (!parsed || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date || Number(date.slice(0, 4)) < 1900 || Number(date.slice(0, 4)) > 2100) {
      errors.date = 'Use uma data válida entre 1900 e 2100 ou deixe em branco.';
    }
  }
  return errors;
}

export function buildEnquiry(input = {}, { peopleBadInput = false, dateBadInput = false } = {}) {
  const values = { occasion: 'coffee-break', people: '', date: '', ...input };
  // Native number/date controls expose some partial entries as value="".
  // A partial entry must not be confused with an intentionally empty optional field.
  if (peopleBadInput) values.people = 'invalid';
  if (dateBadInput) values.date = 'invalid';
  const errors = validateRequest(values);
  if (Object.keys(errors).length) return { ok: false, errors, text: '' };
  const peopleText = values.people === '' ? ', com quantidade de pessoas a combinar' : ` para ${values.people} ${Number(values.people) === 1 ? 'pessoa' : 'pessoas'}`;
  const dateText = values.date === '' ? ' e data a combinar' : `, no dia ${values.date.split('-').reverse().join('/')}`;
  return {
    ok: true,
    errors: {},
    text: `Olá! Gostaria de consultar opções para ${occasions[values.occasion]}${peopleText}${dateText}.\n\nQuais seriam as opções, os valores e a disponibilidade?\n\n[Texto de demonstração da Mesa 01. Não é um pedido e não foi enviado.]`,
  };
}
