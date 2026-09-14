# Chaves de API

**Isto é opcional.** Você só precisa de chave se quiser **gerar imagem ou vídeo
sob medida**. Página com arte própria tem uma cara que banco de imagem não dá,
mas ela não é pré-requisito de página boa. As quatro origens de imagem, e
quando cada uma vale, estão em
`../../acabamento-visual/references/de-onde-vem-a-imagem.md`: desenhar cobre a
maioria, e o Pixabay cobre quase todo o resto, de graça.

Leia este arquivo quando decidir que quer arte gerada, não antes.

---

## Regra zero: a chave não mora no projeto

Chave de API é senha. Ela não vai no HTML, não vai no código, não vai num
arquivo solto dentro da pasta do site, e não vai pro repositório.

Ela mora num cofre, fora da árvore do projeto:

```
~/.config/segredos/
```

No Windows o caminho é o mesmo e o jeito de criar muda: veja `windows.md`.

```bash
mkdir -p ~/.config/segredos/projetos
chmod 700 ~/.config/segredos ~/.config/segredos/projetos
```

### Duas gavetas, e confundir as duas dá trabalho

Nem toda credencial tem a mesma vida. Uma é **sua**, outra é **daquele
cliente**, e elas mudam em ritmos diferentes.

| Gaveta | O que guarda | Exemplo |
|---|---|---|
| `segredos/` | o que é seu e serve pra todo projeto | chave da API de imagem |
| `segredos/projetos/` | o que é de **um** projeto só | acesso de FTP do servidor daquele cliente, token de pixel |

**Na gaveta de cima**, um arquivo por serviço:

```bash
printf 'GEMINI_API_KEY=coloque_a_chave_aqui\n' > ~/.config/segredos/gemini.env
chmod 600 ~/.config/segredos/gemini.env
```

**Na de baixo**, um arquivo por projeto, com o mesmo nome da pasta do projeto:

```bash
printf 'FTP_HOST=\nFTP_USER=\nFTP_PASS=\nFTP_PASTA=\n' > ~/.config/segredos/projetos/ingles-para-ti.env
chmod 600 ~/.config/segredos/projetos/ingles-para-ti.env
```

E o `PROJETO.md` **aponta** pro arquivo, sem nunca conter o conteúdo dele:

```markdown
Credenciais: ~/.config/segredos/projetos/ingles-para-ti.env
```

### Por que não guardar dentro da pasta do projeto

Parece mais natural: o acesso é daquele site, por que não fica junto?

**Porque a pasta do projeto vai pro ar.** Se o arquivo estiver lá e a lista de
exclusão falhar, você publica a senha do seu servidor na internet, num endereço
que qualquer um acessa. É o tipo de erro que só se descobre depois.

A associação entre projeto e credencial é resolvida pelo nome do arquivo e pela
linha no `PROJETO.md`. O segredo em si nunca entra na pasta que é publicada.

E no projeto, um `.gitignore` com `.env` e `.env.*` **antes do primeiro
commit**, como rede de segurança pro caso de algo escapar.

### Se a chave vazou

Apagar o arquivo não resolve: o histórico do repositório guarda. O único
caminho é **revogar a chave no painel do serviço e gerar outra**. Leva dois
minutos e é a diferença entre um susto e uma fatura.

---

## Gemini, pra imagem e vídeo

Serve pra gerar arte de fundo, retrato tratado e vídeo de textura.

### Os passos

1. Entre no Google AI Studio com sua conta Google.
2. Gere uma chave de API.
3. **Ative o faturamento no projeto.** Este é o passo que trava quase todo
   mundo: o nível gratuito não gera imagem nem vídeo. Sem billing, a chave
   funciona pra texto e devolve erro pra mídia.
4. Guarde a chave no cofre, como acima.

### Dois avisos que economizam tempo

**Vídeo é assíncrono.** O pedido não devolve o vídeo: devolve um comprovante, e
você pergunta de tempos em tempos se ficou pronto. Cada clipe leva de 80 a 120
segundos. Se o seu script "travou", provavelmente ele está só esperando.

**Custo por peça, não por assinatura.** Você paga pelo que gera. Uma página
inteira de arte custa alguns dólares, não centenas, mas gerar cinquenta
variações de capricho aparece na conta.

---

## Outras chaves, quando aparecerem

O mesmo padrão vale pra qualquer serviço: um arquivo por serviço no cofre, modo
600, e o projeto lendo de lá.

| Serviço | Quando você vai precisar |
|---|---|
| Pixabay | quando quiser textura ou objeto de acervo. **Grátis**, chave na hora |
| Gemini | quando quiser arte gerada sob medida. Paga por peça |
| Hospedagem (SFTP ou painel) | na letra E, pra publicar |
| Plataforma de pagamento | pra pegar o link de checkout, que não é chave |
| Pixel e rastreamento | é identificador público, pode ficar no HTML |

Note a diferença: **pixel é público, chave de API é secreta.** Confundir os dois
faz gente esconder o que não precisa e expor o que precisava esconder.

---

## Como saber se está configurado

Peça ao agente pra gerar uma imagem de teste. Se voltar imagem, está pronto. Se
voltar erro, os dois motivos mais comuns, nesta ordem:

1. **Faturamento não ativado** no projeto do Google Cloud. É o campeão.
2. **Chave copiada com espaço no fim**, ou com aspas que não deveriam estar lá.

---

## Checklist

- [ ] Cofre criado em `~/.config/segredos/`, modo 700
- [ ] Arquivo da chave em modo 600
- [ ] `.gitignore` com `.env` antes do primeiro commit
- [ ] Faturamento ativado, se for gerar mídia
- [ ] Imagem de teste gerada com sucesso
- [ ] Nenhuma chave dentro da pasta do projeto
