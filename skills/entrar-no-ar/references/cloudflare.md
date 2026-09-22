# Cloudflare: DNS pela API, sem abrir o painel

Quando o domínio da pessoa está no Cloudflare (a maioria está), apontar um
subdomínio é um comando. Isso tira do caminho o "me avisa quando salvar o
registro", que costuma custar um dia.

---

## O token

Pede pra pessoa criar em **Meu perfil → Tokens de API → Criar token →
"Editar DNS da zona"**, restrito à zona do domínio. Só isso: nada de token
global, nada de permissão de conta inteira. O token vai pro arquivo do projeto
no cofre (`~/.config/segredos/projetos/<nome>.env`, variável
`CLOUDFLARE_API_TOKEN`), nunca pra pasta publicada.

Validar antes de usar:

```bash
curl -s https://api.cloudflare.com/client/v4/user/tokens/verify \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
```

## Os três comandos

**1 · Achar a zona:**

```bash
curl -s "https://api.cloudflare.com/client/v4/zones?name=dominio.com.br" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
# pega result[0].id
```

**2 · Conferir se o nome já existe** (nunca crie em cima de um registro que
já aponta pra outro lugar):

```bash
curl -s "https://api.cloudflare.com/client/v4/zones/$ZID/dns_records?name=lp.dominio.com.br" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
```

**3 · Criar o registro:**

```bash
curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZID/dns_records" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" -H 'Content-Type: application/json' \
  --data '{"type":"A","name":"lp","content":"IP.DO.SERVIDOR","ttl":300,"proxied":false,
           "comment":"LP <nome do projeto>, criado em <data>"}'
```

Pra Vercel é `CNAME` com `cname.vercel-dns.com`. Pra Cloudways é `A` com o IP
público do servidor.

## Proxy: desligado até o SSL emitir

`proxied: false` (nuvem cinza) enquanto o Let's Encrypt não sai. Com a nuvem
laranja o certificado da origem não valida, e o Cloudways devolve erro sem
explicar. Depois que o `https://` responde com o certificado certo, pode
ligar o proxy se quiser CDN e firewall na frente. Aí o SSL entre Cloudflare e
origem precisa estar em **Full (strict)**, senão vira loop de redirect.

## Propagação: o seu resolvedor é o último a saber

Com TTL 300 o `1.1.1.1` responde em segundos. O resolvedor da operadora
(Vivo, Claro) pode levar minutos. Então:

- teste com `dig +short lp.dominio.com.br @1.1.1.1`
- teste a página com `curl --resolve lp.dominio.com.br:443:IP https://lp.dominio.com.br/`
  sem esperar o DNS local
- o Chrome da sua máquina só abre quando o resolvedor dela atualizar; não
  confunda isso com a página fora do ar

## Checklist

- [ ] Token com escopo de uma zona só, guardado no cofre do projeto
- [ ] Registro conferido antes de criar (nome livre)
- [ ] `proxied: false` até o SSL emitir
- [ ] Comentário no registro dizendo o projeto e a data
- [ ] Endereço final testado com `--resolve`, não esperando o DNS local
