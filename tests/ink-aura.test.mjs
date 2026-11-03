import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../src/components/art/InkAura.tsx", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
}).outputText;

// Run the real effect with a deliberately stroke-only canvas. Any regression to
// pigment sprites, filled dots, masks, or gradients fails without a browser.
function mountAura({ mobile = false, reduced = false } = {}) {
  const callbacks = new Map();
  const listeners = new Map();
  const media = new Map();
  let nextFrame = 0;
  let draws = 0;
  let strokes = 0;
  let segments = 0;
  let cleanup;
  const context = {
    setTransform(...args) { this.transform = args; },
    clearRect() { draws++; },
    stroke() { strokes++; },
  };
  const canvas = { dataset: {}, getContext: () => context };
  const addEventListener = (name, callback) => listeners.set(name, callback);
  const removeEventListener = name => listeners.delete(name);
  const figure = {
    getBoundingClientRect: () => ({ left: mobile ? 30 : 800, top: 100 - window.scrollY, width: mobile ? 330 : 500, height: 760 }),
    closest: () => null,
    addEventListener,
    removeEventListener,
  };
  const document = {
    hidden: false,
    body: {},
    documentElement: { scrollHeight: 6000 },
    querySelector: () => figure,
    createTreeWalker: () => ({ nextNode: () => null }),
    createRange: () => ({}),
    fonts: { ready: { then() {} } },
    addEventListener,
    removeEventListener,
  };
  const window = {
    innerWidth: mobile ? 390 : 1440,
    innerHeight: 1000,
    devicePixelRatio: 3,
    scrollY: 0,
    matchMedia(query) {
      const value = {
        matches: query.includes("767") ? mobile : query.includes("reduce") ? reduced : !mobile,
        addEventListener(_, callback) { this.change = callback; },
        removeEventListener() {},
      };
      media.set(query, value);
      return value;
    },
    addEventListener,
    removeEventListener,
  };
  class Path {
    moveTo() {}
    quadraticCurveTo() { segments++; }
    bezierCurveTo() { segments++; }
    lineTo() { segments++; }
  }
  class Observer { observe() {} disconnect() {} }
  const exports = {};
  vm.runInNewContext(compiled, {
    exports,
    require(name) {
      if (name === "react") return { useRef: () => ({ current: canvas }), useEffect: effect => { cleanup = effect(); } };
      if (name === "react/jsx-runtime") return { jsx: () => null };
      throw new Error(`Unexpected dependency: ${name}`);
    },
    window, document,
    performance: { getEntriesByType: () => [] },
    NodeFilter: { SHOW_TEXT: 4 },
    Path2D: Path,
    ResizeObserver: Observer,
    IntersectionObserver: Observer,
    requestAnimationFrame(callback) { callbacks.set(++nextFrame, callback); return nextFrame; },
    cancelAnimationFrame(id) { callbacks.delete(id); },
  });
  exports.InkAura();
  return {
    canvas, context, exports, document, window, listeners, media,
    get draws() { return draws; },
    get strokes() { return strokes; },
    get segments() { return segments; },
    get pending() { return callbacks.size; },
    step(now) {
      const frame = [...callbacks.values()];
      callbacks.clear();
      frame.forEach(callback => callback(now));
    },
    unmount() { cleanup(); },
  };
}

test("desktop aura is stroke-only, batched, and DPR-capped without waterfall bundles", () => {
  const app = mountAura({ reduced: true });
  app.step(0);
  assert.equal(app.canvas.dataset.introProgress, "1.000");
  assert.equal(app.canvas.dataset.stringCount, String(app.exports.STRING_COUNT));
  assert.equal(app.canvas.dataset.bundleCount, undefined);
  assert.equal(app.exports.BUNDLE_COUNT, undefined);
  assert.equal(app.canvas.width, 2880);
  assert.equal(app.canvas.height, 2000);
  assert.ok(app.strokes > 0);
  assert.ok(app.segments > app.strokes * 4, "segments should share color/style batches");
  assert.equal(app.context.lineCap, "round");
  app.unmount();
  assert.equal(app.pending, 0);
});

test("mobile halves aura strings; reduced motion is static", () => {
  const app = mountAura({ mobile: true, reduced: true });
  app.step(0);
  assert.equal(app.canvas.dataset.stringCount, String(Math.round(app.exports.STRING_COUNT / 2)));
  assert.equal(app.canvas.dataset.bundleCount, undefined);
  assert.equal(app.canvas.dataset.introProgress, "1.000");
  assert.equal(app.pending, 0);
  app.step(500);
  assert.equal(app.draws, 1);
  app.window.scrollY = 1000;
  app.listeners.get("scroll")();
  app.step(600);
  assert.equal(app.draws, 2, "static drawing must still follow scrolling");
  app.unmount();
});

test("hidden tabs pause and resume without advancing the intro clock", () => {
  const app = mountAura();
  app.step(0);
  app.step(40);
  const progress = app.canvas.dataset.introProgress;
  app.document.hidden = true;
  app.listeners.get("visibilitychange")();
  assert.equal(app.pending, 0);
  app.step(10000);
  app.document.hidden = false;
  app.listeners.get("visibilitychange")();
  app.step(10040);
  assert.equal(app.canvas.dataset.introProgress, progress);
  app.unmount();
});

test("changing reduced-motion preference finishes the intro and stops the loop", () => {
  const app = mountAura();
  app.step(0);
  const preference = app.media.get("(prefers-reduced-motion: reduce)");
  preference.matches = true;
  preference.change();
  app.step(40);
  assert.equal(app.canvas.dataset.introProgress, "1.000");
  assert.equal(app.pending, 0);
  app.unmount();
});
