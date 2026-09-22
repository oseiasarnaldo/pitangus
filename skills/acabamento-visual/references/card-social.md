# O card social (og:image)

A imagem que aparece quando o link é colado no WhatsApp, no Instagram ou no
LinkedIn. É a primeira dobra da página pra quem ainda não clicou, e costuma
ser a última coisa feita, com pressa, ou esquecida: o preview volta cinza.

Regra: **o card é a composição do hero em 1200 por 630**, não uma arte nova.
Mesma textura, mesma luz, mesma foto, mesma headline. Quem clica e chega na
página precisa reconhecer o que viu no preview.

---

## O modelo

Um `og.html` na pasta `_qa/` do projeto (fora do envio), com o corpo travado
em `1200 x 630` e `overflow: hidden`, carregando o `tokens.css` do projeto
pelo caminho relativo. As camadas, de trás pra frente:

1. textura do hero (`fundo-hero.webp`), com opacidade e saturação reduzidas
2. grade em CSS, mascarada em radial pra não virar papel milimetrado
3. luz de marca: três radiais, uma forte fora de eixo
4. grão a 7%
5. a foto do expert à direita, com máscara na base, sem recorte duro
6. os símbolos que a página usa (no Pitangus: Claude, ChatGPT e a nuvem do Codex)
7. o texto à esquerda: selo, headline com o acento em gradiente, uma linha de
   apoio, o preço num pill do gradiente do botão, e a assinatura com o endereço

Tamanhos que funcionaram: headline 54px e leading 1,06, apoio 21px, preço 22px,
assinatura 14px em caixa alta com espaçamento 1,4px. Texto ocupa 640px de
largura; a foto ocupa o resto.

## A captura

1. Servidor local na pasta do projeto (`python3 -m http.server 8765`).
2. No Chrome pelo MCP: `emulate` com viewport `1200x630x1` (o `resize_page`
   não basta quando há emulação ativa; use `emulate`).
3. `navigate_page` no `og.html` com `?v=` novo, e `take_screenshot` em PNG
   pra um arquivo.
4. Converter pra JPEG progressivo, qualidade 84: fica entre 90 e 110 KB.
   Salvar em `assets/og.jpg`.
5. Conferir no HTML: `og:image` e `twitter:image` com URL **absoluta** do
   endereço final, `og:image:width` 1200 e `og:image:height` 630.

## Checklist

- [ ] `og.html` monta com as camadas do hero, não com fundo chapado
- [ ] Headline igual à da página, palavra por palavra
- [ ] Preço e assinatura com o endereço final
- [ ] Capturado em 1200 x 630 com `deviceScaleFactor` 1
- [ ] `assets/og.jpg` abaixo de 150 KB
- [ ] `og:image` absoluto, apontando pro endereço final, e purgado depois do envio
