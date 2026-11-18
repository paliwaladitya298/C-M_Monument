import { useEffect, useRef, useState } from "react";

export const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));

export const seg = (p, a, b) => clamp((p - a) / (b - a));

export const ease = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function useReducedMotionPreference() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event) => setReduced(event.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

export function useScrollProgress(storyRef) {
  const rawRef = useRef(0);
  const smoothRef = useRef(0);

  useEffect(() => {
    const computeRaw = () => {
      const story = storyRef.current;
      if (!story) return 0;
      const rect = story.getBoundingClientRect();
      const span = Math.max(1, story.offsetHeight - window.innerHeight);
      return clamp(-rect.top / span);
    };

    const onScroll = () => {
      rawRef.current = computeRaw();
    };

    rawRef.current = computeRaw();
    smoothRef.current = rawRef.current;

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [storyRef]);

  const stepSmooth = (dt) => {
    const p = rawRef.current;
    let sp = smoothRef.current;
    sp += (p - sp) * (1 - Math.pow(0.86, dt / 16.7));
    if (Math.abs(p - sp) < 0.0002) {
      sp = p;
    }
    smoothRef.current = sp;
    return { p, sp };
  };

  return { rawRef, smoothRef, stepSmooth };
}
