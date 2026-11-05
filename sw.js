// Dominei · service worker mínimo: só torna o app instalável. Nada é guardado em cache
// (o app sempre vem da rede: build novo aparece na hora, sem versão velha presa no celular).
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
