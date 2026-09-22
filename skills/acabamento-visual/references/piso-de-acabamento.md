# O piso de acabamento

A skill descreve dezenas de técnicas, e é possível ler tudo e entregar uma
página **chapada**: imagem colada em fundo liso, sem entrada, sem máscara, sem
luz. Acontece porque catálogo não obriga nada.

Este arquivo é a obrigação. **Nenhuma página é entregue abaixo deste piso.**

---

## Por que isto existe

Duas páginas medidas lado a lado, a mesma pessoa, o mesmo método:

| Técnica | LP de referência | Página chapada |
|---|---|---|
| `radial-gradient` (luz e profundidade) | 29 | 3 |
| `data-reveal` (entrada no scroll) | 21 | **0** |
| `mask-image` (imagem que dissolve no fundo) | 9 | **0** |
| `filter: blur` (névoa, halo) | 7 | **0** |
| `@keyframes` | 5 | 1 |
| `backdrop-filter` (vidro) | 5 | 1 |

A segunda tinha 17 imagens. Não faltou imagem, **faltou tratamento**. É a
diferença entre página cara e álbum de fotos com legenda.

---

## Os sete itens do piso

### 1 · A dobra de abertura tem quatro camadas nomeadas

Não é fundo com imagem, é uma pilha, cada uma com z-index e trabalho próprio:

```css
/* z-0 · a textura. Escurecida e dessaturada, porque ela é chão, não assunto.
   A máscara apaga o canto onde a headline mora: textura viva atrás de texto
   é o jeito mais rápido de deixar um hero ilegível. */
.hero-textura { position: absolute; inset: 0; z-index: 0; overflow: hidden; }
.hero-textura img, .hero-textura video {
  mask-image: radial-gradient(78% 76% at 42% 44%, #000 0%, transparent 82%);
}

/* z-0 · a grade e o scrim, no mesmo plano da textura */
.hero-grade::after {
  background:
    radial-gradient(120% 100% at 50% 50%, transparent 34%, rgba(26,31,38,.72) 88%),
    linear-gradient(180deg, rgba(26,31,38,.55) 0%, transparent 22%, transparent 72%, var(--ink-900) 100%);
}

/* z-1 · a luz de marca. TRÊS radiais, não uma, em posições diferentes */
.hero-luz {
  position: absolute; inset: 0; pointer-events: none; z-index: 1;
  background:
    radial-gradient(72% 58% at 76% 20%, rgba(235,96,31,.20), transparent 62%),
    radial-gradient(62% 52% at 10% 88%, rgba(230,19,84,.17), transparent 60%),
    radial-gradient(46% 44% at 68% 62%, rgba(230,19,84,.10), transparent 70%);
}

/* z-2 · o grão, por cima de tudo, entre 5 e 8% */
.hero::after {
  content: ""; position: absolute; inset: 0; pointer-events: none; z-index: 2; opacity: .075;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* z-3 · o conteúdo */
.hero .container { position: relative; z-index: 3; }
```

**Três radiais e não uma.** Uma só lê como degradê de banco de imagem. Três, em
posições e opacidades diferentes (.20, .17, .10), leem como luz de estúdio.

### 1b · Continuidade: o tratamento chega na última dobra

**O defeito mais comum não é ausência, é desistência.** O acabamento inteiro
aparece no topo e vai sumindo conforme a página desce: as duas primeiras dobras
têm textura, luz e entrada, e da metade pra baixo sobra texto sobre fundo liso,
parado.

Acontece porque a atenção acaba antes da página, e porque **contagem não vê
distribuição**: uma página com 37 revelações pode ter as 37 no hero.

> **O piso é por dobra, não por página.** Toda dobra precisa de matéria, de
> luz e de entrada, ou de um motivo escrito pra não ter.

Três regras que resolvem na prática:

1. **Percorra as dobras de baixo pra cima na hora de auditar.** É lá que o
   tratamento morre, e é lá que ninguém olha.
2. **O rodapé conta como dobra.** Ele é o último frame de quem leu tudo, e é
   onde a página quase sempre entrega fundo chapado sem nada.
3. **Olhe a densidade, não só a presença.** Uma página medida de verdade tinha
   entrada em todas as dobras e mesmo assim parecia morrer no fim, porque a
   contagem por dobra era `5, 8, 8, 8, 2, 3, 4`: o terço final tinha menos da
   metade do resto. Presente não é o bastante, tem que ser **parelho**.

#### Movimento ambiente também é contínuo

Duas coisas diferentes se confundem aqui, e a segunda é a que quase sempre
falta:

| Tipo | O que é | Onde costuma estar |
|---|---|---|
| **Entrada** | o bloco aparece quando entra na tela | espalhada, se você lembrou |
| **Vida** | movimento que continua acontecendo: fumaça derivando, parallax, brilho lento num selo, marquee, hover que responde | **só no topo** |

Uma página com fumaça de 46 segundos no hero e nada acontecendo dali pra baixo
lê como se tivesse acabado a bateria no meio. Não precisa de outra animação
grande: **hover nos cards, um selo que gira devagar, um marcador que pulsa
discreto** já mantêm a página viva.

Regra: se a dobra de abertura tem vida, **pelo menos mais duas dobras precisam
ter**, e uma delas na metade de baixo.

O medidor no fim deste arquivo mostra dobra a dobra, justamente pra isso. Uma
linha `sem nada` na tabela é defeito, não sobra.

### 2 · Entrada no scroll em todo bloco de conteúdo

Um `IntersectionObserver` só pra página inteira, com o índice vindo da posição
entre os irmãos marcados:

```css
@media (prefers-reduced-motion: no-preference) {
  .js [data-reveal] {
    opacity: 0; transform: translateY(28px);
    transition: transform var(--dur-enter) var(--ease-out-expo),
                opacity calc(var(--dur-enter) * .9) ease;
    transition-delay: calc(var(--reveal-i, 0) * 110ms);
  }
  .js [data-reveal].visivel { opacity: 1; transform: none; }
}
```

Números que vieram de tentativa e erro, não de gosto:

- **`translateY(28px)`.** Menos que isso não se percebe, mais parece salto.
- **`--dur-enter: .8s`** com `cubic-bezier(.22, 1, .36, 1)`. Dispara rápido,
  freia longo.
- **`110ms` de cascata, não 70ms.** Com 70ms, num grupo de quatro, o último
  elemento terminava antes do primeiro sair do lugar: a cascata acontecia
  dentro do mesmo piscar de olho e lia como um bloco só aparecendo.
- **`threshold: .15`, `rootMargin: '0px 0px -8% 0px'`.** Revela quando o bloco
  entrou de verdade, não quando encostou a borda.
- **`.js` na frente da regra**, e a classe posta pelo próprio script. Se o
  JavaScript falhar, nada fica invisível pra sempre.

**Onde marcar:** cada card de um grid (pro escalonamento existir), o bloco
inteiro de tabela e FAQ (não cada linha, senão a cascata vira espera), e nada
no que já tem animação própria.

### 3 · Toda imagem que encosta no fundo tem máscara

Imagem com borda reta colada no fundo é a assinatura de página montada em
builder:

```css
.figura img {
  mask-image: linear-gradient(180deg, transparent 0%, #000 16%, #000 82%, transparent 100%);
}
```

Com máscara a imagem some e o fundo aparece por baixo, **qualquer que ele
seja**. Terminar num gradiente de cor fixa quase nunca fecha, porque o card
costuma ter uma camada semitransparente por cima.

### 4 · Grão na página, e textura de matéria nas dobras

Duas coisas diferentes, e as duas faltam quando a página parece plástico.

**O grão** é global: um `feTurbulence` inline, entre 2 e 8%, sem arquivo
externo. Se dá pra ver que existe, está forte demais.

**A textura de matéria** é por dobra, e é o que dá corpo: madeira, papel,
concreto, tecido, metal escovado. Ela entra como camada de fundo, escurecida,
dessaturada e **mascarada onde o texto mora**. É o item mais barato do piso
inteiro, porque uma textura de acervo resolve, e é o que mais muda a sensação
de "isso foi feito por alguém".

> **Fundo liso é o que sobra quando ninguém decidiu nada.** Se a dobra está
> sem textura, foi omissão, não escolha.

#### A série de matérias, uma por projeto

Não é uma textura, é um **conjunto**, gerado ou escolhido de uma vez, com o
mesmo DNA. Num boteco saíram seis: tampo de madeira, reboco descascado, azulejo,
papel kraft, fumaça de cozinha e condensação de copo gelado. Somadas, 348 KB em
WebP.

Registre no `PROJETO.md`, junto do mapa de imagem, **qual matéria vai em qual
dobra**. É o que impede a página de virar colcha de retalhos, e é o que faz a
próxima sessão continuar no mesmo mundo:

```markdown
## Mapa de matéria
| Dobra | Matéria | Arquivo |
|---|---|---|
| 1 hero | madeira de tampo | assets/img/mat/madeira.webp |
| 2 cardápio | azulejo | assets/img/mat/azulejo.webp |
| 4 a casa | reboco descascado | assets/img/mat/reboco.webp |
```

A matéria vem do mundo do negócio, não de um catálogo genérico. Boteco tem
azulejo e madeira; escola tem papel, giz e caderno; escritório tem concreto e
vidro. **Se a matéria serviria pra qualquer negócio, ela não é da marca.**

#### Cor de marca sobre textura pede um passo mais fechado

Descoberta de um projeto real, e ela não é óbvia: o vermelho puro da marca
funcionava no botão e **sufocava** como fundo de dobra com textura por baixo. A
saída foi separar os dois usos:

| Onde | Que versão | Por quê |
|---|---|---|
| Botão, chip, marcador | a cor cheia da marca | ali ela precisa gritar |
| Fundo de dobra com textura | um passo mais fechada | é o que deixa o texto e o acento respirarem por cima da matéria |

Textura embaixo de cor chapada rouba contraste sem avisar: o olho lê a soma das
duas, não cada uma. Se a dobra colorida com textura parece "abafada", quase
sempre é isso.

#### Continuidade: o erro que estraga textura boa

Textura certa aplicada errado fica **pior** que fundo liso, porque a emenda
denuncia. Três jeitos de quebrar, e os três acontecem:

| Sintoma | Causa | Correção |
|---|---|---|
| Retângulo de textura com fundo liso em volta | aplicada num container ou card, não na dobra | a camada é `position: absolute; inset: 0` **na section**, com o conteúdo em `z-index` acima |
| Grade regular de emendas | `repeat` com imagem que não é seamless | ou arruma o ladrilho, ou troca pra `cover` com máscara |
| Borda reta onde a textura acaba | `no-repeat` com `background-size` menor que a dobra | `cover`, e **máscara nas bordas** pra ela morrer no fundo |

```css
/* a textura é camada da DOBRA, e cobre ela inteira */
.section { position: relative; isolation: isolate; }
.section .textura {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background: url("../img/azulejo.webp") center / cover;
  opacity: .5; filter: saturate(.5) brightness(.9);
  /* morre nas bordas, em vez de terminar numa linha */
  mask-image: radial-gradient(120% 100% at 50% 40%, #000 55%, transparent 92%);
}
.section > .container { position: relative; z-index: 1; }
```

**A escala tem que ser a mesma na página inteira.** Se o azulejo tem 60px numa
dobra e 90px na outra, a matéria "muda de tamanho" e o olho lê como duas
imagens diferentes coladas. Trave a `background-size` num token e use o mesmo
em todas.

**Entre duas dobras com a mesma matéria**, escolha um dos dois e assuma: ou a
textura é **contínua na página inteira** (uma camada só, no elemento que
envolve tudo), ou cada dobra tem a sua e **a virada é marcada de propósito**
com um divisor. O que não pode é a mesma textura recomeçar do zero e aparecer a
costura.

**Como conferir, e não é a olho nu:** capture a tela e faça varredura de pixel
ao longo das bordas da dobra, procurando salto de cor em linha reta. Zoom
visual com brilho normal esconde emenda fraca; a varredura não.

### 4b · Um conjunto de ícones, um peso só

Ícone não é enfeite, é rótulo, e a página inteira precisa dos mesmos. Onde eles
sempre cabem: item de oferta, selo de fechamento, marcador do comparativo,
número de autoridade.

Phosphor no peso Duotone, inlinado como SVG, segunda camada na cor de acento
entre 45 e 55%, sempre dentro de um chip. **Nunca emoji** (renderiza diferente
em cada sistema) e **nunca duas bibliotecas** na mesma tela.

→ `icones.md`

### 5 · Profundidade em duas camadas, nunca uma

```css
box-shadow: 0 1px 2px rgba(10,12,15,.12), 0 2px 8px rgba(10,12,15,.08);
```

E em fundo escuro, elevação é **luz na borda**, não sombra:
`inset 0 0 0 1px rgba(255,255,255,.07)`.

### 6 · Ritmo de dobra, não repetição

`min-height: 100svh` no desktop (`svh`, não `vh`, senão o conteúdo salta quando
a barra do celular some), desligado abaixo de 860px. E três alturas de
respiro, não uma: `3.5rem`, `5.5rem`, `7rem`.

### 7 · `prefers-reduced-motion` em tudo que se move

Não é detalhe de acessibilidade: movimento involuntário causa enjoo real. Todo
`@keyframes`, todo marquee e todo carrossel automático precisa da saída.

---

## A medição

Rode isto no console da página pronta, ou peça pro agente rodar. Ele conta o que
existe de verdade no CSS aplicado, e é o mesmo espírito do auditor de contraste:
**nada é entregue no olhômetro.**

```js
(() => {
  const css = [...document.styleSheets].flatMap(s => { try { return [...s.cssRules].map(r => r.cssText) } catch { return [] } }).join('\n');
  const html = document.documentElement.outerHTML;
  const conta = (re, fonte = css) => (fonte.match(re) || []).length;
  const r = {
    'luz radial':        conta(/radial-gradient/g),
    'entrada no scroll': conta(/data-reveal/g, html),
    'máscara':           conta(/mask-image/g),
    'desfoque':          conta(/filter:\s*blur/g),
    'keyframes':         conta(/@keyframes/g),
    'vidro':             conta(/backdrop-filter/g),
    'grão':              conta(/feTurbulence/g, html + css),
    'reduced-motion':    conta(/prefers-reduced-motion/g),
  };
  const piso = { 'luz radial': 8, 'entrada no scroll': 6, 'máscara': 2, 'desfoque': 1, 'keyframes': 2, 'vidro': 1, 'grão': 1, 'reduced-motion': 1 };
  console.table(Object.fromEntries(Object.entries(r).map(([k,v]) => [k, { tem: v, piso: piso[k], veredito: v >= piso[k] ? 'ok' : 'ABAIXO' }])));
})();
```

O piso é mínimo, não meta. A LP de referência entrega de duas a três vezes cada
número.

**E a segunda tabela é a que mais pega defeito:** a cobertura dobra a dobra.
Ela responde se cada dobra tem entrada, matéria e luz, e lista as que estão
nuas. Uma página pode passar em todos os totais e ainda ter as três últimas
dobras sem nada, que é o defeito mais comum de todos.

---

## Quando o piso não se aplica

Uma página deliberadamente seca (documento, formulário, painel interno) pode
ficar abaixo. **Escreva o motivo no `PROJETO.md`.** O que não pode é ficar
abaixo por não ter pensado nisso.

---

## Checklist

- [ ] Dobra de abertura com quatro camadas nomeadas e z-index explícito
- [ ] Três radiais de luz na abertura, em posições e opacidades diferentes
- [ ] `data-reveal` nos blocos de conteúdo, cascata de 110ms
- [ ] **Nenhuma dobra sem tratamento**, do hero ao rodapé, conferido dobra a dobra
- [ ] Densidade de entrada parelha, sem despencar no terço final
- [ ] Movimento de vida em pelo menos três dobras, uma delas na metade de baixo
- [ ] Auditoria feita de baixo pra cima, que é onde o acabamento morre
- [ ] `.js` na regra de ocultar, posta pelo próprio script
- [ ] Máscara em toda imagem que encosta no fundo
- [ ] Grão na página, entre 2 e 8%
- [ ] Textura de matéria nas dobras, mascarada onde o texto mora
- [ ] Textura cobrindo a dobra inteira, sem retângulo nem borda reta visível
- [ ] Mesma escala de textura em todas as dobras
- [ ] Emenda entre dobras texturizadas resolvida: contínua, ou virada marcada
- [ ] Um conjunto de ícones, um peso, em chip
- [ ] Sombra em duas camadas, e borda de luz no dark
- [ ] `svh` e não `vh` na altura de dobra
- [ ] `prefers-reduced-motion` em tudo que se move
- [ ] Medição rodada, e nenhum item `ABAIXO` sem motivo escrito


---

## Item 9 (set/2026): fluidez medida

O piso mede o que existe no CSS. A bateria de fluidez mede o que a pessoa
sente: a página que pula, o frame que trava, a rolagem que engasga no celular.
`scripts/audita-fluidez.js`, duas vezes (desktop, e celular com CPU 4x mais
lenta). Aprovado é CLS 0, nenhum frame acima de 100 ms, zero long task, sem
estouro. Registre os números no `PROJETO.md` como registra o contraste.
