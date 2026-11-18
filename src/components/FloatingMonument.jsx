import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

export default function FloatingMonument({
  cutoutRef,
  cutoutSrc,
  revealState,
  onReveal,
}) {
  const isInteractive = revealState === "idle";

  return (
    <div ref={cutoutRef} className="layer hero-cutout-layer">
      <motion.button
        type="button"
        className="floating-monument-trigger interactive"
        onClick={() => {
          if (isInteractive) onReveal();
        }}
        disabled={!isInteractive}
        aria-label="Inspect featured granite monument memorial presentation"
        whileHover={
          isInteractive
            ? { scale: 1.028, y: -6 }
            : undefined
        }
        whileTap={isInteractive ? { scale: 0.985 } : undefined}
        animate={{
          opacity: revealState === "idle" ? 1 : 0,
          scale: revealState === "opening" ? 1.18 : 1,
        }}
        transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <span className="floating-monument-shadow" aria-hidden="true" />
        <img
          src={cutoutSrc}
          alt="Polished charcoal granite upright monument with carved laurel arch"
          className="floating-monument-img"
          referrerPolicy="no-referrer"
        />
        <span className="floating-monument-cue">
          <Sparkles size={11} style={{ color: "#d2bc91" }} aria-hidden="true" />
          Click Monument to Inspect
        </span>
      </motion.button>
    </div>
  );
}
