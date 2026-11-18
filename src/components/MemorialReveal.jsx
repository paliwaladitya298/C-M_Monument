import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function MemorialReveal({
  revealState,
  cutoutSrc,
  onClose,
  onExploreMonuments,
}) {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const visible = revealState !== "idle";

  useEffect(() => {
    if (!visible) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [visible, onClose]);

  const handlePointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -y * 8, ry: x * 10 });
  };

  const handlePointerLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="memorial-reveal-overlay interactive"
          role="dialog"
          aria-modal="true"
          aria-labelledby="memorial-reveal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: revealState === "closing" ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.48, ease: [0.2, 0.8, 0.2, 1] }}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <div className="memorial-reveal-grid">
            <motion.div
              className="memorial-reveal-stage"
              initial={{ opacity: 0, scale: 0.84, y: 36, rotateX: 8 }}
              animate={{
                opacity: revealState === "closing" ? 0 : 1,
                scale: revealState === "closing" ? 0.88 : 1,
                y: revealState === "closing" ? 24 : 0,
                rotateX: tilt.rx,
                rotateY: tilt.ry,
              }}
              transition={{
                duration: 0.65,
                ease: [0.2, 0.8, 0.2, 1],
                rotateX: { duration: 0.25 },
                rotateY: { duration: 0.25 },
              }}
            >
              <div className="memorial-reveal-aura" aria-hidden="true" />
              <div className="memorial-reveal-stone-card">
                <img
                  src={cutoutSrc}
                  alt="Close-up of polished dark granite monument showing carved laurel arch and stepped base"
                  className="memorial-reveal-img"
                  referrerPolicy="no-referrer"
                />
                <span className="memorial-reveal-engraving-badge">
                  Beveled Granite · Hand-Carved Laurel Relief
                </span>
              </div>
            </motion.div>

            <motion.div
              className="memorial-reveal-copy"
              initial={{ opacity: 0, y: 26, filter: "blur(6px)" }}
              animate={{
                opacity: revealState === "closing" ? 0 : 1,
                y: revealState === "closing" ? 18 : 0,
                filter: revealState === "closing" ? "blur(6px)" : "blur(0px)",
              }}
              transition={{ duration: 0.55, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <span className="chip">Featured Memorial Presentation</span>

              <h2 id="memorial-reveal-title" className="memorial-reveal-heading">
                Every Life Deserves a Beautiful Tribute.
              </h2>

              <p className="memorial-reveal-body">
                A lasting memorial is more than stone. It is a beautiful way to
                honor a life, preserve memories, and celebrate a loved one.
              </p>

              <div className="memorial-reveal-specs">
                <span>Solid Granite Stone</span>
                <span>·</span>
                <span>Custom Lettering &amp; Etching</span>
                <span>·</span>
                <span>Stepped Base Finish</span>
              </div>

              <div className="memorial-reveal-actions">
                <button
                  type="button"
                  className="memorial-cta-primary"
                  onClick={onExploreMonuments}
                >
                  Explore Our Monuments
                  <ArrowRight size={14} />
                </button>

                <button
                  type="button"
                  className="memorial-cta-back"
                  onClick={onClose}
                >
                  <ArrowLeft size={14} />
                  Return to Landscape
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
