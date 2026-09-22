/* Bateria de fluidez. Cole no console da página, ou rode via chrome-devtools
   MCP com evaluate_script (a função é async, retorna um objeto).

   O que faz: rola a página inteira do topo ao rodapé em ~14 s, como um dedo
   no trackpad, depois para na dobra indicada por 6 s com as animações
   rodando. Enquanto isso mede:

   - layout shift acumulado (CLS) e cada deslocamento acima de 0,001, com o
     elemento culpado e a altura em que aconteceu
   - o tempo de cada frame: quantos passaram de 34 ms (perdeu um frame a 30
     fps) e de 100 ms (travou), e o pior
   - tarefas longas na thread principal
   - estouro horizontal
   - quantas animações estão vivas ao fim

   Rode duas vezes: no desktop, e no celular com CPU 4x mais lenta
   (emulate: viewport 390x844x3 mobile touch, cpuThrottlingRate 4).

   Aprovado = CLS 0, nenhum frame acima de 100 ms, no máximo um punhado
   acima de 34 ms, zero long task, sem estouro.

   Argumento opcional: o seletor da dobra onde parar (padrão: a que tiver
   mais animações). */
(async (seletorParada) => {
  const esperar = ms => new Promise(r => setTimeout(r, ms));
  let cls = 0, shifts = [], longTasks = [];
  const nome = n => n && (n.id ? '#' + n.id : (n.className && typeof n.className === 'string' ? '.' + n.className.split(' ')[0] : n.tagName));
  try {
    new PerformanceObserver(l => { for (const e of l.getEntries()) { if (!e.hadRecentInput) { cls += e.value; if (e.value > 0.001) shifts.push({ valor: +e.value.toFixed(4), y: Math.round(scrollY), culpados: (e.sources || []).map(s => nome(s.node) || '?').slice(0, 3) }); } } }).observe({ type: 'layout-shift' });
    new PerformanceObserver(l => { for (const e of l.getEntries()) longTasks.push({ ms: Math.round(e.duration), y: Math.round(scrollY) }); }).observe({ type: 'longtask' });
  } catch (e) {}
  let frames = [], last = performance.now(), rodando = true;
  const tick = t => { frames.push(t - last); last = t; if (rodando) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
  const total = document.documentElement.scrollHeight - innerHeight;
  const t0 = performance.now(), dur = 14000;
  while (performance.now() - t0 < dur) { window.scrollTo(0, total * ((performance.now() - t0) / dur)); await esperar(16); }
  let alvo = seletorParada && document.querySelector(seletorParada);
  if (!alvo) {
    let melhor = 0;
    document.querySelectorAll('section').forEach(s => { const n = s.getAnimations({ subtree: true }).length; if (n > melhor) { melhor = n; alvo = s; } });
  }
  if (alvo) window.scrollTo({ top: alvo.getBoundingClientRect().top + scrollY - 60, behavior: 'instant' });
  await esperar(6000);
  rodando = false;
  const media = frames.reduce((a, b) => a + b, 0) / frames.length;
  const r = {
    cls: +cls.toFixed(4), deslocamentos: shifts.slice(0, 10),
    frames: { total: frames.length, mediaMs: +media.toFixed(1), acimaDe34ms: frames.filter(f => f > 34).length, acimaDe100ms: frames.filter(f => f > 100).length, piorMs: Math.round(Math.max(...frames)) },
    longTasks: longTasks.slice(0, 10), longTasksTotal: longTasks.length,
    animacoesVivas: document.getAnimations().length,
    estouroHorizontal: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    paradaEm: alvo ? nome(alvo) : null
  };
  r.aprovado = r.cls === 0 && r.frames.acimaDe100ms === 0 && r.longTasksTotal === 0 && !r.estouroHorizontal;
  return r;
})(typeof SELETOR_PARADA !== 'undefined' ? SELETOR_PARADA : null);
