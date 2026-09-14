# Cloudways

Hospedagem gerenciada com SSH e SFTP. É o destino mais comum quando o cliente
já tem servidor, e é o único aqui que permite colocar uma página estática
**dentro** de um domínio que já roda WordPress.

Este arquivo é a consolidação de aprendizado espalhado por três projetos que
tropeçaram nos mesmos gotchas de forma independente. Ler antes de subir custa
dez minutos. Descobrir na hora custa uma tarde.

---

## O truque que vale o capítulo: pasta física vence WordPress

Se o cliente tem `dominio.com.br` rodando WordPress e você quer publicar
`dominio.com.br/oferta/` como página estática, **não precisa de plugin, tema
nem tocar no WordPress.** Basta criar a pasta física dentro do `public_html` do
app do WordPress e mandar os arquivos pra lá.

O servidor entrega a pasta antes de o WordPress ser consultado. O WP nem
participa da requisição.

Três ganhos, e o terceiro é o que importa pro tráfego:

1. Velocidade de estático, dentro de um site pesado.
2. Nada quebra no WordPress: se der errado, você apaga a pasta.
3. **Pixel, GTM e cookie ficam no domínio principal**, como primeira parte.
   Página em subdomínio ou em domínio de teste perde parte do rastreamento.

Uma versão antiga da página pode continuar no ar em paralelo, em outro caminho,
até o cliente aprovar a troca. Migração sem risco.

---

## SFTP é chroot, SSH não. Os paths são diferentes

O gotcha mais caro, e o que mais consome tempo de quem nunca viu:

| Canal | O que ele enxerga como raiz |
|---|---|
| SFTP | `/applications/<app>/public_html` |
| SSH | `/home/master/applications/<app>/public_html` |

Mandar um arquivo por SFTP usando o caminho que você viu no SSH devolve
`No such file`. O arquivo está certo, o caminho é que não existe **naquele
canal**.

Quando o SFTP recusar o caminho, a rota confiável é mandar por SSH:

```bash
printf '%s' 'CONTEUDO_EM_BASE64' | base64 -d > /caminho/completo/arquivo.html
```

Ferramentas: `paramiko` (Python) resolve SFTP e SSH na mesma sessão. `sshpass`
serve pra senha em linha de comando. `lftp` e `ncftp` podem não estar
instalados, não conte com eles.

---

## Servidor compartilhado: confira a app antes de escrever

Um servidor Cloudways hospeda várias aplicações lado a lado, todas visíveis no
mesmo `/home/master/applications/`. Escrever na app errada é destrutivo e
silencioso: nenhum erro aparece, e o estrago é no site de outro cliente.

**Confira o destino antes de todo envio.** Em script, o caminho remoto é
parâmetro obrigatório e nunca um valor padrão esquecido no código.

---

## Permissão: 644, não 600

O PHP roda com um usuário diferente do que faz o SFTP. Arquivo salvo como 600
fica ilegível pro PHP e a página devolve "Permission denied" sem explicar.

Regra: **644 pra arquivo, 755 pra pasta.** Vale principalmente pra arquivo de
configuração que o PHP precisa ler, como token guardado fora do `public_html`.

Outro caso: o usuário do SSH costuma estar no grupo `www-data`, então ele
**cria e apaga** em pasta com escrita de grupo, mas **não sobrescreve** arquivo
já existente do usuário da app. Quando o upload falha silenciosamente nesse
cenário, o truque é apagar e recriar em vez de sobrescrever.

---

## O nginx ignora o `.htaccess` pra arquivo estático

Você configura cache no `.htaccess`, testa, e nada muda. O motivo: o nginx
serve css, js e imagem **direto**, sem passar pelo Apache, com cache longo por
padrão. O `.htaccess` só vale pro que chega no Apache.

Consequência prática: depois de cada envio, quem já visitou continua recebendo
o css antigo. A página fica quebrada só pra quem já a viu, que é justamente
quem você mais quer impressionar.

**Conserto: carimbar a versão no link.**

```html
<link rel="stylesheet" href="assets/css/lp.css?v=20260906143012">
```

O carimbo muda a cada envio, então o navegador entende como arquivo novo.

Duas regras sobre o carimbo:

1. **Só nos seus próprios arquivos.** Script de terceiro (GTM, pixel,
   rastreador) tem que ficar com a URL exata que o painel deles pede. Carimbar
   quebra a tag.
2. **Não vale pro HTML.** O HTML é o arquivo cujo endereço não muda, e é aí que
   entra o Varnish, abaixo.

---

## O Varnish segura o HTML por horas

O sintoma é confuso: o css atualizou, o HTML não. Você reenvia, e nada.

Diagnóstico:

```bash
curl -sI https://seudominio.com.br/ | grep -iE 'x-cache|age'
```

`x-cache: HIT` com `age` de milhares de segundos quer dizer que o HTML está
congelado no proxy há horas, mesmo com `max-age=0` no arquivo.

**Isso já custou duas rodadas inteiras de medição de performance**, comparando
números da versão nova contra uma página velha servida do cache.

Conserto duplo, e os dois são necessários:

**1 · O HTML pede pra não ser guardado.** Num arquivo estático o custo é zero:

```apache
<FilesMatch "\.html$">
  Header set Cache-Control "no-cache, must-revalidate"
</FilesMatch>
```

**2 · Purgar depois de cada envio**, por SSH, porque o purge só é aceito de
dentro do servidor:

```bash
curl -s -o /dev/null -X PURGE -H 'Host: seudominio.com.br' http://127.0.0.1:8080/caminho/
```

Purgue os **dois hosts**, com e sem `www`. Eles são entradas separadas no cache,
e purgar só um deixa metade dos visitantes na versão velha.

---

## Redirect duplo quando tem CDN na frente

Sintoma: a URL sem barra final dá dois pulos antes de abrir, e o carregamento
perde tempo à toa.

Causa: o Apache atrás do nginx devolve o redirecionamento em `http://`, e a CDN
manda de volta pra `https://`. Dois saltos onde deveria ter um.

Conserto: no `.htaccess`, redirecionar direto pro `https://` final, com o
domínio explícito, em vez de deixar o Apache montar a URL sozinho.

---

## Sobre o script de envio

Um script de envio não faz parte desta skill, de propósito: cada projeto tem sua
pasta e seu destino, e script genérico vira configuração disfarçada. Mas o
roteiro é sempre o mesmo, e é isso que importa guardar:

1. Conectar por SFTP lendo credencial do **arquivo daquele projeto**
   (`~/.config/segredos/projetos/<nome>.env`), nunca do código.
2. Percorrer a pasta local pulando o que não vai pro ar (fonte, ferramenta,
   material bruto, arquivo de configuração local).
3. Carimbar `?v=<timestamp>` nos links de css e js **do próprio projeto**.
4. Enviar, com permissão 644.
5. Purgar o cache por SSH, nos dois hosts.

Quem faz esses cinco passos na mão, no painel, chega no mesmo lugar. O script só
tira o esquecimento da equação, e o passo 5 é o que todo mundo esquece.

---

## Checklist

- [ ] App de destino conferida antes de escrever (servidor é compartilhado)
- [ ] Caminho compatível com o canal usado: SFTP e SSH enxergam raízes diferentes
- [ ] Arquivos com permissão 644, pastas 755
- [ ] css e js com carimbo de versão, e só os do próprio projeto
- [ ] HTML com `no-cache, must-revalidate`
- [ ] Cache purgado nos dois hosts depois do envio
- [ ] Versão no ar confirmada por `curl`, não por suposição
- [ ] Credencial lida de `segredos/projetos/<nome>.env`, fora da pasta publicada
