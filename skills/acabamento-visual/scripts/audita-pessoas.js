/* Auditoria de pessoas na página. Cole no console, ou rode via
   chrome-devtools MCP com evaluate_script. Rode em 1440 e em 390.

   Acusa os dois defeitos de composição que o cliente vê primeiro:

   FANTASMA · imagem com mask-image própria sobreposta a outra imagem ou a
   um fundo com arte. Onde a máscara deixa a imagem transparente, o que
   está atrás aparece através do corpo. O conserto é tirar a máscara da
   pessoa e pôr no wrapper do grupo ou no container.

   CORTE · imagem que ultrapassa a caixa de um ancestral que recorta
   (overflow hidden/clip, mask-image ou clip-path). A parte de fora some
   com borda reta: braço amputado. O conserto é alargar o wrapper.

   Também lista quem cobre o topo de uma imagem (a faixa de 35% de cima,
   onde o rosto costuma estar), pra conferir a olho que nada tapa rosto.

   Considera "pessoa" toda <img> com mais de 120px de altura cujo arquivo
   tem transparência de verdade (recorte com alfa). Arte opaca, como neon
   ou textura, não entra. Pra ser explícito, marque com data-pessoa.
   Imagem lazy que ainda não carregou fica de fora: role a página inteira
   antes, ou troque pra eager.                                      */
(() => {
  const rect = (el) => el.getBoundingClientRect();
  const inter = (a, b) => {
    const w = Math.min(a.right, b.right) - Math.max(a.left, b.left);
    const h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
    return w > 0 && h > 0 ? w * h : 0;
  };
  const nome = (el) => {
    const src = (el.currentSrc || el.src || '').split('/').pop().split('?')[0];
    return src || el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : '');
  };
  const temMascara = (el) => {
    const cs = getComputedStyle(el);
    const m = cs.maskImage || cs.webkitMaskImage;
    return m && m !== 'none';
  };

  // recorte = arquivo com transparência de verdade nos cantos (arte opaca não conta)
  const temAlfa = (img) => {
    try {
      const c = document.createElement('canvas'); c.width = c.height = 24;
      const x = c.getContext('2d'); x.drawImage(img, 0, 0, 24, 24);
      const d = x.getImageData(0, 0, 24, 24).data;
      let transp = 0;
      for (let i = 3; i < d.length; i += 4) if (d[i] < 200) transp++;
      return transp > 24 * 24 * 0.08;
    } catch { return /\.png(\?|$)/i.test(img.currentSrc || img.src); }
  };
  const pessoas = [...document.images].filter((img) => {
    if (img.hasAttribute('data-pessoa')) return true;
    const b = rect(img);
    return b.height > 120 && b.width > 0 && img.complete && temAlfa(img);
  });

  const fantasmas = [];
  const cortes = [];
  const sobreRosto = [];

  for (const p of pessoas) {
    const bp = rect(p);

    // FANTASMA: máscara na própria pessoa + algo visual atrás dela
    if (temMascara(p)) {
      const atras = [...document.images].filter((o) => o !== p && inter(rect(o), bp) > bp.width * bp.height * 0.04);
      if (atras.length) fantasmas.push({ pessoa: nome(p), atras: atras.map(nome).slice(0, 4) });
    }

    // CORTE: ancestral que recorta e a pessoa passa da caixa dele
    for (let a = p.parentElement; a && a !== document.body; a = a.parentElement) {
      const cs = getComputedStyle(a);
      const recorta = /hidden|clip/.test(cs.overflow + cs.overflowX + cs.overflowY) || temMascara(a) || (cs.clipPath && cs.clipPath !== 'none');
      if (!recorta) continue;
      const ba = rect(a);
      const fora = {
        esquerda: Math.round(ba.left - bp.left),
        direita: Math.round(bp.right - ba.right),
        topo: Math.round(ba.top - bp.top),
      };
      const lados = Object.entries(fora).filter(([, v]) => v > 2).map(([k, v]) => `${k} ${v}px`);
      if (lados.length) cortes.push({ pessoa: nome(p), cortadaPor: a.tagName.toLowerCase() + (a.className ? '.' + String(a.className).split(' ')[0] : ''), lados });
    }

    // ROSTO: faixa de cima da pessoa coberta por elemento posicionado acima dela
    const rosto = { left: bp.left, right: bp.right, top: bp.top, bottom: bp.top + bp.height * 0.35 };
    const zP = parseInt(getComputedStyle(p).zIndex) || 0;
    document.querySelectorAll('body *').forEach((el) => {
      if (el === p || el.contains(p) || p.contains(el)) return;
      const cs = getComputedStyle(el);
      if (cs.position === 'static' || cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) return;
      const be = rect(el);
      if (!be.width || be.width > innerWidth * 0.8) return;
      const antes = !!(p.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING);
      const zE = parseInt(cs.zIndex) || 0;
      if ((zE > zP || (zE === zP && antes)) && inter(be, rosto) > (rosto.right - rosto.left) * (rosto.bottom - rosto.top) * 0.03) {
        sobreRosto.push({ pessoa: nome(p), elemento: el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : '') });
      }
    });
  }

  const unico = (arr) => [...new Map(arr.map((o) => [JSON.stringify(o), o])).values()];
  return {
    largura: innerWidth,
    pessoas: pessoas.map(nome),
    fantasmas: unico(fantasmas),
    cortes: unico(cortes),
    conferirRosto: unico(sobreRosto).slice(0, 10),
    aprovado: !fantasmas.length && !cortes.length,
    nota: 'conferirRosto não reprova sozinho: abra o print e veja se o elemento tapa rosto ou a mão do gesto',
  };
})();
