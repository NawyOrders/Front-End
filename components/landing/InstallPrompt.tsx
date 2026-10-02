"use client";

import { useCallback, useEffect, useState } from "react";
import type { Dictionary } from "@/lib/i18n";

/* `beforeinstallprompt` is not in lib.dom.d.ts, so the event is typed here
   rather than widened to `any` at the call site. */
interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSED = "nawy:install-dismissed";

/** Already installed: the button would be a no-op, so it never renders. */
function isStandalone(): boolean {
  const nav = navigator as Navigator & { standalone?: boolean };
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    nav.standalone === true
  );
}

/**
 * The optional "Install the app" button.
 *
 * Chrome fires `beforeinstallprompt` only when the app is genuinely installable
 * (manifest + worker + icons all present), so that event is the whole feature
 * detection: the button is not rendered before it fires, and never at all in a
 * browser that cannot install (Firefox, Safari desktop, or iOS, where the prompt
 * is not exposed to the page).
 *
 * Dismissal — accepted or not — is remembered in localStorage, so the button
 * appears at most once per visitor. It is mounted in the footer's first column
 * so it adds no element to the navbar and changes no grid track.
 */
export function InstallPrompt({ dict }: { dict: Dictionary }) {
  const [event, setEvent] = useState<InstallPromptEvent | null>(null);

  useEffect(() => {
    if (isStandalone()) return;
    if (localStorage.getItem(DISMISSED) === "1") return;

    const onBeforeInstall = (native: Event) => {
      // Suppress the browser's own mini-infobar; this button is the site's.
      native.preventDefault();
      setEvent(native as InstallPromptEvent);
    };
    // The app was installed from somewhere else (the mini-infobar, the OS): the
    // worker is already gone by the time this fires, so just hide the button.
    const onInstalled = () => setEvent(null);

    addEventListener("beforeinstallprompt", onBeforeInstall);
    addEventListener("appinstalled", onInstalled);
    return () => {
      removeEventListener("beforeinstallprompt", onBeforeInstall);
      removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    if (!event) return;
    setEvent(null);
    try {
      await event.prompt();
      await event.userChoice;
    } catch {
      // A prompt that cannot be shown (user gesture lost, already running) is
      // not worth surfacing.
    } finally {
      // Remembered whether they accepted or closed it, so the footer never grows
      // the same button twice.
      try {
        localStorage.setItem(DISMISSED, "1");
      } catch {}
    }
  }, [event]);

  if (!event) return null;

  return (
    <button
      type="button"
      onClick={install}
      data-reveal
      className="btn-ghost reveal rv-fade mt-4 !min-h-10 !px-4"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3v10m0 0 3.5-3.5M12 13l-3.5-3.5M4 16v2.5A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5V16" />
      </svg>
      {dict.install.label}
    </button>
  );
}
