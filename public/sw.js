/*
 * Nawy Order — service worker.
 *
 * Hand-written on purpose: no next-pwa, no serwist, no workbox. Three jobs, and
 * nothing else is allowed to be cached:
 *
 *   1. precache the offline shell + the two install icons, so a cold offline
 *      start still has something to show;
 *   2. navigations go to the network first and fall back to the offline shell
 *      only when the network is gone;
 *   3. build output, images and fonts are served stale-while-revalidate.
 *
 * HTML is deliberately NEVER written to the cache. The site reveals its content
 * through IntersectionObserver-driven entrances and renders a phone mockup from
 * component state; a cached document would serve a stale, mismatched tree, so
 * the offline shell is the only HTML the browser ever gets from the cache.
 *
 * Bump CACHE to invalidate everything at once; `activate` drops every other
 * cache it finds.
 */

const CACHE = "app-v5";
const OFFLINE_URL = "/offline.html";

/* Paths are absolute, so they resolve against the "/" scope regardless of which
 * locale's page registered us. */
const PRECACHE = [OFFLINE_URL, "/icons/icon-192.png", "/icons/icon-512.png"];

/* Static, cacheable, and safe to revalidate in the background: the hashed build
 * output plus the brand's own images and fonts. */
const ASSET = /\.(?:png|jpe?g|webp|avif|svg|ico|woff2?|ttf|otf)$/i;

/* Only reached if the precached shell was evicted, so the browser gets a real
 * response instead of a network error. */
const LAST_RESORT = `<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#FFF7EA;color:#0F2A47;font:16px/1.7 system-ui,sans-serif;text-align:center"><p>مفيش اتصال &middot; No connection</p></body></html>`;

/** Same-origin, cacheable, successful. Everything else is passed through. */
function cacheable(response) {
  return !!response && response.ok && response.status === 200 && response.type === "basic";
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      // allSettled, not addAll: one missing file must not cost us the whole
      // install, because then there would be no offline shell either.
      .then((cache) => Promise.allSettled(PRECACHE.map((url) => cache.add(url))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // POST/PUT/DELETE and every cross-origin request (the Google Form, the font
  // CDN if it ever moves) are none of our business.
  if (request.method !== "GET") return;
  if (new URL(request.url).origin !== self.location.origin) return;

  // Documents: network first, offline shell on failure, nothing cached. The
  // RSC payloads the App Router fetches for client-side navigation are NOT
  // navigations and fall through untouched below.
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }

  if (request.url.includes("/_next/static/") || ASSET.test(new URL(request.url).pathname)) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Everything else — API routes, RSC prefetches, any future non-asset request
  // — is left to the network exactly as it was.
});

async function networkFirst(request) {
  try {
    return await fetch(request);
  } catch {
    const shell = await caches.match(OFFLINE_URL);
    return shell || new Response(LAST_RESORT, { headers: { "Content-Type": "text/html; charset=utf-8" } });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);

  const fresh = fetch(request)
    .then((response) => {
      if (cacheable(response)) cache.put(request, response.clone());
      return response;
    })
    .catch(() => undefined);

  // A stale hit is returned immediately; the refetch above settles on its own
  // for the next load. Only a cold miss waits for the network.
  return cached || (await fresh) || Response.error();
}
