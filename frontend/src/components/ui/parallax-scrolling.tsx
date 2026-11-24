'use client';

/**
 * parallax-scrolling.tsx
 * EcoPoint "PLASTIC WASTE IS EVERYONE'S PROBLEM" parallax section.
 *
 */

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// ─── Unsplash eco images ───────────────────────────────────────────────────
// Layer 1 – far background: clean nature sky
const LAYER_1 =
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1600&q=80';
// Layer 2 – midground: plastic/ocean pollution
const LAYER_2 =
  'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&w=1600&q=80';
// Layer 4 – foreground: lush green ground
const LAYER_4 =
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80';

export function ParallaxProblem() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const layersEl = wrap.querySelector('[data-parallax-layers]') as HTMLElement | null;
    if (!layersEl) return;

    // --- GSAP parallax timeline tied to scroll position ---
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: layersEl,
          start: 'top top',
          end: 'bottom top',
          // scrub: true gives butter-smooth 1:1 mapping with scroll position.
          // A number (seconds) adds a lerp lag — 0.6 s is the sweet spot between
          // "responsive" and "cinematic".
          scrub: 0.6,
          invalidateOnRefresh: true,   // recalculate on resize / orientation change
        },
      });

      // Each layer moves at a different speed → depth illusion
      const layers: { sel: string; yPercent: number }[] = [
        { sel: '[data-parallax-layer="1"]', yPercent: 55 },  // slowest – bg
        { sel: '[data-parallax-layer="2"]', yPercent: 38 },  // mid
        { sel: '[data-parallax-layer="3"]', yPercent: 22 },  // text
        { sel: '[data-parallax-layer="4"]', yPercent:  8 },  // fastest – fg
      ];

      layers.forEach(({ sel, yPercent }) => {
        const els = wrap.querySelectorAll(sel);
        if (!els.length) return;
        tl.to(els, { yPercent, ease: 'none' }, '<'); // all run simultaneously
      });
    }, wrap);

    // Refresh after mount so sticky offsets are measured correctly
    ScrollTrigger.refresh();

    return () => {
      ctx.revert(); // cleanly kills only the ScrollTriggers created above
    };
  }, []);

  return (
    <div className="eco-parallax" ref={wrapRef}>

      {/* ══ Sticky parallax viewport ══════════════════════════════════════ */}
      <section className="eco-parallax__header" aria-label="Problem statement hero">
        <div className="eco-parallax__visuals">

          {/* seamless join with previous dark section */}
          <div className="eco-parallax__black-line-overflow" aria-hidden="true" />

          <div data-parallax-layers className="eco-parallax__layers">

            {/* Layer 1 – far background */}
            <img
              src={LAYER_1}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              width={1600}
              height={900}
              data-parallax-layer="1"
              alt=""
              className="eco-parallax__layer-img"
            />

            {/* Layer 2 – plastic/pollution midground */}
            <img
              src={LAYER_2}
              loading="eager"
              decoding="async"
              width={1600}
              height={900}
              data-parallax-layer="2"
              alt=""
              className="eco-parallax__layer-img eco-parallax__layer-img--mid"
            />

            {/* Layer 3 – headline + stats */}
            <div data-parallax-layer="3" className="eco-parallax__layer-title">
              <span className="eco-parallax__badge">THE ISSUE</span>

              <h2 className="eco-parallax__title">
                PLASTIC&nbsp;WASTE&nbsp;IS
                <br />
                EVERYONE&apos;S
                <br />
                <span className="eco-parallax__title-hl">PROBLEM.</span>
              </h2>

              <div className="eco-parallax__stats" role="list">
                {STATS.map((s) => (
                  <div key={s.num} className="eco-parallax__stat" role="listitem">
                    <span className="eco-parallax__stat-num">{s.num}</span>
                    <span className="eco-parallax__stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Layer 4 – foreground */}
            <img
              src={LAYER_4}
              loading="eager"
              decoding="async"
              width={1600}
              height={900}
              data-parallax-layer="4"
              alt=""
              className="eco-parallax__layer-img eco-parallax__layer-img--fg"
            />

          </div>

          {/* gradient fade to cards below */}
          <div className="eco-parallax__fade" aria-hidden="true" />
        </div>
      </section>

      {/* ══ Problem cards ════════════════════════════════════════════════════ */}
      <section className="eco-parallax__content bg-ink" id="problem">
        <div className="container">
          <div className="grid-3" style={{ gap: 24 }}>
            {PROBLEM_ITEMS.map((it) => (
              <div key={it.title} className="card card-ink eco-parallax__card">
                <div className="eco-parallax__card-icon">{it.emoji}</div>
                <h3 className="eco-parallax__card-title">{it.title}</h3>
                <p style={{ opacity: 0.85 }}>{it.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{PARALLAX_CSS}</style>
    </div>
  );
}

// ─── Data ──────────────────────────────────────────────────────────────────
const STATS = [
  { num: '8M+',  label: 'Tons in oceans / year' },
  { num: '91%',  label: 'Plastic never recycled' },
  { num: '450yr',label: 'To decompose'           },
];

const PROBLEM_ITEMS = [
  {
    emoji: '🌱',
    title: 'Soil Pollution',
    desc: 'Sampah plastik mencemari tanah dan merusak keseimbangan ekosistem.',
  },
  {
    emoji: '💧',
    title: 'Environmental Pollution',
    desc: 'Limbah plastik mencemari sungai dan lautan tempat bergantungnya kehidupan.',
  },
  {
    emoji: '🗑️',
    title: 'Low Awareness',
    desc: 'Kesadaran daur ulang masih rendah — sampah berakhir di tempat pembuangan.',
  },
];

// ─── CSS ───────────────────────────────────────────────────────────────────
const PARALLAX_CSS = `
/* ── wrapper ───────────────────────────────────────── */
.eco-parallax {
  position: relative;
  background: #0D0F0C;
}

/* ── sticky scroll shell ──────────────────────────── */
/* 220 vh total scroll travel; 100 vh is the sticky viewport */
.eco-parallax__header {
  position: relative;
  height: 220vh;
}

.eco-parallax__visuals {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  background: #0D0F0C;
  /* isolate stacking context so GPU compositing stays local */
  isolation: isolate;
}

.eco-parallax__black-line-overflow {
  position: absolute;
  top: -4px; left: 0; right: 0;
  height: 8px;
  background: #0D0F0C;
  z-index: 10;
}

/* ── layers ────────────────────────────────────────── */
.eco-parallax__layers {
  position: absolute;
  inset: 0;
  /* contain: strict tells browser not to repaint outside this box */
  contain: strict;
}

/*
 * GPU-accelerated base for every layer.
 * transform3d(0,0,0) forces the element onto its own compositor layer.
 * This prevents the CPU from doing pixel blending on scroll.
 */
.eco-parallax__layer-img {
  position: absolute;
  top: -20%;
  left: 0;
  width: 100%;
  height: 140%;
  object-fit: cover;
  display: block;
  pointer-events: none;
  /* GPU compositing hints */
  will-change: transform;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
}

/* plastic/ocean midground: blend + desaturate slightly */
.eco-parallax__layer-img--mid {
  opacity: 0.65;
  filter: saturate(1.3) brightness(0.85);
  mix-blend-mode: normal;
}

/* foreground: dark vignette strip */
.eco-parallax__layer-img--fg {
  top: auto;
  bottom: -10%;
  height: 55%;
  opacity: 0.15;
  filter: grayscale(1) brightness(0.4);
}

/* ── title layer ────────────────────────────────────── */
.eco-parallax__layer-title {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 24px;
  z-index: 4;
  will-change: transform;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  background: radial-gradient(
    ellipse 80% 60% at 50% 50%,
    rgba(13,15,12,0.78) 0%,
    rgba(13,15,12,0.32) 70%,
    transparent 100%
  );
}

/* ── badge ──────────────────────────────────────────── */
.eco-parallax__badge {
  display: inline-block;
  font-family: var(--font-display, 'Archivo', sans-serif);
  font-weight: 900;
  font-size: 12px;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  padding: 6px 16px;
  border: 3px solid #0D0F0C;
  box-shadow: 4px 4px 0 0 #0D0F0C;
  background: #FF5A1F;
  color: #F5F1E8;
  margin-bottom: 20px;
  transform: rotate(-3deg);
}

/* ── title ──────────────────────────────────────────── */
.eco-parallax__title {
  font-family: var(--font-display, 'Archivo', sans-serif);
  font-weight: 900;
  font-size: clamp(36px, 7vw, 88px);
  line-height: 1.0;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  color: #F5F1E8;
  margin: 0;
  text-shadow: 0 8px 40px rgba(0,0,0,0.65);
}

.eco-parallax__title-hl {
  background: #FFD100;
  color: #0D0F0C;
  padding: 0 14px;
  box-shadow: 4px 4px 0 0 rgba(0,0,0,0.5);
  display: inline-block;
  transform: rotate(-1deg);
}

/* ── stats pills ────────────────────────────────────── */
.eco-parallax__stats {
  display: flex;
  gap: 16px;
  margin-top: 32px;
  flex-wrap: wrap;
  justify-content: center;
}

.eco-parallax__stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(13,15,12,0.75);
  border: 3px solid #FFD100;
  box-shadow: 4px 4px 0 0 rgba(255,209,0,0.30);
  padding: 12px 20px;
  min-width: 100px;
}

.eco-parallax__stat-num {
  font-family: var(--font-display, 'Archivo', sans-serif);
  font-weight: 900;
  font-size: clamp(22px, 4vw, 36px);
  color: #FFD100;
  line-height: 1;
}

.eco-parallax__stat-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #F5F1E8;
  opacity: 0.8;
  margin-top: 4px;
  text-align: center;
}

/* ── fade to cards ──────────────────────────────────── */
.eco-parallax__fade {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 200px;
  background: linear-gradient(to bottom, transparent 0%, #0D0F0C 100%);
  z-index: 5;
  pointer-events: none;
}

/* ── cards section ──────────────────────────────────── */
.eco-parallax__content {
  padding: 72px 0 96px;
  position: relative;
  z-index: 2;
}

/* ── problem card ───────────────────────────────────── */
.eco-parallax__card {
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}
.eco-parallax__card:hover {
  transform: translate(-3px, -3px);
  box-shadow: 8px 8px 0 0 var(--ink, #0D0F0C);
}

.eco-parallax__card-icon {
  font-size: 36px;
  margin-bottom: 8px;
  color: var(--hazard, #FFD100);
}

.eco-parallax__card-title {
  font-size: 22px;
  margin: 8px 0;
  color: var(--hazard, #FFD100);
}

/* ── responsive ─────────────────────────────────────── */
@media (max-width: 960px) {
  .eco-parallax__stats  { gap: 10px; }
  .eco-parallax__stat   { min-width: 80px; padding: 10px 14px; }
}

@media (max-width: 640px) {
  .eco-parallax__title  { font-size: clamp(30px, 11vw, 56px); }
  .eco-parallax__header { height: 260vh; }
}

/* Respect user's prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .eco-parallax__layer-img,
  .eco-parallax__layer-title {
    will-change: auto;
    transform: none !important;
  }
}
`;
