// Dominei · folha "Instale o app" (05/11/2026) — mesma folha do hub da Revolução (/app/instalar.js de 27/10), com a cara do Dominei.
// Só roda em dominei.app (e no preview local). Em revolucaodoestudo.com.br/dominei quem manda é a folha do hub (um app só para as 3 plataformas).
// O navegador não instala sozinho: exige um toque da pessoa. A folha aparece em todo acesso pelo celular até o app estar instalado
// (aberto pelo ícone = tela "standalone" = a folha nunca aparece).
// Diferença para o hub: só aparece com o aluno JÁ DENTRO do app (edital escolhido) — nunca na entrada, no cadastro, no convite nem na escolha do edital.
// O index.html avisa com window.__pwaDentro = true + window.__pwaAbrir().
// Conferir sem celular: ?instalar=android|ios|navegador (&nav=chrome|firefox|edge|opera no iPhone).
(function () {
  if (window.__pwaFolha) return; window.__pwaFolha = true;
  var UA = navigator.userAgent, q = new URLSearchParams(location.search), debug = q.get('instalar') || '';
  var BASE = new URL('.', document.currentScript ? document.currentScript.src : location.href).href; // pasta onde o app mora (raiz em dominei.app)
  var standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  var ios = /iPhone|iPad|iPod/.test(UA) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var inApp = /Instagram|FBAN|FBAV|FB_IAB|Line\//i.test(UA);
  var mobile = ios || /Android/i.test(UA);
  var navIos = q.get('nav') || (/CriOS/.test(UA) ? 'chrome' : /FxiOS/.test(UA) ? 'firefox' : /EdgiOS/.test(UA) ? 'edge' : /OPiOS|OPT\//.test(UA) ? 'opera' : 'safari');
  var ONDE = { safari: 'na barra de baixo do Safari', chrome: 'no canto da barra de endereço do Chrome', firefox: 'no menu ≡ do Firefox', edge: 'no menu ⋯ do Edge', opera: 'no menu do Opera' };
  var head = document.head;
  if ('serviceWorker' in navigator) navigator.serviceWorker.register(BASE + 'sw.js', { scope: new URL(BASE).pathname }).catch(function () {});
  if (!debug && (standalone || !mobile)) return;
  // a folha
  var CSS = '.pwa{position:fixed;inset:0;z-index:2147483000;background:rgba(3,7,16,.8);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:flex-end;justify-content:center;font-family:"Atkinson Hyperlegible",system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#EAF2EC;-webkit-font-smoothing:antialiased}' +
    '.pwa[hidden],.pwa-box [hidden]{display:none!important}' +
    '.pwa-box{width:100%;max-width:520px;background:#0A1322;border:1px solid rgba(132,170,214,.16);border-radius:22px 22px 0 0;padding:24px 20px calc(22px + env(safe-area-inset-bottom));text-align:center;animation:pwaUp .35s cubic-bezier(.2,.9,.3,1) both;box-sizing:border-box}' +
    '@media(min-width:640px){.pwa{align-items:center;padding:16px}.pwa-box{border-radius:22px;padding-bottom:22px}}' +
    '@keyframes pwaUp{from{transform:translateY(40px);opacity:0}to{transform:none;opacity:1}}' +
    '@media(prefers-reduced-motion:reduce){.pwa-box{animation:none}}' +
    '.pwa-box img{width:64px;height:64px;border-radius:16px;margin:0 auto 12px;display:block;box-shadow:0 8px 28px rgba(47,224,141,.22)}' +
    '.pwa-t{font-family:Archivo,inherit;font-variation-settings:"wdth" 105,"wght" 800;font-weight:800;font-size:22px;line-height:1.2}' +
    '.pwa-s{color:#9AA7BA;font-size:16px;margin:8px 0 16px;line-height:1.45}' +
    '.pwa-btn{display:block;width:100%;margin-top:4px;background:#2FE08D;color:#03170D;border:0;border-radius:14px;padding:16px 18px;font:inherit;font-weight:700;font-size:17px;cursor:pointer;box-shadow:0 8px 28px rgba(47,224,141,.24);min-height:52px}' +
    '.pwa-btn:active{transform:scale(.98)}' +
    '.pwa-ios{text-align:left;margin:0;padding:0 0 0 24px;color:#C6D0DC;font-size:16px;line-height:1.5}.pwa-ios li{margin:8px 0}.pwa-ios b{color:#EAF2EC}' +
    '.pwa-ios svg{width:18px;height:18px;vertical-align:-3px;color:#2FE08D}' +
    '.pwa-nav{color:#C6D0DC;font-size:16px;line-height:1.5;margin:0}.pwa-nav b{color:#EAF2EC}' +
    '.pwa-alt{color:#9AA7BA;font-size:14px;line-height:1.5;margin:12px 0 0}.pwa-alt b{color:#C6D0DC}.pwa-alt button{background:none;border:0;color:#2FE08D;font:inherit;text-decoration:underline;text-underline-offset:3px;cursor:pointer;padding:0}' +
    '.pwa-skip{display:block;margin:14px auto 0;background:none;border:0;color:#9AA7BA;font:inherit;font-size:14px;text-decoration:underline;text-underline-offset:3px;cursor:pointer;min-height:44px;padding:0 12px}' +
    'body.pwa-on{overflow:hidden}';
  var TXT = 'Abre com um toque, sem digitar endereço, direto no seu estudo de hoje.';
  var HTML = '<div class="pwa-box" role="dialog" aria-modal="true" aria-labelledby="pwaT">' +
    '<img src="' + BASE + 'img/icon-192.png" alt="" width="64" height="64">' +
    '<div class="pwa-t" id="pwaT">Instale o Dominei no seu celular</div>' +
    '<p class="pwa-s" id="pwaS">' + TXT + '</p>' +
    '<button class="pwa-btn" id="pwaBtn" type="button" hidden>Instalar o app</button>' +
    '<ol class="pwa-ios" id="pwaIos" hidden>' +
    '<li>Toque em <b>Compartilhar</b> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7"/></svg> <span id="pwaOnde"></span></li>' +
    '<li>Role a lista e toque em <b>Adicionar à Tela de Início</b></li>' +
    '<li>Toque em <b>Adicionar</b>. O ícone fica junto dos seus apps.</li></ol>' +
    '<p class="pwa-alt" id="pwaAlt" hidden>Não achou? Abra este endereço no <b>Safari</b> e instale por lá: <button type="button" id="pwaCopiar">copiar o link</button></p>' +
    '<p class="pwa-nav" id="pwaNav" hidden>Este navegador não instala apps. Toque nos três pontos (ou em <b>⋯</b>) e escolha <b>Abrir no navegador</b>. Lá, instale pelo botão.</p>' +
    '<button class="pwa-skip" id="pwaSkip" type="button">Continuar no navegador por agora</button></div>';
  var evt = null, box = null;
  function $(id) { return document.getElementById(id); }
  function montar() {
    if (box) return box;
    var st = document.createElement('style'); st.textContent = CSS; head.appendChild(st);
    box = document.createElement('div'); box.className = 'pwa'; box.id = 'pwa'; box.hidden = true; box.innerHTML = HTML; document.body.appendChild(box);
    $('pwaBtn').onclick = function () { if (!evt) return; evt.prompt(); evt.userChoice.then(function (r) { evt = null; if (!r || r.outcome !== 'accepted') esconder(); }, function () { evt = null; esconder(); }); };
    $('pwaSkip').onclick = function () { try { sessionStorage.setItem('pwa-depois', '1'); } catch (e) {} esconder(); };
    $('pwaCopiar').onclick = function () { var url = BASE; var b = $('pwaCopiar');
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { b.textContent = 'link copiado ✓'; }, function () { prompt('Copie o endereço:', url); }); else prompt('Copie o endereço:', url); };
    return box;
  }
  function mostrar(modo) {
    var run = function () { montar();
      $('pwaBtn').hidden = modo !== 'android'; $('pwaIos').hidden = modo !== 'ios'; $('pwaNav').hidden = modo !== 'navegador';
      $('pwaOnde').textContent = ONDE[navIos] || ONDE.safari; $('pwaAlt').hidden = !(modo === 'ios' && navIos !== 'safari');
      $('pwaS').textContent = modo === 'navegador' ? 'Para instalar, abra esta página no navegador do celular.' : TXT;
      box.hidden = false; document.body.classList.add('pwa-on'); };
    if (document.body) run(); else document.addEventListener('DOMContentLoaded', run);
  }
  function esconder() { if (box) { box.hidden = true; } document.body.classList.remove('pwa-on'); }
  function decidir() {
    if (debug) return mostrar(debug);
    if (!window.__pwaDentro) return; // só com o aluno dentro do app (edital escolhido)
    try { if (sessionStorage.getItem('pwa-depois')) return; } catch (e) {}
    if (inApp) return mostrar('navegador');
    if (ios) return mostrar('ios');
    if (evt) return mostrar('android'); // Android: só quando o Chrome avisa que dá para instalar (já instalado = não avisa)
  }
  window.__pwaAbrir = decidir;
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); evt = e; decidir(); });
  window.addEventListener('appinstalled', function () { evt = null; esconder(); });
  decidir();
})();
