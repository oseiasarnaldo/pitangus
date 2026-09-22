---
name: acabamento-visual
description: Aplica o acabamento que separa uma página "feita por IA" de uma que parece cara. Use SEMPRE que for criar ou melhorar qualquer interface visual, landing page, site, página de vendas, dashboard, apresentação ou componente. Cobre paleta e proporção de cor, escala tipográfica, ritmo de fundo, profundidade e sombra, textura, blend modes, movimento, e composição de imagem e vídeo gerados por IA. Aciona também em "melhora o design", "está com cara de template", "deixa mais profissional", "parece feito por IA", "revisa o visual", "por que isso parece amador". E a letra D do metodo P.O.D.E.: vem depois de ofertar-copy e entrega pra entrar-no-ar, que publica e audita.
---

# Acabamento visual

O que separa uma página que parece cara de uma que parece template não é
criatividade. É **um punhado de decisões repetidas com disciplina**, e a maioria
delas é mensurável.

Esta skill é o conjunto dessas decisões.

---

## Antes da primeira linha de HTML

**Abra o `COPY.md` e o `PROJETO.md` e responda três coisas.** Leva um segundo e
evita o retrabalho mais caro do método.

1. Qual é o `Status` no topo do `COPY.md`?
2. **Sobrou algum `[confirmar:` no texto?**
3. O `PROJETO.md` tem cor de marca, tipografia e a linha de fotos próprias?

**Leia os arquivos.** Não confie em `grep`: no Windows, sem Git Bash, o comando
não existe e a checagem falha em silêncio, que é o pior jeito de falhar. Se
quiser o atalho, ele existe nos dois mundos:

```bash
# macOS, Linux, ou Git Bash no Windows
grep -n '\[confirmar:' COPY.md
```

```powershell
# PowerShell no Windows
Select-String -Path COPY.md -Pattern '\[confirmar:'
```

Depois obedeça a tabela, **mesmo que a pessoa tenha acabado de dizer "pode
ir"**:

| O que voltou | O que você faz |
|---|---|
| Sobrou `[confirmar:` e o Status não é `liberado` | **PARE. Não escreva HTML nesta resposta.** Mostre a lista de pendências e pergunte: resolve agora, ou a página sobe com esses buracos à mostra? |
| Status não é `liberado`, mas nenhuma pendência sobrou | Siga. Escreva `Status: liberado` no arquivo e **diga que escreveu** |
| Status é `liberado` | Siga |
| O `PROJETO.md` não tem cor de marca | Você não inventa cor de marca. Veja "De onde vem o texto, e de onde vem a marca" |

**"Pode ir" autoriza o trabalho, não apaga uma pendência que a pessoa não viu.**
Mostrar a lista custa uma mensagem. Publicar uma página com
`[confirmar: data de início]` no lugar da data custa a venda, e custa a
confiança de quem confiou em você pra revisar.

O `COPY.md` existe justamente pra passar pelas mãos dela antes de virar página.
Pular esse passo esvazia a única etapa do método em que quem vende manda no
texto.

---

## As duas perguntas que abrem a letra D

**Não decida isso sozinho. Pergunte, sempre, antes de desenhar.** Elas mudam o
que é possível na página inteira, e a pessoa não sabe que estão em jogo se você
não abrir a boca.

**1 · "Posso gerar imagem por IA neste projeto?"**

Diga junto o que ela precisa pra decidir, em duas linhas:

> Dá pra gerar arte sob medida pra essa página, com a cara da sua marca, em vez
> de usar acervo. Custa por imagem gerada (centavos a alguns reais cada, não
> assinatura) e precisa de uma chave do Google configurada uma vez. Sem isso a
> página fica boa do mesmo jeito, com textura de acervo e peça desenhada. Você
> prefere qual?

Se ela disser sim e a chave não estiver configurada, **ofereça configurar na
hora**: `../setup-ambiente/references/apis.md`. Não é trabalho dela caçar isso.

Se disser não, siga sem drama e **sem voltar a insistir no meio do caminho**.

**2 · "Tem foto própria, ou dá pra tirar hoje?"**

Do lugar, de quem ensina, do material, do produto na mão. Celular resolve. Numa
escola ou num curso, isso vale mais que qualquer acervo, porque **é prova**, e
custa zero.

> **A pergunta 1 é a que mais se esquece, e é a que mais muda o resultado.**
> Ela apareceu num projeto real: a pessoa teve que pedir a geração de imagem
> porque o agente nunca ofereceu. Perguntar custa uma linha.

---

## O piso de acabamento

Esta skill descreve dezenas de técnicas, e dá pra ler tudo e entregar uma
página **chapada**: imagem colada em fundo liso, sem entrada, sem máscara, sem
luz. Catálogo não obriga nada, então existe um piso.

**Oito itens, e nenhuma página é entregue abaixo deles:**

1. Dobra de abertura com **quatro camadas nomeadas** (textura, grade e scrim,
   luz de marca, grão), cada uma com z-index próprio
2. **Três radiais** de luz na abertura, não uma. Uma só lê como degradê de
   banco de imagem
3. **Entrada no scroll** (`data-reveal`) nos blocos de conteúdo, cascata de
   110ms, **em todas as dobras e não só nas primeiras**. O defeito mais comum
   não é ausência, é desistência: o acabamento aparece no topo e some conforme
   a página desce. Audite de baixo pra cima
4. **Máscara** em toda imagem que encosta no fundo
5. **Grão** na página inteira, entre 2 e 8%, e **textura de matéria** onde a
   dobra pede corpo: madeira, papel, concreto, tecido. Fundo liso é o que
   sobra quando ninguém decidiu nada. **A textura cobre a dobra inteira**,
   como camada em `inset: 0` da própria section: textura numa caixa interna
   vira retângulo com fundo liso em volta, e fica pior que não ter
6. **Um conjunto de ícones**, um peso só, em chip: rótulo de item de oferta,
   selo de fechamento, marcador de comparativo. Nunca emoji, nunca duas
   bibliotecas
7. **Sombra em duas camadas**, e borda de luz no escuro
8. **`prefers-reduced-motion`** em tudo que se move

Tem um medidor no fim do arquivo de referência: ele conta o que existe no CSS
aplicado e diz o que está abaixo do piso. **Rode antes de entregar**, do mesmo
jeito que se roda o auditor de contraste.

Página deliberadamente seca pode ficar abaixo. O que não pode é ficar abaixo
por não ter pensado nisso.

→ `references/piso-de-acabamento.md`

---

## Regra zero: as três constantes

Trave isto antes de escrever a primeira linha. Não é preferência estética, é o
mecanismo que faz a página parecer coerente.

> **Uma família tipográfica. Duas cores de marca. Três curvas de easing.**

Toda vez que a página parece bagunçada, é porque uma dessas três foi violada.

---

## Os 12 erros que denunciam trabalho amador

Rode esta lista **antes** de entregar. Se algum item bate, corrija antes de mostrar.

| # | Erro | Correção |
|---|---|---|
| 1 | Título em CAIXA ALTA porque "fica forte" | tamanho + peso 700 + leading apertado. Caixa alta só em rótulo |
| 2 | `line-height` de 1.5 no título | display pede 1,05 a 1,15. 1.5 é para corpo |
| 3 | Mais de duas cores de marca | 90% neutro, 10% acento. O resto são tons do neutro |
| 4 | Gradiente roxo para azul | é o gradiente default de todo template desde 2018 |
| 5 | `box-shadow: 0 4px 6px rgba(0,0,0,.1)` em tudo | sombra genérica em tudo é o mesmo que sombra em nada |
| 6 | Foto de banco com gente sorrindo apontando para tela | ou imagem própria, ou objeto/textura abstrata, ou nada |
| 7 | Ícones de bibliotecas diferentes na mesma tela | um conjunto só, mesma espessura de traço |
| 8 | Easing misturado (ease-in-out num loop, linear num hover) | loop é sempre `linear`, interação é sempre out-expo ou ease |
| 9 | Texto cinza-claro sobre branco | abaixo de 4,5:1 reprova. Meça, não estime |
| 10 | Todas as dobras alternando claro e escuro | ritmo é blocos, não zebra |
| 11 | Cards de alturas diferentes na mesma linha | altura travada ou conteúdo padronizado |
| 12 | Emoji no lugar de ícone em interface séria | emoji renderiza diferente em cada sistema |

---

## O método, em ordem

### 1. Defina o sistema antes do layout

Escreva os tokens primeiro. Um bloco `:root` com cor, tipo, espaço, raio e curva.
**Nenhum valor de cor literal fora dele.** Se você escreveu um hexadecimal no
meio do CSS, o sistema já quebrou.

Base pronta em `assets/tokens.css`. Troque o `:root` e tudo muda junto.

→ Detalhes em `references/cor.md` e `references/tipografia.md`

### 2. Planeje o ritmo de fundo antes do conteúdo

Desenhe o mapa de dobras claras e escuras **antes** de escrever texto. O fundo é
sinalização de assunto, não decoração.

→ `references/ritmo.md`

### 3. Escolha o tratamento de profundidade

Sombra, blend, textura e vinheta. É a camada que mais separa profissional de
amador, e a mais ignorada.

→ `references/profundidade.md`

### 4. Faça o mapa de imagem, dobra a dobra, antes do HTML

Do mesmo jeito que o mapa de fundos vem antes do conteúdo, **o mapa de imagem
vem antes do layout**. Sem ele, o resultado é sempre o mesmo: um fundo
texturizado e mais nada, e a página fica com cara de rascunho bem diagramado.

> **Fundo texturizado não é o plano de imagem. É a camada zero dele.**

### Os três papéis, e só um deles faz entender

Antes de escolher a peça, escolha o **papel** dela. São três, e a confusão
entre eles é o que produz página cheia de imagem que não ajuda ninguém:

| Papel | O que faz | Onde vive |
|---|---|---|
| **Ambiente** | cria clima, dá profundidade, segura a atmosfera | **atrás** do texto: fundo, luz, textura, grão |
| **Elucidação** | faz a pessoa **entender** o que está sendo dito | **dentro** da dobra, ao lado ou abaixo do texto, com tamanho pra ser lida |
| **Prova** | mostra que aquilo existe e funcionou | dentro da dobra: foto real, print de tela, painel de números |

A imagem de ambiente **nunca explica nada**, porque tem texto por cima dela.
Quem explica é a de elucidação, e ela precisa de espaço próprio na grade da
dobra.

**Toda dobra que explica alguma coisa pede uma peça de elucidação.** Se o
texto diz "como funciona", "o que você recebe", "o que muda depois", "por que
é diferente", ali cabe uma peça que mostre, e não só um fundo bonito.

O que elucida, em ordem de força:

1. **O artefato real.** A tela do resultado, o material que a pessoa recebe, a
   planilha preenchida, a página publicada com o domínio na barra.
2. **Antes e depois**, lado a lado, com o mesmo enquadramento nos dois.
3. **O passo a passo em quadros**, um por etapa, com o mesmo vocabulário de
   traços.
4. **A comparação**, o jeito antigo contra o novo, no mesmo desenho.
5. **O diagrama do mecanismo**, quando o que se vende é um processo.

**O teste que decide se a peça elucida:** tape o texto da dobra. A imagem
sozinha ainda conta o que está acontecendo? Se não conta, ela é ambiente, e a
dobra continua sem explicação visual.

**O diagrama é mudo.** Nada de número, rótulo ou palavra dentro da ilustração:
forma, cor e movimento contam; o que precisa ser lido mora no texto ao lado.
Diagramas com "1, 2, 3, 4" e "headline / prova / oferta" foram rejeitados duas
vezes numa mesma sessão. E balão de conversa não vai em cima do diagrama: a
conversa é texto, mora na coluna de texto.

**Toda peça de elucidação leva legenda.** O `COPY.md` tem o rótulo
`**Legenda**` justamente pra isso: se a copy escreveu uma, ela é obrigatória.
Se não escreveu e a peça precisa, peça o texto em vez de inventar.

### Agora, dobra a dobra

Percorra as dobras do `COPY.md` e decida, uma por uma, **qual peça carrega
aquela dobra e em que papel**:

| Dobra | Papel | O que ela costuma pedir |
|---|---|---|
| **Toda dobra** | ambiente | **textura de matéria** no fundo, mascarada onde o texto mora. Fundo liso é o que sobra quando ninguém decidiu nada |
| Título e abertura | ambiente **mais** elucidação | **uma composição, não uma imagem.** Três camadas no mínimo: o motivo principal, algo atrás com profundidade, e a luz da marca. Se há expert, a foto na frente e a demonstração do resultado atrás do ombro |
| Proposta de valor | **elucidação** | é a dobra que mais precisa: um quadro por passo do método, mostrando o artefato de cada etapa. Ícone genérico por card não elucida, só rotula |
| Benefícios comparativos | **elucidação** | o jeito antigo contra o novo no mesmo desenho, ou as duas colunas com contraste visual de verdade: marcador cheio contra vazio, a coluna perdedora dessaturada |
| Prova social | **prova** | o artefato: print de conversa tratado, painel de números, foto real de quem fala |
| Torre de oferta | rótulo | um ícone por item, mesmo conjunto e mesmo peso, mais o cartão de fechamento com tratamento próprio |
| Garantia | rótulo | um selo em vetor, com o prazo em número grande |
| FAQ e fechamento | pode ser nenhum | é a dobra que mais aceita ficar sem peça. Se for, diga que foi escolha |

**A regra de suficiência:** conte as dobras que pedem apoio visual e conte as
peças do seu mapa. Se o segundo número for muito menor, o mapa não está pronto.
Uma página de sete dobras costuma pedir de **cinco a nove peças**, entre
composição, diagrama, selo, painel e conjunto de ícones.

"Nada" é resposta legítima pra uma dobra, mas precisa ser **argumentada**, não
ser o que sobrou por falta de plano.

Escreva o mapa no `PROJETO.md` antes de abrir o HTML:

```markdown
## Mapa de matéria
| Dobra | Matéria | Arquivo |
|---|---|---|
| 1 hero | madeira de tampo | assets/img/mat/madeira.webp |
| 2 cardápio | azulejo | assets/img/mat/azulejo.webp |

## Mapa de imagem
| Dobra | Papel | Peça | Origem | Estado |
|---|---|---|---|---|
| 1 hero | ambiente + elucidação | foto do expert na frente, tela do resultado atrás do ombro, luz da marca | foto do cliente + CSS | feito |
| 2 método | elucidação | 4 quadros em vetor, um por passo, mostrando o artefato de cada um | desenhado | feito |
| 3 comparativo | elucidação | o jeito antigo contra o novo, mesmo desenho, coluna perdedora dessaturada | desenhado | feito |
| 4 prova | prova | print de conversa tratado + painel de números | do cliente | pendente |
| 5 torre | rótulo | 7 ícones em chip | Phosphor | feito |
| 6 garantia | rótulo | selo vetorial com serrilha | desenhado | feito |
| 7 FAQ | nenhum | só tipografia, de propósito: a dobra é de leitura | | feito |
```

### 5. Componha a mídia com um DNA fixo

Se for gerar imagem por IA, escreva **um parágrafo de direção que entra em todos
os prompts**. É isso que faz peças criadas em momentos diferentes parecerem do
mesmo ensaio. A mesma lógica vale sem IA: um vocabulário só de traços faz
diagramas separados lerem como família.

→ `references/midia-ia.md` pro DNA de prompt, e
`references/de-onde-vem-a-imagem.md` pras quatro origens

### 6. Prefira diagrama a metáfora onde a pessoa precisa entender

Arte abstrata cria clima. Diagrama explica. Nas dobras onde a pessoa decide se
entendeu, mostre o **artefato**, não a metáfora dele: um wireframe, uma
checklist, uma barra de navegador com o domínio. E desenhe em vetor, porque
legibilidade é alinhamento exato e texto nítido.

→ `references/efeitos.md` (seção 7)

### 7. Audite antes de declarar pronto

Nunca entregue no "acho que está bom". Meça.

**Dois auditores, e os dois são obrigatórios antes de mostrar a página:**

```
scripts/audita-contraste.js    reprovação de contraste, lista vazia é aprovado
scripts/audita-acabamento.js   piso de acabamento, item a item
```

**`ABAIXO` não é entregável.** Se o medidor acusar, conserte e rode de novo. Se
a página é seca de propósito, escreva o motivo no `PROJETO.md` **antes** de
entregar, não depois que a pessoa reclamar.

O defeito que mais escapa é a **máscara**: imagem grande com borda reta colada
no fundo. O auditor lista as imagens sem máscara com nome, então não tem como
não ver.

→ `references/auditoria-visual.md` e os scripts em `scripts/`

### 7b. Uplift: o que é novo ganha arquivo próprio

Quando a página já existe e você está mudando texto, oferta ou uma dobra, **todo
CSS e JS novo vai num arquivo separado** (`v3.css`, `v3.js`), carregado por
último, com `?v=` no link. Nada de editar o `lp.css` de dois meses atrás no
meio. O ganho é duplo: dá pra desligar a rodada inteira com uma linha, e a
sessão seguinte sabe exatamente o que mudou. E a versão anterior fica
congelada em `_versoes/` antes do primeiro toque.

### 7c. A bateria de fluidez

Contraste e piso não pegam a página que "pula". `scripts/audita-fluidez.js`
rola a página inteira, para na dobra mais animada e mede deslocamento de
layout, tempo de frame, tarefas longas e estouro. Roda no desktop e no celular
com CPU 4x mais lenta. **CLS 0 e nenhum frame acima de 100 ms** é o mínimo.

### 7d. O card social

O `og:image` é a composição do hero em 1200 por 630, não uma arte nova.
→ `references/card-social.md`

### 7e. Dobra de método como linha do tempo

Quatro cards iguais não contam processo.
→ `references/linha-do-tempo.md`

### 8. Efeitos prontos, com o motivo do conserto junto

Parallax de mouse por camadas, dissolver imagem sem recorte, cartões de vidro,
fundo em quatro camadas, selo vetorial com serrilha calculada, sanfona que de
fato anima, infográfico em vetor. Cada um com a armadilha que ele esconde.

→ `references/efeitos.md`

### 9. Hero com o expert: a foto entra no primeiro frame

Se a pessoa que ensina é parte da oferta, a foto dela abre a página em qualquer
largura. Demonstração, arte ou animação ficam **atrás do ombro**, apresentadas
por ela, nunca no lugar dela. No mobile, sai o segundo botão para o rosto caber
na primeira tela. Elementos apoiados na foto (mascote, selo) herdam o parallax
dela.

→ `references/hero-expert.md`

### 10. Ícones: um conjunto, um peso, duas camadas

Phosphor Duotone inlinado como SVG, segunda camada na cor de acento a 55%,
sempre dentro de um chip. É o padrão desta skill. Lucide
serve pra interface; pra página de vendas perde a segunda camada.

→ `references/icones.md`

---

## Níveis de ferramenta

A skill funciona em três cenários. Identifique em qual você está e siga o
correspondente.

### Nível 0 · Só o Claude, sem terminal

Você não consegue rodar script nem gerar mídia. Ainda assim:

- Aplique tokens, tipografia, ritmo e profundidade. **Isto é 70% do resultado.**
- Peça ao Claude para calcular contraste manualmente (ele acerta a fórmula WCAG).
- Para mídia, use as diretrizes de `references/midia-ia.md` em qualquer gerador
  de imagem que você tenha, colando o DNA em todo prompt.
- Substitua auditoria automática pelo **checklist manual** ao fim de cada
  arquivo de referência.

### Nível 1 · Claude Code com terminal, sem extras

Some ao nível 0:

- Rode um servidor local: `python3 -m http.server 8000` (no Windows, `py -m http.server 8000`)
- Abra no navegador e **cole os scripts de `scripts/` no console** (F12). Eles
  são JavaScript puro, funcionam em qualquer navegador, sem instalar nada.
- Isso já pega contraste, alvo de toque e overflow.

### Nível 2 · Ambiente completo

Some ao nível 1:

- **MCP do Chrome DevTools**: o Claude vê e mede a página sozinho. Muda o jogo,
  porque quase todo defeito real passa em revisão de código e só aparece na tela.
- **ffmpeg + cwebp**: otimização de vídeo e imagem
- **API de geração** (Gemini, ou outra): mídia sob medida

Instalação em `references/ferramentas.md`.

> **Importante:** o nível 2 melhora a verificação, não o gosto. Uma página feita
> no nível 0 com as regras aplicadas ganha de uma página do nível 2 sem elas.

---

## O que essa skill NÃO faz

Ela cuida de **como a coisa parece**, não de:

- Estrutura de persuasão e arquitetura da oferta → `projetar`
- Texto, headline, prova e objeção → `ofertar-copy`
- Publicação, cache, performance de servidor e leitura por agente → `entrar-no-ar`

Essas são competências vizinhas. Misturar as duas na mesma decisão é o que
produz página bonita que não vende, e página que vende e parece golpe.

Esta é a letra **D** do método P.O.D.E. Ela recebe o texto de `ofertar-copy`,
já com as dobras e a hierarquia identificadas, e entrega pra `entrar-no-ar`
uma página que passou na auditoria visual.

---

## De onde vem o texto, e de onde vem a marca

Você não recebe nada pela conversa. Você **lê dois arquivos da pasta**, sempre,
antes de escrever a primeira linha de HTML:

**1 · `COPY.md`.** A página inteira em texto, uma seção por dobra, cada bloco
com um rótulo (`**H1**`, `**Lead**`, `**Corpo**`, `**Botão**`). Os rótulos são
o mapa da hierarquia: siga o que está escrito, não escolha nível de heading por
tamanho de fonte.

> **Leia o arquivo do disco, não o que você lembra da conversa.** A pessoa pode
> ter editado ontem, em outra sessão, sem você. O que está no disco vence.

> **Só comece se o `Status` do arquivo for `liberado`.** Se estiver `rascunho`
> ou `em revisão`, o texto ainda vai mudar, e desenhar agora é retrabalho.
>
> **Se a pessoa mandar seguir mesmo assim**, faça duas checagens antes:
>
> 1. **Procure `[confirmar:` no arquivo.** Se sobrou algum, **pare e mostre a
>    lista.** Cada um é um buraco que vai aparecer na página publicada, e ela
>    provavelmente não leu o arquivo se eles ainda estão lá. Pergunte se quer
>    resolver agora ou se prefere que a página suba com os buracos marcados.
> 2. **Escreva `Status: liberado` no arquivo você mesmo, e diga que escreveu.**
>    Um arquivo que diz "em revisão" enquanto a página já existe faz a próxima
>    sessão tomar a decisão errada.

**2 · A marca, que veio na letra P.** Logotipo, cores e tipografia estão na
pasta `base/` e registrados no `PROJETO.md`. **Você não escolhe cor de marca**,
você aplica a que já existe: troque o bloco MARCA de `assets/tokens.css` pelas
cores registradas e siga.

Se a tabela de material disser que não há cor definida, aí sim proponha, e diga
que foi proposta sua.

**Se a edição da pessoa quebrou alguma coisa** (a promessa ficou maior que a
entrega, o botão perdeu o valor, a prova sumiu da dobra onde a dúvida nasce),
diga qual é o risco e devolva a decisão pra ela. Não "melhore" o texto dela em
silêncio.

**3 · O plano de imagem, e ele se decide antes do layout.**

Olhe a linha `Fotos próprias` da tabela de material base e resolva **antes** de
escrever HTML, porque isso muda o desenho da dobra, não só o preenchimento dela:

| O que a tabela diz | O que você faz |
|---|---|
| Fotos próprias recebidas | use as fotos. Recorte na proporção em que aparecem, converta pra WebP, e **abra cada uma antes** pra ver se não tem texto queimado |
| Não tem fotos, mas dá pra tirar hoje | **peça a foto do celular**. Numa escola ou num curso ela vale mais que qualquer acervo, porque é prova |
| Não tem fotos, e a camada de mídia está pronta | **gere a arte**, com o DNA de marca em todo prompt |
| Não tem fotos, e a camada de mídia não está pronta | **não pare, e não empurre a conta.** Desenhar e o Pixabay resolvem a maioria dos casos: `references/de-onde-vem-a-imagem.md` |

Conferir se a camada de mídia existe leva um segundo:

```bash
# macOS, Linux, ou Git Bash
ls ~/.config/segredos/ 2>/dev/null
command -v ffmpeg cwebp
```

```powershell
# PowerShell no Windows
Get-ChildItem "$HOME\.config\segredos" -ErrorAction SilentlyContinue
Get-Command ffmpeg, cwebp -ErrorAction SilentlyContinue
```

**Se não estiver pronta, apresente as duas saídas, nessa ordem, e sem empurrar
a paga:**

1. **De graça.** Quase tudo se desenha: fundo em camadas, quadro de passo em
   vetor, cartão de vidro, mini interface, selo. E quando faltar uma textura ou
   um objeto de verdade, o **Pixabay** resolve, com chave gratuita. Tudo em
   `references/de-onde-vem-a-imagem.md`.
2. **Pagando por peça.** O **Gemini**, pra arte sob medida e coerente em série,
   feita com o DNA da marca. Custa por imagem gerada, não assinatura, e o passo
   a passo está em `../setup-ambiente/references/apis.md`.

Diga que a primeira existe **antes** de falar da segunda. Muita gente não vai
querer ligar faturamento pra fazer uma página, e não precisa: a diferença entre
página cara e página de template está nas regras desta skill, não na conta de
API.

O que **nunca** entra, em nenhum dos dois caminhos, é foto de banco de imagem
com gente sorrindo. É o item 6 dos doze erros, e trocar arte gerada por foto de
estoque de pessoa não economiza dinheiro: piora a página.

→ `references/midia-ia.md` pro DNA de prompt, `references/ferramentas.md` pra
instalação

---

## O `PROJETO.md` e o modo definido no P

**Leia o `PROJETO.md` da pasta antes de começar.** Ele tem o tipo de projeto, o
modo, e tudo que já foi decidido. Perguntar de novo o que a pessoa já respondeu
é o jeito mais rápido de perder a confiança dela.

**Atualize o `PROJETO.md`** com o que esta etapa decidir, principalmente o que
fugir do padrão. Daqui a três meses alguém vai olhar uma escolha estranha e
"consertar" o que era proposital.

Sobre o modo: em **passo a passo**, termine cada etapa com resumo, a decisão
principal, o que vem agora, e o pedido de aval. Em **automático**, execute sem
parar, e só interrompa nas paradas obrigatórias (dado de negócio que faltou e
ação irreversível).

→ `../projetar/references/conducao.md` e `../projetar/references/modos-de-operacao.md`

---

## Antes de pedir permissão pra seguir

**Mostre o que você fez, como checklist marcada.** A pessoa não tem como saber
se o trabalho aconteceu ou se você só disse que aconteceu.

```
✓ <o resultado, não a tarefa>
✓ <outro resultado>
✓ PROJETO.md atualizado
○ <o que não passou, com o motivo>
○ <o que está esperando resposta dela>
```

Quatro regras: de cinco a oito linhas; **o que não passou aparece com `○` e o
motivo**, nunca escondido; cada linha diz o resultado ("4 concorrentes
abertos"), não a tarefa ("fiz o estudo de mercado"); e nada de item de processo
tipo "li os arquivos".

Depois da checklist vêm três linhas: **a decisão** que isso trava e o porquê,
**o que vem agora**, e **posso seguir?**

---

## Checklist final

Não entregue sem passar por aqui:

- [ ] `COPY.md` lido do disco, com `Status: liberado`
- [ ] Hierarquia vinda dos rótulos do arquivo, não do tamanho de fonte
- [ ] Cor e tipografia vindas da marca registrada, não escolhidas por você
- [ ] Nenhum `[confirmar:` sobrando no `COPY.md`, ou a pessoa avisada dos que sobraram
- [ ] Mapa de imagem escrito dobra a dobra no `PROJETO.md`, antes do HTML
- [ ] Número de peças compatível com o número de dobras que pedem apoio visual
- [ ] O hero é uma composição em camadas, não uma imagem chapada
- [ ] Toda dobra que explica algo tem peça de **elucidação**, não só ambiente
- [ ] Cada peça de elucidação passa no teste de tapar o texto
- [ ] Peça de elucidação com legenda, vinda do `COPY.md`
- [ ] Toda dobra sem peça tem o motivo escrito
- [ ] Se falta a chave de API, o caminho gratuito foi oferecido **antes** do pago
- [ ] Nenhuma foto de banco de imagem
- [ ] Uma família tipográfica, no máximo quatro pesos
- [ ] Duas cores de marca, proporção 90/10 com o neutro
- [ ] Três curvas de easing, loop sempre `linear`
- [ ] Nenhum valor de cor literal fora do `:root`
- [ ] Título sem caixa alta, leading entre 1,05 e 1,15
- [ ] Escala tipográfica fluida, sem congelar entre breakpoints
- [ ] Mapa de fundos em blocos, não zebra
- [ ] Contraste medido: 4,5:1 texto normal, 3:1 texto grande
- [ ] Alvo de toque de 44px em dispositivo de toque
- [ ] Sem overflow horizontal em 360, 390, 768 e 1280
- [ ] `prefers-reduced-motion` respeitado
- [ ] Expert no primeiro frame em 390, 768 e 1440, quando ele é parte da oferta
- [ ] Os 12 erros acima, todos verificados
- [ ] Perguntado se pode gerar imagem por IA, e se tem foto própria
- [ ] Textura de matéria em toda dobra, e um conjunto de ícones só
- [ ] Máscara em toda imagem grande, conferida pelo auditor e não a olho
- [ ] Medidor do piso de acabamento rodado, sem item `ABAIXO` por esquecimento
- [ ] Bateria de fluidez rodada em desktop e celular com CPU 4x: CLS 0, sem frame acima de 100 ms
- [ ] Nenhuma palavra ou número dentro de diagrama de elucidação
- [ ] Em uplift: tudo novo em arquivo próprio de css e js, com `?v=`, e a versão anterior em `_versoes/`
- [ ] Card social capturado em 1200 x 630 a partir da composição do hero
