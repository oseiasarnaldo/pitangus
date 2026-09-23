# Pessoas na página: recorte, composição e os três defeitos que o cliente vê

Quando o expert é parte da oferta, a foto dele é a peça mais olhada da página.
E é a que mais denuncia trabalho feito às pressas, porque o olho humano lê
rosto e corpo antes de qualquer outra coisa. Três defeitos aparecem sempre, e
o cliente vê os três antes de nós:

| Defeito | O que a pessoa vê | Causa quase sempre |
|---|---|---|
| **Corte** | braço, mão ou ombro terminando reto, "amputado" | a foto de origem já vinha cortada, ou uma caixa com `overflow` ou `mask` cortou quem saiu pela lateral |
| **Fantasma** | um corpo transparente, com o fundo ou outra pessoa aparecendo através dele | máscara de fade aplicada em cada pessoa, em vez do grupo |
| **Borrão** | rosto mole, sem nitidez, principalmente em tela retina | foto pequena (500px) ampliada pra caber |

Esses três se evitam antes do HTML. Consertar depois custa uma rodada inteira
de geração e o constrangimento de o cliente ter apontado.

---

## 1 · Antes de usar: abra a foto e responda quatro perguntas

1. **Tem coisa gravada na imagem?** Foto tirada de site costuma vir com balão,
   moldura, nome, faixa colorida. Na página original o HTML cobria; na sua, o
   resto aparece.
2. **Qual a largura?** Precisa ter **2x a largura em que vai aparecer**. Um
   expert exibido a 400px pede arquivo de 800px. Site de cliente costuma ter
   500px.
3. **Algum membro encosta na borda da imagem?** Braço, mão, cotovelo ou
   ombro tocando a borda lateral ou de cima quer dizer que ele foi cortado na
   foto. Não tem como "descortar" com CSS.
4. **O rosto está livre?** Nada na frente: nem mão de outra pessoa, nem
   elemento gráfico.

Se qualquer resposta for ruim, a foto passa pela reconstrução (seção 2) antes
de entrar na página.

## 2 · Reconstrução: a mesma pessoa, maior e inteira

Quando a foto é pequena, tem gráfico gravado ou vem com membro cortado, **não
amplie e não remende**. Mande a foto pro gerador de imagem (Gemini, com a
imagem como entrada) e peça a mesma pessoa de novo:

```
Recreate this exact photo as a high-resolution, tack-sharp studio portrait.
Keep the man EXACTLY identical: same face, same facial features, same
expression, same hair and beard, same glasses, same pose, same t-shirt with
the same logo in the same color and position. Do not beautify, do not change
identity or age.
ZOOM OUT like a wider lens: from the top of the head to mid-thigh, with at
least 15 percent empty margin on left, right and top, so NOTHING touches the
edges. Both arms fully visible and complete, hands included.
Remove every graphic element (speech bubble, frame, text, colored shapes).
Plain flat solid light gray background (#BDBDBD), even soft light. 3:4.
```

Com `imageConfig: { aspectRatio: "3:4", imageSize: "2K" }`.

Quatro regras que vieram de erro real:

- **Se ainda encostar na borda, mande a SAÍDA de volta** com o mesmo pedido.
  Na primeira rodada o gerador costuma respeitar o enquadramento de origem;
  na segunda ele abre.
- **Peça o membro cortado pelo nome.** "O outro braço, que está cortado na
  borda, reconstruído inteiro, com a mão" funciona. "Corpo inteiro" não.
- **Fundo cinza liso, não branco nem verde.** Cinza médio recorta melhor em
  camiseta preta e em cabelo.
- **Confira a identidade a olho, sempre**, lado a lado com a foto original.
  Rosto que mudou é pior que foto borrada. Se mudou, gere de novo, e se
  mudar duas vezes, use a original e mude o enquadramento da página.

## 3 · Recorte

- Recorte com `rembg`, modelo `isnet-general-use`.
- **Confira o recorte sobre magenta**, não sobre o fundo da página. Furo,
  borda cinza e camiseta semitransparente só aparecem em cor que não existe
  na foto.
- **Corte o arquivo no contorno da pessoa** (bounding box do alfa) e exporte
  em WebP na largura de uso vezes 2.
- Rode `scripts/confere-recorte.py` no recorte **antes de cortar no contorno**:
  ele diz se algum membro encosta na borda lateral ou de cima (o recorte
  herdou um corte) e quanto do corpo está semitransparente (fantasma de
  origem).

## 4 · Composição: as regras da página

### Nunca fade por pessoa

A base da pessoa dissolve no fundo, e isso é certo. O erro é fazer com
`mask-image` **em cada foto**:

```css
/* ERRADO: cada pessoa some sozinha, e quem está atrás aparece através de
   quem está na frente. Vira fantasma. */
.pessoa { mask-image: linear-gradient(180deg, #000 70%, transparent 100%); }
```

A máscara vai **num wrapper que envolve o grupo** (hero com várias pessoas)
ou **no container** (card com uma pessoa sobre arte):

```css
.palco-grupo { position: absolute; top: 0; bottom: 0; left: -15%; right: -15%;
  mask-image: linear-gradient(180deg, #000 68%, transparent 98%); }
.card-foto { overflow: hidden; mask-image: linear-gradient(180deg, #000 74%, transparent 100%); }
```

No card vale o mesmo: se a arte de fundo (neon, textura) está atrás da
pessoa e a pessoa tem fade próprio, a arte atravessa o corpo.

### A caixa que mascara é maior que as pessoas

`mask-image` e `overflow: hidden` cortam na **caixa do elemento**. Se o
wrapper tem o tamanho do palco e uma pessoa sai pela lateral, ela perde o
braço. Por isso o wrapper do grupo é **30% mais largo** que o palco
(`left: -15%; right: -15%`), e as posições de cada pessoa passam a ser em %
do wrapper.

### Sobreposição: pouca, e sempre opaca

- Pessoas podem se sobrepor nos ombros, **nunca no rosto nem na mão que faz
  o gesto** (o dedo apontando, a mão no queixo).
- Quem está na frente é o principal, maior e com `z-index` maior.
- Camiseta preta sobre fundo escuro some: dê **borda de luz** com
  `filter: drop-shadow(0 0 1px <acento a 35%>)` e uma sombra que faça sentar.

### Nada na frente do rosto

Selo, chip, balão e botão **nunca** passam por cima de rosto, em nenhuma
largura. O caso real: um chip "Questão 98" que no desktop ficava ao lado do
ombro, no celular cobriu os olhos do expert. Conserto: no celular, o chip
some ou desce pra altura do peito.

### No celular, o rosto entra na primeira tela

Ver `hero-expert.md`. Com várias pessoas, o palco encolhe (de 250px a 300px de
altura) e vai **acima** do título, com os rostos inteiros visíveis.

## 5 · Conferência na tela

O print reduzido esconde os três defeitos. Confira assim:

1. **Print da dobra em 2x** (`deviceScaleFactor: 2`), recortado só na área
   das pessoas, e olhe ampliado: borda de braço, dedo, contorno do cabelo.
2. **Rode `scripts/audita-pessoas.js`** na página montada: ele acusa imagem
   com máscara própria sobreposta a outra imagem (fantasma) e imagem cortada
   pela caixa de um ancestral com `mask` ou `overflow` (corte).
3. **Rode `scripts/audita-resolucao.js`**: o expert precisa sair sem aviso.
4. Repita em 390px no celular.

## Checklist

- [ ] Foto de origem aberta e as quatro perguntas respondidas
- [ ] Foto pequena, com gráfico gravado ou membro cortado passou pela reconstrução
- [ ] Identidade conferida a olho contra a original
- [ ] Recorte conferido sobre magenta, e `confere-recorte.py` sem membro na borda
- [ ] Arquivo com 2x a largura de uso
- [ ] Fade de base no grupo ou no container, nunca em cada pessoa
- [ ] Wrapper de máscara mais largo que as pessoas que saem pela lateral
- [ ] Nenhum elemento sobre rosto ou sobre a mão do gesto, em 390, 768 e 1440
- [ ] `audita-pessoas.js` e `audita-resolucao.js` sem reprovação
