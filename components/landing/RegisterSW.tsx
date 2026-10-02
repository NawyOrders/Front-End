"use client";

import { useEffect } from "react";

/**
 * Registers the hand-written /sw.js, once per page load.
 *
 * Production only: a service worker in dev would serve a stale precache and a
 * stale /_next/static/ tree over the top of hot reload, so the browser is never
 * even asked for it outside a production build. The guard is on
 * `process.env.NODE_ENV` rather than on the origin, so `next start` on
 * http://localhost still registers and can be tested in DevTools.
 *
 * Renders nothing — it exists purely for the effect. Mounted once, by
 * app/[locale]/layout.tsx, the layout that owns <body>.
 */
export function RegisterSW() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    // The registration is what makes /sw.js the controller for the whole
    // origin; "/" is the site root, which is also the manifest's scope.
    const register = () => {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
        // A failed registration is never fatal: the site works without it, and a
        // rejected install (private mode, quota, insecure context) must not
        // surface as an unhandled rejection.
      });
    };

    // Registering after `load` keeps the worker's own fetches off the critical
    // path, and defers it entirely when the visitor never finishes loading.
    if (document.readyState === "complete") register();
    else addEventListener("load", register, { once: true });

    return () => removeEventListener("load", register);
  }, []);

  return null;
}
