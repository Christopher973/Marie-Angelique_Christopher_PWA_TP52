// Importation des modules Workbox nécessaires
importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js"
);

// Configuration de Workbox
workbox.setConfig({
  debug: false, // Mettre à true pour le débogage
});

// Utilisation des modules Workbox
const { precacheAndRoute, cleanupOutdatedCaches } = workbox.precaching;
const { registerRoute } = workbox.routing;
const { StaleWhileRevalidate, CacheFirst, NetworkFirst } = workbox.strategies;
const { CacheableResponsePlugin } = workbox.cacheableResponse;
const { ExpirationPlugin } = workbox.expiration;

// Nom du cache pour les ressources dynamiques
const CACHE_NAME = "temperature-converter-cache-v1";

// Nettoyage des anciens caches
cleanupOutdatedCaches();

// Pré-cache des ressources statiques (sera rempli par Workbox lors de la génération)
precacheAndRoute(self.__WB_MANIFEST);

// Stratégie Cache First pour les ressources statiques (images, polices, etc.)
registerRoute(
  ({ request }) =>
    request.destination === "image" ||
    request.destination === "font" ||
    request.destination === "style",
  new CacheFirst({
    cacheName: CACHE_NAME + "-assets",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
      }),
    ],
  })
);

// Stratégie StaleWhileRevalidate pour le reste (HTML, JS)
// Cette stratégie répond avec le cache puis met à jour en arrière-plan
registerRoute(
  ({ request }) =>
    request.destination === "document" || request.destination === "script",
  new StaleWhileRevalidate({
    cacheName: CACHE_NAME + "-html-js",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// Stratégie NetworkFirst pour les API (au cas où vous en utiliseriez dans le futur)
registerRoute(
  ({ url }) => url.pathname.startsWith("/api/"),
  new NetworkFirst({
    cacheName: CACHE_NAME + "-api",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// Gestionnaire pour les ressources non trouvées (mode hors ligne)
workbox.routing.setCatchHandler(async ({ event }) => {
  // Pour les pages HTML, renvoyer la page hors ligne
  if (event.request.destination === "document") {
    return caches.match("/offline.html");
  }

  // Pour les autres types de ressources, afficher une erreur
  return Response.error();
});

// Écouteur d'événements pour la mise à jour du service worker
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
