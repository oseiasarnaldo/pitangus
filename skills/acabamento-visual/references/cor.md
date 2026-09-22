# Cor

## A proporção 90/10

**Noventa por cento neutro. Dez por cento cor.**

É a regra que mais segura o resultado. O neutro faz o trabalho pesado (fundo,
superfície, texto), e a cor de marca aparece só onde precisa de atenção.

Quando uma página parece "carnaval", quase sempre é porque a cor de marca virou
preenchimento de área grande em vez de acento.

## O acento é luz, não tinta

Esta é a diferença mais difícil de perceber e a mais fácil de aplicar.

| Amador | Profissional |
|---|---|
| bloco inteiro pintado na cor de marca | rim light na borda de um objeto |
| ícone chapado no magenta | brilho radial atrás do ícone |
| card com fundo colorido | card neutro com um traço de 3px colorido |
| seção inteira com gradiente | gradiente só na linha divisória de 1px |

A cor entra como **luz sobre o neutro**, não como camada de tinta por cima dele.

## Escala de superfície, não "claro e escuro"

Um erro comum é ter só duas superfícies: fundo e card. Um sistema decente tem
três a quatro degraus no neutro:

```css
--ink-900: #14181E;   /* o mais escuro. Base para mix-blend-mode: screen */
--ink-800: #1E232B;   /* fundo padrão da maioria das dobras */
--ink-700: #272D36;   /* card e superfície elevada sobre o fundo */
--ink-600: #3A414D;   /* borda e divisor */
--surface: #FFFFFF;   /* a dobra de quebra */
--surface-2: #F5F6F8; /* variação clara */
```

Sem esses degraus, você acaba usando `rgba(255,255,255,.05)` espalhado, e a
página perde hierarquia.

**Regra prática:** se você precisa de um tom que não existe na escala, ou o
sistema está incompleto, ou a decisão está errada.

## Texto: quatro níveis, não dois

```css
--on-dark:        #FFFFFF;              /* título e texto forte */
--on-dark-muted:  rgba(255,255,255,.74);/* corpo */
--on-dark-faint:  rgba(255,255,255,.60);/* legenda e rótulo */
--on-light:       #272D36;              /* título sobre branco */
--on-light-muted: #5B6270;              /* corpo sobre branco */
```

> **Cuidado com o "faint".** Branco a 42% fica bonito e **reprova em AA**
> (3,7:1). Sessenta por cento sobe para 5,4:1 e continua discreto. Meça sempre.

## O erro que até quem escreveu esta regra comete

A versão luminosa da cor de marca (aquela que existe para **brilhar** sobre fundo
escuro) é tentadora como cor de rótulo. E reprova.

```css
/* rótulo de 13px, peso 700, sobre um card de vidro */
color: var(--marca-b-hi);   /* 3,6:1  →  REPROVA (mínimo 4,5) */
```

A correção não é escurecer a cor. É **devolver ela ao papel de luz**:

```html
<!-- o texto fica branco, a cor vira um marcador ao lado -->
<h3 style="color:#fff; display:flex; gap:.5rem; align-items:center">
  <span style="width:7px;height:7px;border-radius:999px;background:var(--grad-marca)"></span>
  Rótulo
</h3>
```

Mesma informação, mesma presença de marca, e passa em AA. Esta correção nasceu de
rodar o auditor na página de exemplo **desta própria skill**, que estava errada.

## Gradiente: o teste que quase todo mundo pula

Um gradiente pode reprovar em contraste sem ninguém notar, porque a cor muda ao
longo do elemento. **Teste as duas pontas.**

Um caso medido: um gradiente de laranja para magenta com texto branco em cima.
Na ponta magenta o contraste deu 4,58:1 e passou. Na ponta laranja deu
**3,37:1 e reprovou**. Metade do botão estava ilegível pelo critério AA, e
ninguém tinha percebido.

**Solução:** manter o gradiente de marca para tudo que **não** tem texto por cima
(traços, ícones, marcadores, bordas), e criar uma variante um passo mais fechada
só para superfície com texto:

```css
--grad-marca: linear-gradient(45deg, var(--marca-a), var(--marca-b));       /* sem texto em cima */
--grad-btn:   linear-gradient(45deg, var(--marca-a-dk), var(--marca-b-dk)); /* com texto em cima */
```

Fechando as duas pontas o suficiente, aquele mesmo par subiu para 4,70:1 e
5,53:1, com a leitura de cor praticamente igual. Quanto fechar é medição, não
palpite: a conta muda com cada par de cores.

## Gradiente no texto, com rede de segurança

```css
.grad {
  color: var(--magenta);              /* fallback sólido, declarado ANTES */
  background-image: var(--grad-marca);
  -webkit-background-clip: text;
  background-clip: text;
}
@supports (-webkit-background-clip: text) {
  .grad { color: transparent; }        /* só então vira transparente */
}
```

Sem o `@supports`, um navegador que não suporta `background-clip` mostra texto
transparente, ou seja, **texto invisível**.

Use só em título de dobra-manifesto, uma vez por página. Nunca em corpo.

## Cores que denunciam template

- **Roxo para azul.** O gradiente padrão de todo starter kit desde 2018.
- **Azul #007BFF.** O primário do Bootstrap.
- **Verde-menta com roxo.** Combinação de dashboard genérico.
- **Seis cores "semânticas"** (sucesso, erro, aviso, info, primário, secundário)
  quando a interface tem três estados.

Se um estado precisa de cor semântica, ela entra como **exceção nomeada**, nunca
promovida a cor de marca.

---

## Checklist

- [ ] Duas cores de marca, no máximo
- [ ] Proporção 90/10 entre neutro e cor
- [ ] Três a quatro degraus na escala de superfície
- [ ] Quatro níveis de cor de texto
- [ ] O acento aparece como luz, não como área pintada
- [ ] Gradiente com texto por cima testado nas **duas** pontas
- [ ] Gradiente em texto com fallback sólido antes do `@supports`
- [ ] Nenhum valor de cor literal fora do `:root`


---

## Hierarquia de botões: o que brilha é o que compra

Sete botões iguais é o mesmo que nenhum. Separe em dois níveis:

| Botão | Papel | Tratamento |
|---|---|---|
| os que **compram** (torre, fechamento, barra fixa do celular) | levar pro checkout | gradiente da marca + halo permanente + um brilho que varre o botão a cada 7 s (`::after` inclinado, `translateX` de -40% a 460%, 18% do ciclo) + sobe 2 px no hover |
| os que **rolam** até a oferta (hero, comparativo, garantia) | mover a pessoa | mesmo gradiente, **sem halo em repouso**, halo discreto só no hover |

O olho aprende em uma tela: o que brilha é o que compra.

**Verde no botão de compra: não.** O "botão verde converte mais" é lenda de
outro contexto. Converte o botão ser a coisa mais visível da dobra. Verde nessa
página já tem dono, o WhatsApp; se o botão de compra também for verde, "compre"
e "fale comigo" viram a mesma coisa pro olho, e a pessoa clica no mais barato.

O que não entra em botão nenhum: pulsar, piscar, tremer, seta animada. Avisa
"estão tentando me empurrar" e derruba a confiança que a garantia construiu.

## A exceção semântica às duas cores

Verde e vermelho **como significado**, não como marca:

- check verde (`#2FD27A`) e X magenta numa tabela comparativa, com a coluna
  vencedora mais escura que a tabela (quase preta, `#0E1116`), não rosada;
- verde do WhatsApp no botão de conversa;
- "aprovado" e "travado" num painel de status.

São cores de leitura universal, e brigar com elas custa clareza. Fora desses
três casos, vale a regra: duas cores de marca, e só.
