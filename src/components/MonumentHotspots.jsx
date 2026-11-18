import { useState } from "react";
import { motion } from "motion/react";

const HOTSPOTS = [
  {
    id: "granite",
    num: "1",
    label: "Premium Granite",
    description:
      "Dense, weather-resilient natural granite chosen for enduring color, rich crystalline grain, and timeless dignity.",
    pos: { left: "61%", top: "24%" },
  },
  {
    id: "engraving",
    num: "2",
    label: "Detailed Engraving",
    description:
      "Crisp custom lettering, dates, and meaningful emblems carved with precision to honor every personal story.",
    pos: { left: "70%", top: "43%" },
  },
  {
    id: "designs",
    num: "3",
    label: "Custom Memorial Designs",
    description:
      "Thoughtfully shaped upright monuments, companion memorials, and flat or slant markers tailored to each family.",
    pos: { left: "53%", top: "58%" },
  },
  {
    id: "craftsmanship",
    num: "4",
    label: "Quality Craftsmanship",
    description:
      "Careful attention to beveled shoulders, polished planes, and balanced proportions that endure across generations.",
    pos: { left: "66%", top: "73%" },
  },
];

export default function MonumentHotspots({ registerHotspotRef }) {
  const [openId, setOpenId] = useState(null);

  const toggleHotspot = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      {HOTSPOTS.map((spot, idx) => {
        const isOpen = openId === spot.id;
        return (
          <div
            key={spot.id}
            ref={(el) => registerHotspotRef(idx, el)}
            className="hotspot-item"
            style={{
              left: spot.pos.left,
              top: spot.pos.top,
              opacity: 0,
              visibility: "hidden",
            }}
          >
            <motion.button
              type="button"
              className="hotspot-btn interactive"
              aria-expanded={isOpen}
              onClick={() => toggleHotspot(spot.id)}
              whileTap={{ scale: 0.97 }}
            >
              <span className="hotspot-dot-wrap" aria-hidden="true">
                <span className="hotspot-pulse" />
                <span className="hotspot-marker">{spot.num}</span>
              </span>

              <span className="hotspot-glass">
                <span className="hotspot-label">{spot.label}</span>
                <span
                  className={`hotspot-desc-wrap ${
                    isOpen ? "hotspot-desc-wrap--open" : ""
                  }`}
                >
                  <span className="hotspot-desc" style={{ display: "block" }}>
                    {spot.description}
                  </span>
                </span>
              </span>
            </motion.button>
          </div>
        );
      })}
    </>
  );
}
