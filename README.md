# Pitangus

O agente do método P.O.D.E.: faz página de vendas com você, do briefing até o
endereço no ar.

Não é um curso pra assistir e reproduzir depois: você decide, ele executa, e as
duas coisas acontecem na mesma tela.

---

## Instalação

**Quem comprou** recebe um arquivo pra baixar e instalar localmente, com o
passo a passo na área de membros. O agente funciona no Claude Cowork e no
ChatGPT; o terminal é opcional.

**Pra quem desenvolve o método**, uma linha e o agente passa a existir em
qualquer pasta do seu computador:

```bash
git clone https://github.com/oseiasarnaldo/pitangus.git ~/.claude/skills/pitangus
```

Feche e abra o Claude Code (ou rode `/reload-plugins`). Pronto.

**Pra atualizar**, quando sair versão nova:

```bash
cd ~/.claude/skills/pitangus && git pull
```

**Alternativa, por marketplace:**

```
/plugin marketplace add oseiasarnaldo/pitangus
/plugin install pitangus@pitangus
```

**Conferir se instalou:** `claude plugin details pitangus` lista as cinco skills.

---

## Como usar

Abra o terminal na pasta onde você quer trabalhar e diga o que quer:

```
quero fazer a página do meu curso
```

O agente carrega sozinho. Se preferir chamar pelo nome, `/pitangus`.

Ele começa perguntando três coisas (o nome do projeto, se é página nova ou
melhoria de uma que existe, e se você quer acompanhar cada etapa ou receber
pronto), cria a pasta do projeto **ali onde você abriu o terminal**, e conduz
dali em diante. Onde os seus projetos moram é escolha sua: ele trabalha onde
você está, não numa pasta que ele inventou.

**Ao voltar depois**, é só abrir a pasta do projeto e dizer "vamos continuar".
Ele lê o `PROJETO.md`, vê onde parou e segue. Você não repete nada.

---

## O que tem dentro

| Etapa | O que resolve |
|---|---|
| `setup-ambiente` | prepara a máquina. Roda uma vez na vida |
| **P** · `projetar` | decide o que a página precisa ter e o que está sendo vendido |
| **O** · `ofertar-copy` | escreve o texto |
| **D** · `acabamento-visual` | resolve como a coisa parece |
| **E** · `entrar-no-ar` | publica e prova que está no ar |

O `SKILL.md` da raiz é a condução: ele decide em que etapa o projeto está e
chama a parte certa. As cinco skills também disparam sozinhas quando o assunto
aparece, então pedir "melhora essa headline" no meio de outra coisa funciona.

---

## Antes de entregar qualquer página

`skills/acabamento-visual/assets/tokens.css` abre com duas cores que **não são
identidade de ninguém**: existem só pra o kit funcionar na primeira execução.
Troque o bloco MARCA pelas suas duas cores. Nada mais no arquivo precisa mudar.

---

## Requisito

O agente exige conta paga ou crédito de API. Não existe caminho gratuito, e é
melhor resolver isso antes de sentar pra instalar.
