// Todos os itens, ingredientes e preços abaixo são exemplos fictícios.
export const categories = Object.freeze([
  { id: 'paes', label: 'Pães & salgados', short: 'Pães', number: '01' },
  { id: 'doces', label: 'Doces da pausa', short: 'Doces', number: '02' },
  { id: 'cafes', label: 'Cafés & companhia', short: 'Cafés', number: '03' },
]);

export const menu = Object.freeze([
  { id: 'pao-natural', category: 'paes', name: 'Pão de fermentação natural', description: 'Casca dourada, miolo macio. Para levar à mesa.', portion: 'unidade · 400 g', price: 22 },
  { id: 'pao-queijo', category: 'paes', name: 'Pão de queijo', description: 'Pequeno no tamanho, generoso no queijo.', portion: 'unidade', price: 6 },
  { id: 'croissant', category: 'paes', name: 'Croissant de manteiga', description: 'Camadas delicadas e um bom motivo para parar.', portion: 'unidade', price: 12 },
  { id: 'sanduiche', category: 'paes', name: 'Sanduíche da casa', description: 'Pão francês, queijo, presunto, tomate e folhas.', portion: 'unidade', price: 19 },
  { id: 'bolo-fuba', category: 'doces', name: 'Bolo de fubá', description: 'Aquele sabor simples que combina com café.', portion: 'fatia', price: 8 },
  { id: 'bolo-laranja', category: 'doces', name: 'Bolo de laranja', description: 'Massa leve com uma delicada calda cítrica.', portion: 'fatia', price: 9 },
  { id: 'cookie', category: 'doces', name: 'Cookie de chocolate', description: 'Bordas crocantes e pedaços de chocolate.', portion: 'unidade', price: 10 },
  { id: 'espresso', category: 'cafes', name: 'Espresso', description: 'Intenso, curto e sem pressa para o próximo gole.', portion: '50 ml', price: 7 },
  { id: 'coado', category: 'cafes', name: 'Café coado', description: 'Uma xícara leve para acompanhar a conversa.', portion: '150 ml', price: 8 },
  { id: 'cappuccino', category: 'cafes', name: 'Cappuccino', description: 'Espresso, leite e uma camada cremosa de espuma.', portion: '180 ml', price: 12 },
]);
