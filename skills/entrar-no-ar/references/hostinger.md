# Hostinger

> **Não validado na prática ainda.** O conteúdo aqui vem da documentação e do
> padrão de hospedagem compartilhada, não de uma página que subiu por este
> caminho. Ao publicar a primeira, corrigir este arquivo com o que se mostrou
> diferente. Enquanto essa marca estiver aqui, trate como roteiro, não como
> registro.

É o destino mais provável de quem está começando: barata, painel em português,
FTP direto e SSL incluso. Onde a Cloudways é a hospedagem de quem já atende
cliente, a Hostinger é a de quem está montando a primeira página.

---

## O caminho, no painel

1. **Achar o `public_html`.** No hPanel, em Arquivos, Gerenciador de Arquivos.
   É a pasta que vira a raiz do domínio. O que está nela em `index.html` é o
   que abre quando alguém digita o endereço.
2. **Subir os arquivos.** Ou pelo gerenciador (arrastar, e ele aceita zip com
   opção de extrair no servidor), ou por FTP com um cliente.
3. **Domínio.** Se o domínio foi comprado lá, já aponta sozinho. Se foi comprado
   em outro lugar, trocar os servidores de nome no registrador e esperar a
   propagação, que costuma levar de minutos a algumas horas.
4. **SSL.** Ativar o certificado grátis no painel, e conferir que o site força
   `https://`. Página de vendas em `http://` mostra aviso de insegurança no
   navegador e mata a conversão antes da headline.

Subpasta funciona igual à Cloudways: uma pasta dentro do `public_html` vira
`seudominio.com.br/nome-da-pasta/`.

---

## Credencial de FTP

O painel gera host, usuário, senha e porta. Esse acesso é **daquele projeto**, então vai no arquivo dele:

```
${XDG_CONFIG_HOME:-$HOME/.config}/segredos/projetos/<nome-do-projeto>.env
```

Prefira **SFTP** (porta 22) quando o plano oferecer, em vez de FTP puro (porta
21). FTP puro manda a senha em texto aberto.

---

## O que provavelmente muda em relação à Cloudways

| Item | Cloudways | Hostinger (esperado) |
|---|---|---|
| Proxy de HTML na frente | Varnish, e o purge é obrigatório | em geral não há, o HTML atualiza direto |
| Raiz do SFTP contra a do SSH | caminhos diferentes, gotcha clássico | caminho único, mais simples |
| Cache de css e js | nginx cacheia por 1 ano, ignorando `.htaccess` | costuma respeitar o `.htaccess` |
| SSH | disponível | só em alguns planos |

**Mesmo sem Varnish, mantenha o carimbo de versão** (`?v=<timestamp>`) nos links
de css e js. Ele custa nada, e o cache do navegador de quem já visitou existe em
qualquer hospedagem.

---

## `.htaccess`

Como a Hostinger usa Apache, o `.htaccess` tende a valer também pra arquivo
estático, diferente da Cloudways. Isso torna o modelo em
`../assets/htaccess-modelo.txt` mais útil aqui do que lá: compressão, cache por
tipo de arquivo, e o `noindex` enquanto a página é protótipo.

---

## Checklist

- [ ] Arquivos no `public_html`, com `index.html` na raiz certa
- [ ] Domínio apontado e propagado
- [ ] SSL ativo e `https://` forçado
- [ ] Credencial em `segredos/projetos/<nome>.env`, e SFTP em vez de FTP puro quando disponível
- [ ] Carimbo de versão em css e js
- [ ] Ao publicar a primeira página por aqui, corrigir este arquivo e remover o
      aviso do topo
