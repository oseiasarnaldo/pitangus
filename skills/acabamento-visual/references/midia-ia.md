# Imagem e vídeo gerados por IA

## O segredo: um DNA fixo em todos os prompts

Doze imagens geradas com doze prompts independentes ficam bonitas e desconexas.
A coerência vem de **um parágrafo de direção que entra em todo prompt**, sem
exceção.

Escreva o seu uma vez e reutilize:

```
BRAND LOOK, siga estritamente: ambiente [SEU NEUTRO] profundo, base
dessaturada e fria, e exatamente um acento: gradiente de 45 graus de
[COR A] para [COR B]. O acento é sempre LUZ, nunca preenchimento chapado:
rim light, brilho, realce de borda ou rastro luminoso. Cerca de 90 por
cento neutro e 10 por cento acento, nunca mais. Sem [COR PROIBIDA]. Contenção editorial premium, nada berrante.
```

A linha de proibição de cor é o que impede o gerador de puxar pro azul ou pro
roxo de banco de imagem. Liste ali as famílias de cor que não são da sua marca.

Troque o que está entre colchetes. Esse parágrafo é o que faz peças criadas em
momentos diferentes parecerem do mesmo ensaio fotográfico.

## Estrutura de um prompt de imagem

```
[tipo de peça]
+ SUBJECT: [o assunto, em uma frase]
+ [o DNA da marca]
+ [direção de câmera e luz]
+ [proibição de texto]
```

**Sempre proíba texto explicitamente.** Modelos de imagem erram tipografia, e
um texto torto destrói a peça inteira:

```
ABSOLUTAMENTE NENHUM TEXTO: sem letras, palavras, rótulos, números,
interface legível, legendas, marca d'água ou logotipo.
```

## O que funciona em card de serviço

**Um objeto por card**, escuro, sobre superfície neutra, com o acento entrando
como rim light. Nada de cena cheia.

Exemplos que funcionam:

- uma antena parabólica fosca, anéis de sinal se expandindo
- painéis de vidro flutuando, bordas acesas no acento
- um funil escuro com esferas caindo, uma delas iluminada
- uma peça de xadrez isolada, com sombra longa
- uma treliça neural translúcida, alguns nós pulsando

O padrão: **objeto único, matéria fosca, fundo vazio, uma fonte de luz colorida.**

## O que NÃO funciona

- pessoas sorrindo apontando para telas
- colagem de ícones flutuando
- "equipe diversa em reunião"
- qualquer coisa com texto ou interface legível
- cena com mais de dois elementos disputando atenção
- **cor pedida como preenchimento.** "Um feixe laranja atravessando a cena"
  devolve uma faixa chapada que briga com a marca. Peça a cor como emissão:
  *"the light is BORN at the edges of the object itself"*. A diferença entre
  as duas frases é a diferença entre parecer da marca e parecer genérico.

## A arte tem que caber na dobra, não a dobra na arte

Gerar é a parte fácil. Três erros aparecem só depois que a imagem entra na
página:

**A emenda denuncia.** Terminar um gradiente escuro numa cor fixa para
"fundir" a imagem com o card quase nunca fecha, porque o card costuma ter uma
camada semitransparente por cima do fundo da seção e a conta não bate. Um fio
de tom diferente sobra, e é exatamente o que faz uma página parecer montada em
builder. Use `mask-image: linear-gradient(180deg, #000 50%, transparent 100%)`
na imagem: ela desaparece e o fundo do card aparece por baixo, qualquer que
ele seja.

**A proporção rouba a dobra.** 3:2 num card estreito vira uma imagem mais alta
que o texto que ela ilustra. Arte de ambiente pede 16:9 ou mais achatado.

**O escurecimento mata o motivo.** É tentador baixar o brilho até a imagem
"não atrapalhar". Passou do ponto, sobra um retângulo cinza que só adiciona
peso. Se a máscara já resolve a emenda, a imagem não precisa perder exposição:
deixe o motivo visível o bastante para pagar o próprio download.

**Sempre declare `width` e `height` no `<img>`** mesmo com `aspect-ratio` no
CSS, e `loading="lazy"` em tudo que não está na primeira dobra. Sem as
dimensões, o layout pula quando o arquivo chega.

## Arte do cliente: olhe antes de usar

Arte de hero e card de site montado em builder costuma vir com **texto
queimado na imagem** (headline, logo, rótulo do card). Na página original não
se nota porque o HTML cobre o texto na mesma posição. Na recriação, o texto
fantasma aparece atrás do seu. Dois casos que aparecem sempre:

- Hero: headline e logo queimados na metade esquerda de um JPG de 1920px.
  Solução: recortar a metade direita (PIL) e usar só o motivo.
- Cards "para quem é": foto + moldura preta em degraus + texto, tudo num
  WebP. Solução: recortar a faixa da foto, cobrir com `object-fit: cover` +
  `scale(1.08)` e esconder o canto com o `clip-path` do próprio card.

Regra: **abra a imagem antes de colocar na página.** Ler a imagem custa menos
que descobrir a sobra de texto fantasma no screenshot.

## Peso: o bruto não vai pro ar

Um modelo de imagem devolve JPEG de 500 a 700 KB. Isso é material de trabalho,
não arquivo de produção. Converta para WebP na largura em que a imagem é de
fato exibida (o dobro do CSS, para retina) e não além.

Arte escura e abstrata comprime de um jeito que surpreende: seis peças de
~600 KB viraram 44 KB somadas, sem banding visível, em qualidade 72. Foto de
pessoa não se comporta assim. Guarde os originais fora da pasta que sobe.

## Vídeo de fundo

### Direção de câmera

Fundo de página não é filme. O clipe precisa ser:

```
Filmado como plate de fundo para site: UM único plano contínuo, sem cortes,
movimento de câmera muito lento e estável, nada de ação rápida, nada
cruzando o quadro de um jeito que puxe o olho. Mantenha o TERÇO ESQUERDO
calmo, escuro e limpo para o texto do título sentar por cima.
Sem texto, sem logotipo, sem gráficos na tela. Sem fala.
```

> **Cuidado:** essa diretriz de "terço esquerdo calmo" **empurra o motivo para a
> direita**. Ótimo para hero, péssimo para um elemento que precisa ficar
> centralizado. Para esses, escreva um prompt sem ela.

### Peso

Vídeo é enfeite caro. Regras:

1. **Reencode sempre.** Um gerador entrega 1080p com bitrate alto. Como fundo,
   o clipe fica sob scrim e desfocado pela profundidade de campo, então aguenta
   compressão pesada: `ffmpeg -i entrada.mp4 -an -vf scale=1280:-2 -c:v libx264 -crf 30 -preset veryslow -movflags +faststart saida.mp4`
2. **CRF por conteúdo.** Cena real aguenta 30. Partícula sobre fundo escuro e
   brilho abstrato aguentam 34, com metade do peso.
3. **Teste VP9 antes de assumir que é melhor.** Grão de filme não comprime bem
   em VP9, e o WebM pode sair **maior** que o H.264.
4. **`-an` sempre.** Fundo de site não carrega áudio.

### Carga condicional

Nenhuma camada de vídeo deve ter `src` no HTML. Quem decide baixar é o script,
depois de checar contexto:

```js
const con = navigator.connection || {};
const leve = con.saveData === true || /^(slow-)?2g$/.test(con.effectiveType || '');
const podeVideo = !leve
  && !matchMedia('(prefers-reduced-motion: reduce)').matches
  && matchMedia('(min-width: 769px)').matches;

if (podeVideo) { video.src = video.dataset.src; video.load(); video.play(); }
```

Sempre com `poster` em WebP, que é o estado final se o vídeo não vier.

## Resolução: gere no tamanho de uso, e confira

O padrão do gerador é 1K. Isso serve pra card e ícone, e estica em qualquer
peça que ocupa a largura da tela. No Gemini, o tamanho vai no pedido:

```json
"generationConfig": { "responseModalities": ["IMAGE"],
  "imageConfig": { "aspectRatio": "16:9", "imageSize": "2K" } }
```

| Peça | Tamanho | Por quê |
|---|---|---|
| card, ícone, passo | 1K | exibida a 400px, 1K dá 2x |
| hero, mockup largo | 2K | exibida a até 1440px |
| textura de fundo | 4K, reduzida pra 2048 | vira tile exibido a 1024px, em 2x |
| pessoa recortada | 2K | recorte sobre fundo liso, com margem |

Depois de montar, **rode `scripts/audita-resolucao.js`**. O print que você lê
é reduzido e esconde o esticamento; o script não.

## Textura de fundo: grande, costurada, em 2x

Três erros juntos fizeram uma página inteira parecer "esticada além do que
dava", e o cliente viu no primeiro olhar:

1. **O DNA contaminou a textura.** O parágrafo de marca pede quadrícula e luz
   neon; aplicado ao prompt da textura, o gerador desenhou grade e borda
   acesa, e a peça não servia de superfície. **Textura não leva o DNA.** Leva
   só a matéria, "full-frame, edge to edge, uniform flat lighting, no lines".
2. **Saiu em 1K e foi esticada** com `cover` pra cobrir seções de 1440px a
   2000px de altura.
3. **A quadrícula estava no pixel**, então ampliava junto e borrava.

O conserto, que vira regra:

- gere em 4K, reduza pra 2048 (reduzir afia)
- achate a luz: subtraia um blur grande e some a média, pra não haver canto
  mais claro que se repete
- costure: misture a imagem com ela mesma deslocada meio tile, com peso zero
  na borda e um no centro, e confira numa prévia 2x2 antes de usar
- exiba com `background-size: 1024px` e `repeat`: densidade 2x, sem emenda
- **grade, pauta e quadrícula em CSS** (`linear-gradient` de 1px), nítidas em
  qualquer largura

## Pessoa recortada: fonte pequena se reconstrói

Foto de expert tirada de site costuma vir pequena (500px) e às vezes com
braço cortado pela moldura original. Ampliar não resolve. O que resolve:

1. mande a foto pro gerador pedindo **a mesma pessoa, idêntica**, em 2K,
   "zoom out, 15% de margem vazia dos lados", fundo liso cinza
2. se ainda encostar na borda, mande **a saída** de volta com o mesmo pedido.
   Na segunda rodada o enquadramento abre
3. recorte o fundo (rembg `isnet-general-use`) e **confira sobre magenta**:
   é onde furo e borda cinza aparecem
4. confira o rosto a olho contra a foto original, sempre

**Fade de base nunca por pessoa.** Máscara em cada recorte deixa o de trás
(e o neon, e a textura) aparecer pelo corpo de quem está na frente: vira
fantasma. A máscara vai no **grupo** ou no **container**, e o grupo é mais
largo que o palco, porque `mask-image` corta na caixa do elemento e quem sai
pela lateral fica sem braço.

## Quando a geração sai ruim

| Problema | Causa | Correção |
|---|---|---|
| motivo deslocado para um lado | a diretriz de composição empurrou | prompt separado, sem ela |
| cor puxando para roxo ou violeta | o modelo interpreta "magenta" livremente | proíba explicitamente: "sem roxo, sem violeta, sem lilás" |
| brilho com borda dura, cara de tinta na água | o gerador entrega bordas definidas demais | `filter: blur(14px)` no CSS transforma em luz volumétrica |
| logo com fundo branco opaco | o gerador não faz alfa | processe: branco vira transparente, marca vira sólida |
| textura com grade, borda ou luz neon | o DNA entrou no prompt da textura | textura sem DNA, só matéria e "no lines" |
| pessoa com braço cortado | enquadramento herdado da foto | peça "zoom out, 15% de margem" e reenvie a saída |

**Regra geral:** quando a geração falha, **entenda a causa antes de tentar de
novo**. Regerar sem diagnóstico é loteria cara.

---

## Checklist

- [ ] Um DNA escrito, presente em todos os prompts de peça (textura fica sem)
- [ ] Cada peça gerada no tamanho de uso: 1K card, 2K hero e pessoa, 4K textura
- [ ] `audita-resolucao.js` rodado em 1440 @2x, sem REPROVADO
- [ ] Proibição de texto em todo prompt de imagem
- [ ] Um objeto por peça, fundo vazio, acento como luz
- [ ] Vídeo reencodado, sem áudio, com `faststart`
- [ ] `poster` em toda tag de vídeo
- [ ] Vídeo não baixa em mobile, save-data ou reduced-motion
