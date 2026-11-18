import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Hero from "./Hero.jsx";
import FloatingMonument from "./FloatingMonument.jsx";
import MemorialReveal from "./MemorialReveal.jsx";
import MonumentHotspots from "./MonumentHotspots.jsx";
import PromiseSection from "./PromiseSection.jsx";
import {
  clamp,
  ease,
  seg,
  useReducedMotionPreference,
  useScrollProgress,
} from "../hooks/useScrollProgress.js";
import { usePointerParallax } from "../hooks/usePointerParallax.js";
import { useVideoFrameCache } from "../hooks/useVideoFrameCache.js";

const HERO_STILL_SRC = "/src/assets/images/hero_cemetery_still_1795006422575.jpg";
const CRAFTSMANSHIP_STILL_SRC =
  "/src/assets/images/craftsmanship_monument_close_1795006425218.jpg";
const CUTOUT_SRC = "/assets/monument_cutout.png";
const VIDEO_SRC = "/assets/monument_flyin.mp4";

const VISION_TEXT =
  "Creating Beautiful Memorials. Preserving Precious Memories.";
const MISSION_TEXT =
  "C & M Monument Company was born from the belief that we could help loved ones in time of loss by providing quality markers of remembrance at an affordable cost. Our goal is to offer monuments that beautifully celebrate the life of the one who has passed on. We care about the little things that remind us of our loved ones and the life they lived.";

export default function CinematicStory({ onExploreMonuments }) {
  const storyRef = useRef(null);
  const cameraRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const stillRef = useRef(null);
  const cutoutRef = useRef(null);
  const headlineRef = useRef(null);
  const hudRef = useRef(null);
  const metaRef = useRef(null);
  const fogRef = useRef(null);
  const progressBarRef = useRef(null);

  const visionLayerRef = useRef(null);
  const visionChipRef = useRef(null);
  const visionSubRef = useRef(null);
  const visionWordRefs = useRef([]);

  const missionLayerRef = useRef(null);
  const missionBlockRef = useRef(null);
  const missionWordRefs = useRef([]);
  const hotspotRefs = useRef([]);

  const promiseLayerRef = useRef(null);
  const promiseHeadingRef = useRef(null);
  const promiseCardRef = useRef(null);
  const promiseFeaturesWrapRef = useRef(null);
  const promiseSvgPathRef = useRef(null);
  const promiseRowRefs = useRef([]);

  const [revealState, setRevealState] = useState("idle");
  const revealTimersRef = useRef([]);
  const reducedMotion = useReducedMotionPreference();

  const visionWords = useMemo(() => VISION_TEXT.split(" "), []);
  const missionWords = useMemo(() => MISSION_TEXT.split(" "), []);

  const { stepSmooth } = useScrollProgress(storyRef);
  const { stepPointer } = usePointerParallax(reducedMotion);
  const { nfRef, drawWant } = useVideoFrameCache({
    videoRef,
    canvasRef,
    videoSrc: VIDEO_SRC,
    fallbackStartSrc: HERO_STILL_SRC,
    fallbackEndSrc: CRAFTSMANSHIP_STILL_SRC,
  });

  const registerHotspotRef = useCallback((idx, el) => {
    hotspotRefs.current[idx] = el;
  }, []);

  const registerRowRef = useCallback((idx, el) => {
    promiseRowRefs.current[idx] = el;
  }, []);

  const clearRevealTimers = useCallback(() => {
    revealTimersRef.current.forEach((id) => clearTimeout(id));
    revealTimersRef.current = [];
  }, []);

  const handleOpenReveal = useCallback(() => {
    if (revealState !== "idle") return;
    clearRevealTimers();
    if (window.scrollY > 120) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setRevealState("opening");
    const t = setTimeout(() => {
      setRevealState("revealed");
    }, 420);
    revealTimersRef.current.push(t);
  }, [clearRevealTimers, revealState]);

  const handleCloseReveal = useCallback(() => {
    if (revealState === "idle" || revealState === "closing") return;
    clearRevealTimers();
    setRevealState("closing");
    const t = setTimeout(() => {
      setRevealState("idle");
    }, 440);
    revealTimersRef.current.push(t);
  }, [clearRevealTimers, revealState]);

  const handleExploreFromReveal = useCallback(() => {
    clearRevealTimers();
    setRevealState("closing");
    const t = setTimeout(() => {
      setRevealState("idle");
      if (onExploreMonuments) {
        onExploreMonuments();
      }
    }, 360);
    revealTimersRef.current.push(t);
  }, [clearRevealTimers, onExploreMonuments]);

  useEffect(() => () => clearRevealTimers(), [clearRevealTimers]);

  // Single unified requestAnimationFrame scroll + parallax loop
  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();

    const applyVisibility = (el, visible) => {
      if (!el) return;
      el.style.visibility = visible ? "visible" : "hidden";
    };

    const tick = (now) => {
      const dt = Math.min(64, Math.max(1, now - lastTime));
      lastTime = now;

      const { sp } = stepSmooth(dt);
      const { sx, sy } = stepPointer();
      const nf = nfRef.current || 121;
      const vh = window.innerHeight || 900;

      // 1. Video Progress (.05 - .70)
      const vp = ease(seg(sp, 0.05, 0.70));
      const want = Math.round(vp * (nf - 1));
      drawWant(want);

      // 2. Camera & Foreground Cutout Transform
      const tx = reducedMotion ? 0 : -sx * 18;
      const ty = reducedMotion ? 0 : -sy * 12 + (1 - vp) * vh * 0.06;
      const sc = reducedMotion ? 1 : 1 + 0.02 * (1 - vp);
      const camTransform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${sc.toFixed(4)})`;

      if (cameraRef.current) {
        cameraRef.current.style.transform = camTransform;
      }

      // 3. Still-to-video handoff (.06 - .105)
      const handoff = seg(sp, 0.06, 0.105);
      const stillOpacity = 1 - handoff;
      if (stillRef.current) {
        stillRef.current.style.opacity = stillOpacity.toFixed(3);
        applyVisibility(stillRef.current, stillOpacity > 0.005);
      }

      if (cutoutRef.current) {
        const cutoutOpacity = 1 - seg(sp, 0.06, 0.11);
        cutoutRef.current.style.transform = camTransform;
        cutoutRef.current.style.opacity = cutoutOpacity.toFixed(3);
        applyVisibility(cutoutRef.current, cutoutOpacity > 0.005);
      }

      // 4. Hero Exit (.02 - .10, HUD .02 - .08, Meta .01 - .05)
      const h = seg(sp, 0.02, 0.10);
      if (headlineRef.current) {
        const hOpacity = 1 - h;
        headlineRef.current.style.transform = reducedMotion
          ? "none"
          : `translate3d(0, ${(-h * 80).toFixed(2)}px, 0) scale(${(1 + h * 0.12).toFixed(4)})`;
        headlineRef.current.style.filter = reducedMotion
          ? "none"
          : `blur(${(h * 14).toFixed(2)}px)`;
        headlineRef.current.style.opacity = hOpacity.toFixed(3);
        applyVisibility(headlineRef.current, hOpacity > 0.005);
      }

      const hudFade = 1 - seg(sp, 0.02, 0.08);
      if (hudRef.current) {
        const hudY = reducedMotion ? 0 : -h * 48 - sy * 16;
        const hudX = reducedMotion ? 0 : -sx * 24;
        hudRef.current.style.transform = `translate3d(${hudX.toFixed(2)}px, ${hudY.toFixed(2)}px, 0)`;
        hudRef.current.style.opacity = hudFade.toFixed(3);
        applyVisibility(hudRef.current, hudFade > 0.005);
      }

      const metaFade = 1 - seg(sp, 0.01, 0.05);
      if (metaRef.current) {
        metaRef.current.style.opacity = metaFade.toFixed(3);
        applyVisibility(metaRef.current, metaFade > 0.005);
      }

      // 6. Atmospheric Cemetery Mist (.10 - .48)
      if (fogRef.current) {
        const fogIn = seg(sp, 0.08, 0.24);
        const fogOut = seg(sp, 0.36, 0.50);
        const fogOpacity = fogIn * (1 - fogOut) * 0.85;
        const fogShiftX = reducedMotion ? 0 : -18 + fogIn * 22 + fogOut * 14;
        fogRef.current.style.opacity = fogOpacity.toFixed(3);
        fogRef.current.style.transform = `translate3d(${fogShiftX.toFixed(2)}%, 0, 0)`;
        applyVisibility(fogRef.current, fogOpacity > 0.005);
      }

      // 7. Vision Statement (.16 - .27 in, .34 - .42 out)
      const vIn = seg(sp, 0.16, 0.27);
      const vOut = seg(sp, 0.34, 0.42);
      const vVis = vIn > 0.005 && vOut < 0.995;
      if (visionLayerRef.current) {
        applyVisibility(visionLayerRef.current, vVis);
      }
      if (vVis) {
        const chipOp = clamp(vIn * 1.4) * (1 - vOut);
        if (visionChipRef.current) {
          visionChipRef.current.style.opacity = chipOp.toFixed(3);
          visionChipRef.current.style.transform = reducedMotion
            ? "none"
            : `translate3d(0, ${((1 - clamp(vIn * 1.4)) * 18 - vOut * 36).toFixed(2)}px, 0)`;
        }
        if (visionSubRef.current) {
          const subK = clamp(vIn * 1.5 - 0.35);
          visionSubRef.current.style.opacity = (subK * (1 - vOut)).toFixed(3);
          visionSubRef.current.style.transform = reducedMotion
            ? "none"
            : `translate3d(0, ${((1 - subK) * 20 - vOut * 42).toFixed(2)}px, 0)`;
        }
        visionWordRefs.current.forEach((wordEl, i) => {
          if (!wordEl) return;
          const k = clamp(vIn * 1.6 - i * 0.08);
          const wy = reducedMotion ? 0 : (1 - k) * 30 - vOut * 60;
          const wBlur = reducedMotion ? 0 : (1 - k) * 12 + vOut * 14;
          wordEl.style.opacity = (k * (1 - vOut)).toFixed(3);
          wordEl.style.transform = `translate3d(0, ${wy.toFixed(2)}px, 0)`;
          wordEl.style.filter = wBlur > 0.05 ? `blur(${wBlur.toFixed(2)}px)` : "none";
        });
      }

      // 8. Craftsmanship Mission Paragraph & Hotspots (.45 - .55 in, .63 - .68 out)
      const aIn = seg(sp, 0.45, 0.55);
      const aOut = seg(sp, 0.63, 0.68);
      const aVis = aIn > 0.005 && aOut < 0.995;
      if (missionLayerRef.current) {
        applyVisibility(missionLayerRef.current, aVis);
      }
      if (missionBlockRef.current) {
        const blockOp = clamp(aIn * 2.5) * (1 - aOut);
        missionBlockRef.current.style.opacity = blockOp.toFixed(3);
        missionBlockRef.current.style.transform = reducedMotion
          ? "none"
          : `translate3d(0, ${(-aOut * 36).toFixed(2)}px, 0)`;
      }
      if (aVis) {
        const count = missionWords.length || 1;
        missionWordRefs.current.forEach((wordEl, i) => {
          if (!wordEl) return;
          const k = clamp(aIn * 2.2 - (i / count) * 1.2);
          const wOp = (0.15 + 0.85 * k) * (1 - aOut);
          const wBlur = reducedMotion ? 0 : (1 - k) * 6 + aOut * 10;
          wordEl.style.opacity = wOp.toFixed(3);
          wordEl.style.filter = wBlur > 0.05 ? `blur(${wBlur.toFixed(2)}px)` : "none";
        });
      }

      hotspotRefs.current.forEach((hsEl, i) => {
        if (!hsEl) return;
        const hIn = ease(seg(sp, 0.49 + i * 0.02, 0.53 + i * 0.02));
        const hOp = hIn * (1 - aOut);
        const hx = reducedMotion ? 0 : -sx * (14 + i * 3);
        const hy = reducedMotion ? 0 : -sy * 10 + (1 - hIn) * 18 - aOut * 24;
        const hScale = 0.88 + 0.12 * hIn;
        hsEl.style.opacity = hOp.toFixed(3);
        hsEl.style.transform = `translate3d(${hx.toFixed(2)}px, ${hy.toFixed(2)}px, 0) scale(${hScale.toFixed(4)})`;
        applyVisibility(hsEl, hOp > 0.01);
      });

      // 9. Company Promise — Made with Care (.72 - .86+)
      const sIn = seg(sp, 0.72, 0.82);
      const cIn = ease(seg(sp, 0.74, 0.86));
      const fIn = ease(seg(sp, 0.75, 0.82));
      const pVisible = sIn > 0.005 || cIn > 0.005;

      if (promiseLayerRef.current) {
        promiseLayerRef.current.style.opacity = pVisible ? "1" : "0";
        applyVisibility(promiseLayerRef.current, pVisible);
      }

      if (promiseHeadingRef.current) {
        promiseHeadingRef.current.style.opacity = sIn.toFixed(3);
        promiseHeadingRef.current.style.transform = reducedMotion
          ? "none"
          : `translate3d(0, ${((1 - sIn) * 28).toFixed(2)}px, 0)`;
        applyVisibility(promiseHeadingRef.current, sIn > 0.005);
      }

      if (promiseCardRef.current) {
        const cardY = reducedMotion ? 0 : (1 - cIn) * 44;
        const rotY = reducedMotion ? 0 : sx * 10;
        const rotX = reducedMotion ? 0 : -sy * 8 + (1 - cIn) * 10;
        promiseCardRef.current.style.opacity = cIn.toFixed(3);
        promiseCardRef.current.style.transform = `translate3d(0, ${cardY.toFixed(2)}px, 0) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg)`;
        applyVisibility(promiseCardRef.current, cIn > 0.005);
      }

      if (promiseFeaturesWrapRef.current) {
        promiseFeaturesWrapRef.current.style.opacity = fIn.toFixed(3);
        promiseFeaturesWrapRef.current.style.transform = reducedMotion
          ? "none"
          : `translate3d(${((1 - fIn) * 24).toFixed(2)}px, 0, 0)`;
        applyVisibility(promiseFeaturesWrapRef.current, fIn > 0.005);
      }

      if (promiseSvgPathRef.current) {
        const dashOffset = 560 * (1 - cIn);
        promiseSvgPathRef.current.style.strokeDashoffset = dashOffset.toFixed(1);
      }

      promiseRowRefs.current.forEach((rowEl, i) => {
        if (!rowEl) return;
        const k = ease(seg(sp, 0.76 + i * 0.025, 0.82 + i * 0.025));
        const rx = reducedMotion ? 0 : (1 - k) * 40;
        rowEl.style.opacity = k.toFixed(3);
        rowEl.style.transform = `translate3d(${rx.toFixed(2)}px, 0, 0)`;
        applyVisibility(rowEl, k > 0.005);
      });

      // 10. Bottom Progress Indicator
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${sp.toFixed(4)})`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [
    drawWant,
    missionWords.length,
    nfRef,
    reducedMotion,
    stepPointer,
    stepSmooth,
  ]);

  return (
    <section id="story" ref={storyRef} aria-label="C & M Monument Cinematic Journey">
      <div className="stage">
        {/* Camera Container with Video Canvas + Hero Still */}
        <div ref={cameraRef} className="camera">
          <video
            ref={videoRef}
            className="hidden-video"
            muted
            playsInline
            preload="auto"
            crossOrigin="anonymous"
            aria-hidden="true"
          />
          <canvas
            ref={canvasRef}
            className="video-canvas"
            aria-label="Cinematic cemetery fly-in toward featured granite monument"
          />
        </div>

        {/* Hero Still, Headline, HUD, Meta */}
        <Hero
          stillRef={stillRef}
          headlineRef={headlineRef}
          hudRef={hudRef}
          metaRef={metaRef}
          stillSrc={HERO_STILL_SRC}
          isRevealed={revealState !== "idle"}
        />

        {/* Interactive Foreground Monument Cutout (Overlaps lower headline) */}
        <FloatingMonument
          cutoutRef={cutoutRef}
          cutoutSrc={CUTOUT_SRC}
          revealState={revealState}
          onReveal={handleOpenReveal}
        />

        {/* Atmospheric Cemetery Morning Mist */}
        <div
          ref={fogRef}
          className="layer fog-layer"
          style={{ opacity: 0, visibility: "hidden" }}
          aria-hidden="true"
        >
          <div className="fog-base" />
          <svg
            className="fog-noise-a"
            viewBox="0 0 800 600"
            preserveAspectRatio="none"
          >
            <filter id="cm-mist-a">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.006 0.014"
                numOctaves="3"
                seed="4"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.94  0 0 0 0 0.94  0 0 0 0 0.92  0 0 0 0.48 0"
              />
            </filter>
            <rect width="800" height="600" filter="url(#cm-mist-a)" />
          </svg>
          <svg
            className="fog-noise-b"
            viewBox="0 0 800 600"
            preserveAspectRatio="none"
          >
            <filter id="cm-mist-b">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.004 0.009"
                numOctaves="4"
                seed="11"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.92  0 0 0 0 0.93  0 0 0 0 0.90  0 0 0 0.36 0"
              />
            </filter>
            <rect width="800" height="600" filter="url(#cm-mist-b)" />
          </svg>
        </div>

        {/* Beat 2 — Vision Statement */}
        <div
          ref={visionLayerRef}
          className="layer vision-layer"
          style={{ visibility: "hidden" }}
        >
          <div className="vision-inner">
            <div ref={visionChipRef} className="vision-chip-wrap" style={{ opacity: 0 }}>
              <span className="chip">A Legacy of Remembrance</span>
            </div>
            <h2 className="vision-heading">
              {visionWords.map((word, i) => (
                <span
                  key={`${word}-${i}`}
                  ref={(el) => {
                    visionWordRefs.current[i] = el;
                  }}
                  className="vision-word"
                  style={{ opacity: 0 }}
                >
                  {word}
                </span>
              ))}
            </h2>
            <p ref={visionSubRef} className="vision-sub" style={{ opacity: 0 }}>
              Every monument represents a life, a story, and a meaningful place
              for family and friends to gather in quiet remembrance.
            </p>
          </div>
        </div>

        {/* Beat 3 — Craftsmanship Mission Landscape & 4 Interactive Hotspots */}
        <div
          ref={missionLayerRef}
          className="layer mission-layer"
          style={{ visibility: "hidden" }}
        >
          <div ref={missionBlockRef} className="mission-block" style={{ opacity: 0 }}>
            <p className="mission-kicker">Our Mission &amp; Craftsmanship</p>
            <p className="mission-copy">
              {missionWords.map((word, i) => (
                <span
                  key={`${word}-${i}`}
                  ref={(el) => {
                    missionWordRefs.current[i] = el;
                  }}
                  className="mission-word"
                  style={{ opacity: 0.15 }}
                >
                  {word}
                </span>
              ))}
            </p>
          </div>

          <MonumentHotspots registerHotspotRef={registerHotspotRef} />
        </div>

        {/* Beat 4 — Our Promise: Made with Care */}
        <PromiseSection
          layerRef={promiseLayerRef}
          headingRef={promiseHeadingRef}
          cardRef={promiseCardRef}
          featuresWrapRef={promiseFeaturesWrapRef}
          svgPathRef={promiseSvgPathRef}
          registerRowRef={registerRowRef}
        />

        {/* Interactive Memorial Reveal (Triggered by clicking the floating monument) */}
        <MemorialReveal
          revealState={revealState}
          cutoutSrc={CUTOUT_SRC}
          onClose={handleCloseReveal}
          onExploreMonuments={handleExploreFromReveal}
        />

        {/* Bottom 120x2px Progress Indicator */}
        <div className="story-progress-track" aria-hidden="true">
          <div ref={progressBarRef} className="story-progress-fill" />
        </div>
      </div>
    </section>
  );
}
