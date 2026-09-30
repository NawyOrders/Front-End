/**
 * Motion runtime — the browser-side plumbing behind src/styles/motion.css.
 *
 * Four jobs, all of them deliberately outside React:
 *
 *   1. ONE shared IntersectionObserver for every reveal on the page.
 *   2. A MutationObserver that registers `data-reveal` nodes as they appear, so
 *      anything mounted late (a tab, a toggle, a lazy section, the next route)
 *      is still revealed.
 *   3. ONE passive scroll listener + rAF that writes `--scroll` and `--p`.
 *   4. ONE passive pointermove + rAF that writes `--mx` / `--my` (spotlight)
 *      and drives the tilt hook.
 *
 * Everything a component needs is a CSS custom property on a DOM node, so no
 * scroll or mousemove can ever cause a render.
 */

/* --- environment ---------------------------------------------------------- */

/** Read lazily, never at module scope: these are used inside effects. */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Desktop-grade pointer: the gate for tilt, spotlight and parallax. */
export const canPointFine = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 768px)").matches;

export const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** Count-up easing. */
export const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/* --- text splitting -------------------------------------------------------- */

/**
 * Split a string into WORDS, keeping the whitespace out of the animated nodes.
 *
 * Arabic is cursive: splitting by letter would break the joins between
 * characters, so this never splits inside a word. The space between two words
 * is a plain text node between two inline-block spans, which is exactly what
 * the browser needs to keep shaping each word correctly.
 */
export const splitWords = (text: string): string[] =>
  text.split(/\s+/u).filter((word) => word.length > 0);

/* --- shared IntersectionObserver ------------------------------------------- */

/**
 * One observer for the whole site. A single threshold/rootMargin pair is the
 * whole configuration; anything that needs a different rule reveals its
 * children from the one entry instead of registering more targets.
 */
const OBSERVER_OPTIONS: IntersectionObserverInit = {
  threshold: 0.2,
  rootMargin: "0px 0px -10% 0px",
};

/** How long an on-screen element may stay hidden before it is revealed anyway. */
const SAFETY_MS = 1500;

type RevealHandler = () => void;

let observer: IntersectionObserver | null = null;
const handlers = new Map<Element, RevealHandler>();

/** Every element the shared observer is already responsible for. */
const tracked = new WeakSet<Element>();

function sharedObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const handler = handlers.get(entry.target);
        if (handler) handler();
      }
    },
    OBSERVER_OPTIONS,
  );
  return observer;
}

/**
 * Register `element` with the shared observer and return an unsubscribe.
 *
 * The hit adds `.is-in` and unregisters immediately: a reveal is once-only, so
 * scrolling back up never replays it and the element stops being a target.
 * Everything that needs a different rule than the shared threshold is handled
 * by observing the right element, never by loosening the observer.
 */
export function observeReveal(element: Element, onEnter: RevealHandler = () => {}): () => void {
  const io = sharedObserver();
  // Already revealed — a node that was moved rather than recreated. Registering
  // it again would replay its entrance, and replay the count-up with it.
  if (element.classList.contains("is-in")) return () => {};
  tracked.add(element);

  let done = false;
  let safety = 0;

  const finish = () => {
    if (done) return;
    done = true;
    window.clearTimeout(safety);
    onEnter();
    element.classList.add("is-in");
    io.unobserve(element);
    handlers.delete(element);
    tracked.delete(element);
  };

  // Safety net. If the element is on screen and the observer has still not
  // fired after 1.5s — a zero-height box, a clipped ancestor, a node that
  // mounted inside a tab after the sweep — reveal it anyway. Content must never
  // be able to stay invisible because a box the observer cannot measure.
  window.clearTimeout(safety);
  safety = window.setTimeout(() => {
    const rect = element.getBoundingClientRect();
    const onScreen = rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0;
    if (onScreen) finish();
  }, SAFETY_MS);

  handlers.set(element, finish);
  io.observe(element);

  return () => {
    done = true;
    window.clearTimeout(safety);
    io.unobserve(element);
    handlers.delete(element);
    tracked.delete(element);
  };
}

/* --- automatic discovery --------------------------------------------------- */

/**
 * `data-reveal` opts an element into the shared observer without a ref.
 *
 * This is what covers nodes that appear after the first paint: a tab, a
 * toggle, a lazy section, or the next route's content. A MutationObserver
 * watches the document and registers whatever shows up, so a late mount can
 * never end up stuck at its hidden start state because nothing was watching
 * for it. Elements the React hooks already observe are skipped via `tracked`.
 */
const REVEAL_SELECTOR = "[data-reveal]";

/**
 * Register the `data-reveal` nodes in `node`'s subtree, skipping ones already
 * handled — by a ref hook, by an earlier sweep, or because they are revealed.
 * Recurses through any node type (Document, DocumentFragment, text nodes) so
 * the initial sweep can start from `document` itself.
 */
function sweep(node: Node): void {
  if (node instanceof Element) {
    if (node.matches(REVEAL_SELECTOR) && !tracked.has(node) && !node.classList.contains("is-in")) {
      observeReveal(node);
    }
    node.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
      if (!tracked.has(el) && !el.classList.contains("is-in")) observeReveal(el);
    });
    return;
  }
  node.childNodes.forEach(sweep);
}

let autoRefs = 0;
let autoObserver: MutationObserver | null = null;

/** Mounted once, by MotionRoot. */
export function startAutoReveal(): () => void {
  autoRefs += 1;
  if (autoRefs === 1) {
    sweep(document);
    autoObserver = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach(sweep);
      }
    });
    autoObserver.observe(document.documentElement, { childList: true, subtree: true });
  }
  return () => {
    autoRefs -= 1;
    if (autoRefs > 0) return;
    autoObserver?.disconnect();
    autoObserver = null;
  };
}

/* --- scroll engine --------------------------------------------------------- */

/**
 * `--p` progress targets. Kept as a Set rather than React state: the fan and
 * the parallax shapes read it straight off their own inline style.
 */
const progressTargets = new Set<HTMLElement>();

let scrollRefs = 0;
let scrollFrame = 0;

function paintScroll() {
  scrollFrame = 0;

  const root = document.documentElement;
  const scrollable = root.scrollHeight - window.innerHeight;
  root.style.setProperty("--scroll", scrollable > 0 ? clamp01(window.scrollY / scrollable).toFixed(4) : "0");

  if (progressTargets.size === 0) return;
  const viewport = window.innerHeight;
  for (const el of progressTargets) {
    const rect = el.getBoundingClientRect();
    // 0 when the element's top touches the viewport bottom, 1 when its bottom
    // passes the viewport top.
    const travel = rect.height + viewport;
    el.style.setProperty("--p", travel > 0 ? clamp01(1 - (rect.top + rect.height) / travel).toFixed(4) : "0");
  }
}

function onScroll() {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(paintScroll);
}

function acquireScroll() {
  scrollRefs += 1;
  if (scrollRefs === 1) {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();
  }
  return () => {
    scrollRefs -= 1;
    if (scrollRefs > 0) return;
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
    cancelAnimationFrame(scrollFrame);
    scrollFrame = 0;
  };
}

/* --- pointer engine -------------------------------------------------------- */

/**
 * Card spotlight. One window-level listener, one closest() lookup: whichever
 * card the pointer is over gets `--mx` / `--my`, nobody else is touched.
 */
function attachSpotlight() {
  let queued = 0;
  let event: PointerEvent | null = null;

  const paint = () => {
    queued = 0;
    const source = event;
    event = null;
    if (!source) return;
    const target = source.target;
    if (!(target instanceof Element)) return;
    const card = target.closest<HTMLElement>(".card, .lift");
    if (!card) return;
    const rect = card.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    card.style.setProperty("--mx", `${(((source.clientX - rect.left) / rect.width) * 100).toFixed(2)}%`);
    card.style.setProperty("--my", `${(((source.clientY - rect.top) / rect.height) * 100).toFixed(2)}%`);
  };

  const onMove = (e: PointerEvent) => {
    event = e;
    if (queued) return;
    queued = requestAnimationFrame(paint);
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  return () => {
    window.removeEventListener("pointermove", onMove);
    cancelAnimationFrame(queued);
  };
}

let spotlightRefs = 0;
let spotlightOff: (() => void) | null = null;

export function acquireSpotlight(): () => void {
  spotlightRefs += 1;
  if (spotlightRefs === 1 && canPointFine()) {
    spotlightOff = attachSpotlight();
  }
  return () => {
    spotlightRefs -= 1;
    if (spotlightRefs > 0) return;
    spotlightOff?.();
    spotlightOff = null;
  };
}

/* --- shared frame loop ------------------------------------------------------ */

/**
 * One rAF loop for the pointer-driven effects. It runs only while something is
 * easing — `wake()` extends a short idle window — so an idle page costs nothing.
 */
type FrameTask = () => void;

const tasks = new Set<FrameTask>();
let frame = 0;
let idleUntil = 0;

function tick() {
  frame = 0;
  for (const task of tasks) task();
  if (performance.now() < idleUntil) frame = requestAnimationFrame(tick);
}

export function onFrame(task: FrameTask): () => void {
  tasks.add(task);
  wake();
  return () => {
    tasks.delete(task);
  };
}

export function wake(ms = 400) {
  const until = performance.now() + ms;
  if (until > idleUntil) idleUntil = until;
  if (!frame) frame = requestAnimationFrame(tick);
}

/* --- exports used by the hooks --------------------------------------------- */

export function startScroll() {
  return acquireScroll();
}

export function trackProgress(element: HTMLElement): () => void {
  progressTargets.add(element);
  onScroll(); // paint it immediately, in case the page is already scrolled
  return () => {
    progressTargets.delete(element);
  };
}