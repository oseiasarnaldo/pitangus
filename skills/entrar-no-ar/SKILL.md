---
name: entrar-no-ar
description: Publica a página e prova que ela está no ar. Use SEMPRE que for subir, republicar, migrar ou diagnosticar uma página publicada. Cobre escolha de hospedagem, deploy por FTP e SFTP, Cloudways, Hostinger, Vercel, os três caches que atrapalham, checklist de pré-publicação e auditoria de publicação (carregamento, mobile e leitura por agente). Aciona em "sobe a página", "publica isso", "põe no ar", "faz o deploy", "troquei mas não atualizou", "o site tá mostrando a versão velha", "cadê o CSS novo", "melhora o Lighthouse", "llms.txt", "configura o domínio", "instala o pixel". É a letra E do método P.O.D.E. e vem depois de acabamento-visual.
---

# Entrar no ar

A página existe no seu computador. Isso não é nada. Ela precisa estar num
endereço, rápida, e com o pixel medindo, senão o trabalho das três letras
anteriores não vira matrícula.

Esta skill resolve tirar do computador e colocar no ar, **com prova**. Não
resolve o visual (`acabamento-visual`) nem o texto (`ofertar-copy`).

---

## Regra zero: publicar não é copiar arquivo, é vencer três caches

Quase todo problema de publicação é o mesmo problema com três disfarces:

| Cache | Onde vive | Sintoma |
|---|---|---|
| Navegador | máquina de quem visita | você vê o novo, o cliente vê o velho |
| CDN ou nginx | na frente do servidor | css e js velhos mesmo com o HTML novo |
| Varnish ou proxy | dentro da hospedagem | o HTML inteiro congelado por horas |

Quem entende isso resolve em minutos o que trava um dia inteiro. Quem não
entende reenvia o arquivo dez vezes achando que o upload falhou.

---

## Por que uma página estática ganha de builder

Este é o argumento do método, e ele não é opinião. Medição real de set/2026,
uma LP de curso migrada de WordPress mais Elementor pra HTML estático, **no
mesmo domínio e na mesma hora**, com cache frio:

| Medida | WordPress mais Elementor | Estática |
|---|---|---|
| LCP no celular | 1.896 ms | 1.265 ms |
| Carga completa no celular | 7.766 ms | 2.954 ms |
| HTML comprimido | 67 KB | 16 KB |
| Requisições | 116 | 60 |
| Nós no DOM | 844 | 455 |
| Nota do Lighthouse no celular | 57 | 95 |
| Nota do Lighthouse no desktop | 55 | 99 |

E o argumento que fecha, o de custo: publicar por FTP não exige comprar o
builder, não exige assinatura em dólar, e não exige programador. O que exige é
saber onde colocar o arquivo, que é o que esta skill ensina.

**O que isso significa na prática:** quem perde o clique no carregamento paga
o mesmo CPM e recebe menos lead. Página lenta é verba de mídia queimada antes
da pessoa ler a headline.

---

## Onde publicar

| Situação | Destino | Por quê |
|---|---|---|
| Testar, mostrar pro cliente, protótipo | **Vercel** | grátis, no ar em um comando, URL na hora |
| Cliente já tem servidor, ou a página precisa viver dentro de um domínio que já roda WordPress | **Cloudways** | pasta física vence o WordPress, e o pixel fica no mesmo host |
| Você está começando, ou não tem servidor de agência | **Hostinger** | barata, painel simples, FTP direto |
| Qualquer outra hospedagem com cPanel | **FTP genérico** | o princípio é o mesmo em todas |

→ `references/escolha-de-hospedagem.md`

---

## O caminho, em ordem

**0 · Onde a página mora.** Domínio próprio, subdomínio ou caminho: a tabela
que fecha a decisão em uma rodada, e a regra "apex em WordPress = subdomínio".
→ `references/escolha-de-endereco.md`

**1 · Antes de subir.** As trocas que dependem de decisão sua: link de
checkout, domínio, indexação, pixel, e o pacote de SEO (JSON-LD de produto e
FAQ, twitter tags, `robots.txt`, `sitemap.xml`). Nenhuma exige mexer no CSS, e
todas quebram a página se ficarem pra depois.
→ `references/antes-de-subir.md`

**1b · DNS.** Se o domínio está no Cloudflare, o registro é um comando com o
token da zona, sem esperar ninguém abrir painel.
→ `references/cloudflare.md`

**2 · Subir.** O envio em si, com o gotcha de cada hospedagem.
→ `references/cloudways.md`, `references/hostinger.md`, `references/vercel.md`, `references/ftp-generico.md`

**3 · Purgar.** O arquivo chegou, o servidor ainda serve o antigo. Esse passo
não é opcional em hospedagem com proxy na frente.
→ `references/cloudways.md`

**4 · Confirmar que subiu.** Antes de comemorar ou de medir:

```bash
curl -s https://seudominio.com.br/ | grep 'algo-que-so-existe-na-versao-nova'
```

**5 · Auditar.** Carregamento, mobile e leitura por agente, agora que a URL
existe de verdade.
→ `references/auditoria-publicacao.md`

**6 · Auditar segurança.** O que está público no diretório, listagem,
headers, credencial no publicado. Cinco minutos, antes do tráfego.
→ `references/auditoria-seguranca.md`

---

## O acesso da hospedagem é do projeto, não do ambiente

Credencial não mora na pasta do projeto, não mora no HTML e não entra no
histórico do Git. Mas **acesso de hospedagem também não é igual pra todo
projeto**: cada cliente tem servidor, usuário e pasta diferentes.

Por isso o cofre tem duas gavetas:

```
~/.config/segredos/               o que é seu e vale pra tudo (chave de API)
~/.config/segredos/projetos/      um arquivo por projeto (o acesso daquele servidor)
```

O arquivo do projeto leva **o mesmo nome da pasta do projeto**, e o
`PROJETO.md` aponta pra ele:

```markdown
Credenciais: ~/.config/segredos/projetos/ingles-para-ti.env
```

O que costuma morar ali: host, porta, usuário, senha e a pasta remota. Os
**nomes** das variáveis ficam documentados, os **valores** nunca.

**Por que não deixar junto do projeto, já que é dele:** porque a pasta do
projeto é publicada. Se o arquivo estiver lá e a lista de exclusão falhar, a
senha do servidor vai pra internet num endereço que qualquer um abre. O nome do
arquivo e a linha no `PROJETO.md` resolvem a associação sem correr esse risco.

No projeto, `.gitignore` com `.env` e `.env.*` antes do primeiro commit, como
rede de segurança. Uma credencial que entra no histórico continua lá depois de
você apagar o arquivo.

---

## Níveis de ferramenta

**Nível 0 · Sem terminal.** Painel da hospedagem: gerenciador de arquivos da
Hostinger ou da Cloudways, ou arrastar a pasta na Vercel. Funciona, e é assim
que a maioria começa. O custo é que cada republicação é manual e você esquece
de purgar.

**Nível 1 · Com terminal.** `vercel deploy --prod` na Vercel, ou um script de
envio por SFTP nas outras. Aqui o purge e o carimbo de versão entram no mesmo
comando, e o erro humano cai a zero.

**Nível 2 · Completo.** MCP do Chrome DevTools pra auditar sem sair da conversa,
mais `curl` pra confirmar o que está no ar. É o que transforma "acho que subiu"
em "está no ar e mede assim".

> O nível 2 melhora a verificação, não a página. Uma página bem feita publicada
> pelo painel ganha de uma página ruim publicada por pipeline.

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

## Checklist

- [ ] Checklist de `references/antes-de-subir.md` cumprido antes do primeiro envio
- [ ] Acesso da hospedagem no arquivo do projeto, em `segredos/projetos/`
- [ ] Nenhuma credencial dentro da pasta que vai ser publicada
- [ ] Arquivo no ar confirmado por `curl`, não por suposição
- [ ] Cache purgado, se a hospedagem tem proxy na frente
- [ ] css e js com carimbo de versão ou hash no nome
- [ ] Domínio, canônica e `og:image` apontando pro endereço final
- [ ] Indexação liberada no dia do lançamento, nos dois lugares (HTML e config)
- [ ] Pixel disparando, conferido no navegador e não só no código
- [ ] Assinatura de autoria aplicada, e conferida com `assets/verificar-assinatura.py`
- [ ] Nome do projeto e data de publicação anotados no `PROJETO.md` (sem eles o carimbo dos assets não se recalcula)
- [ ] `references/auditoria-publicacao.md` rodada, com as notas registradas
- [ ] Endereço decidido com `references/escolha-de-endereco.md` e o motivo no `PROJETO.md`
- [ ] `references/auditoria-seguranca.md` rodada: listagem fechada, headers, nada de credencial no publicado
- [ ] Redirect https testado atrás do proxy (um salto, sem loop)
