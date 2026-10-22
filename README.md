# Controle Financeiro (PWA)

Aplicativo web de controle financeiro pessoal para registrar receitas e despesas e acompanhar o saldo mês a mês. Funciona **offline**, pode ser **instalado** como app e guarda os dados no próprio navegador. Feito com HTML, CSS e JavaScript puros, sem frameworks e sem backend.

**Acesse o app:** https://lucassloliveira.github.io/controle-financeiro/

Projeto de estudo desenvolvido durante o curso de front-end da EBAC.

## Funcionalidades

- Cadastro de lançamentos com tipo (receita ou despesa), descrição, valor, data e categoria
- Lista de lançamentos do mês, do mais recente para o mais antigo
- Remoção de lançamentos
- Navegação entre meses com os botões anterior e próximo (inclui a virada de ano)
- Resumo do mês: saldo, total de receitas e total de despesas
- Dados salvos no navegador (`localStorage`), que permanecem ao recarregar a página e sem internet
- Funciona offline depois da primeira visita
- Instalável na tela inicial (botão "Instalar app" em navegadores compatíveis)
- Layout responsivo, pensado primeiro para celular, com tema claro e escuro conforme a preferência do sistema

## O que faz dele uma PWA

| Peça | Arquivo | Função |
|---|---|---|
| Manifest | `manifest.json` | Nome, ícones, cores e modo de exibição para a instalação |
| Service worker | `service-worker.js` | Guarda os arquivos do app em cache e os entrega mesmo sem rede (estratégia cache primeiro) |
| Persistência | `script.js` | Lê e grava os lançamentos no `localStorage` |
| Instalação | `script.js` | Trata o evento `beforeinstallprompt` e mostra o botão "Instalar app" |

## Tecnologias

- HTML5 semântico
- CSS3 (Grid, Flexbox, variáveis CSS, media queries, `prefers-color-scheme`)
- JavaScript (ES6+), sem bibliotecas
- Web App Manifest, Service Worker e Cache API
- `localStorage`

## Estrutura do projeto

```
controle-financeiro/
├── index.html
├── style.css
├── script.js
├── manifest.json
├── service-worker.js
└── icons/
    ├── icon-192.png
    └── icon-512.png
```

## Como executar localmente

O service worker só funciona em `localhost` ou em `https`. Abrir o `index.html` com duplo clique (`file://`) mostra o app, mas não registra o service worker.

```bash
git clone https://github.com/lucassloliveira/controle-financeiro.git
cd controle-financeiro
```

Depois, sirva a pasta por um servidor local. Duas opções:

- No VS Code, com a extensão **Live Server**: clique com o botão direito no `index.html` e escolha **Open with Live Server**.
- Com Python instalado: `python -m http.server 5500` e acesse `http://localhost:5500`.

## Como instalar

- **Chrome ou Edge (computador e Android):** use o botão "Instalar app" no cabeçalho ou o ícone de instalação na barra de endereço.
- **Safari (iPhone):** toque em compartilhar e escolha **Adicionar à Tela de Início**.

## Decisões técnicas

- **Valores em centavos.** Os valores são guardados como números inteiros (R$ 159,90 vira `15990`) para evitar erros de arredondamento do ponto flutuante. A conversão para o formato de moeda acontece só na exibição.
- **Datas como texto `AAAA-MM-DD`.** O filtro por mês compara o início do texto da data, sem usar `Date` para interpretar datas, o que evita problemas de fuso horário.
- **Renderização com `textContent`.** O conteúdo digitado pelo usuário é inserido como texto, nunca como HTML.
- **Delegação de eventos.** Um único ouvinte de clique na lista trata todos os botões de remover.
- **Cache versionado.** O nome do cache (`CACHE_NOME`, em `service-worker.js`) leva um número de versão. Ao alterar `index.html`, `style.css` ou `script.js`, é preciso subir a versão para que os usuários recebam os arquivos novos. Na ativação, os caches antigos são apagados.

## Limitações conhecidas

- Os dados ficam apenas no navegador do aparelho: não há sincronização entre dispositivos, e limpar os dados do navegador apaga os lançamentos.
- Ainda não é possível editar um lançamento, só adicionar e remover.
- O botão "Instalar app" depende do evento `beforeinstallprompt`, disponível em navegadores baseados em Chromium. Nos demais, o app continua funcionando normalmente, sem o botão.

## Próximos passos

Funcionalidades planejadas, ainda não implementadas:

- Gráficos mensais (receitas e despesas, despesas por categoria)
- Metas financeiras com acompanhamento de progresso
- Cartões, com limite, fatura e vencimento
- Edição de lançamentos

## Autor

Lucas · [GitHub](https://github.com/lucassloliveira)
