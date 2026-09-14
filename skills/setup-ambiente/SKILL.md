---
name: setup-ambiente
description: Prepara a máquina antes do método começar. Use SEMPRE que a pessoa for rodar o P.O.D.E. pela primeira vez, quando disser que não tem nada instalado, quando algo do método não funcionar por falta de ferramenta, ou quando precisar configurar chave de API. Cobre terminal, Claude Code, MCP do Chrome DevTools, ferramentas de mídia, chaves de API (Gemini e afins) e o cofre de segredos. Aciona em "não tenho nada instalado", "por onde começo", "como configuro", "não tenho a API", "deu erro de comando não encontrado", "setup", "instalar". É a etapa 0, antes da letra P.
---

# Setup do ambiente

A etapa zero. Roda **uma vez na vida**, não uma vez por projeto.

O P.O.D.E. não é só um método pra ler: ele é um agente que executa. E agente
precisa de ferramenta, do mesmo jeito que um marceneiro precisa de bancada. Esta
skill monta a bancada.

---

## O que você está montando

Não é um curso onde você assiste e depois tenta reproduzir sozinho. É **um
método mais um agente que trabalha com você**: você decide, ele executa, e as
duas coisas acontecem na mesma tela.

Isso muda o que "estudar" significa aqui. No fim do setup, você não sabe mais
teoria: você tem uma máquina que constrói página de vendas com você.

---

## A camada 1 acontece antes da conversa

Um paradoxo que vale entender: **quem precisa instalar o terminal e o agente não
consegue pedir ajuda ao agente**, porque sem ele não há conversa.

Então a camada 1 vive fora daqui, como passo a passo escrito pra uma pessoa
ler: está em `references/primeiros-passos.md`.

As camadas 2 a 4 vivem dentro da conversa, e são chamadas quando fazem falta.

---

## Regra zero: instale por necessidade, não por lista

A tentação é instalar tudo antes de começar, e travar no primeiro erro de uma
ferramenta que você só usaria daqui a três semanas.

**O caminho certo é em camadas.** Cada camada te deixa produzir algo de verdade,
e você só passa pra próxima quando esbarrar no limite dela.

| Camada | O que instala | O que você já consegue fazer |
|---|---|---|
| **1 · Essencial** | terminal e Claude Code | página inteira, do zero ao HTML pronto |
| **2 · Verificação** | Chrome Canary com MCP | o agente vê e mede a página, em vez de escrever no escuro |
| **3 · Mídia** | ffmpeg, webp, chave de API | imagem e vídeo próprios, sem banco de imagem |
| **4 · Publicação** | acesso da hospedagem | a página sai do computador e vai pro ar |

Quem parar na camada 1 ainda faz página boa. As outras três ampliam, não
substituem.

→ `references/ferramentas.md`, e `references/windows.md` se a máquina for
Windows: o método roda igual lá, o que muda é o nome de alguns comandos

---

## As chaves e os acessos

Três regras que valem pra qualquer credencial, e que evitam o erro mais caro de
iniciante:

**1 · Chave nunca fica no projeto.** Nem no HTML, nem no código, nem num arquivo
solto na pasta. Ela mora num cofre fora da árvore do projeto, com permissão
fechada, e o projeto lê de lá.

**2 · Chave que vazou está vazada pra sempre.** Se ela entrou num repositório,
apagar o arquivo não resolve: o histórico guarda. O caminho é revogar a chave e
gerar outra.

**3 · Nem toda credencial tem a mesma vida.** A chave da API de imagem é sua e
serve pra todo projeto. O acesso do servidor é **daquele cliente**, e muda a
cada um. Por isso o cofre tem duas gavetas: uma pro que é seu, outra com um
arquivo por projeto.

→ `references/apis.md`

---

## O caminho, em ordem

1. **Terminal.** É onde o agente trabalha. Se você nunca usou, é mais parecido
   com conversar do que com programar.
2. **Claude Code.** O agente em si.
3. **A pasta do projeto.** Uma pasta por página, e o agente trabalha dentro dela.
4. **Chrome Canary com MCP.** Aqui o agente ganha olhos: ele abre a página,
   mede contraste, testa no celular e roda auditoria sozinho. O Canary convive
   com o seu Chrome e tem ícone amarelo, então a janela de trabalho nunca se
   confunde com a pessoal.
5. **Mídia e API**, quando você chegar na letra D e quiser arte própria.
6. **Acesso da hospedagem**, quando chegar na letra E.

Cada passo tem um teste de "funcionou?" em `references/ferramentas.md`. Não
avance sem o teste passar: erro de setup acumulado vira erro misterioso três
etapas depois.

---

## Quando o setup termina

Você está pronto pra começar o método quando conseguir, na sua máquina:

- [ ] Abrir o terminal e rodar o Claude Code dentro de uma pasta
- [ ] Pedir uma página simples e ver o arquivo aparecer
- [ ] Abrir essa página no navegador
- [ ] *(camada 2)* Pedir pro agente medir alguma coisa na página e receber número
- [ ] *(camada 3)* Gerar uma imagem, se for usar arte própria
- [ ] *(camada 4)* Saber onde ficam os dados de acesso da sua hospedagem

Os três primeiros bastam pra começar. O resto pode esperar o momento em que
fizer falta.

---

## O que essa skill NÃO faz

- **Não ensina a usar o método.** Isso começa em `projetar`.
- **Não substitui a documentação de cada ferramenta.** Ela dá o caminho testado,
  e quando a ferramenta muda, a documentação oficial vence.
- **Não é obrigatória inteira.** Ver a tabela de camadas.

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

## Checklist

- [ ] Terminal aberto e funcionando
- [ ] Claude Code instalado e rodando numa pasta de projeto
- [ ] Uma página de teste criada e aberta no navegador
- [ ] Chrome Canary com MCP conectado, se for usar verificação automática
- [ ] Chave de API na gaveta comum, acesso de servidor na gaveta do projeto
- [ ] Nenhuma credencial dentro da pasta que vai ser publicada
- [ ] Testado cada passo antes de avançar pro próximo
- [ ] Pronto pra ir pra `projetar`
