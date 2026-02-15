// ——— Journal Santé · Service Worker ———————————————————————
// Stratégie :
//   - Cache-first pour les assets statiques (JS, CSS, fonts, icônes)
//   - Network-first pour les appels API (données fraîches, fallback cache)
//   - Offline fallback page si tout échoue
// ——————————————————————————————————————————————————————————

const CACHE_VERSION = "v1";
const STATIC_CACHE = `sante-static-${CACHE_VERSION}`;
const API_CACHE = `sante-api-${CACHE_VERSION}`;

// Assets à pré-cacher à l'installation
const PRECACHE_URLS = [
  "/journal",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/offline.html",
];

// ——— INSTALL —————————————————————————————————————————————
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// ——— ACTIVATE ————————————————————————————————————————————
// Nettoyage des anciens caches lors d'une mise à jour
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== STATIC_CACHE && k !== API_CACHE)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ——— FETCH ———————————————————————————————————————————————
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-GET (POST, PUT, DELETE → toujours réseau)
  if (request.method !== "GET") return;

  // Appels API → network-first
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  // Fonts Google → cache-first (longue durée)
  if (
    url.hostname === "fonts.googleapis.com" ||
    url.hostname === "fonts.gstatic.com"
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Navigation (pages HTML) → network-first avec fallback offline
  if (request.mode === "navigate") {
    event.respondWith(networkFirstWithOffline(request));
    return;
  }

  // Tout le reste (JS, CSS, images) → cache-first
  event.respondWith(cacheFirst(request, STATIC_CACHE));
});

// ——— Stratégies ——————————————————————————————————————————

// Cache-first : sert depuis le cache, sinon réseau + mise en cache
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("Offline", { status: 503 });
  }
}

// Network-first : essaie le réseau, sinon cache
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response(JSON.stringify({ error: "offline" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Network-first pour navigation, avec page offline en dernier recours
async function networkFirstWithOffline(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    // Fallback : page offline
    const offlinePage = await caches.match("/offline.html");
    if (offlinePage) return offlinePage;

    return new Response(
      `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Hors ligne</title>
<style>
  body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center;
         background:#0a0f1a; color:#dce4ed; font-family:-apple-system,sans-serif; text-align:center; }
  h1 { font-size:20px; margin-bottom:8px; }
  p  { color:#5e7490; font-size:14px; }
</style></head>
<body><div><h1>📡 Hors ligne</h1><p>Vérifie ta connexion et réessaie.</p></div></body>
</html>`,
      { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }
}
