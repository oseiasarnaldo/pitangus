# Onde a página mora: domínio próprio, subdomínio ou caminho

Essa decisão costuma levar três rodadas de conversa e sair errada. Aqui está
a tabela que fecha em uma, com a regra que decide sozinha na maioria dos casos.

---

## A regra que decide

**Olhe o que responde no domínio principal hoje.** Se for WordPress (ou
qualquer sistema que não seja arquivo estático), a página **não** vai em
caminho (`dominio.com.br/oferta/`) quando a hospedagem da LP é outra
(Vercel, outra app do Cloudways). Vai em subdomínio.

O motivo é técnico, não de gosto: pra servir um caminho de outro host você
precisa de proxy (Worker do Cloudflare, regra de origem) ou de colocar os
arquivos dentro do WordPress. O primeiro é uma peça a mais pra quebrar e mistura
cookies, cache e headers de dois sistemas no mesmo host. O segundo faz o tema,
o Elementor e os plugins injetarem CSS e script na sua página.

A exceção é quando a LP mora **no mesmo servidor** do WordPress, como pasta
física dentro do `public_html` dele: aí o caminho funciona e o WordPress nem
participa (ver `cloudways.md`). Isso vale pra "uma LP dentro do site do
cliente", não pra um produto com vida própria.

## A tabela

| Endereço | Quando | Prós | Contras |
|---|---|---|---|
| `produto.com.br` (domínio próprio) | o produto tem nome e vai crescer (docs, atualizações, versão 2) | o nome vira endereço; cabe no anúncio e no WhatsApp; não depende de mais ninguém | custa (R$ 40/ano no Registro.br), e é mais um domínio pra verificar na Meta |
| `produto.dominio.com.br` (subdomínio) | o produto é seu, o domínio principal roda WordPress | um CNAME/A e pronto; a verificação de domínio da Meta no apex cobre os subdomínios; carrega seu nome | depende do domínio principal |
| `lp.dominio.com.br/produto/` (subdomínio de LPs + caminho) | você vai ter várias LPs e quer uma app só | uma app, um SSL, um `robots.txt`; cada LP é uma pasta | a raiz do subdomínio precisa de um index (redirect pra LP principal); URL lê como campanha, não como produto |
| `dominio.com.br/produto/` (caminho no apex) | o apex é estático **ou** a LP mora no mesmo servidor como pasta | autoridade do domínio principal | com WordPress em outra hospedagem: proxy ou plugin, não faça |

## Três coisas que parecem argumento e não são

- **Autoridade de SEO no caminho.** LP de tráfego pago não precisa de índice.
  Se for indexar, um subdomínio com conteúdo próprio ranqueia bem.
- **Pixel e verificação da Meta.** A verificação é no domínio raiz e cobre os
  subdomínios. O pixel funciona igual.
- **"Fica mais bonito".** Bonito é o que a pessoa lembra. Um nome de produto
  como subdomínio ou domínio é mais lembrável do que `/pagina-de-vendas-2/`.

## O que muda na página, em qualquer escolha

Só quatro lugares: canônica, `og:url`, `og:image` (absoluto) e o `sitemap.xml`.
Trocar de endereço depois custa uma linha em cada um mais um redirect 301 no
endereço antigo. Não trave a publicação por causa disso.

## Anote no `PROJETO.md`

O endereço decidido, o motivo em uma linha, e o que foi descartado. Na
sessão seguinte alguém vai perguntar "por que não no domínio principal?", e a
resposta precisa estar escrita.
