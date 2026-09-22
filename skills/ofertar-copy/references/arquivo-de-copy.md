# O `COPY.md`: o texto vira arquivo, não conversa

A copy não é entregue na conversa. Ela vira **um arquivo único na pasta do
projeto**, que a pessoa abre no editor dela, lê com calma, muda o que quiser, e
só então libera pro desenho.

Isso não é organização, é o que muda quem manda no texto. Copy que só existe no
histórico do chat pertence ao agente. Copy num arquivo pertence a quem vende.

---

## Regra zero: um arquivo só, do título ao rodapé

Um `COPY.md`, com a página inteira dentro, na ordem em que ela aparece. Não
divida em um arquivo por dobra: a pessoa precisa **ler seguido** pra sentir se o
argumento se sustenta, e é lendo seguido que ela percebe a repetição, o pulo de
raciocínio e a dobra que não precisava existir.

Nada de HTML aqui dentro. Nem `<h1>`, nem `<div>`, nem classe. Se aparecer tag,
a pessoa para de editar com liberdade e passa a ter medo de quebrar alguma
coisa. A tradução pra HTML é trabalho da letra D.

---

## O formato

```markdown
# Copy · <nome do projeto>

Status: rascunho
Atualizado: <data>

> Edite à vontade: o que estiver aqui é o que vai pra página, palavra por
> palavra. Quando estiver do jeito que você quer, troque o Status para
> `liberado` e me chame.
> Onde estiver `[confirmar: ...]`, é dado que eu não invento e preciso de você.

---

## Dobra 1 · Título e abertura
**Função:** parar o scroll e dizer, em dois segundos, se a página é pra ela.

**H1**
Você não trava por falta de inglês. Trava por falta de prática sob pressão.

**H2**
Seis semanas, duas aulas por semana, ao vivo. Você sai apresentando o seu
próprio material.

**Botão**
Quero minha vaga

**Apoio do botão**
Turma de 6 pessoas. Começa em [confirmar: data de início].

---

## Dobra 2 · Proposta de valor
**Função:** fazer entender antes de tentar vender.

**Título da dobra**
...

**Lead**
...

**Item 1 · Título**
...

**Item 1 · Corpo**
...
```

E assim até a última dobra.

---

## Os rótulos, e por que eles importam

Cada bloco de texto entra debaixo de um rótulo em negrito. É o rótulo que diz
pra letra D **o que aquilo é**, e é isso que impede o `h4` solitário escolhido
por tamanho de fonte.

| Rótulo | O que é |
|---|---|
| `**H1**` | o título da página. Existe **uma vez** no arquivo inteiro |
| `**H2**` | o subtítulo do hero |
| `**Título da dobra**` | o título de cada dobra a partir da segunda |
| `**Lead**` | o parágrafo de abertura da dobra, maior que o corpo |
| `**Corpo**` | texto normal |
| `**Rótulo**` | a palavra em caixa alta acima do título |
| `**Item N · Título**` e `**Item N · Corpo**` | cada card, cada linha de lista, cada bônus |
| `**Botão**` | o texto do botão daquela dobra |
| `**Apoio do botão**` | a linha que tira o último medo, logo abaixo |
| `**Legenda**` | o texto embaixo de uma imagem que explica algo, e também selo e observação |
| `**Imagem**` | o que a peça visual daquela dobra precisa mostrar, em uma frase. Não é a arte, é a instrução pra quem desenha |
| `**Pergunta**` e `**Resposta**` | cada par do FAQ |

Se um texto não couber em nenhum rótulo, **provavelmente ele não deveria estar
na página.** É um bom teste.

### O rótulo `**Imagem**`, e por que ele é da copy e não do desenho

Nas dobras que **explicam** alguma coisa (como funciona, o que você recebe, o
que muda depois), escreva em uma frase o que a imagem precisa mostrar:

```markdown
**Imagem**
A tela do resultado: uma página publicada, com o domínio na barra do navegador.

**Legenda**
Foi isso que saiu na primeira tarde.
```

Isso não é desenhar. É dizer **o que precisa ser entendido ali**, que é decisão
de quem escreve o argumento. Quem desenha resolve como mostrar.

Sem essa linha, a dobra vira texto sobre um fundo bonito, e a explicação fica
só nas palavras.

---

## O `Status`, que é o portão

Três valores, e só o terceiro autoriza a letra D a começar:

| Status | O que significa |
|---|---|
| `rascunho` | você ainda está escrevendo |
| `em revisão` | está com a pessoa, esperando leitura e edição |
| `liberado` | a pessoa leu, mexeu no que quis, e autorizou virar página |

**Enquanto o Status não for `liberado`, a letra D não começa.** Desenhar em
cima de texto que ainda vai mudar é retrabalho garantido, e o pior tipo: o
layout já está pronto quando o texto encolhe pela metade.

Quem troca o Status é a pessoa, não você. Se ela disser "pode seguir" na
conversa sem ter mexido no arquivo, **antes de trocar por ela, procure
`[confirmar:` no texto**. Se sobrou algum, mostre a lista e pergunte: aqueles
buracos vão aparecer na página publicada, e a presença deles é sinal de que ela
não leu o arquivo.

Resolvido isso, escreva `Status: liberado` você mesmo e **diga que escreveu**.
Arquivo que diz "em revisão" enquanto a página já existe faz a próxima sessão
tomar a decisão errada.

---

## As duas seções do fim

**Pendências.** Toda ocorrência de `[confirmar: ...]` repetida numa lista, pra
a pessoa resolver tudo de uma vez em vez de caçar pelo arquivo.

**Versões descartadas.** As headlines e chamadas que você escreveu e não
escolheu, com uma linha dizendo por que a escolhida ganhou. Isso vale mais do
que parece: no dia em que a página não converter, é daqui que sai o teste
seguinte, sem começar do zero.

---

## Quando a pessoa edita

Ela vai editar, e é pra isso que o arquivo existe. Duas coisas ao voltar:

1. **Leia o arquivo de novo, inteiro, antes de qualquer coisa.** O que está no
   disco vence o que você lembra da conversa. Ela pode ter mexido ontem, em
   outra sessão, sem você.
2. **Procure contradição.** A edição dela em uma dobra pode desmentir outra.
   Caso real: "Roda no Claude e no ChatGPT" entrou no hero enquanto a FAQ
   inteira dizia "a ferramenta é o Claude". Trate como `[confirmar:]`: mostre
   as duas frases lado a lado e pergunte qual vale, antes de qualquer HTML.
3. **Não "melhore" em silêncio o que ela escreveu.** Se a edição dela quebrou
   alguma coisa (a promessa ficou maior do que a entrega, o botão perdeu o
   valor, a prova sumiu da dobra onde a dúvida nasce), **diga qual é o risco e
   deixe a decisão com ela**. O texto é dela.

---

## Checklist

- [ ] Um `COPY.md` só, com a página inteira na ordem
- [ ] `Status` e `Atualizado` no topo, e a instrução de edição em uma linha
- [ ] Uma seção por dobra, cada uma com a **Função** que veio de `projetar`
- [ ] Todo bloco debaixo de um rótulo em negrito
- [ ] Um único `**H1**` no arquivo inteiro
- [ ] Nenhuma tag de HTML
- [ ] Dado que falta marcado como `[confirmar: ...]`, nunca inventado
- [ ] Pendências e versões descartadas no fim
- [ ] `Status: liberado` antes de chamar `acabamento-visual`
