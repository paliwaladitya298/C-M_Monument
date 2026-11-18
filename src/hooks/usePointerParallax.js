import { useEffect, useRef } from "react";

export function usePointerParallax(disabled = false) {
  const targetRef = useRef({ mx: 0, my: 0 });
  const smoothRef = useRef({ sx: 0, sy: 0 });

  useEffect(() => {
    if (disabled) {
      targetRef.current = { mx: 0, my: 0 };
      smoothRef.current = { sx: 0, sy: 0 };
      return undefined;
    }

    const onPointerMove = (event) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      targetRef.current.mx = event.clientX / w - 0.5;
      targetRef.current.my = event.clientY / h - 0.5;
    };

    const onPointerLeave = () => {
      targetRef.current.mx = 0;
      targetRef.current.my = 0;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [disabled]);

  const stepPointer = () => {
    if (disabled) {
      smoothRef.current.sx = 0;
      smoothRef.current.sy = 0;
      return smoothRef.current;
    }
    const { mx, my } = targetRef.current;
    const s = smoothRef.current;
    s.sx += (mx - s.sx) * 0.06;
    s.sy += (my - s.sy) * 0.06;
    return s;
  };

  return { targetRef, smoothRef, stepPointer };
}
