import { ArrowDown } from "lucide-react";

export default function Hero({
  stillRef,
  headlineRef,
  hudRef,
  metaRef,
  stillSrc,
  isRevealed,
}) {
  return (
    <>
      {/* High-resolution hero still (dissolves cleanly into video frame 0 during .06-.105) */}
      <div ref={stillRef} className="layer hero-still-layer">
        <img
          src={stillSrc}
          alt="Peaceful morning cemetery landscape featuring a polished charcoal granite upright monument"
          className="hero-still-img"
          referrerPolicy="no-referrer"
        />
        <div className="layer hero-scrim" />
      </div>

      {/* Centered Hero Headline */}
      <div
        ref={headlineRef}
        className="layer hero-headline-layer"
        style={{
          opacity: isRevealed ? 0 : undefined,
          transition: isRevealed ? "opacity 0.35s ease" : undefined,
        }}
      >
        <div className="hero-chip-wrap">
          <span className="chip">C &amp; M Monument Company</span>
        </div>
        <div className="hero-title-mask">
          <h1 className="hero-title">A Lasting Tribute. A Timeless Memory.</h1>
        </div>
      </div>

      {/* Hero Craftsmanship HUD */}
      <div
        ref={hudRef}
        className="layer hero-hud-layer"
        style={{
          opacity: isRevealed ? 0 : undefined,
          transition: isRevealed ? "opacity 0.25s ease" : undefined,
        }}
      >
        <aside className="hero-hud" aria-label="Monument Craftsmanship Highlights">
          <span className="hero-hud-corner hero-hud-corner--tl" />
          <span className="hero-hud-corner hero-hud-corner--tr" />
          <span className="hero-hud-corner hero-hud-corner--bl" />
          <span className="hero-hud-corner hero-hud-corner--br" />
          <p className="hero-hud-title">Monument Craftsmanship</p>
          <ul className="hero-hud-list">
            <li>Premium Granite</li>
            <li>Personalized Engraving</li>
            <li>Quality Finishing</li>
          </ul>
        </aside>
      </div>

      {/* Bottom Left Caption & Bottom Right Scroll Indicator */}
      <div
        ref={metaRef}
        className="layer hero-meta-layer"
        style={{
          opacity: isRevealed ? 0 : undefined,
          transition: isRevealed ? "opacity 0.25s ease" : undefined,
        }}
      >
        <p className="hero-caption">
          Honoring a lifetime of memories.
          <br />
          Crafted with care and attention.
          <br />
          Designed to preserve what matters.
        </p>

        <div className="scroll-hint" aria-hidden="true">
          <span>Scroll to Explore</span>
          <span className="scroll-hint-circle">
            <ArrowDown size={12} className="scroll-arrow-svg" />
          </span>
        </div>
      </div>
    </>
  );
}
