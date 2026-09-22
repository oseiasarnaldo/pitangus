# Antes de subir

Tudo que depende de uma decisão sua, num lugar só. Nenhum item exige mexer no
CSS, e todos quebram a página se ficarem pra depois.

O erro clássico não é errar essas trocas. É subir sem lembrar que elas existem,
e descobrir com a campanha rodando e o dinheiro saindo.

---

## Obrigatório

### 1 · O link de checkout

Enquanto ele for um marcador vazio, o botão não vende. Deve existir **um ponto
único** no JavaScript onde essa URL vive:

```js
const CHECKOUT = '#';   // trocar pela URL real
```

Trocar ali atualiza todos os botões da página de uma vez. Se você precisa
procurar a URL em vários lugares do HTML, o problema não é a troca, é a
arquitetura: um deles vai ficar pra trás.

Enquanto for `#`, o comportamento esperado é rolar até a oferta, nunca travar.

### 2 · O domínio

Aparece em **três lugares** no `<head>`, e os três precisam apontar pro endereço
final:

- a **canônica**, que diz ao Google qual é o endereço oficial
- o **`og:url`**, que é pra onde o link compartilhado leva
- o **`og:image`**, a imagem do preview

O `og:image` **precisa ser URL absoluta**, com `https://` e domínio. WhatsApp e
Facebook não resolvem caminho relativo, e o preview volta como um retângulo
cinza. Numa página que circula por WhatsApp, isso derruba o clique antes do
primeiro scroll.

### 3 · A indexação

Enquanto a página é rascunho, ela fica bloqueada pra busca. No dia do
lançamento, esse bloqueio sai.

**Ele costuma estar em dois lugares**: a meta tag no HTML e um cabeçalho na
configuração do servidor (`../assets/vercel.json`, `.htaccess`). Tirar só um deixa a
página invisível pro Google sem explicação aparente. É o erro mais comum do dia
do lançamento.

### 4 · O pixel e o rastreamento

Entram antes do fechamento do `<head>`, mas com uma regra de carregamento: **as
tags não podem competir com o carregamento da página**. A tag que mede a
conversão é frequentemente a que atrapalha a conversão.

Carregue-as na primeira interação, ou alguns segundos depois do carregamento
completo. O detalhe de quanto isso rende está em `auditoria-publicacao.md`.

Conferir no navegador que o evento dispara, não só que o código está no arquivo.

---

## O que não sobe

Nem tudo que está na pasta do projeto tem função no ar. Fora:

- material bruto e original de imagem e vídeo (o que sobe é o derivado comprimido)
- fotos de referência
- ferramentas de geração e de build
- capturas de auditoria
- documentação e anotação
- o arquivo-fonte, quando existe uma versão minificada ao lado

A pergunta que resolve qualquer dúvida: **o navegador de quem visita pede esse
arquivo?** Se não, ele não sobe. Cada arquivo a mais é peso e superfície
exposta.

---

## O que já deve estar resolvido

Esta é a fronteira com a skill anterior. Se algum destes itens ainda está
aberto, volte pra `acabamento-visual` antes de publicar, porque acelerar uma
página que reprova em contraste é otimizar o lugar errado:

| Item | Estado esperado |
|---|---|
| Contraste AA | zero reprovações, medido |
| Overflow horizontal | zero em todas as larguras testadas |
| Alvo de toque | nenhum abaixo de 44px em dispositivo de toque |
| Medida de linha | nenhum parágrafo largo demais pra ler |
| Console | sem erro, sem recurso faltando |
| Movimento reduzido | respeitado nas animações |
| Contagem regressiva | data e fuso conferidos |
| Card social | gerado, no tamanho certo |

---

## Uma decisão que vale registrar

Sempre que a página se afastar do óbvio (não ter menu, esconder o retrato no
celular, usar uma dobra a menos), **escreva o porquê junto do projeto**. Daqui a
três meses, você ou outra pessoa vai olhar e achar que foi esquecimento, e vai
"consertar" o que era escolha.

---

## Checklist

- [ ] Link de checkout real, num ponto único, testado com clique
- [ ] Domínio final na canônica, no `og:url` e no `og:image`
- [ ] `og:image` como URL absoluta, preview testado no WhatsApp
- [ ] Bloqueio de indexação removido nos **dois** lugares, no dia certo
- [ ] Pixel disparando, conferido no navegador
- [ ] Pastas de bruto, ferramenta e QA fora do envio
- [ ] Checklist de `../../acabamento-visual/references/auditoria-visual.md` fechado antes de subir

---

## O pacote de SEO, mesmo em página de tráfego pago

Cinco coisas, todas baratas, todas esquecidas:

1. `robots` em `index, follow, max-image-preview:large` no dia do lançamento
   (no HTML **e** no `.htaccess`, os dois lugares).
2. JSON-LD com `Product` (nome, preço, moeda, garantia como
   `hasMerchantReturnPolicy`) e `FAQPage` gerada a partir das perguntas da
   própria FAQ, extraídas do HTML pra não divergir.
3. `twitter:title`, `twitter:description`, `twitter:image`, e `og:site_name`
   com o nome do produto, não o da agência.
4. `robots.txt` e `sitemap.xml` na raiz do host, com o endereço final.
5. Um `h1` só, nenhuma imagem sem `alt`: conferir por `grep`, não por olho.
