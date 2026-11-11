// ============ CÉREBRO v3 · UM CÉREBRO EM VISTA LATERAL (29/09/2026 — aprovado pelo Fábio após a reunião com a equipe) ============
// Tela principal = um cérebro (frente à esquerda). Cada disciplina é uma região (área ∝ peso na prova; Português e Língua
// Estrangeira no lobo temporal, a área da linguagem). Neurônio = tema, COR = ESTADO (verde dominado, amarelo em
// desenvolvimento, vermelho atenção; apagado = não explorado). Só o nome da disciplina: dentro da região quando cabe,
// senão fora com linha-guia. Sinapses (árvore mínima) só dentro da região, acesas com pulso onde o aluno já passou.
// Toque → a disciplina abre com os nomes curtos dos temas (nodes.rotulo_curto). Entrada: contorno se desenha → onda de
// luz da frente para trás → nomes (≈3 s; toque pula; respeita "reduzir movimento"). Posições determinísticas.
const COSMO_COR = { dominado: '#2FE08D', desenvolvimento: '#F2B33D', atencao: '#ED5A5A' };
const COSMO_TOM = ['#4F8BFF', '#A970FF', '#FF9F43', '#22D3EE', '#EC5FD0', '#2DD4BF', '#A3E635', '#7C83FF', '#7DD3FC', '#F9A8D4', '#FDBA74', '#C4B5FD', '#6EE7B7', '#F0ABFC'];
const COSMO_CURTO = { 'Direito Administrativo': 'Administrativo', 'Direito Constitucional': 'Constitucional', 'Direito Penal': 'Penal',
  'Direito Processual Penal': 'Processo Penal', 'Legislação de Trânsito': 'Trânsito', 'Legislação Especial': 'Leis Especiais', 'Língua Portuguesa': 'Português',
  'Língua Estrangeira': 'Estrangeira', 'Raciocínio Lógico-Matemático': 'Raciocínio Lógico', 'Ética e Cidadania': 'Ética' };
const COSMO_OURO = '#F5C542', CER_APAGADO = '#343E53', COSMO_ESTUDO = '#7FB8FF'; // azul = estudado (registro ou material), ainda sem questão
const galSemMov = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
const cosmoExpl = (e) => e === 'dominado' || e === 'desenvolvimento' || e === 'atencao';
const cosmoClamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
function cosmoHash(s) { let h = 2166136261; for (const c of String(s)) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619); } return ((h >>> 0) % 100000) / 100000; }
function cosmoRng(s) { let a = Math.floor(cosmoHash(s) * 4294967296) || 1; return () => { a ^= a << 13; a ^= a >>> 17; a ^= a << 5; return ((a >>> 0) % 1e6) / 1e6; }; }
const cosmoSprites = {};
function cosmoSprite(cor) { if (cosmoSprites[cor]) return cosmoSprites[cor];
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'), gr = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, cor); gr.addColorStop(.18, cor + 'AA'); gr.addColorStop(.45, cor + '33'); gr.addColorStop(1, cor + '00');
  x.fillStyle = gr; x.fillRect(0, 0, 128, 128); return (cosmoSprites[cor] = c); }
// árvore mínima (Prim): liga todos os temas sem voltas; o mesmo assunto "puxa" mais (peso menor)
function cosmoArvore(ts, px, py) {
  const n = ts.length, dentro = new Array(n).fill(false), melhor = new Array(n).fill(Infinity), de = new Array(n).fill(-1), E = [];
  if (!n) return E; melhor[0] = 0;
  for (let k = 0; k < n; k++) {
    let u = -1; for (let i = 0; i < n; i++) if (!dentro[i] && (u < 0 || melhor[i] < melhor[u])) u = i;
    dentro[u] = true; if (de[u] >= 0) E.push([ts[de[u]], ts[u]]);
    for (let v = 0; v < n; v++) if (!dentro[v]) { const d = Math.hypot(px(ts[u]) - px(ts[v]), py(ts[u]) - py(ts[v])) * (ts[u].a === ts[v].a ? .55 : 1.5);
      if (d < melhor[v]) { melhor[v] = d; de[v] = u; } }
  }
  return E;
}
// ---- anatomia (mundo 1000 × 720) ----
const CER_P = [[150,430],[118,360],[120,280],[160,200],[230,135],[320,90],[430,62],[540,55],[650,68],[750,105],[830,165],[885,240],[905,320],[895,395],[860,450],[800,480],[720,488],[640,500],[560,535],[470,555],[380,548],[310,520],[275,480],[285,445],[240,455],[190,455]];
const CER_CB = [[640,505],[720,490],[810,486],[872,505],[898,548],[872,592],[800,620],[708,622],[650,597],[624,556]];
const CER_TR = [[548,540],[602,548],[620,600],[630,692],[597,706],[580,652],[560,590]];
function cerCurva(pts, fechada, passos = 14) { // Catmull-Rom amostrado
  const n = pts.length, out = [], lim = fechada ? n : n - 1;
  for (let i = 0; i < lim; i++) {
    const p1 = pts[i], p2 = pts[(i + 1) % n], q0 = fechada ? pts[(i - 1 + n) % n] : (i === 0 ? p1 : pts[i - 1]), q3 = fechada ? pts[(i + 2) % n] : (i + 2 >= n ? p2 : pts[i + 2]);
    for (let k = 0; k < passos; k++) { const t = k / passos, t2 = t * t, t3 = t2 * t;
      out.push([.5 * ((2 * p1[0]) + (-q0[0] + p2[0]) * t + (2 * q0[0] - 5 * p1[0] + 4 * p2[0] - q3[0]) * t2 + (-q0[0] + 3 * p1[0] - 3 * p2[0] + q3[0]) * t3),
                .5 * ((2 * p1[1]) + (-q0[1] + p2[1]) * t + (2 * q0[1] - 5 * p1[1] + 4 * p2[1] - q3[1]) * t2 + (-q0[1] + 3 * p1[1] - 3 * p2[1] + q3[1]) * t3)]); }
  }
  if (!fechada) out.push(pts[n - 1]);
  return out;
}
const cerPath = (pts, fechada = true) => { const p = new Path2D(); pts.forEach(([x, y], i) => i ? p.lineTo(x, y) : p.moveTo(x, y)); if (fechada) p.closePath(); return p; };
const CER_C_PTS = (() => { const pts = cerCurva(CER_P, true, 22), n = pts.length, cx = 510, cy = 330; // calombos dos giros na borda de cima e de trás
  return pts.map(([x, y], i) => { const a = pts[(i + 1) % n], b = pts[(i - 1 + n) % n], tx = a[0] - b[0], ty = a[1] - b[1], L = Math.hypot(tx, ty) || 1;
    let nx = ty / L, ny = -tx / L; if (nx * (x - cx) + ny * (y - cy) < 0) { nx = -nx; ny = -ny; }
    const k = y < 470 ? 1 : cosmoClamp((520 - y) / 50), d = k * (6.5 * Math.sin(i * .2) + 2.5 * Math.sin(i * .47 + 1)); return [x + nx * d, y + ny * d]; }); })();
const CER_CB_PTS = cerCurva(CER_CB, true), CER_TR_PTS = cerCurva(CER_TR, true);
const CER_PATH_C = cerPath(CER_C_PTS), CER_PATH_CB = cerPath(CER_CB_PTS), CER_PATH_TR = cerPath(CER_TR_PTS);
const CER_SYL = cerCurva([[288,452],[360,428],[450,410],[540,392],[610,360]], false), CER_CEN = cerCurva([[548,57],[530,150],[500,250],[468,345],[445,402]], false);
const CER_MUNDO = { x0: 95, y0: 40, x1: 920, y1: 715 }, CER_GR = 5, CER_GX0 = 100, CER_GY0 = 45;
const CER_NX = Math.ceil((920 - CER_GX0) / CER_GR), CER_NY = Math.ceil((570 - CER_GY0) / CER_GR);
let cerGradeCache = null;
function cerGradeDeMascara(b64) { // reconstrói a grade a partir da máscara guardada (mesmas células, mesma ordem)
  const bin = atob(b64), cel = [], idx = new Int32Array(CER_NX * CER_NY).fill(-1);
  for (let j = 0; j < CER_NY; j++) for (let i = 0; i < CER_NX; i++) { const q = j * CER_NX + i;
    if (bin.charCodeAt(q >> 3) & (1 << (q & 7))) { idx[q] = cel.length; cel.push({ i, j, x: CER_GX0 + (i + .5) * CER_GR, y: CER_GY0 + (j + .5) * CER_GR }); } }
  return { cel, idx };
}
function cerMascara() {
  const { idx } = cerGrade(), u8 = new Uint8Array(Math.ceil(CER_NX * CER_NY / 8));
  for (let q = 0; q < idx.length; q++) if (idx[q] >= 0) u8[q >> 3] |= 1 << (q & 7);
  let bin = ''; for (let i = 0; i < u8.length; i++) bin += String.fromCharCode(u8[i]); return btoa(bin);
}
function cerGrade() { // células de 5 × 5 dentro do cérebro (uma vez só)
  if (cerGradeCache) return cerGradeCache;
  const tc = document.createElement('canvas').getContext('2d'), cel = [], idx = new Int32Array(CER_NX * CER_NY).fill(-1);
  for (let j = 0; j < CER_NY; j++) for (let i = 0; i < CER_NX; i++) { const x = CER_GX0 + (i + .5) * CER_GR, y = CER_GY0 + (j + .5) * CER_GR;
    if (tc.isPointInPath(CER_PATH_C, x, y)) { idx[j * CER_NX + i] = cel.length; cel.push({ i, j, x, y }); } }
  return (cerGradeCache = { cel, idx });
}
// ruído suave por região: as divisas ficam onduladas como sulcos
const CER_LAYOUTS = {}; // memória da sessão (e cópia no aparelho, abaixo)
function cerLayoutLer(chave) {
  if (CER_LAYOUTS[chave]) return CER_LAYOUTS[chave];
  try { const j = localStorage.getItem('dominei_cerebro_' + chave); if (j) return (CER_LAYOUTS[chave] = JSON.parse(j)); } catch (e) { /* sem armazenamento: calcula */ }
  return null;
}
function cerLayoutGravar(chave, obj) {
  CER_LAYOUTS[chave] = obj;
  try { Object.keys(localStorage).filter(k => k.startsWith('dominei_cerebro_') && k !== 'dominei_cerebro_' + chave).forEach(k => localStorage.removeItem(k));
        localStorage.setItem('dominei_cerebro_' + chave, JSON.stringify(obj)); } catch (e) { /* sem armazenamento: fica só na memória */ }
}
const cerRuido = (x, y, k) => 520 * (Math.sin((x * .71 + y * .7) * .03 + k * 1.7) + Math.sin((x * .5 - y * .87) * .027 - k * 2.3) + .7 * Math.sin((x * .26 + y * .97) * .041 + k));

class CerebroMapa {
  constructor(cv, opts = {}) {
    this.cv = cv; this.ctx = cv.getContext('2d'); this.opts = opts;
    this.gals = []; this.temas = []; this.byId = {}; this.modo = 'cerebro'; this.sel = null; this.selTema = null; this.rotulos = [];
    this.fade = 0; this.fadeAlvo = 0; this.cam = { x: 0, y: 0, s: 1 }; this.alvo = { x: 0, y: 0, s: 1 }; this.anim = null; this.intro = null;
    this.W = 0; this.H = 0; this.dpr = 1; this.fs = 1; this.raf = null; this.exp = false; this.sB = 1; this.camB = { x: 0, y: 0, s: 1 };
    this.fundo = []; const r = cosmoRng('fundo'); for (let i = 0; i < 200; i++) this.fundo.push([r(), r(), r() * .9 + .2, r() * 6.28]);
    if (opts.interativo) cv.addEventListener('click', (e) => this.tocar(e));
    this.ro = new ResizeObserver(() => this.redimensionar()); this.ro.observe(cv);
  }
  // áreas ocupadas pela interface: título (topo), legenda (base) e o cartão do tema no desktop (direita)
  topo() { return this.exp ? 40 : this.opts.topo ? this.opts.topo() : 10; }
  base() { return this.exp ? 40 : this.opts.base ? this.opts.base() : 10; }
  direita() { return !this.exp && this.modo === 'aberta' && this.opts.direita ? this.opts.direita() : 0; }
  celular() { return this.exp ? true : this.W < 700; } // o story (1080 × 1920) usa o arranjo do celular: nomes em cima e embaixo
  meio() { return (this.topo() - this.base()) / 2; }
  fonteTema() { return `700 ${(this.celular() ? 12.5 : 14) * this.fs}px 'Atkinson Hyperlegible', system-ui, sans-serif`; }
  fonteNome() { return `800 ${(this.celular() ? 11.5 : 13) * this.fs}px 'Archivo', system-ui, sans-serif`; }

  montar({ estrutura, porNode, ligacoes }) {
    this.gals = []; this.temas = []; this.byId = {};
    (estrutura || []).forEach(d => {
      const g = { id: d.disciplina_id, nome: d.disciplina, curto: COSMO_CURTO[d.disciplina] || d.disciplina, assuntos: [], temas: [], peso: 0 };
      d.assuntos.forEach(a => {
        const as = { id: a.assunto_id, nome: a.assunto, temas: [] };
        (a.topicos || []).forEach(t => {
          const st = porNode[t.node_id] || {};
          let rot = t.rotulo || t.nome; if (rot.length > 26) rot = rot.slice(0, 24).trimEnd() + '…';
          const n = { id: t.node_id, nome: t.nome, rot, peso: +t.peso || .001, freq: t.provas_freq || 0, disc: d.disciplina, assunto: a.assunto,
            estado: st.estado || 'nao_avaliado', n_ev: st.n_evidencias || 0, forca_obs: st.forca_obs, forca: st.forca,
            rever: !!st.rever, visto: !!st.visto, g, a: as, viz: [], pviz: [] };
          as.temas.push(n); g.temas.push(n); g.peso += n.peso; this.temas.push(n); this.byId[n.id] = n;
        });
        if (as.temas.length) g.assuntos.push(as);
      });
      if (g.temas.length) this.gals.push(g);
    });
    this.gals.sort((a, b) => b.peso - a.peso);
    this.pesoTot = this.gals.reduce((s, g) => s + g.peso, 0) || 1;
    this.gals.forEach((g, i) => { g.tom = COSMO_TOM[i % COSMO_TOM.length]; g.expl = g.temas.filter(t => cosmoExpl(t.estado)).length;
      g.frac = g.expl / g.temas.length; g.pct = Math.round(100 * g.peso / this.pesoTot); });
    if (this.gals.length) {
      const chave = this.chaveLayout();
      if (!this.aplicarLayout(cerLayoutLer(chave))) { this.regioes(); this.decidirNomes(); this.neuronios(); cerLayoutGravar(chave, this.exportarLayout()); }
    }
    this.ligar(ligacoes || {});
    this.modo = 'cerebro'; this.sel = null; this.selTema = null; this.fade = 0; this.fadeAlvo = 0; this.anim = null; this.intro = null;
    this.redimensionar(true);
    this.prontoEm = performance.now(); // cliques anteriores a isto ficaram na fila durante a carga: ignorados
    return this;
  }
  // ligações do conteúdo e "estudados juntos": alimentam só o cartão do tema (não são desenhadas)
  ligar(lig) {
    this.temas.forEach(n => { n.viz = []; n.pviz = []; });
    (lig.conteudo || []).forEach(e => { const a = this.byId[e.a], b = this.byId[e.b]; if (!a || !b) return;
      const E = { tipo: e.tipo, forca: +e.forca || .5, motivo: e.motivo }; a.viz.push({ n: b, e: E }); b.viz.push({ n: a, e: E }); });
    (lig.pessoais || []).forEach(e => { const a = this.byId[e.a], b = this.byId[e.b]; if (!a || !b) return;
      const E = { n: e.n || 1 }; a.pviz.push({ n: b, e: E }); b.pviz.push({ n: a, e: E }); });
  }
  // regiões: diagrama de potência na grade (área ∝ peso) com divisas onduladas
  regioes() {
    const { cel, idx } = cerGrade(), n = this.gals.length, rng = cosmoRng('regioes'), tot = cel.length;
    const alvo = this.gals.map(g => tot * g.peso / this.pesoTot);
    const ancora = { 'Língua Portuguesa': [430, 492], 'Língua Estrangeira': [590, 468] };
    const sem = this.gals.map(g => ancora[g.nome] ? [...ancora[g.nome]] : null);
    const livres = cel.filter(c => c.y < 430 || c.x < 270);
    this.gals.forEach((g, k) => { if (sem[k]) return; let best = livres[0], bd = -1;
      for (let t = 0; t < 60; t++) { const c = livres[Math.floor(rng() * livres.length)], ds = sem.filter(Boolean).map(s => Math.hypot(s[0] - c.x, s[1] - c.y));
        const d = ds.length ? Math.min(...ds) : 1e9; if (d > bd) { bd = d; best = c; } }
      sem[k] = [best.x, best.y]; });
    const w = new Array(n).fill(0), r = new Int16Array(cel.length), N = cel.length;
    const X = new Float64Array(N), Y = new Float64Array(N), NZ = new Float64Array(N * n), SX = new Float64Array(n), SY = new Float64Array(n);
    for (let ci = 0; ci < N; ci++) { X[ci] = cel[ci].x; Y[ci] = cel[ci].y; for (let k = 0; k < n; k++) NZ[ci * n + k] = cerRuido(X[ci], Y[ci], k); }
    for (let it = 0; it < 90; it++) {
      const cnt = new Array(n).fill(0), sx = new Array(n).fill(0), sy = new Array(n).fill(0);
      for (let k = 0; k < n; k++) { SX[k] = sem[k][0]; SY[k] = sem[k][1]; }
      for (let ci = 0; ci < N; ci++) { const x = X[ci], y = Y[ci], o = ci * n; let b = 0, bv = 1e18;
        for (let k = 0; k < n; k++) { const dx = x - SX[k], dy = y - SY[k], v = dx * dx + dy * dy - w[k] + NZ[o + k]; if (v < bv) { bv = v; b = k; } }
        r[ci] = b; cnt[b]++; sx[b] += x; sy[b] += y; }
      for (let k = 0; k < n; k++) { w[k] += .7 * (alvo[k] - cnt[k]) * CER_GR * CER_GR / Math.PI;
        if (cnt[k]) { const cx = sx[k] / cnt[k], cy = sy[k] / cnt[k], an = ancora[this.gals[k].nome];
          sem[k] = an ? [cx * .4 + an[0] * .6, cy * .4 + an[1] * .6] : [sem[k][0] * .5 + cx * .5, sem[k][1] * .5 + cy * .5]; } }
    }
    const d = new Int32Array(cel.length).fill(1e9), fila = [];
    const viz = (c) => [[c.i + 1, c.j], [c.i - 1, c.j], [c.i, c.j + 1], [c.i, c.j - 1]].map(([i, j]) => (i < 0 || j < 0 || i >= CER_NX || j >= CER_NY) ? -1 : idx[j * CER_NX + i]);
    cel.forEach((c, ci) => { if (viz(c).some(v => v < 0 || r[v] !== r[ci])) { d[ci] = 0; fila.push(ci); } });
    for (let h = 0; h < fila.length; h++) { const ci = fila[h]; viz(cel[ci]).forEach(v => { if (v >= 0 && r[v] === r[ci] && d[v] > d[ci] + 1) { d[v] = d[ci] + 1; fila.push(v); } }); }
    this.reg = r;
    this.gals.forEach((g, k) => {
      g.cel = []; cel.forEach((c, ci) => { if (r[ci] === k) g.cel.push({ x: c.x, y: c.y, d: d[ci], ci }); });
      if (!g.cel.length) g.cel = [{ x: 500, y: 300, d: 0, ci: -1 }];
      g.cx = g.cel.reduce((s, c) => s + c.x, 0) / g.cel.length; g.cy = g.cel.reduce((s, c) => s + c.y, 0) / g.cel.length;
      let pb = g.cel[0]; g.cel.forEach(c => { if (c.d > pb.d || (c.d === pb.d && Math.hypot(c.x - g.cx, c.y - g.cy) < Math.hypot(pb.x - g.cx, pb.y - g.cy))) pb = c; });
      g.polo = [pb.x, pb.y];
    });
  }
  // nome dentro da região quando cabe (medido na escala do celular, o pior caso); em uma ou duas linhas
  decidirNomes() {
    const { idx } = cerGrade(), sRef = .42, m = document.createElement('canvas').getContext('2d');
    m.font = "800 11.5px 'Archivo', system-ui, sans-serif";
    this.gals.forEach((g, k) => {
      g.dentro = null; g.reserva = null; g.linhas = [g.curto];
      const pal = g.curto.split(' '), duas = pal.length > 1 ? [pal.slice(0, Math.ceil(pal.length / 2)).join(' '), pal.slice(Math.ceil(pal.length / 2)).join(' ')] : null;
      const opcoes = [[[g.curto], m.measureText(g.curto).width]]; if (duas) opcoes.push([duas, Math.max(...duas.map(l => m.measureText(l).width))]);
      const cands = [...g.cel].sort((p, q) => q.d - p.d).slice(0, 160);
      for (const [linhas, larg] of opcoes) {
        const bw = (larg + 10) / sRef, bh = (4 + 14 * linhas.length) / sRef;
        const cabe = (cx, cy) => { let tot = 0, fora = 0;
          for (let y = cy - bh / 2; y <= cy + bh / 2; y += CER_GR) for (let x = cx - bw / 2; x <= cx + bw / 2; x += CER_GR) {
            const i = Math.floor((x - CER_GX0) / CER_GR), j = Math.floor((y - CER_GY0) / CER_GR); tot++;
            if (i < 0 || j < 0 || i >= CER_NX || j >= CER_NY) return false; const v = idx[j * CER_NX + i]; if (v < 0) return false; if (this.reg[v] !== k) fora++; }
          return fora / tot <= .12; };
        const c = cands.find(c => cabe(c.x, c.y));
        if (c) { g.dentro = [c.x, c.y]; g.linhas = linhas; g.reserva = [c.x - bw / 2 - 6, c.y - bh / 2 - 4, c.x + bw / 2 + 6, c.y + bh / 2 + 4]; break; }
      }
    });
  }
  // neurônios espalhados na região (ponto mais distante), o tema mais pesado perto do centro
  neuronios() {
    this.gals.forEach(g => {
      const livre = (c) => !g.reserva || c.x < g.reserva[0] || c.x > g.reserva[2] || c.y < g.reserva[1] || c.y > g.reserva[3];
      let cand = g.cel.filter(c => c.d >= 2 && livre(c)); if (cand.length < g.temas.length * 3) cand = g.cel.filter(c => c.d >= 1 && livre(c)); if (cand.length < g.temas.length) cand = g.cel;
      const rng = cosmoRng(g.nome + '#neur'), esc = [];
      const pri = cand.reduce((b, c) => Math.hypot(c.x - g.cx, c.y - g.cy) < Math.hypot(b.x - g.cx, b.y - g.cy) ? c : b, cand[0]); esc.push(pri);
      const md = cand.map(c => Math.hypot(c.x - pri.x, c.y - pri.y));
      while (esc.length < g.temas.length) { let bi = 0, bv = -1; md.forEach((v, i) => { const vv = v + rng() * 2; if (vv > bv) { bv = vv; bi = i; } });
        const c = cand[bi]; esc.push(c); cand.forEach((o, i) => { md[i] = Math.min(md[i], Math.hypot(o.x - c.x, o.y - c.y)); }); }
      esc.sort((a, b) => Math.hypot(a.x - g.cx, a.y - g.cy) - Math.hypot(b.x - g.cx, b.y - g.cy));
      [...g.temas].sort((a, b) => b.peso - a.peso).forEach((t, k) => { const c = esc[k % esc.length]; t.bx = c.x + (rng() - .5) * 3; t.by = c.y + (rng() - .5) * 3; });
      this.derivar(g);
    });
  }
  derivar(g) {
    {
      const rx = Math.max(8, ...g.temas.map(t => Math.abs(t.bx - g.cx))), ry = Math.max(8, ...g.temas.map(t => Math.abs(t.by - g.cy)));
      g.temas.forEach(t => { t.u = g.temas.length > 1 ? (t.bx - g.cx) / rx : 0; t.v = g.temas.length > 1 ? (t.by - g.cy) / ry : 0; t.rb = 1.7 + 2.3 * Math.sqrt(t.peso / .03); });
      g.arCer = cosmoArvore(g.temas, t => t.bx, t => t.by);
    }
  }
  // ---- layout guardado: o desenho do cérebro só depende do edital; calcula uma vez e guarda no aparelho ----
  chaveLayout() {
    const sig = 'L1|' + this.gals.map(g => g.id + ':' + g.nome + ':' + g.peso.toFixed(6) + ':' + g.temas.map(t => t.id + '@' + t.peso.toFixed(6)).join(',')).join('|');
    let h = 2166136261; for (let i = 0; i < sig.length; i++) { h ^= sig.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0).toString(36) + sig.length.toString(36);
  }
  exportarLayout() {
    const u8 = new Uint8Array(this.reg.buffer); let bin = '';
    for (let i = 0; i < u8.length; i += 8192) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 8192));
    const d = {}, t = {};
    this.gals.forEach(g => d[g.id] = { cx: g.cx, cy: g.cy, polo: g.polo, dentro: g.dentro, reserva: g.reserva, linhas: g.linhas });
    this.temas.forEach(x => t[x.id] = [x.bx, x.by]);
    return { v: 'L1', n: cerGrade().cel.length, reg: btoa(bin), m: cerMascara(), d, t };
  }
  aplicarLayout(c) {
    try {
      if (!c || c.v !== 'L1') return false;
      if (!cerGradeCache && c.m) { const g = cerGradeDeMascara(c.m); if (g.cel.length === c.n) cerGradeCache = g; }
      const { cel } = cerGrade(); if (c.n !== cel.length) return false;
      const bin = atob(c.reg), u8 = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
      const reg = new Int16Array(u8.buffer); if (reg.length !== cel.length) return false;
      if (this.gals.some(g => !c.d[g.id]) || this.temas.some(x => !c.t[x.id])) return false;
      this.reg = reg;
      const por = this.gals.map(() => []); for (let ci = 0; ci < cel.length; ci++) { const k = reg[ci]; if (por[k]) por[k].push({ x: cel[ci].x, y: cel[ci].y, d: 0, ci }); }
      this.gals.forEach((g, k) => { const L = c.d[g.id]; g.cel = por[k].length ? por[k] : [{ x: 500, y: 300, d: 0, ci: -1 }];
        g.cx = L.cx; g.cy = L.cy; g.polo = L.polo; g.dentro = L.dentro; g.reserva = L.reserva; g.linhas = L.linhas || [g.curto]; });
      this.temas.forEach(x => { x.bx = c.t[x.id][0]; x.by = c.t[x.id][1]; });
      this.gals.forEach(g => this.derivar(g));
      return true;
    } catch (e) { return false; }
  }
  // enquadramento do cérebro + nomes de fora (em cima/embaixo no celular, nas laterais no desktop e no story)
  telaB([x, y]) { return [(x - this.camB.x) * this.camB.s + this.W / 2, (y - this.camB.y) * this.camB.s + this.H / 2]; }
  montarTela() {
    const bw = 820, bh = 668, bcx = 507, bcy = 381, topo = this.topo(), base = this.base(), livreH = this.H - topo - base, fs = this.fs, ctx = this.ctx;
    if (this.opts.mini) { // HOJE (15/10): versão pequena, sem os nomes em volta; o cérebro ocupa o quadro inteiro
      this.rotulos = []; this.sB = Math.max(.05, Math.min((this.W - 16) / bw, (livreH - 8) / bh));
      this.camB = { s: this.sB, x: bcx, y: bcy - (topo + livreH / 2 - this.H / 2) / this.sB }; return; }
    this.gals.forEach(g => { ctx.font = this.fonteNome(); g.lw = ctx.measureText(g.curto).width + 6; g.lh = (this.celular() ? 16 : 18) * fs; });
    const fora = this.gals.filter(g => !g.dentro); this.rotulos = [];
    if (this.celular()) {
      const ord = [...fora].sort((a, b) => a.polo[1] - b.polo[1]), cima = ord.slice(0, Math.ceil(ord.length / 2)), baixo = ord.slice(Math.ceil(ord.length / 2)), lh = 20 * fs;
      let lc = cima.length ? 1 : 0, lb = baixo.length ? 1 : 0;
      for (let pass = 0; pass < 3; pass++) {
        const LT = lc * lh + 10 * fs, LB = lb * lh + 10 * fs;
        this.sB = Math.max(.05, Math.min((this.W - 18 * fs) / bw, (livreH - LT - LB) / bh));
        const topoCer = topo + LT + (livreH - LT - LB - bh * this.sB) / 2;
        this.camB = { s: this.sB, x: bcx, y: bcy - ((topoCer + bh * this.sB / 2) - this.H / 2) / this.sB };
        const colocar = (lista, lado) => { const filas = [], out = [];
          [...lista].sort((a, b) => a.polo[0] - b.polo[0]).forEach(g => { const [px] = this.telaB(g.polo);
            let x = cosmoClamp(px - g.lw / 2, 6 * fs, this.W - 6 * fs - g.lw), fila = -1;
            const livre = (oc, x2) => !oc.some(([a, b]) => x2 < b + 8 * fs && x2 + g.lw > a - 8 * fs);
            for (let f = 0; f < 4 && fila < 0; f++) { const oc = filas[f] || []; if (livre(oc, x)) fila = f;
              else for (const dx of [-24, 24, -48, 48]) { const x2 = cosmoClamp(x + dx * fs, 6 * fs, this.W - 6 * fs - g.lw); if (livre(oc, x2)) { x = x2; fila = f; break; } } }
            if (fila < 0) fila = 3; (filas[fila] = filas[fila] || []).push([x, x + g.lw]); out.push({ g, x, fila, lado }); });
          return { out, n: lista.length ? filas.length : 0 }; };
        const c = colocar(cima, 'c'), b = colocar(baixo, 'b'), ok = c.n === lc && b.n === lb; lc = c.n; lb = b.n;
        if (ok || pass === 2) { const yT = (bcy - bh / 2 - this.camB.y) * this.sB + this.H / 2, yB = (bcy + bh / 2 - this.camB.y) * this.sB + this.H / 2;
          this.rotulos = [...c.out.map(o => ({ ...o, y: yT - 8 * fs - (o.fila + 1) * lh + 2 * fs })), ...b.out.map(o => ({ ...o, y: yB + 8 * fs + o.fila * lh }))]; break; }
      }
    } else {
      const colW = fora.length ? Math.max(...fora.map(g => g.lw)) + 40 * fs : 30 * fs;
      this.sB = Math.max(.05, Math.min((this.W - 2 * colW - 40 * fs) / bw, (livreH - 20 * fs) / bh));
      this.camB = { s: this.sB, x: bcx, y: bcy - (topo + livreH / 2 - this.H / 2) / this.sB };
      const ord = [...fora].sort((a, b) => a.polo[0] - b.polo[0]), metade = Math.ceil(ord.length / 2);
      const xE = (bcx - bw / 2 - this.camB.x) * this.sB + this.W / 2 - 18 * fs, xD = (bcx + bw / 2 - this.camB.x) * this.sB + this.W / 2 + 18 * fs;
      [[ord.slice(0, metade), 'e'], [ord.slice(metade), 'd']].forEach(([lista, lado]) => {
        let ult = topo + 4; const pos = [...lista].sort((a, b) => a.polo[1] - b.polo[1]).map(g => { const [, py] = this.telaB(g.polo);
          const y = Math.max(py - g.lh / 2, ult); ult = y + g.lh + 10 * fs; return { g, y, lado, x: lado === 'e' ? xE - g.lw : xD }; });
        const exc = ult - (this.H - base - 4); if (exc > 0) pos.forEach(p => p.y -= exc); this.rotulos.push(...pos); });
    }
  }
  // camada fixa (corpo, tom das regiões, sulcos, fissuras, cerebelo, contorno), refeita só quando o tamanho muda
  desenharBase() {
    if (!this.gals.length) { this.baseC = null; this.tinta = null; return; }
    const k = this.sB * this.dpr, M = CER_MUNDO, { cel } = cerGrade(), GR = CER_GR, px = 1 / this.sB;
    const novo = () => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil((M.x1 - M.x0) * k)); c.height = Math.max(1, Math.ceil((M.y1 - M.y0) * k)); return c; };
    const base = novo(), b = base.getContext('2d'); b.setTransform(k, 0, 0, k, -M.x0 * k, -M.y0 * k);
    b.save(); b.shadowColor = 'rgba(80,140,255,.55)'; b.shadowBlur = 26 * this.dpr * this.fs; b.fillStyle = '#081226'; b.fill(CER_PATH_C); b.restore(); // 30/09: sem cerebelo e tronco (pedido da equipe)
    const tint = novo(), t = tint.getContext('2d'); t.setTransform(k, 0, 0, k, -M.x0 * k, -M.y0 * k);
    this.gals.forEach(g => { if (!g.expl) return; t.fillStyle = g.tom; t.globalAlpha = .08 + .17 * g.frac; g.cel.forEach(c => t.fillRect(c.x - GR / 2 - .3, c.y - GR / 2 - .3, GR + .6, GR + .6)); });
    const tinta = novo(); { const tt = tinta.getContext('2d'); tt.filter = `blur(${Math.max(2.5 * this.dpr, GR * k * 1.3)}px)`; tt.drawImage(tint, 0, 0); }
    b.save(); b.clip(CER_PATH_C); const rg = cosmoRng('giros'); b.strokeStyle = 'rgba(165,190,240,.13)'; b.lineWidth = 1.4 * px * this.fs; b.lineCap = 'round';
    for (let n = 0; n < 95; n++) { let x = 120 + rg() * 780, y = 55 + rg() * 500, a = rg() * 6.28; b.beginPath(); b.moveTo(x, y);
      for (let s = 0; s < 14; s++) { a += (rg() - .5) * 1.6; const nx = x + Math.cos(a) * 20, ny = y + Math.sin(a) * 20; b.quadraticCurveTo(x + Math.cos(a + .8) * 10, y + Math.sin(a + .8) * 10, nx, ny); x = nx; y = ny; }
      b.stroke(); }
    b.restore();
    b.strokeStyle = 'rgba(170,195,245,.26)'; b.lineWidth = 2 * px * this.fs; b.lineCap = 'round'; [CER_SYL, CER_CEN].forEach(p => b.stroke(cerPath(p, false)));
    b.strokeStyle = 'rgba(130,175,255,.6)'; b.lineWidth = 1.6 * px * this.fs; b.stroke(CER_PATH_C);
    this.baseC = base; this.tinta = tinta;
  }
  // disciplina aberta: o desenho da região ampliado, com os nomes curtos empurrados só o suficiente para não encostarem
  layoutAberta(g) {
    const LW = this.W - (this.celular() ? 28 : 120) - this.direita(), LH = this.H - this.topo() - this.base() - (this.celular() ? 6 : 30), ctx = this.ctx, nos = [];
    ctx.font = this.fonteTema(); const est = ctx.measureText('★ ').width;
    g.temas.forEach(t => { t.w = ctx.measureText(t.rot).width + (t.freq >= 3 ? est : 0); t.r = 3.4 + 5.4 * Math.sqrt(t.peso / .03); t.b = { x0: -t.r - 4, x1: t.r + 8 + t.w + 2, y0: -11, y1: 11 }; });
    const wm = g.temas.reduce((s, t) => s + t.w, 0) / g.temas.length, ax = Math.max(60, (LW - wm - 30) / 2), ay = Math.max(40, LH / 2 - 26), desl = -wm * .42;
    g.temas.forEach(t => { t.tx = t.u * ax + desl; t.ty = t.v * ay; t.lx = t.tx; t.ly = t.ty; nos.push(t); });
    for (let k = 0, it = 600; k < it; k++) { const mola = .06 * (1 - k / it) + .01;
      nos.forEach(p => { p.lx += (p.tx - p.lx) * mola; p.ly += (p.ty - p.ly) * mola; });
      for (let i = 0; i < nos.length; i++) for (let j = i + 1; j < nos.length; j++) { const A = nos[i], B = nos[j];
        const ax0 = A.lx + A.b.x0 - 3, ax1 = A.lx + A.b.x1 + 3, ay0 = A.ly + A.b.y0 - 3, ay1 = A.ly + A.b.y1 + 3, bx0 = B.lx + B.b.x0, bx1 = B.lx + B.b.x1, by0 = B.ly + B.b.y0, by1 = B.ly + B.b.y1;
        const ox = Math.min(ax1, bx1) - Math.max(ax0, bx0), oy = Math.min(ay1, by1) - Math.max(ay0, by0); if (ox <= 0 || oy <= 0) continue;
        if (ox < oy) { const d = Math.sign((ax0 + ax1) - (bx0 + bx1)) || 1; A.lx += d * ox / 2; B.lx -= d * ox / 2; } else { const d = Math.sign((ay0 + ay1) - (by0 + by1)) || 1; A.ly += d * oy / 2; B.ly -= d * oy / 2; } }
      nos.forEach(p => { p.lx = cosmoClamp(p.lx, -LW / 2 - p.b.x0, LW / 2 - p.b.x1); p.ly = cosmoClamp(p.ly, -LH / 2 - p.b.y0, LH / 2 - p.b.y1); }); }
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; nos.forEach(p => { x0 = Math.min(x0, p.lx + p.b.x0); x1 = Math.max(x1, p.lx + p.b.x1); y0 = Math.min(y0, p.ly + p.b.y0); y1 = Math.max(y1, p.ly + p.b.y1); });
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2; nos.forEach(p => { p.lx -= cx; p.ly -= cy; });
    g.arGal = cosmoArvore(g.temas, t => t.lx, t => t.ly);
  }
  // ---- câmera ----
  sAberta() { return this.sB * 3.2; }
  camAberta(g) { const s = this.sAberta(); return { x: g.cx + this.direita() / 2 / s, y: g.cy - this.meio() / s, s }; }
  posTema(t) { const f = t.g === this.sel && t.lx != null ? this.fade : 0; if (!f) return [t.bx, t.by]; const s = this.sAberta();
    return [t.bx * (1 - f) + (t.g.cx + t.lx / s) * f, t.by * (1 - f) + (t.g.cy + t.ly / s) * f]; }
  raio(t) { const f = t.g === this.sel && t.r != null ? this.fade : 0, rb = t.rb * (this.celular() ? 1 : 1.4) * this.fs; return f ? rb * (1 - f) + t.r * f : rb; }
  tela(x, y) { return [(x - this.cam.x) * this.cam.s + this.W / 2, (y - this.cam.y) * this.cam.s + this.H / 2]; }
  irPara(c1, ax, ay) { this.alvo = { ...c1 }; this.anim = { c0: { ...this.cam }, c1: { ...c1 }, ax, ay, t0: performance.now(), ms: 700 }; }
  redimensionar(forcar) {
    const w = this.cv.clientWidth, h = this.cv.clientHeight; if (!w || !h) return;
    if (!forcar && w === this.W && h === this.H) return;
    this.W = w; this.H = h; this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.cv.width = w * this.dpr; this.cv.height = h * this.dpr;
    if (!this.gals.length) return;
    this.montarTela(); this.desenharBase();
    if (this.modo === 'aberta' && this.sel) this.layoutAberta(this.sel);
    this.alvo = this.modo === 'aberta' && this.sel ? this.camAberta(this.sel) : { ...this.camB }; this.cam = { ...this.alvo }; this.anim = null;
    if (this.selTema) this.ajustarFoco();
  }
  // ---- navegação ----
  abrir(g) {
    this.intro = null; this.modo = 'aberta'; this.sel = g; this.selTema = null; this.fadeAlvo = 1;
    this.opts.onModo && this.opts.onModo('aberta', g); // o título muda antes: a área útil depende da altura dele
    this.layoutAberta(g); this.irPara(this.camAberta(g), g.cx, g.cy);
    this.opts.onTema && this.opts.onTema(null);
  }
  voltar() {
    const g = this.sel; if (!g) return;
    this.modo = 'cerebro'; this.selTema = null; this.fadeAlvo = 0;
    this.opts.onModo && this.opts.onModo('cerebro', null); this.opts.onTema && this.opts.onTema(null);
    this.montarTela(); this.irPara({ ...this.camB }, g.cx, g.cy);
    setTimeout(() => { if (this.modo === 'cerebro') this.sel = null; }, galSemMov() ? 0 : 750);
  }
  selecionar(n) {
    if (!n) { this.selTema = null; this.opts.onTema && this.opts.onTema(null);
      if (this.modo === 'aberta' && this.sel) { const c = this.camAberta(this.sel); if (this.anim) this.anim.c1 = c; else this.alvo = c; } return; }
    if (this.modo !== 'aberta' || n.g !== this.sel) this.abrir(n.g);
    this.selTema = n; this.opts.onTema && this.opts.onTema(n); this.ajustarFoco();
  }
  // no celular o cartão sobe por baixo: se o tema ficaria atrás dele, a disciplina sobe um pouco
  ajustarFoco() {
    const t = this.selTema, g = this.sel; if (!t || !g || t.lx == null) return;
    const c = this.camAberta(g), baixo = this.opts.ocupadoBaixo ? this.opts.ocupadoBaixo() : 0;
    if (baixo > 0) { const s = c.s, sy = (g.cy + t.ly / s - c.y) * s + this.H / 2, lim = this.H - baixo - 34; if (sy > lim) c.y += (sy - lim) / s; }
    if (this.anim) this.anim.c1 = c; else this.alvo = c;
  }
  tocar(e) {
    if (this.prontoEm && e.timeStamp && e.timeStamp < this.prontoEm) return; // clique dado durante a carga
    if (this.intro) { this.intro = null; return; } // toque pula a entrada
    const r = this.cv.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top;
    if (this.modo === 'cerebro') {
      const rb = this.rotulos.find(o => px >= o.x - 8 && px <= o.x + o.g.lw + 8 && py >= o.y - 6 && py <= o.y + o.g.lh + 6); if (rb) { this.abrir(rb.g); return; }
      const wx = (px - this.W / 2) / this.cam.s + this.cam.x, wy = (py - this.H / 2) / this.cam.s + this.cam.y;
      const i = Math.floor((wx - CER_GX0) / CER_GR), j = Math.floor((wy - CER_GY0) / CER_GR), { idx } = cerGrade();
      const v = (i >= 0 && j >= 0 && i < CER_NX && j < CER_NY) ? idx[j * CER_NX + i] : -1; if (v >= 0) this.abrir(this.gals[this.reg[v]]);
      return;
    }
    let t = null;
    this.sel.temas.forEach(o => { const [x, y] = this.tela(...this.posTema(o)); if (px >= x + o.b.x0 - 4 && px <= x + o.b.x1 + 2 && py >= y + o.b.y0 - 4 && py <= y + o.b.y1 + 4) t = o; });
    if (t) { this.selecionar(t); return; }
    if (this.selTema) this.selecionar(null);
  }
  // ---- entrada: contorno se desenha → cérebro aparece → onda de luz da frente para trás → nomes ----
  entrada(ms = 3000) {
    if (!ms || galSemMov() || !this.gals.length) { this.intro = null; return; }
    const xs = this.gals.map(g => g.cx), mn = Math.min(...xs), mx = Math.max(...xs), k = ms / 3000;
    this.temas.forEach(t => { t.atraso = k * (1150 + 1250 * (t.g.cx - mn) / ((mx - mn) || 1) + 260 * Math.hypot(t.bx - t.g.cx, t.by - t.g.cy) / 120 + cosmoHash(t.id) * 120); });
    this.intro = { t0: performance.now(), k, ms };
  }
  luz(t, ti) { return this.intro ? cosmoClamp((ti - t.atraso) / 220) : 1; }
  iniciar() { if (this.raf) return; let falhas = 0;
    const loop = () => { this.raf = requestAnimationFrame(loop); if (this.cv.offsetParent === null) return;
      try { this.quadro(); falhas = 0; } catch (e) { if (++falhas === 3) { registrarErro('cerebro_quadro: ' + e.message, e.stack); this.parar(); this.opts.onFalha && this.opts.onFalha(e); } } };
    loop(); }
  parar() { if (this.raf) cancelAnimationFrame(this.raf); this.raf = null; }
  quadro() {
    if (!this.W) this.redimensionar(true); if (!this.W || !this.gals.length || !this.baseC) return;
    const T = performance.now(), dt = Math.min(100, T - (this.tq || T)); this.tq = T;
    if (!this.leve && dt > 0 && (this.nq = (this.nq || 0) + 1) <= 90) { this.somaDt = (this.somaDt || 0) + dt;
      if (this.nq >= 40 && this.somaDt / this.nq > 33) { this.leve = true; tele('cerebro_modo_leve', { ms_quadro: Math.round(this.somaDt / this.nq) }); } }
    if (this.anim) { const A = this.anim, p = galSemMov() ? 1 : cosmoClamp((T - A.t0) / A.ms), e = 1 - Math.pow(1 - p, 3), s = Math.exp(Math.log(A.c0.s) * (1 - e) + Math.log(A.c1.s) * e);
      const sx0 = (A.ax - A.c0.x) * A.c0.s, sy0 = (A.ay - A.c0.y) * A.c0.s, sx1 = (A.ax - A.c1.x) * A.c1.s, sy1 = (A.ay - A.c1.y) * A.c1.s;
      this.cam = { s, x: A.ax - (sx0 + (sx1 - sx0) * e) / s, y: A.ay - (sy0 + (sy1 - sy0) * e) / s }; if (p >= 1) { this.cam = { ...A.c1 }; this.alvo = { ...A.c1 }; this.anim = null; } }
    else { const k = galSemMov() ? 1 : 1 - Math.exp(-dt / 110); ['x', 'y', 's'].forEach(c => this.cam[c] += (this.alvo[c] - this.cam[c]) * k); }
    this.fade += (this.fadeAlvo - this.fade) * (galSemMov() ? 1 : 1 - Math.exp(-dt / 150)); if (Math.abs(this.fadeAlvo - this.fade) < .002) this.fade = this.fadeAlvo;
    const ti = this.intro ? T - this.intro.t0 : 1e9; if (this.intro && ti > this.intro.ms) this.intro = null;
    const ctx = this.ctx; ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0); ctx.clearRect(0, 0, this.W, this.H);
    this.desenhar(ctx, this.intro ? ti : 1e9, T / 1000);
  }
  contornoParcial(ctx, p) {
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    [CER_C_PTS].forEach((pts, qi) => { const pp = cosmoClamp(p * 1.15 - qi * .25); if (pp <= 0) return; const n = Math.floor(pts.length * pp); if (n < 2) return;
      ctx.beginPath(); pts.slice(0, n + 1).forEach(([x, y], i) => { const [sx, sy] = this.tela(x, y); i ? ctx.lineTo(sx, sy) : ctx.moveTo(sx, sy); });
      ctx.shadowColor = 'rgba(110,170,255,.95)'; ctx.shadowBlur = this.leve ? 0 : 16; ctx.strokeStyle = 'rgba(170,205,255,.95)'; ctx.lineWidth = 2; ctx.stroke();
      const [hx, hy] = this.tela(...pts[Math.min(n, pts.length - 1)]); ctx.shadowBlur = 0; ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(cosmoSprite('#CFE3FF'), hx - 16, hy - 16, 32, 32); ctx.globalCompositeOperation = 'source-over'; });
    ctx.restore();
  }
  desenhar(ctx, ti, t) {
    const W = this.W, H = this.H, fs = this.fs, sm = galSemMov() || this.exp, k = this.intro ? this.intro.k : 1, fade = this.fade;
    this.fundo.forEach(([fx, fy, a, ph]) => { ctx.globalAlpha = a * .35 * (.7 + .3 * Math.sin(t * .8 + ph)) * cosmoClamp(ti / (600 * k)); ctx.fillStyle = '#AFC3E6'; ctx.fillRect(fx * W, fy * H, fs, fs); });
    // cérebro (camada fixa) — some quando a disciplina abre
    const aBase = cosmoClamp((ti - 750 * k) / (650 * k)) * (1 - .9 * fade);
    if (aBase > .01) { const M = CER_MUNDO, [x0, y0] = this.tela(M.x0, M.y0), [x1, y1] = this.tela(M.x1, M.y1);
      ctx.globalAlpha = aBase; ctx.drawImage(this.baseC, x0, y0, x1 - x0, y1 - y0);
      const aT = cosmoClamp((ti - 1250 * k) / (1500 * k)) * (1 - .9 * fade); if (this.tinta && aT > .01) { ctx.globalAlpha = aBase * aT; ctx.drawImage(this.tinta, x0, y0, x1 - x0, y1 - y0); }
      if (!sm && !this.leve) { // respiração: o contorno pulsa de leve (desligada no modo leve)
        ctx.globalAlpha = aBase * (.18 + .12 * Math.sin(t * 1.3)) * (1 - fade); ctx.save();
        ctx.setTransform(this.dpr * this.cam.s, 0, 0, this.dpr * this.cam.s, this.dpr * (W / 2 - this.cam.x * this.cam.s), this.dpr * (H / 2 - this.cam.y * this.cam.s));
        ctx.shadowColor = 'rgba(100,160,255,1)'; ctx.shadowBlur = 18 * this.dpr; ctx.strokeStyle = 'rgba(150,195,255,.9)'; ctx.lineWidth = 1.4 / this.cam.s; ctx.stroke(CER_PATH_C); ctx.restore(); }
      ctx.globalAlpha = 1; }
    if (this.intro && ti < 1500 * k) { const p = cosmoClamp(ti / (1100 * k)); this.contornoParcial(ctx, p * p * (3 - 2 * p)); }
    // sinapses e neurônios
    this.gals.forEach(g => {
      const aG = this.sel && g !== this.sel ? 1 - .96 * fade : 1; if (aG < .02) return; const fG = g === this.sel ? fade : 0, aparece = cosmoClamp((ti - 700 * k) / (600 * k));
      ctx.lineCap = 'round';
      [[g.arCer, 1 - fG, false], [fG > .01 ? g.arGal : null, fG, true]].forEach(([E, al, ab]) => { if (!E || al < .02) return;
        E.forEach(([p, q]) => { const [x1, y1] = this.tela(...this.posTema(p)), [x2, y2] = this.tela(...this.posTema(q));
          const ok = cosmoExpl(p.estado) && cosmoExpl(q.estado) && this.luz(p, ti) >= 1 && this.luz(q, ti) >= 1;
          if (ok) { const gr = ctx.createLinearGradient(x1, y1, x2, y2); gr.addColorStop(0, COSMO_COR[p.estado]); gr.addColorStop(1, COSMO_COR[q.estado]); ctx.strokeStyle = gr;
            ctx.globalAlpha = aG * al * (ab ? .22 : .2); ctx.lineWidth = (ab ? 7 : 4) * fs; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
            ctx.globalAlpha = aG * al * (ab ? .95 : .85); ctx.lineWidth = (ab ? 2.2 : 1.3) * fs; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
            if (!sm && !this.leve) { const u = ((t * (ab ? .32 : .25) + cosmoHash(p.id + q.id)) % 1), px = x1 + (x2 - x1) * u, py = y1 + (y2 - y1) * u, z = ab ? 11 : 6;
              ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = aG * al * Math.sin(Math.PI * u); ctx.drawImage(cosmoSprite('#FFFFFF'), px - z, py - z, z * 2, z * 2); ctx.globalCompositeOperation = 'source-over'; }
          } else { const est = (p.visto || cosmoExpl(p.estado)) && (q.visto || cosmoExpl(q.estado)); // os dois estudados: linha azulada
            ctx.globalAlpha = aG * al * (ab ? .55 : .32) * aparece * (est ? 1.35 : 1); ctx.strokeStyle = est ? '#6C9BDA' : '#6F7E99'; ctx.lineWidth = (ab ? 1.4 : .9) * fs; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); } });
      });
      ctx.globalCompositeOperation = 'lighter';
      g.temas.forEach(o => { if (cosmoExpl(o.estado) || !o.visto) return; const [x, y] = this.tela(...this.posTema(o)), gw = this.raio(o) * 5.6; // luz de estudo
        ctx.globalAlpha = aG * .8 * aparece; ctx.drawImage(cosmoSprite(COSMO_ESTUDO), x - gw, y - gw, gw * 2, gw * 2); });
      g.temas.forEach(o => { if (!cosmoExpl(o.estado)) return; const L = this.luz(o, ti); if (L <= 0) return; const [x, y] = this.tela(...this.posTema(o)), r = this.raio(o);
        const I = o.estado === 'dominado' ? 1 : o.estado === 'desenvolvimento' ? .55 + .35 * cosmoClamp(((o.forca_obs ?? 50) - 40) / 40) : .75 + .25 * (sm ? 1 : Math.sin(t * 3 + o.peso * 1e3));
        const flash = this.intro ? Math.sin(Math.PI * L) * 2.2 : 0, gw = r * (2.6 + 3.2 * I + flash * 2);
        ctx.globalAlpha = aG * cosmoClamp((.35 + .55 * I) * L + flash * .25); ctx.drawImage(cosmoSprite(COSMO_COR[o.estado]), x - gw, y - gw, gw * 2, gw * 2); });
      ctx.globalCompositeOperation = 'source-over';
      g.temas.forEach(o => { const [x, y] = this.tela(...this.posTema(o)), r = this.raio(o), L = cosmoExpl(o.estado) ? this.luz(o, ti) : 0, ex = L > 0;
        ctx.globalAlpha = aG * (ex ? 1 : .9 * aparece); ctx.fillStyle = ex ? COSMO_COR[o.estado] : o.visto ? '#6FA6EC' : CER_APAGADO; ctx.beginPath(); ctx.arc(x, y, ex || o.visto ? r : r * .8, 0, 6.29); ctx.fill();
        if (ex) { ctx.fillStyle = '#FFFFFF'; ctx.globalAlpha = aG * .75 * L; ctx.beginPath(); ctx.arc(x, y, r * .42, 0, 6.29); ctx.fill(); }
        else if (!o.visto && g === this.sel && fade > .5) { ctx.globalAlpha = aG * .8 * aparece; ctx.strokeStyle = '#56627A'; ctx.lineWidth = fs;
          ctx.beginPath(); ctx.arc(x, y, r * .8, 0, 6.29); ctx.stroke(); }
        if (o === this.selTema) { ctx.globalAlpha = 1; ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, r + 5 + (sm ? 0 : Math.sin(t * 4) * 1.2), 0, 6.29); ctx.stroke(); } });
      ctx.globalAlpha = 1;
    });
    // nomes das disciplinas: dentro da região quando cabe; os de fora com linha-guia
    const aRot = (1 - cosmoClamp(fade / .45)) * cosmoClamp((ti - 2250 * k) / (550 * k));
    if (aRot > .01) {
      ctx.lineJoin = 'round';
      this.gals.forEach(g => { if (!g.dentro) return; const [cx, cy] = this.tela(...g.dentro), L = g.linhas || [g.curto], lh = (this.celular() ? 13.5 : 15.5) * fs;
        ctx.globalAlpha = aRot; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 4.5 * fs; ctx.strokeStyle = 'rgba(4,7,14,.9)'; ctx.font = this.fonteNome();
        L.forEach((l, i) => { const y = cy + (i - (L.length - 1) / 2) * lh; ctx.strokeText(l, cx, y); ctx.fillStyle = g.expl ? '#FFFFFF' : '#7C889C'; ctx.fillText(l, cx, y); }); });
      this.rotulos.forEach(o => { const g = o.g, [px, py] = this.tela(...g.polo), cx = o.x + g.lw / 2;
        const ax = o.lado === 'e' ? o.x + g.lw + 4 * fs : o.lado === 'd' ? o.x - 4 * fs : cx, ay = o.lado === 'c' ? o.y + g.lh : o.lado === 'b' ? o.y - 2 : o.y + g.lh / 2;
        ctx.globalAlpha = aRot * (g.expl ? .55 : .3); ctx.strokeStyle = g.expl ? '#9FB4D6' : '#5A6680'; ctx.lineWidth = fs; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(px, py); ctx.stroke();
        ctx.globalAlpha = aRot; ctx.fillStyle = g.expl ? '#EAF2EC' : '#6E7A8E'; ctx.beginPath(); ctx.arc(px, py, 2.2 * fs, 0, 6.29); ctx.fill();
        const tx = o.lado === 'e' ? o.x + g.lw : o.lado === 'd' ? o.x : cx; ctx.textAlign = o.lado === 'e' ? 'right' : o.lado === 'd' ? 'left' : 'center'; ctx.textBaseline = 'top';
        ctx.lineWidth = 4 * fs; ctx.strokeStyle = 'rgba(4,7,14,.92)'; ctx.font = this.fonteNome(); ctx.strokeText(g.curto, tx, o.y); ctx.fillStyle = g.expl ? '#EAF2EC' : '#6E7A8E'; ctx.fillText(g.curto, tx, o.y); });
      ctx.textAlign = 'left'; ctx.globalAlpha = 1;
    }
    // nomes dos temas (disciplina aberta)
    if (this.sel && fade > .75) {
      const a = cosmoClamp((fade - .75) / .2); ctx.font = this.fonteTema(); ctx.textBaseline = 'middle'; ctx.lineJoin = 'round'; const est = ctx.measureText('★ ').width;
      this.sel.temas.forEach(o => { const [x, y] = this.tela(...this.posTema(o)), ex = cosmoExpl(o.estado); let lx = x + o.r + 8;
        ctx.globalAlpha = a * (ex ? 1 : .85); ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(4,7,14,.9)';
        if (o.freq >= 3) { ctx.strokeText('★', lx, y + .5); ctx.fillStyle = COSMO_OURO; ctx.fillText('★', lx, y + .5); lx += est; }
        ctx.strokeText(o.rot, lx, y + .5); ctx.fillStyle = o === this.selTema ? '#FFFFFF' : ex ? '#EAF2EC' : o.visto ? '#A9CBF5' : '#7A869A'; ctx.fillText(o.rot, lx, y + .5); });
      ctx.globalAlpha = 1;
    }
  }
  // story: o cérebro inteiro desenhado numa arte (fora da tela), sem mexer na visão atual
  exportar(ctx, W, H) {
    const s = { W: this.W, H: this.H, dpr: this.dpr, cam: this.cam, alvo: this.alvo, anim: this.anim, modo: this.modo, sel: this.sel, fade: this.fade, selTema: this.selTema,
      intro: this.intro, rotulos: this.rotulos, sB: this.sB, camB: this.camB, baseC: this.baseC, tinta: this.tinta };
    this.exp = true; this.W = W; this.H = H; this.dpr = 1; this.fs = Math.max(1, W / 440); this.modo = 'cerebro'; this.sel = null; this.fade = 0; this.selTema = null; this.intro = null;
    this.montarTela(); this.desenharBase(); this.cam = { ...this.camB }; this.desenhar(ctx, 1e9, 0);
    this.exp = false; this.fs = 1; Object.assign(this, s); this.montarTela(); this.cam = s.cam;
  }
}

