# Changelog

Toda mudança que chega em quem usa o Pitangus fica registrada aqui.
Formato baseado no Keep a Changelog, versionamento semântico.

**Como ler o número:** `MAIOR.MENOR.CORREÇÃO`

| Parte | Sobe quando |
|---|---|
| MAIOR | o método muda de forma, uma letra do P.O.D.E. nasce, morre ou troca de papel |
| MENOR | entra capacidade nova sem quebrar o que já existia |
| CORREÇÃO | conserto, texto mais claro, caminho de comando atualizado |

---

## [1.1.0] · 2026-09-22

O que a LP do próprio Pitangus ensinou (uplift de "curso" para "agente + curso",
publicada em lp.oseias.com.br/pitangus).

### Condução

- A abertura declara a versão do agente
- Tipo novo de projeto: **uplift de produto** (a página existe, o produto mudou)
- Versão que está no ar é congelada em `_versoes/` antes de qualquer toque
- CSS e JS editados saem com `?v=` já na letra D, não só na publicação

### Ofertar

- `references/conversa-como-prova.md`: quando o produto é um agente, a dobra
  de método vira diálogo de três falas, a última do agente se digita
- Ao reler o `COPY.md` editado pela pessoa, procurar contradição entre dobras
  e tratar como `[confirmar:]`
- `scripts/soma-torre.py` confere soma, "de" e economia da torre

### Desenhar

- Diagrama de elucidação é **mudo**: sem número, rótulo ou palavra dentro
- `references/linha-do-tempo.md`: a dobra de método como espinha com letras,
  uma linha larga por etapa, no lugar de cards iguais
- `scripts/audita-fluidez.js`: CLS, tempo de frame, tarefas longas e estouro,
  em desktop e celular com CPU 4x; entra no piso como item 9
- `references/card-social.md`: o og:image como composição do hero, 1200 x 630
- Hierarquia de botões (o que brilha é o que compra), verde só onde é
  semântica, e a exceção do comparativo (coluna vencedora escura, checks verdes)
- Efeitos 11, 12 e 13: balão que se digita sem pular o layout, diagrama vivo
  em loop de ida e volta, e duas armadilhas de camada (grão em faixa sem
  fundo, derrame do divisor cortado)
- Em uplift, tudo novo em arquivo próprio de CSS e JS

### Entrar no ar

- `references/escolha-de-endereco.md`: domínio próprio, subdomínio ou caminho,
  e a regra "apex em WordPress = subdomínio"
- `references/cloudflare.md`: DNS pela API com token de uma zona
- `references/auditoria-seguranca.md`: o que está público, listagem, headers,
  credencial no publicado
- `cloudways.md`: servidor conferido pela API, chave SSH registrada quando a
  senha está desligada, app e domínio pela API, SSL por `lets_encrypt_install`
  (o endpoint da documentação devolve 405), purge por caminho
- `htaccess-modelo.txt`: redirect https que não faz loop atrás do nginx
  (`X-Forwarded-Proto`), `Options -Indexes`, headers de segurança
- `antes-de-subir.md`: o pacote de SEO (JSON-LD de Product e FAQPage, twitter
  tags, robots e sitemap)

### Fora das skills

- `README.md`: quem comprou recebe o arquivo pra instalar localmente; `git clone`
  fica pra quem desenvolve o método

## [1.0.0] · 2026-09-12

Primeira versão fechada. O método P.O.D.E. inteiro, empacotado como agente.

### Tem

- **Condução** (`SKILL.md`): descobre sozinho em que etapa o projeto está,
  lê o `PROJETO.md` na retomada, e nunca pula letra pra frente
- **Etapa 0** · `setup-ambiente`: as quatro camadas de ferramenta, instaladas
  por necessidade e não por lista, mais o cofre de chaves de API
- **P** · `projetar`: briefing, estudo de mercado, arquitetura de oferta,
  nível de consciência e mapa de dobras
- **O** · `ofertar-copy`: a copy da página em arquivo único, liberada pela
  pessoa antes de virar HTML
- **D** · `acabamento-visual`: o acabamento que separa página cara de
  template, incluindo o plano de imagem dobra a dobra
- **E** · `entrar-no-ar`: publicação por FTP, SFTP, Cloudways, Hostinger e
  Vercel, com auditoria que prova que a versão nova está no ar
- Instalação por `git clone` ou por marketplace de plugin

### Nesta versão

- O navegador de trabalho passa a ser o **Chrome Canary**, recomendado na
  abertura da sessão: o ícone amarelo separa a janela de trabalho da pessoal,
  e ele convive com o Chrome normal em vez de substituir. Quem preferir o
  Chrome comum continua funcionando
- No Windows, o `webp` sai do `winget`, não de zip baixado na mão
