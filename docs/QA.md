# Validação

## Resumo — 25/10/2026

**V4 aprovada no escopo testado**, sem defeito bloqueante identificado nessa revisão. A aplicação publicada preserva os mesmos arquivos da versão revisada. Acesso público ativo confirmado pela configuração nativa de hospedagem em 25/10/2026, às 23:39 UTC; não se trata de uma verificação por um serviço externo de disponibilidade.

A avaliação combina testes automatizados, inspeção de código e observação real em Chromium. **Não é uma certificação de acessibilidade, compatibilidade entre navegadores ou funcionamento em todos os dispositivos.**

## Verificação automatizada

Executada na cópia preparada para publicação, com **Node.js v24.22.1 e npm 11.9.0**, sem instalação de dependências:

- `npm run check`: build concluído; **30 testes aprovados**, sem falhas, cancelamentos, testes ignorados ou pendências.
- O build reproduziu os arquivos estáticos versionados sem alterar seus bytes.
- `node --check`: sintaxe aprovada nos 11 arquivos de aplicação, scripts e testes.
- Smoke HTTP local: nove recursos retornaram 200 com MIME e bytes corretos; HEAD, 404, rejeição de POST (405) e bloqueio de acesso fora de `dist/` também foram verificados. O servidor de revisão foi encerrado.
- O requisito declarado em `package.json` é Node.js `>=20`; esta execução não equivale a uma matriz de testes de todas as versões suportadas.

### Cobertura

Filtros, normalização de acentos, busca combinada com categoria, estado vazio e recuperação; dez itens, agrupamento e preços; composição do exemplo, campos opcionais, limites de pessoas e datas; validade nativa de data parcialmente apagada e recuperação; sincronização de `src/` com `dist/`; ativos locais e licença da fonte; CSP e ausência de APIs de rede/persistência/telemetria no JavaScript; ícones SVG, tamanhos de texto e regras responsivas.

## Revisão em navegador

Realizada em **Chromium, por interface nativa**, em 25/10/2026, entre 23:33 e 23:37 UTC. Os tamanhos abaixo são viewports CSS medidos, não dimensões de imagem nem modelos de telefone emulados.

| Viewport CSS observado | Escopo | Resultado |
| --- | --- | --- |
| 1440 × 900 | Desktop, imagem principal e cardápio | Sem overflow horizontal ou sobreposição observada. |
| 768 × 1023 | Tablet, hierarquia e alinhamento de itens/preços | Nomes e preços separados; descrições sem corte. |
| 390 × 546 | Mobile em janela baixa, cardápio e simulador | Controles, busca, primeiro item completo e seu preço visíveis após o salto para o cardápio, sem rolagem adicional. |
| 320 × 409 | Verificação adicional de estresse | Sem overflow horizontal observado. |

### Interações e legibilidade observadas

- Ícones SVG renderizados corretamente; CTAs/filtros em 14 px CSS, busca mobile em 16 px e avisos relevantes de IA/demonstração em 12 px.
- Busca com acentos/capitalização, combinação com categoria, estado vazio e limpeza funcionando; recuperação retorna os dez itens e o foco para a busca.
- Data parcialmente apagada produz erro inline, prévia vazia e cópia desabilitada. Ao apagar todos os segmentos, o campo opcional volta a ser válido imediatamente e permanece correto após sair do campo.
- Data fora da faixa rejeitada e data completa válida recuperada. Quantidades 0, 301 e 1,5 rejeitadas, com recuperação para quantidade válida.
- Texto fictício gerado e copiado correspondeu à prévia; o status informa que nada foi enviado ou confirmado.
- Escape fecha o diálogo e devolve o foco; reabertura restaura os valores iniciais. O diálogo em janela baixa permite alcançar os controles de cópia e status por rolagem, sem overflow horizontal.

### Capturas incluídas

As imagens abaixo são capturas **inalteradas de uma janela isolada do navegador**, incluindo sua barra, com apenas a demonstração aberta. Não são montagens ou capturas de dispositivos físicos. O zoom nativo explica a diferença entre viewport CSS e pixels do arquivo.

| Captura | Viewport CSS | Pixels do JPEG | Zoom / DPR |
| --- | --- | --- | --- |
| [Página inicial desktop](screenshots/desktop-hero.jpg) | 1440 × 900 | 1160 × 811 | 80% / 0,8 |
| [Cardápio mobile](screenshots/mobile-menu.jpg) | 390 × 546 | 593 × 910 | 150% / 1,5 |
| [Cardápio tablet](screenshots/tablet-menu.jpg) | 768 × 1023 | 623 × 910 | 80% / 0,8 |

## Limites da revisão

- **390 × 844 não foi testado.** O recorte mobile observado é 390 × 546; a altura do tablet é 1023, não 1024.
- Não foram testados Safari, Firefox ou dispositivos físicos com toque.
- Não houve sessão de leitor de tela nem auditoria formal WCAG.
- Movimento reduzido e conteúdo sem JavaScript foram inspecionados no código, não exercitados por configurações de runtime do navegador.
- Não houve captura/instrumentação de tráfego de rede. A ausência de chamadas da aplicação foi verificada no código e nos testes estáticos, não por um registro de requisições.
- O resultado cobre os fluxos e recortes descritos; não comprova todos os estados ou condições de uso.

## Reproduzir

```sh
npm run check
npm run dev
```

O servidor local não é um deploy. Consulte [Executar localmente](../README.md#executar-localmente) para a porta e as opções de Bash/PowerShell. Alterações posteriores exigem nova verificação automatizada e revisão dos fluxos afetados no navegador.
