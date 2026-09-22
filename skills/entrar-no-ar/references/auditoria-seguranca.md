# Auditoria de segurança: o que está público?

Depois de publicar, antes de mandar tráfego. Leva cinco minutos e responde a
pergunta que o cliente vai fazer: "tem alguma coisa minha exposta aí?".

---

## 1 · O que está no servidor, arquivo a arquivo

Por SSH, liste tudo que está na pasta pública e passe pela peneira:

```bash
find . -type f | sort
find . \( -name '*.md' -o -name '*.env' -o -name '*.py' -o -name '*.json' -o -name '.git*' \
        -o -path '*_qa*' -o -path '*_versoes*' -o -path '*_bruto*' -o -path '*_ref*' \
        -o -path '*tools*' -o -path '*.vercel*' -o -name '*.map' -o -name '*.log' \)
```

O que pode estar lá: html, css, js, imagens, vídeo, fontes, `robots.txt`,
`sitemap.xml`, `.htaccess`. **Mais nada.** `PROJETO.md`, `COPY.md`, pasta
`_qa/`, `_versoes/`, `tools/`, fotos brutas e referências, `.vercel/`, `.env`
e `.git` nunca sobem: a lista de exclusão do envio existe pra isso.

Arquivo que está lá e o HTML não referencia (um css de catálogo, um js de
experimento) é peso morto e superfície de ataque. Apaga do servidor e põe na
lista de exclusão.

## 2 · Por fora, com curl

```bash
R="--resolve dominio.com.br:443:IP"
for p in assets/ assets/css/ assets/img/ _qa/ _versoes/ tools/ .vercel/project.json \
         PROJETO.md COPY.md .env .git/config .htaccess assets/arte/_bruto/; do
  printf '%-32s ' $p; curl -s -o /tmp/r -w '%{http_code}' $R https://dominio.com.br/$p
  grep -qi 'index of' /tmp/r && printf '  <-- LISTAGEM ABERTA'; echo
done
```

Esperado: pasta responde **403** (listagem fechada), arquivo que não deveria
existir responde **404**, e nenhum "Index of" em lugar nenhum.

## 3 · Headers

```bash
curl -sI https://dominio.com.br/ | grep -iE 'strict-transport|x-frame|x-content-type|referrer-policy|permissions-policy|x-powered-by'
```

O que precisa aparecer (o `htaccess-modelo.txt` já traz):

| Header | Valor | Contra o quê |
|---|---|---|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | rebaixar pra http |
| `X-Content-Type-Options` | `nosniff` | navegador "adivinhar" tipo de arquivo |
| `X-Frame-Options` | `SAMEORIGIN` | sua página embutida em iframe alheio (clickjacking do botão de compra) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | vazar a URL completa pra terceiros |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | pedido de permissão que a página não usa |

E o que **não** deve aparecer: `X-Powered-By` com versão de PHP.

Na Cloudways, esses headers entram pelo `.htaccess` e valem pro HTML (que
passa pelo Apache). Pra css e js o nginx serve direto; não é problema, os
headers que importam são os da página.

## 4 · Dentro do que foi publicado

```bash
grep -n -iE 'api[_-]?key|token|password|secret|bearer' index.html assets/js/*.js
```

Tem que voltar vazio (ou só falso positivo tipo `tokens.css`). Chave de API
de geração de imagem, token de deploy, senha de SFTP: nada disso mora em
arquivo que vai pro ar, nem em comentário.

E liste o que a página carrega de fora:

```bash
curl -s https://dominio.com.br/ | grep -oE '(src|href)="https?://[^"]+' | sort -u
```

Cada domínio nessa lista é alguém que recebe o IP de quem visita. Google
Fonts, pixel e GTM são esperados; qualquer outro precisa ter motivo.

## 5 · O que é público de propósito

Anote no `PROJETO.md` o que está exposto porque deve estar: o número do
WhatsApp no botão, a foto do expert com nome previsível, o preço. Não é
vazamento, é a página. Escrever isso evita o alarme falso na próxima
auditoria.

## Checklist

- [ ] `find` no servidor sem `.md`, `.env`, `_qa`, `_versoes`, `tools`, `.vercel`, `.git`
- [ ] Nenhum arquivo sem referência no HTML
- [ ] Pastas respondem 403, sem "Index of"
- [ ] Os cinco headers presentes, `X-Powered-By` ausente
- [ ] `grep` de credencial vazio no publicado
- [ ] Lista de domínios externos conferida
- [ ] O que é público de propósito, anotado
