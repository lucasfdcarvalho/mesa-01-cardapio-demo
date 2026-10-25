# Guia de adaptação responsável

Este projeto demonstra um recorte pequeno: tornar um cardápio legível e ajudar a formular uma primeira consulta. Não é um sistema de pedidos nem uma reconstrução completa de operação comercial.

## Para adaptar como demonstração, quando autorizado

1. Preserve os avisos de identidade/cardápio fictícios e de não recebimento de pedidos.
2. Mantenha os preços claramente ilustrativos e a origem da imagem identificada.
3. Edite o conteúdo em `src/data/menu.js`; execute `npm run check`.
4. Mantenha as fontes com sua licença e não adicione fotos ou marcas sem direito de uso.
5. Confira o resultado visual em 1440, 768 e 390 px, também em janela baixa e pelo teclado.

## Antes de um uso comercial real

- Obtenha autorização expressa para nome, marca, fotografias e conteúdo.
- Valide cardápio, preços, porções, ingredientes, alergênicos, disponibilidade, retirada/entrega, horários e condições com o responsável.
- Defina o canal de atendimento e sua autorização. Não basta substituir o texto do botão para afirmar que uma mensagem foi enviada.
- Qualquer integração, coleta de dados, pedido, pagamento ou acompanhamento exige escopo próprio, requisitos de privacidade/segurança e testes ponta a ponta.
- Só retire os avisos de demonstração quando a publicação e o conteúdo real tiverem sido aprovados. Revise o `noindex` conforme o destino acordado.
- Preserve acessibilidade, busca, estados vazios, foco do diálogo, redução de movimento, desempenho e funcionamento do conteúdo sem JavaScript.

Este guia descreve cuidados técnicos e editoriais; não atribui uma licença de uso ao código. O repositório não inclui uma licença open-source para o projeto. A fonte Inter mantém sua licença própria, preservada em `dist/assets/fonts/Inter-LICENSE.txt`.

Não há números de conversão, garantias de vendas, prazo de entrega ou preços de serviços pressupostos neste projeto.
