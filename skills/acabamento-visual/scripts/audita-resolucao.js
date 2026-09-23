/* Auditoria de resolução. Cole no console da página, ou rode via
   chrome-devtools MCP com evaluate_script (a função é async).

   Imagem esticada além do que o arquivo tem é o defeito que o olho do
   cliente pega primeiro e o nosso revisor não pega nunca: no print
   reduzido tudo parece nítido. Este script compara, para cada imagem, os
   pixels que o ARQUIVO tem com os pixels que a TELA pede.

   Mede três coisas:
   - <img>: naturalWidth contra largura renderizada x densidade da tela
   - fundo CSS (background-image: url): tamanho natural do arquivo contra
     o tamanho do tile desenhado (background-size), em cada elemento
   - pseudo-elementos ::before e ::after com url no fundo

   Critério: o arquivo precisa ter pelo menos a largura exibida vezes
   min(devicePixelRatio, 2). Abaixo de 1x é REPROVADO (esticado de
   verdade). Entre 1x e 2x numa tela retina é AVISO.

   Rode com a viewport na maior largura que a página atende (1440 ou
   1920) e deviceScaleFactor 2: é onde o esticamento aparece.        */
(async () => {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const natural = new Map();
  const carrega = (url) => {
    if (natural.has(url)) return natural.get(url);
    const p = new Promise((ok) => {
      const i = new Image();
      i.onload = () => ok({ w: i.naturalWidth, h: i.naturalHeight });
      i.onerror = () => ok(null);
      i.src = url;
    });
    natural.set(url, p);
    return p;
  };
  const nome = (u) => decodeURIComponent(u.split('/').pop().split('?')[0]);
  const achados = [];

  const avalia = (arquivo, nat, exibidoW, exibidoH, onde) => {
    if (!nat || !exibidoW) return;
    const fator = Math.min(nat.w / exibidoW, nat.h / (exibidoH || 1));
    if (fator >= dpr * 0.95) return;
    achados.push({
      arquivo, onde,
      arquivoPx: `${nat.w}x${nat.h}`,
      exibidoPx: `${Math.round(exibidoW)}x${Math.round(exibidoH)}`,
      densidade: +fator.toFixed(2),
      veredito: fator < 0.98 ? 'REPROVADO (esticada)' : 'aviso (abaixo de 2x no retina)',
    });
  };

  // 1 · <img>
  for (const img of document.images) {
    if (!img.complete) await new Promise((r) => { img.onload = img.onerror = r; });
    const b = img.getBoundingClientRect();
    if (b.width < 48) continue;
    const cs = getComputedStyle(img);
    let w = b.width, h = b.height;
    // object-fit: cover amplia além da caixa
    if (cs.objectFit === 'cover' && img.naturalWidth && img.naturalHeight) {
      const s = Math.max(b.width / img.naturalWidth, b.height / img.naturalHeight);
      w = img.naturalWidth * s; h = img.naturalHeight * s;
    }
    avalia(nome(img.currentSrc || img.src), { w: img.naturalWidth, h: img.naturalHeight }, w, h, 'img');
  }

  // 2 · fundos CSS, incluindo pseudo-elementos
  const els = document.querySelectorAll('body, body *');
  for (const el of els) {
    for (const pseudo of [null, '::before', '::after']) {
      const cs = getComputedStyle(el, pseudo);
      const bg = cs.backgroundImage;
      if (!bg || !bg.includes('url(')) continue;
      const urls = [...bg.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map((m) => m[1]).filter((u) => !u.startsWith('data:'));
      if (!urls.length) continue;
      const b = el.getBoundingClientRect();
      if (b.width < 48 || b.height < 48) continue;
      const tamanhos = cs.backgroundSize.split(',').map((s) => s.trim());
      for (const [k, url] of urls.entries()) {
        const nat = await carrega(url);
        if (!nat) continue;
        const sz = (tamanhos[k] || tamanhos[0] || 'auto').split(' ');
        const px = (v, base) => v.endsWith('%') ? parseFloat(v) / 100 * base : parseFloat(v);
        let w, h;
        if (sz[0] === 'cover') { const s = Math.max(b.width / nat.w, b.height / nat.h); w = nat.w * s; h = nat.h * s; }
        else if (sz[0] === 'contain') { const s = Math.min(b.width / nat.w, b.height / nat.h); w = nat.w * s; h = nat.h * s; }
        else if (sz[0] === 'auto' && (!sz[1] || sz[1] === 'auto')) { w = nat.w; h = nat.h; }
        else {
          w = sz[0] === 'auto' ? null : px(sz[0], b.width);
          h = !sz[1] || sz[1] === 'auto' ? null : px(sz[1], b.height);
          if (w == null) w = h * nat.w / nat.h;
          if (h == null) h = w * nat.h / nat.w;
        }
        const tag = el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.classList[0] ? '.' + el.classList[0] : '') + (pseudo || '');
        avalia(nome(url), nat, w, h, `fundo em ${tag}`);
      }
    }
  }

  // um arquivo por linha, fica o pior caso
  const pior = {};
  for (const a of achados) if (!pior[a.arquivo] || a.densidade < pior[a.arquivo].densidade) pior[a.arquivo] = a;
  const lista = Object.values(pior).sort((a, b) => a.densidade - b.densidade);
  return {
    viewport: `${innerWidth}px @ ${window.devicePixelRatio}x`,
    alvo: `${dpr}x`,
    reprovados: lista.filter((a) => a.veredito.startsWith('REPROVADO')),
    avisos: lista.filter((a) => !a.veredito.startsWith('REPROVADO')),
    aprovado: !lista.some((a) => a.veredito.startsWith('REPROVADO')),
  };
})();
