"use client";

import { useEffect, useRef } from "react";

// Intro duration is milliseconds.
export const INTRO_DURATION = 7000;
export const STRING_COUNT = 72;
export const STRING_MIN_WIDTH = 1.2;
export const STRING_MAX_WIDTH = 3;

// Survives client-side unmount/remount, but resets on a real document load.
let introPlayed = false;

// Speed is a multiplier (0.5 = half speed), independent of intro duration.
export const AURA_CONFIG = {
  desktopCount: STRING_COUNT,
  mobileCount: Math.round(STRING_COUNT / 2),
  speed: 1,
  nearOpacity: 0.85,
  farOpacity: 0.05,
  inkOpacity: 0.38,
  colors: { ink: "#1c1a1f", paint: ["#d6286e", "#b3205f", "#e8a317", "#f08a1c", "#f5b73b", "#2a8fc4"] },
};
type Point = { x: number; y: number };
// Hair, hands and saree edges, in image-relative coordinates.
const ANCHORS = [[0.54, 0.09], [0.76, 0.14], [0.81, 0.31], [0.29, 0.35], [0.15, 0.65], [0.84, 0.60], [0.24, 0.87], [0.71, 0.92]];
const TAU = Math.PI * 2;
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const easeOut = (value: number) => 1 - (1 - clamp(value)) ** 3;

function randomGenerator() {
  let seed = 2606;
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

export function InkAura() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const figure = document.querySelector<HTMLElement>("[data-aura-figure]");
    if (!canvas || !ctx || !figure) return;

    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    let width = 0;
    let height = 0;
    let pageHeight = 0;
    let mobile = mobileQuery.matches;
    let reducedMotion = motionQuery.matches;
    let scrollY = window.scrollY;
    // A scalar field, not another canvas: feather opacity around actual text.
    const protectionCell = 20;
    let protection = new Float32Array(0);
    let protectionColumns = 0;
    let protectionRows = 0;
    let frame = 0;
    let lastFrame = -Infinity;
    let lastTick = 0;
    let elapsed = 0;
    const navigation = performance.getEntriesByType("navigation")[0];
    // Opening another route and navigating home must not trigger the intro.
    let playIntro = !introPlayed && (!navigation || new URL(navigation.name).pathname === "/") && !reducedMotion;
    let progress = playIntro ? 0 : 1;
    let needsMeasure = true;
    let disposed = false;
    let figureVisible = true;
    const mouse = { x: -1000, y: -1000 };
    let strands = makeStrands();
    const palette = [...AURA_CONFIG.colors.paint, AURA_CONFIG.colors.ink];
    // Canvas strokes have uniform styles. Quantized width/alpha sub-batches
    // retain taper and local fading without issuing a stroke for every thread.
    const alphaLevels = 24;
    const widthLevels = 4;
    const batches = new Map<number, Path2D>();

    function strokeBatch(color: number, lineWidth: number, opacity: number) {
      if (opacity < 0.012) return null;
      const alpha = Math.max(1, Math.min(alphaLevels - 1, Math.round(clamp(opacity) * (alphaLevels - 1))));
      const weight = Math.min(widthLevels - 1, Math.max(0, Math.round((lineWidth - 0.4) / (STRING_MAX_WIDTH - 0.4) * (widthLevels - 1))));
      const key = (color * widthLevels + weight) * alphaLevels + alpha;
      let path = batches.get(key);
      if (!path) { path = new Path2D(); batches.set(key, path); }
      return path;
    }

    function flushStrokes() {
      // Sort by colour to minimize style changes, independently of thread order.
      for (const key of Array.from(batches.keys()).sort((a, b) => a - b)) {
        const alpha = key % alphaLevels;
        const weight = Math.floor(key / alphaLevels) % widthLevels;
        const color = Math.floor(key / (alphaLevels * widthLevels));
        ctx!.strokeStyle = palette[color];
        ctx!.globalAlpha = alpha / (alphaLevels - 1);
        ctx!.lineWidth = 0.4 + weight / (widthLevels - 1) * (STRING_MAX_WIDTH - 0.4);
        ctx!.stroke(batches.get(key)!);
      }
      batches.clear();
      ctx!.globalAlpha = 1;
    }

    function readability(x: number, documentY: number) {
      const gx = Math.max(0, Math.min(protectionColumns - 2, x / protectionCell));
      const gy = Math.max(0, Math.min(protectionRows - 2, documentY / protectionCell));
      const ix = Math.floor(gx), iy = Math.floor(gy);
      const u = gx - ix, v = gy - iy;
      const offset = iy * protectionColumns + ix;
      const top = protection[offset] * (1 - u) + protection[offset + 1] * u;
      const bottom = protection[offset + protectionColumns] * (1 - u) + protection[offset + protectionColumns + 1] * u;
      return 1 - (top * (1 - v) + bottom * v) * 0.9;
    }

    function bend(point: Point, envelope: number): Point {
      if (mobile || reducedMotion || !pointerQuery.matches) return point;
      const dx = point.x - mouse.x, dy = point.y - mouse.y;
      if (dx * dx + dy * dy >= 145 * 145) return point;
      const distance = Math.hypot(dx, dy);
      const force = Math.max(0, 1 - distance / 145) ** 2 * 19 * envelope;
      point.x += dx / Math.max(distance, 1) * force;
      point.y += dy / Math.max(distance, 1) * force;
      return point;
    }

    function makeStrands() {
      const random = randomGenerator();
      const count = mobile ? AURA_CONFIG.mobileCount : AURA_CONFIG.desktopCount;
      return Array.from({ length: count }, (_, index) => ({
        anchor: ANCHORS[index % ANCHORS.length],
        phase: random() * TAU,
        turns: 1.2 + random() * 2.5,
        spread: (0.2 + random() * 0.6) * (random() > 0.5 ? 1 : -1),
        target: random(),
        length: index < count * 0.2 ? 0.18 + random() * 0.18 : 0.95 + random() * 0.7,
        lineWidth: STRING_MIN_WIDTH + random() * (STRING_MAX_WIDTH - STRING_MIN_WIDTH),
        color: index % 5 < 3 ? AURA_CONFIG.colors.ink : AURA_CONFIG.colors.paint[index % AURA_CONFIG.colors.paint.length],
        ink: index % 5 < 3,
        dot: random(),
        delay: random() * (1500 / INTRO_DURATION),
        duration: 0.57 + random() * 0.07,
      }));
    }

    function measure() {
      width = window.innerWidth;
      height = window.innerHeight;
      pageHeight = document.documentElement.scrollHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      protectionColumns = Math.ceil(width / protectionCell) + 2;
      protectionRows = Math.ceil(pageHeight / protectionCell) + 2;
      protection = new Float32Array(protectionColumns * protectionRows);
      // Cache a smoothly feathered document-space field. No rectangular eraser,
      // per-section masks, blur, offscreen canvas, or per-frame DOM text measuring.
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      const measured = new Set<HTMLElement>();
      while ((node = walker.nextNode())) {
        const parent = node.parentElement;
        if (!node.textContent?.trim() || !parent || parent.closest("script, style, svg, [aria-hidden='true']")) continue;
        if (measured.has(parent)) continue;
        measured.add(parent);
        // Protect whole text blocks, not individual lines: a wide feather avoids
        // the horizontal bands a line-by-line eraser would leave in the threads.
        for (const rect of Array.from(parent.getClientRects())) {
          if (!rect.width || !rect.height) continue;
          const left = rect.left - 6, right = rect.right + 6;
          const top = rect.top + scrollY - 4, bottom = rect.bottom + scrollY + 4;
          const feather = 72;
          for (let row = Math.max(0, Math.floor((top - feather) / protectionCell)); row <= Math.min(protectionRows - 1, Math.ceil((bottom + feather) / protectionCell)); row++) {
            for (let col = Math.max(0, Math.floor((left - feather) / protectionCell)); col <= Math.min(protectionColumns - 1, Math.ceil((right + feather) / protectionCell)); col++) {
              const dx = Math.max(left - col * protectionCell, 0, col * protectionCell - right);
              const dy = Math.max(top - row * protectionCell, 0, row * protectionCell - bottom);
              const fade = clamp(1 - Math.hypot(dx, dy) / feather);
              const index = row * protectionColumns + col;
              protection[index] = Math.max(protection[index], fade * fade * (3 - 2 * fade));
            }
          }
        }
      }
      canvas!.dataset.stringCount = String(strands.length);
      needsMeasure = false;
    }

    function draw() {
      if (needsMeasure) measure();
      ctx!.clearRect(0, 0, width, height);
      const rect = figure!.getBoundingClientRect();
      introPlayed = true;
      progress = playIntro ? clamp(elapsed / INTRO_DURATION) : 1;
      canvas!.dataset.introProgress = progress.toFixed(3);
      ctx!.lineCap = "round";
      ctx!.lineJoin = "round";
      const time = reducedMotion ? 0 : elapsed * 0.00012 * AURA_CONFIG.speed;
      const reach = pageHeight + height;
      const steps = mobile ? 180 : 260;

      strands.forEach((strand, index) => {
        const spread = playIntro ? easeOut((progress - strand.delay) / strand.duration) : 1;
        if (spread <= 0) return;
        const origin = { x: rect.left + rect.width * strand.anchor[0], y: rect.top + rect.height * strand.anchor[1] };
        const points: Point[] = [];
        for (let step = 0; step <= steps; step++) {
          const t = step / steps * spread;
          const envelope = Math.sin(Math.min(t * 3, 1) * Math.PI / 2);
          // Keep long mobile pages loose and looping, rather than stretching
          // a handful of hero-sized curves into nearly vertical threads.
          const loopDensity = Math.max(1, reach * strand.length / (height * 2));
          const phase = t * TAU * strand.turns * loopDensity + strand.phase;
          // Unequal sine sums form loose loops; t=0 is always exactly on the cutout.
          const x = origin.x + (strand.target * width - origin.x) * t
            + envelope * width * strand.spread * (Math.sin(phase + time * 0.3) * 0.65 + Math.sin(phase * 0.47 - time * 0.2) * 0.35);
          const y = origin.y + t * reach * strand.length
            + envelope * Math.min(height * 0.26, reach * 0.06) * Math.cos(phase * 1.13 + time * 0.25)
            + envelope * 12 * Math.sin(t * 19 + time + strand.phase);
          points.push(bend({ x, y }, envelope));
        }

        // Stroke connected spline runs, not individual segments: translucent
        // round caps would otherwise accumulate into a bead at every sample.
        for (let i = 0; i < steps; i += 2) {
          const end = Math.min(steps, i + 2);
          const p1 = points[i];
          const run = points.slice(i, end + 1);
          if (run.every(p => p.y < -80) || run.every(p => p.y > height + 80)) continue;
          const t = (i + end) / (2 * steps);
          const opacity = (AURA_CONFIG.farOpacity + (AURA_CONFIG.nearOpacity - AURA_CONFIG.farOpacity) * Math.exp(-t * 6))
            * (strand.ink ? AURA_CONFIG.inkOpacity : 1) * clamp((1 - t) / 0.18)
            * readability(p1.x, p1.y + scrollY);
          const path = strokeBatch(palette.indexOf(strand.color), Math.max(0.4, strand.lineWidth * (1 - t * 0.7)), opacity);
          if (!path) continue;
          path.moveTo(p1.x, p1.y);
          for (let j = i; j < end; j++) {
            const p0 = points[Math.max(0, j - 1)], a = points[j], b = points[j + 1], p3 = points[Math.min(steps, j + 2)];
            path.bezierCurveTo(a.x + (b.x - p0.x) / 6, a.y + (b.y - p0.y) / 6, b.x - (p3.x - a.x) / 6, b.y - (p3.y - a.y) / 6, b.x, b.y);
          }
        }
        // A small subset carry traveling pigment; interpolate along the same spline.
        if (!reducedMotion && index % 7 === 0) {
          const travel = (strand.dot + elapsed * 0.000025 * AURA_CONFIG.speed) % 1;
          const position = travel * steps;
          const i = Math.min(steps - 1, Math.floor(position));
          const u = position - i;
          const p0 = points[Math.max(0, i - 1)], p1 = points[i], p2 = points[i + 1], p3 = points[Math.min(steps, i + 2)];
          const spline = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u * u + (-a + 3 * b - 3 * c + d) * u * u * u);
          const x = spline(p0.x, p1.x, p2.x, p3.x), y = spline(p0.y, p1.y, p2.y, p3.y);
          const path = strokeBatch(index % 6, 1.2 + strand.dot, Math.sin(travel * Math.PI) * 0.45 * readability(x, y + scrollY));
          path?.moveTo(x, y);
          path?.lineTo(x + (p2.x - p1.x) * 0.15, y + (p2.y - p1.y) * 0.15);
        }
      });
      flushStrokes();
    }

    function tick(now: number) {
      frame = 0;
      if (document.hidden || disposed) return;
      if (now - lastFrame >= 1000 / 60 - 0.5) {
        if (!reducedMotion) elapsed += lastTick ? Math.min(now - lastTick, 50) : 0;
        lastTick = now;
        lastFrame = now;
        draw();
      }
      if (!reducedMotion) frame = requestAnimationFrame(tick);
    }
    function schedule() {
      if (!frame && !document.hidden && !disposed) frame = requestAnimationFrame(tick);
    }
    function onScroll() {
      scrollY = window.scrollY;
      // Reduced motion uses a still drawing, repositioned only for scroll/resize.
      if (reducedMotion) { lastFrame = -Infinity; schedule(); }
    }
    function invalidate() { needsMeasure = true; lastFrame = -Infinity; schedule(); }
    function onPreferenceChange() {
      mobile = mobileQuery.matches;
      reducedMotion = motionQuery.matches;
      if (reducedMotion) { playIntro = false; progress = 1; introPlayed = true; }
      strands = makeStrands();
      mouse.x = mouse.y = -1000;
      updateFigureMotion();
      invalidate();
    }
    function onPointer(event: PointerEvent) {
      if (!mobile && !reducedMotion && pointerQuery.matches) { mouse.x = event.clientX; mouse.y = event.clientY; }
    }
    function clearPointer() { mouse.x = mouse.y = -1000; }
    function updateFigureMotion() {
      const container = figure!.closest(".hero-figure");
      const paused = document.hidden || !figureVisible;
      container?.classList.toggle("is-paused", paused);
      const svg = container?.querySelector("svg");
      if (paused || mobile || reducedMotion) svg?.pauseAnimations();
      else svg?.unpauseAnimations();
    }
    function onVisibility() {
      updateFigureMotion();
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
      else { lastTick = 0; lastFrame = -Infinity; schedule(); }
    }

    const resizeObserver = new ResizeObserver(invalidate);
    resizeObserver.observe(document.body);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      figureVisible = entry.isIntersecting;
      updateFigureMotion();
    });
    intersectionObserver.observe(figure);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", invalidate);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("pointerleave", clearPointer);
    document.addEventListener("visibilitychange", onVisibility);
    mobileQuery.addEventListener("change", onPreferenceChange);
    motionQuery.addEventListener("change", onPreferenceChange);
    figure.addEventListener("load", invalidate);
    void document.fonts.ready.then(() => { if (!disposed) invalidate(); });
    schedule();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", invalidate);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("pointerleave", clearPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      mobileQuery.removeEventListener("change", onPreferenceChange);
      motionQuery.removeEventListener("change", onPreferenceChange);
      figure.removeEventListener("load", invalidate);
    };
  }, []);

  return <canvas ref={canvasRef} className="ink-aura" aria-hidden="true" />;
}
