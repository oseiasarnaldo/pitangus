# Hero com o expert: enquadramento, palco e mascote

Vale para qualquer página de vendas em que a pessoa que ensina é parte da
oferta: curso, mentoria, consultoria, infoproduto com rosto. Tudo aqui saiu de
uma página que foi refeita três vezes até o hero funcionar.

---

## 1. Regra: hero sem o expert é hero de ferramenta

Uma das versões abria com uma demonstração (uma mini página se montando
sozinha) e sem foto. Ficou bonita e errada: parecia um SaaS, não uma pessoa
ensinando. Voltou atrás no mesmo dia.

> **Se o expert é parte da oferta, a foto dele entra no primeiro frame. Sempre.
> Em qualquer largura de tela.**

A demonstração não sai: ela passa a ser **apresentada** por ele. A leitura muda
de "uma ferramenta monta a página" para "é ele mostrando como se faz".

---

## 2. Enquadramento no desktop: foto na frente, palco atrás do ombro

Composição que funcionou (1440 px):

```
┌─────────────────────────────┬──────────────────────────────┐
│ kicker                      │        ╭─ janela ─╮   ┌────┐ │
│ H1 (4 linhas)               │        │ mini     │   │foto│ │
│ sub                         │        │ página   │   │    │ │
│ [CTA único]                 │        ╰──────────╯   └────┘ │
└─────────────────────────────┴──────────────────────────────┘
        .9fr                              1.1fr
```

- `.hero-palco { position: relative }` é o container das duas camadas.
- **Foto em primeiro plano**: `width: 54%; margin-left: auto; z-index: 2;
  pointer-events: none`. Recorte com alfa (mesmo arquivo da raiz, sem gerar nada
  novo, com pelo menos 2x a largura exibida), máscara vertical desvanecendo a
  base (`#000 58%, transparent 93%`) e
  `drop-shadow(-18px 24px 40px rgba(8,10,14,.6))` puxada para o lado da janela,
  que é onde a sombra faz a foto "sentar" na cena.
- **Janela atrás do ombro**: `position: absolute; left: 0; top: 9%; width: 68%;
  z-index: 1`, com `perspective(1400px) rotateY(7deg) rotateX(2deg)` e
  `transform-origin: right center`. A inclinação leve diz "tela de estúdio";
  mais que 8° vira maquete.
- **Mais de uma pessoa no palco:** a máscara de base sai de cada foto e vai
  num wrapper que envolve o grupo, 30% mais largo que o palco (`left: -15%;
  right: -15%`). Máscara por pessoa deixa um corpo transparecer no outro
  (fantasma), e wrapper do tamanho do palco corta o braço de quem sai pela
  lateral.
- Mantenha a foto no mesmo eixo (lado) das versões anteriores da página. Mudar
  a posição do expert entre versões confunde quem já viu a anterior.

### Armadilhas encontradas

| Sintoma | Causa | Correção |
|---|---|---|
| Legenda embaixo da janela ficou torta | ela estava dentro do elemento com `rotateY` | transformar só a janela (`.demo-janela`), nunca o container |
| Botão da legenda sumiu atrás da foto | foto com `z-index` maior e largura de 54% | legenda em coluna (`flex-direction: column`), alinhada à esquerda, sob a janela |
| Selo decorativo no canto direito da janela | escondido atrás da cabeça | o canto livre é o **superior esquerdo**; o direito pertence à foto |
| Barra do navegador cobria o topo da mini página na fase final | barra desce por cima | `padding-top` maior na mini página quando a barra entra, com transição |

---

## 3. Enquadramento no mobile: o rosto entra no primeiro frame

A tentação é esconder a foto abaixo de 980 px, com o argumento de que seis
linhas de headline mais CTA não cabem junto de um retrato. A regra do expert
vence:

- Abaixo de 980 px a foto **volta**, com a mesma composição do desktop em escala
  menor: `width: 64%; max-width: 300px; margin-left: auto`, janela absoluta em
  `left: 0; top: 12%; width: 66%`.
- Ordem no mobile: kicker, H1, sub, **um** CTA, e logo abaixo a foto. Como o rosto
  fica no topo do recorte, ele aparece na primeira tela (390×844) mesmo com a base
  da foto passando para a segunda.
- O que precisa sair para caber: o segundo botão e qualquer rail lateral de
  navegação. Um CTA só. A dobra seguinte apresenta o método.
- Até 480 px o CTA vira largura total.

Medida de referência em 390 px: topo da foto em ~443 px, CTA terminando em
~427 px. Rosto visível sem rolar.

---

## 4. Copy do hero acompanha o formato do produto

Quando o formato do produto muda (de evento ao vivo para gravado, por
exemplo), o hero inteiro muda junto: sub, CTA, kicker. E cuidado com a promessa
técnica falsa: se a animação leva doze segundos, o kicker não pode dizer "se
monta em seis". Não prometa tempo que a demonstração ao lado não cumpre.

Dentro da mini página demonstrativa, **nenhum texto legível** além do domínio
na barra (`seusite.com.br`). Headline, sub e botão viram barras. Texto dentro
de uma miniatura compete com o H1 real ao lado.

---

## 5. Mascote no ombro: sprite em pixel, sombra e parallax casado

Um mascote em pixel art (grade 17×10, pixel de 8 px) vira um sprite de 5
quadros gerado por script a partir da grade original: parado, piscando (olho de
1 px), agachado (corpo 7 linhas, perna 1), esticado no ar (corpo 9 linhas,
braços para cima), aterrissando. Folha 680×96, pés sempre no chão.

```css
.clawd-poleiro { position: absolute; left: 62.5%; top: 22%; width: 136px; height: 96px;
  transform-origin: 50% 100%; scale: .42; translate: var(--px, 0px) var(--py, 0px); }
.clawd-ombro   { background: url(sprite) 0 0 / 680px 96px; image-rendering: pixelated;
  animation: quadros 3.2s steps(1, end) infinite, pulo 3.2s infinite; }
.clawd-sombra  { radial-gradient elíptica; animation: sombra 3.2s infinite; } /* encolhe e clareia no ar */
```

Três lições:

1. **O ombro certo é o de fora.** No ombro do lado da janela o mascote brigava
   com a interface; no ombro externo ele tem fundo limpo.
2. **A sombra vende o pulo.** Sem a elipse encolhendo enquanto ele sobe, o
   sprite parece deslizar. Achatar na agachada, encolher a 55% no ápice, voltar
   na aterrissagem, tudo no mesmo ciclo de 3,2 s.
3. **Tudo que está sobre a foto recebe o mesmo parallax da foto.** O script
   escrevia `--px/--py` só na `<img>`; o mascote ficava parado enquanto a foto
   andava e "descolava" do ombro. Correção: `MutationObserver` no `style` da
   imagem copiando as duas variáveis para o poleiro. Regra geral: qualquer
   elemento apoiado num objeto com parallax herda o deslocamento dele.

Posicionamento com `scale` e `transform-origin: 50% 100%`: o ponto fixo é o pé,
então `top` é calculado a partir de onde os pés devem tocar, não de onde a
cabeça fica.

---

## 6. Acabamento a mais não salva dobra que não convence

Uma das versões recebeu o acabamento inteiro de uma referência admirada:
cápsula de vidro, grão, plates de vídeo, cartões com borda de luz e tilt,
moldura octogonal, onda em canvas, carimbo de preço. Ficou visivelmente mais
rica, e mesmo assim a versão anterior foi a escolhida, com a frase "acho que
está faltando algo".

A lição, que custa caro pra aprender: **quando a sensação é "falta algo", o
problema costuma ser de estrutura ou de prova, não de efeito.** Guarde os
efeitos num arquivo à parte, como catálogo, e aplique um de cada vez, com
motivo escrito.

---

## Checklist do hero com expert

- [ ] Foto do expert no primeiro frame em 390, 768 e 1440
- [ ] Foto no mesmo eixo (lado) da versão anterior da página
- [ ] Demonstração ou arte **atrás** da foto, nunca disputando o rosto
- [ ] Nada decorativo no canto onde fica a cabeça
- [ ] Um CTA só no mobile; segundo botão e rails saem
- [ ] Texto legível dentro de miniaturas: só o domínio
- [ ] Kicker sem promessa que a animação não cumpre
- [ ] Elementos apoiados na foto herdam o parallax dela
- [ ] Mascote ou selo animado com sombra própria e `prefers-reduced-motion` respeitado
