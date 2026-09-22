# Efeitos que valem guardar

Cada um destes foi construído numa página real, quebrou de um jeito específico
e só então funcionou. O que está aqui é a versão depois do conserto, com o
motivo do conserto junto. Sem o motivo, o próximo projeto repete o erro.

---

## 1. Parallax de mouse por camadas

Elementos ao redor de um retrato se deslocam conforme o cursor, cada um numa
profundidade. **É a disparidade entre as camadas que o olho lê como
profundidade, não o movimento em si.** Todas andando igual não é parallax, é
um bloco escorregando.

O que está longe anda pouco e **ao contrário** do cursor; o que está perto
anda mais e a favor.

```css
/* O parallax vive na propriedade individual `translate`, não em `transform`.
   Se os elementos já têm uma animação de flutuação em transform (têm quase
   sempre), escrever transform pelo JS mata a animação. Individuais e
   transform se compõem. */
.camada { translate: var(--px, 0px) var(--py, 0px); will-change: translate; }
```

```js
const camadas = [
  { el: fundo,   x: -14, y: -10 },   // negativo: anda contra o cursor
  { el: retrato, x:   6, y:   4 },   // quase parado
  { el: cartao1, x:  30, y:  20 },
  { el: cartao2, x:  36, y:  24 },   // o mais "à frente"
];

let alvoX = 0, alvoY = 0, atualX = 0, atualY = 0, visivel = false, rodando = false;

const quadro = () => {
  atualX += (alvoX - atualX) * 0.08;      // lerp: 8% da distância por quadro
  atualY += (alvoY - atualY) * 0.08;
  for (const c of camadas) {
    c.el.style.setProperty('--px', (atualX * c.x).toFixed(2) + 'px');
    c.el.style.setProperty('--py', (atualY * c.y).toFixed(2) + 'px');
  }
  const parado = Math.abs(alvoX - atualX) < 0.001 && Math.abs(alvoY - atualY) < 0.001;
  if (!visivel || parado) { rodando = false; return; }   // dorme
  requestAnimationFrame(quadro);
};
const acorda = () => { if (!rodando && visivel) { rodando = true; requestAnimationFrame(quadro); } };

zona.addEventListener('mousemove', (e) => {
  const r = zona.getBoundingClientRect();
  alvoX = ((e.clientX - r.left) / r.width  - 0.5) * 2;   // -1 a 1
  alvoY = ((e.clientY - r.top)  / r.height - 0.5) * 2;
  acorda();
}, { passive: true });

zona.addEventListener('mouseleave', () => { alvoX = alvoY = 0; acorda(); }, { passive: true });
new IntersectionObserver(([e]) => { visivel = e.isIntersecting; if (visivel) acorda(); }).observe(zona);
```

**As três coisas que separam efeito de travamento:**

1. O evento de mouse **só anota** a posição. Escrever estilo dentro do
   mousemove dispara layout dezenas de vezes por segundo.
2. O valor é **interpolado**. Sem lerp o elemento gruda no cursor e o
   movimento fica duro, com cara de script em vez de câmera.
3. O loop **dorme** quando a seção sai da tela e quando o alvo foi alcançado.

**Guardas obrigatórias:** `prefers-reduced-motion` e
`(hover: hover) and (pointer: fine)`. Em toque não há o que seguir.

**Armadilha:** se a camada de fundo é uma imagem que cobre a seção, ela
precisa de folga (`width: 112%; margin-left: -6%`), senão o deslocamento
revela a borda no canto oposto.

---

## 2. Dissolver imagem no fundo, sem recorte

Retrato ou arte cujo fundo já é da mesma família de cor da seção. Recortar em
silhueta deixa a franja de pixel que denuncia montagem, ainda mais em cabelo
crespo ou curto, onde o contorno não é uma linha.

```css
.figura img {
  -webkit-mask-image:
     linear-gradient(180deg, transparent 0%, #000 16%, #000 82%, transparent 100%),
     linear-gradient(90deg,  transparent 0%, #000 14%, #000 86%, transparent 100%);
          mask-image: /* idem */;
  -webkit-mask-composite: source-in;
          mask-composite: intersect;   /* as duas máscaras se cruzam */
}
```

**Por que mask e não um gradiente escuro por cima:** terminar um scrim numa
cor fixa quase nunca fecha, porque o card costuma ter uma camada
semitransparente sobre o fundo da seção e a conta não bate. Sobra um fio de
tom diferente na emenda. Com mask a imagem desaparece e o fundo aparece por
baixo, **qualquer que ele seja**.

### Névoa em CSS puro: blur no container, não mask no conteúdo

Quinta e sexta tentativa de resolver o mesmo problema (a névoa lendo como
"peça colada" mesmo depois de máscara radial correta): a causa raiz não era
a forma da máscara, era **usar uma foto**. Foto tem conteúdo (bolhas de
bokeh, um ponto mais saturado, direção de luz própria); por mais suave que a
borda fique, o miolo continua reconhecível como "um pedaço de imagem" porque
a cor ali dentro é diferente do resto do fundo, que só tem gradiente puro.

**A correção: parar de usar foto. A névoa vira gradiente radial puro**, a
mesma linguagem do resto do fundo (que também é só `radial-gradient`).
Gradiente não tem conteúdo pra reconhecer, só pode ficar mais ou menos
intenso.

Isso quase resolveu, mas sobrou uma caixa retangular ainda mais óbvia que
antes: **um gradiente CSS sempre termina exatamente na borda do elemento**
(`background` é clipado na própria caixa; `overflow: hidden` no elemento não
muda isso, porque não há conteúdo a mais pra cortar, é o próprio fundo que
já acaba ali). Empurrar os stops do gradiente pra mais cedo só move ONDE o
corte reto acontece, nunca elimina o corte. Uma elipse larga dentro de uma
caixa retangular ainda deixa os CANTOS da caixa mais distantes do centro que
as bordas médias, e é ali que a transição incompleta aparece como linha reta.

**A correção final: `filter: blur()` no CONTAINER, não no conteúdo.**
`filter` não é clipado pela própria caixa do elemento (diferente de
`background`); o blur se espalha organicamente pra fora da borda, dissolvendo
qualquer corte reto sem precisar calcular mask nenhuma.

```css
.nevoa {
  position: absolute; left: -20%; right: -20%; bottom: -10%; height: 55%;
  filter: blur(46px);        /* isto, nao mask-image, e o que apaga a caixa */
}
.nevoa::before { background: radial-gradient(...cores de marca...); }
.nevoa::after  { background: radial-gradient(...var(--fundo)...); }
```

Confirme com hit-test em vez de só olhar: capture a tela, faça varredura de
pixel nas bordas da antiga caixa, e para cada salto de cor encontrado, use
`document.elementsFromPoint(x,y)` pra confirmar que é um elemento real (texto,
cartão) e não sobra do gradiente. "Parece limpo" no zoom visual engana; a
varredura programática não.

---

### Assentar uma figura recortada: névoa na frente

Figura com alfa sobre um fundo termina num corte reto e **boia**. Escurecer a
base resolve o corte, não o boiar: o que faz alguém pertencer a uma cena é ter
coisa **na frente**, não só atrás.

A solução é uma camada da própria textura do fundo, espelhada (para não
repetir o desenho), desfocada (está mais perto da câmera) e passando por cima
da base da figura. De quebra, ela fecha a silhueta onde você quiser.

**A armadilha, e ela custa duas tentativas:** máscara linear tem eixo, e eixo
tem lados. Mascarando só na vertical, com `overflow` cortando em retângulo, as
laterais viram duas bordas retas e a névoa lê como um bloco colado. Pior ainda
é a sombra de contato: se ela for um retângulo com gradiente só vertical e
sem máscara nenhuma, desenha três bordas retas sozinha.

**Use elipse nas duas camadas.** Radial não tem lado, some por igual em todas
as direções:

```css
.nevoa img {
  transform: scaleX(-1);
  filter: brightness(.46) saturate(.66) blur(18px);
  opacity: .75;
  mask-image: radial-gradient(78% 118% at 50% 104%, #000 8%, rgba(0,0,0,.55) 46%, transparent 82%);
}
.nevoa::after {                    /* sombra de contato, também elíptica */
  background: radial-gradient(70% 106% at 50% 106%,
              var(--fundo) 6%, color-mix(in srgb, var(--ink-900) 72%, transparent) 40%, transparent 76%);
}
```

Ela deve andar **mais** que a figura no parallax: está mais perto.

E seja mais discreto do que parece necessário. Névoa que se nota deixou de
ser névoa.

**Terceira rodada, e a que resolveu de verdade:** elipse nas duas camadas
ainda não bastava se o blur ficasse baixo. Com `blur(7px)` a textura de
origem continua reconhecível: as bolhas de bokeh e os pontinhos de luz do
fundo aparecem como uma "nuvem colada", não como atmosfera. O olho não
precisa ver uma borda reta pra identificar um elemento como colado; basta
reconhecer a FORMA do que está nele.

Suba o blur bem mais que parece necessário (20 a 30px), derretendo qualquer
contorno reconhecível, e desça a opacidade (.5, não .75): névoa fraca
convence mais que névoa forte. A sombra de contato (o `::after`) carrega o
resto do trabalho de fechar a base sozinha, então ela pode ficar mais opaca
no centro sem que a dupla vire visível.

```css
filter: brightness(.38) saturate(.42) blur(28px);
opacity: .5;
```

**Quarta rodada: o corte estava na FIGURA, não só no que estava atrás dela.**
Mesmo com a névoa acima corrigida, um zoom com brilho e contraste forçados
(3x) na base ainda revelava o contorno do recorte: o rembg só apaga o fundo
original, não esmaece a própria figura, então a barriga continuava com uma
borda reta por baixo da névoa, só disfarçada, não removida. Névoa
translúcida na frente não tem opacidade suficiente pra apagar essa diferença
de tom sem ficar densa demais em cima da roupa.

A correção definitiva é desvanecer a própria imagem da figura no próprio pé,
redundante com a névoa de propósito: a névoa dá a atmosfera, a máscara na
figura garante que não sobra corte nenhum pra atmosfera precisar cobrir.

```css
.figura img {
  mask-image: linear-gradient(to bottom, #000 0%, #000 56%, transparent 92%);
}
```

Teste com brilho e contraste bem acima do normal antes de aprovar. Sob
exposição normal um corte fraco passa despercebido; ampliado e realçado,
qualquer emenda que sobrou aparece.

---

## 3. Cartões de vidro flutuantes

Elementos de UI ao redor de uma figura, contando o produto antes do primeiro
scroll.

```css
.flutuante {
  position: absolute;
  background: color-mix(in srgb, var(--ink-900) 72%, transparent);
  border: 1px solid rgba(255,255,255,.13);
  box-shadow: 0 18px 40px rgba(8,10,14,.55);
  backdrop-filter: blur(14px) saturate(1.2);
  -webkit-backdrop-filter: blur(14px) saturate(1.2);
}
@media (prefers-reduced-motion: no-preference) {
  .flutuante { animation: boia 7s ease-in-out infinite; }
  .flutuante--b { animation-duration: 8.5s; animation-delay: -2s; }
  .flutuante--c { animation-duration: 9.5s; animation-delay: -4s; }
}
@keyframes boia { 50% { transform: translateY(-9px); } }
```

**Ciclos e atrasos diferentes por cartão.** Sincronizados, quatro elementos
subindo juntos leem como a página inteira tremendo.

`backdrop-filter` de verdade importa: a diferença entre vidro e "retângulo
cinza com opacidade" aparece justamente por cima de uma foto, onde o fundo
tem informação para ser borrada.

**Sumam por etapas** conforme a tela encolhe, antes de estourar o container.

---

## 4. Fundo em quatro camadas

Nenhuma sozinha sustenta: **textura sozinha vira mancha, grade sozinha vira
papel milimetrado, luz sozinha vira degradê de banco de imagem.**

1. **Textura** (imagem gerada, escura, abstrata, ~12 KB em WebP), com máscara
   radial que a apaga onde o texto mora.
2. **Grade** em CSS, dois gradientes de 1px, também com máscara radial.
3. **Luz de marca**, radiais em cima da grade.
4. **Grão**, SVG de `feTurbulence` inline, opacidade entre 5 e 8%.

```css
.fundo::before {                       /* grade */
  background:
    linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px) 0 0 / 100% 64px,
    linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px) 0 0 / 64px 100%;
  mask-image: radial-gradient(78% 76% at 42% 44%, #000 0%, transparent 82%);
}
```

---

## 5. Selo em vetor, com serrilha calculada

Selo de garantia, badge, lacre. **Sempre vetor, nunca imagem gerada:** tem
tipografia exata dentro, e em 150 a 400px qualquer borda rasterizada denuncia
na tela retina. Crescer não custa nitidez nem um byte.

Os dentes são calculados, alternando raio externo e interno a cada meio passo:

```python
def serrilha(cx, cy, r_fora, r_dentro, n=30):
    d = []
    passo = 360 / n
    for i in range(n):
        p0 = ponto(r_fora,   i*passo)
        p1 = ponto(r_dentro, i*passo + passo/2)
        d += [f"{'M' if i==0 else 'L'}{p0[0]:.2f} {p0[1]:.2f}",
              f"L{p1[0]:.2f} {p1[1]:.2f}"]
    return "".join(d) + "Z"
```

**Dois erros que custaram tentativa:**

- **48 dentes rasos** (7px de profundidade, só contorno) leem como uma linha
  tremida, não como dentes. 30 dentes com 12px, preenchidos **por baixo** do
  contorno, é o que vira lacre. Só contorno deixa o dente sem corpo; só
  preenchimento, sem definição.
- **Texto circular** precisa de um `<path>` circular no `<defs>` e
  `startOffset="50%"` com `text-anchor="middle"` para nascer centrado no topo.
  Gire o `<text>` com `animation` e `transform-origin` no centro do viewBox.

Giro em **linear e lento** (40s+). Qualquer easing num loop infinito cria
pulso, e pulso no canto do olho compete com a leitura.

---

## 6. Sanfona que realmente anima

`<details>` não interpola altura, e trocar `content: "+"` por `"−"` também
não anima: o navegador não interpola texto.

```css
.corpo { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .3s; }
details[open] .corpo { grid-template-rows: 1fr; }
details[open].fechando .corpo { grid-template-rows: 0fr; }
.corpo > div { overflow: hidden; min-height: 0; }   /* o filho é obrigatório */

/* o sinal, desenhado com dois gradientes de fundo em vez de um caractere */
summary::after {
  background-image: linear-gradient(#5A6270,#5A6270), linear-gradient(#5A6270,#5A6270);
  background-size: 11px 2px, 2px 11px;      /* mais */
  background-position: center, center;
  background-repeat: no-repeat;
  transition: background-size .3s, transform .3s;
}
details[open] summary::after {
  background-size: 11px 2px, 2px 0;         /* a vertical encolhe: vira menos */
  transform: rotate(180deg);
}
```

O fechamento precisa de JS: intercepte o clique, adicione `.fechando` com o
`open` ainda no lugar, e só remova o `open` no `transitionend`. Ponha um
`setTimeout` de rede: se a transição não disparar (aba em segundo plano), o
painel fica preso meio aberto.

---

## 7. Infográfico em vetor no lugar de arte abstrata

Arte abstrata **cria clima**. Diagrama **explica**. Nas dobras onde a pessoa
decide se entendeu, explicar vale mais.

Sempre vetor: infográfico só funciona se for legível, e legibilidade aqui é
alinhamento exato, peso de traço constante e texto nítido. Modelo de imagem
não entrega nenhum dos três. E o SVG herda as cores da página, então trocar o
tom da marca atualiza todos os diagramas sozinho.

**Mostre o artefato, não a metáfora dele.** "Ofertar" não é uma onda de luz, é
um texto com headline, prova e oferta etiquetadas. "Entrar no ar" não é um
sinal irradiando, é uma barra de navegador com o domínio e o selo de
publicado.

**Um vocabulário só de traços** para todos os diagramas da mesma página:
linha, quadro, rótulo, pino, tique. Repetir os mesmos elementos é o que faz
desenhos separados lerem como família.

**Auditar contraste dentro de SVG exige conta à parte:** texto de SVG usa
`fill`, não `color`, e o `font-size` está em unidades do viewBox. Converta
pelo fator `larguraNaTela / viewBox.width` antes de decidir se o mínimo é 4,5
ou 3.

---

## 8. Dobra em altura de tela

```css
.section {
  min-height: 100svh;
  display: flex; flex-direction: column; justify-content: center;
}
.section > .container { width: 100%; }

@media (max-width: 860px) { .section { min-height: 0; display: block; } }
```

Três decisões dentro dessas quatro linhas:

**`min-height`, não `height`.** Dobra com muito conteúdo passa de uma tela e
precisa continuar crescendo.

**`svh`, não `vh`.** No celular a barra de endereço aparece e some, e `vh`
muda de valor junto: o conteúdo salta enquanto a pessoa rola.

**Desligado no mobile.** Dez dobras de uma tela cada viram uma rolagem sem fim
por espaço vazio, e quem chega de anúncio desiste antes da oferta. Lá o
padding generoso já dá o respiro.

O vazio vertical não é sobra: é o que separa um assunto do próximo e dá tempo
do olho trocar de contexto. Numa peça curta, ele é parte do argumento.

---

## 9. Menu em cápsula de vidro

Header que não encosta nas bordas: uma cápsula fixa, arredondada, flutuando
a 14px do topo, com vidro por trás. Lê como objeto sobre a página, não como
barra colada nela.

```css
#topo { position: fixed; top: 14px; left: 0; right: 0; z-index: 60;
  width: calc(100% - 28px); max-width: 1180px; margin: 0 auto; border-radius: 999px;
  background: color-mix(in srgb, var(--ink-900) 62%, transparent);
  backdrop-filter: blur(18px) saturate(1.3);
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 16px 44px rgba(8,10,14,.32), inset 0 1px 0 rgba(255,255,255,.08); }
#topo.compacto { background: color-mix(in srgb, var(--ink-900) 82%, transparent); top: 8px; }   /* ao rolar: mais opaco e mais colado */
```

**Três cuidados:**

- O `inset 0 1px 0` branco é a luz na borda superior. Sem ele a cápsula
  parece um retângulo cinza com opacidade, não vidro.
- O auditor de contraste acusa o texto branco do menu como reprovado (1,04:1)
  porque não compõe fundo translúcido: ele cai no `body`. Sobre o vidro
  escuro o texto passa com folga. Falso positivo, mas confira a pior dobra a
  olho.
- Hambúrguer no mobile: as três barras têm que ser `position: absolute` no
  **mesmo centro**. Com `display: block` empilhado, girar ±45° dá um ">" em
  vez de um "X". Custou uma rodada pra descobrir.

---

## 10. Revelação no scroll, um observer só pra página inteira

`movimento.md` já documenta a regra (opacity:0 só sob `.js`, só sob
`prefers-reduced-motion: no-preference`, out-expo, `transform`+`opacity`
apenas). O que falta ali é a implementação de produção: um único
`IntersectionObserver` cobrindo toda a página, não um por seção.

```css
@media (prefers-reduced-motion: no-preference) {
  .js [data-reveal] {
    opacity: 0; transform: translateY(24px);
    transition: transform var(--dur-enter) var(--ease-out-expo),
                opacity var(--dur-enter) ease;
    transition-delay: calc(var(--reveal-i, 0) * 110ms);
  }
  .js [data-reveal].visivel { opacity: 1; transform: none; }
}
```

```js
const alvos = [...document.querySelectorAll('[data-reveal]')];
if (!alvos.length || reduzido) return;

alvos.forEach(el => {
  const grupo = [...el.parentElement.children].filter(c => c.hasAttribute('data-reveal'));
  el.style.setProperty('--reveal-i', grupo.indexOf(el));
});

const io = new IntersectionObserver((entradas) => {
  entradas.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visivel');
    io.unobserve(e.target);      // revela uma vez, nunca mais observa
  });
}, { threshold: .15, rootMargin: '0px 0px -8% 0px' });

alvos.forEach(el => io.observe(el));
```

**110ms, e não 70ms.** Com 70ms, num grupo de quatro, o último elemento
terminava antes do primeiro sair do lugar: a cascata inteira acontecia dentro
do mesmo piscar de olho e lia como um bloco só aparecendo, não como sequência.

**O atraso em cascata vem da posição entre os IRMÃOS marcados, não de um
índice fixo por seção.** Um grid de 2 cards escalona em 2 passos, um de 6
escalona em 6, sem escrever regra nova pra cada tamanho de grupo.

**Onde marcar `data-reveal`, e onde não marcar:**

- Cards de um grid (os dois cards de uma dobra, os quatro passos de um
  método) → cada card, pro escalonamento funcionar.
- Tabela ou lista longa (comparativo, FAQ) → o **bloco inteiro**, não cada
  linha. Marcar cada uma das 7 linhas de uma tabela ou 9 perguntas do FAQ
  cria uma cascata de quase 1 segundo pra ler, que vira espera, não entrada.
- Duas versões responsivas do mesmo conteúdo (a tabela `.comp` no desktop, os
  `.cards` no mobile) → marque as duas independentemente. A que estiver
  `display: none` no viewport atual nunca intersecta, então nunca revela, e
  isso é o comportamento certo: ela vai revelar quando a tela virar larga o
  suficiente pra ela aparecer.
- Hero, marquee, qualquer coisa que já tem animação própria → não marcar.
  `data-reveal` é pro conteúdo que hoje só "aparece", sem entrada nenhuma.


---

## 11. Balão que se digita, sem pular o layout

O efeito: a última fala do agente entra com três pontos "pensando", depois se
digita letra a letra com cadência irregular (34 a 104 ms), uma vez só, e fica
parada. Pra parecer gente: cadência regular é assinatura de máquina.

A armadilha: o balão nasce vazio e **cresce a cada letra**, empurrando tudo que
está abaixo. Na sessão do Pitangus a tela "pulava" a cada balão.

O conserto tem duas partes, e as duas são necessárias:

1. **Fantasma.** O `.txt` vira `display: grid`; um `::before` com
   `content: attr(data-txt) "\00a0\00a0"` e `visibility: hidden` ocupa a
   célula com o texto final (mais dois espaços pro cursor não quebrar linha);
   o texto digitado entra num filho `.typed` na mesma célula, por cima.
   Altura e largura ficam reservadas desde o primeiro frame.
2. **Nenhum pseudo-elemento extra na grade.** Um `::after` no `.txt` pra
   desenhar o cursor vira um segundo item da grade e cria uma linha de 14 px
   só enquanto digita. O cursor e os pontos "pensando" ficam no `::after` do
   `.typed`, que já está dentro da célula.

Teste que prova: medir `offsetHeight` do balão em espera, pensando, digitando
e pronto. Os quatro precisam ser iguais.

A fala da pessoa não se digita e não brilha: fundo neutro, sem gradiente.
Quem brilha é o agente. E quando o balão fica sobre uma imagem (mini página,
foto), ele precisa ser opaco, senão o que está atrás vaza como marca-texto.

## 12. Diagrama vivo: entrada escalonada e loop de ida e volta

Diagrama estático em dobra de método parece rascunho. O tratamento:

- **Entrada:** cada peça do SVG (`.ig > :not(defs)`) sobe 6 px e acende,
  escalonada em 80 ms por `nth-child`, quando a dobra ganha `.visivel`.
- **Loop:** depois da entrada, um movimento lento do que a peça representa,
  em `ease-in-out` alternado (2,4 a 3,2 s): seções que respiram pro lado,
  linhas de texto que "escrevem" (`scaleX` pela esquerda), camadas que
  deslizam em cascata, um selo que pulsa. Sem pulo de layout, porque é tudo
  `transform` e `opacity` em `transform-box: fill-box`.
- **Fundo da peça:** as camadas do hero em miniatura (grade mascarada, luz
  que deriva em 14 s linear, grão a 9%).
- **Cuidado com regra genérica:** um `circle:last-of-type` pensado pro selo
  de uma peça vazou pros pontos das outras. Escopo por etapa.

Reduced motion desliga tudo e mostra o estado final.

## 13. Duas armadilhas de camada que parecem "cor errada"

**Grão sobre faixa sem fundo.** O grão por dobra (`.section::after`) aplicado a
uma faixa transparente que corre sobre a base do hero vira uma **banda cinza**
com borda dura. Faixa sem fundo próprio não recebe grão: `#faixa::after { display: none }`.

**Derrame do divisor cortado.** O divisor entre dobras tem um derrame de luz de
190 px pra baixo. Quando a dobra de cima ainda se estende alguns pixels abaixo
da linha (uma faixa com margem negativa que mede menos que a margem), o
derrame é cortado exatamente ali e vira uma faixa clara de 25 px. Ou a dobra de
baixo sobe no empilhamento (`z-index`) e cobre o resto, ou esse divisor fica
sem derrame. Diagnóstico: `elementsFromPoint` logo abaixo da linha e a leitura
dos pixels de uma captura, não o olho.
