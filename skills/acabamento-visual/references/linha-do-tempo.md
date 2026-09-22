# A dobra de método como linha do tempo

Quatro cards iguais lado a lado não contam processo: contam "quatro coisas".
Quando a dobra precisa dizer "primeiro isso, depois aquilo", o desenho certo é
uma **linha do tempo**: uma espinha vertical com os marcadores, e cada etapa
ocupando uma linha inteira, com texto de um lado e a peça de elucidação do
outro.

Aprendido na LP do Pitangus (set/2026): a grade de quatro cards foi rejeitada
duas vezes ("ainda está bem ruim"); a linha do tempo passou na primeira.

---

## O esqueleto

```html
<ol class="etapas">
  <li class="etapa" data-reveal>
    <div class="etapa-letra" aria-hidden="true"><span>P</span></div>
    <div class="etapa-txt">
      <h3><span class="etapa-l" aria-hidden="true">P</span>Projetar</h3>
      <p class="etapa-frase">Uma frase do que a etapa faz.</p>
      <div class="etapa-chat">…conversa, ver ofertar-copy/references/conversa-como-prova.md…</div>
      <p class="etapa-sai"><b>Você sai com</b>o resultado da etapa.</p>
    </div>
    <div class="etapa-arte"><span class="luz"></span><svg class="ig">…</svg></div>
  </li>
</ol>
```

## As regras de layout

| | Desktop (≥ 900px) | Celular |
|---|---|---|
| Espinha | `padding-left: 112px` na lista; um `::before` de 2px em gradiente ligando as letras | some |
| Letra | círculo de 96px, fundo `ink-900`, anel de 8px na cor da dobra, letra em gradiente de 3rem, centrada verticalmente na linha | vira marcador de 2,5rem ao lado do título |
| Linha | grid 1,05fr / 0,95fr, texto à esquerda, peça à direita, alinhamento central | coluna única: título, frase, conversa, resultado, peça |
| Respiro entre etapas | 4,5rem | 2,5rem |
| Cartão | vidro leve (branco a 6% em gradiente, borda a 10%, sombra em duas camadas) | igual |

O respiro importa mais do que parece: com 1,5rem as quatro linhas viravam um
bloco só. Com 4,5rem cada etapa é um momento.

## A peça de cada etapa

Segue `piso-de-acabamento.md` (grade mascarada, luz que deriva em loop, grão)
e a regra do **diagrama mudo**: nada de número, rótulo ou texto dentro da
ilustração. O que precisa ser lido está no texto ao lado. As peças entram
escalonadas quando a etapa aparece (80ms entre cada), e depois ganham um loop
lento de ida e volta do que representam (ver `efeitos.md`, seção 12).

## O que não fazer

- Balão de conversa **em cima** do diagrama: cobre a peça e junta dois textos
  no mesmo lugar. A conversa mora na coluna de texto.
- Três listas rotuladas por etapa ("Ele faz / Você decide / Você sai com"):
  vira doze fragmentos. Uma frase, a conversa, e um resultado.
- Animar o cartão inteiro: o movimento fica na peça, não no contêiner.
