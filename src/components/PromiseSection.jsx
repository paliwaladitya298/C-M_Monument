import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";

const PROMISE_FEATURES = [
  {
    num: "01",
    title: "Meaningful Remembrance",
    detail:
      "Every proportion, inscription, and emblem is composed to reflect the individuality of a cherished life.",
  },
  {
    num: "02",
    title: "Quality Craftsmanship",
    detail:
      "Polished surfaces, crisp chamfers, and balanced granite bases finished with enduring structural care.",
  },
  {
    num: "03",
    title: "Custom Monument Designs",
    detail:
      "Traditional uprights, companion monuments, and bespoke forms tailored to family traditions and cemetery guidelines.",
  },
  {
    num: "04",
    title: "Affordable Memorial Options",
    detail:
      "Clear, compassionate guidance helping families select quality stone markers within their budget.",
  },
  {
    num: "05",
    title: "Personal Attention to Detail",
    detail:
      "Dedicated care for the subtle touches, borders, and inscriptions that keep loved ones close in memory.",
  },
];

export default function PromiseSection({
  layerRef,
  headingRef,
  cardRef,
  featuresWrapRef,
  svgPathRef,
  registerRowRef,
  onSelectFeature,
}) {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div
      ref={layerRef}
      className="layer promise-layer"
      style={{ opacity: 0, visibility: "hidden" }}
    >
      <div
        ref={headingRef}
        className="promise-heading-wrap"
        style={{ opacity: 0, visibility: "hidden" }}
      >
        <p className="promise-kicker">C &amp; M / Our Promise</p>
        <h2 className="promise-heading">Made with Care. Created to Last.</h2>
      </div>

      <div
        ref={cardRef}
        className="promise-card-wrap"
        style={{ opacity: 0, visibility: "hidden" }}
      >
        <div className="promise-glass-card">
          <svg
            className="promise-card-svg"
            viewBox="0 0 214 64"
            fill="none"
            aria-hidden="true"
          >
            <path
              ref={svgPathRef}
              d="M28 58 H186 M42 58 V50 H172 V58 M58 50 V22 C58 12 82 6 107 6 C132 6 156 12 156 22 V50 M74 44 V24 C74 17 90 13 107 13 C124 13 140 17 140 24 V44"
              stroke="#d2bc91"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="560"
              strokeDashoffset="560"
            />
          </svg>
          <h3 className="promise-card-title">Thoughtful Memorial Craftsmanship</h3>
          <p className="promise-card-note">A tribute shaped around a life</p>
          <p className="promise-card-highlight">Personalized Details</p>
        </div>
      </div>

      <div
        ref={featuresWrapRef}
        className="promise-features-wrap"
        style={{ opacity: 0, visibility: "hidden" }}
      >
        {PROMISE_FEATURES.map((item, idx) => {
          const isActive = activeIdx === idx;
          return (
            <button
              key={item.num}
              type="button"
              ref={(el) => registerRowRef(idx, el)}
              className={`promise-feature-row interactive ${
                isActive ? "promise-feature-row--active" : ""
              }`}
              style={{ opacity: 0, visibility: "hidden" }}
              onClick={() => {
                setActiveIdx(idx);
                if (onSelectFeature) onSelectFeature(item);
              }}
            >
              <span className="promise-feature-num">{item.num}</span>
              <span>{item.title}</span>
              <ArrowRight
                size={13}
                className="promise-feature-arrow"
                aria-hidden="true"
              />
            </button>
          );
        })}

        <AnimatePresence mode="wait">
          <motion.p
            key={PROMISE_FEATURES[activeIdx].num}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22 }}
            style={{
              fontSize: "12px",
              lineHeight: 1.5,
              color: "rgba(247, 246, 242, 0.78)",
              padding: "10px 0 6px",
              borderTop: "1px solid rgba(255, 255, 255, 0.12)",
            }}
          >
            {PROMISE_FEATURES[activeIdx].detail}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
