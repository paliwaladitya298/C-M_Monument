import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export default function MonumentCard({
  monument,
  index,
  isSelected,
  onSelect,
}) {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const handlePointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: Number((-y * 6).toFixed(2)),
      ry: Number((x * 6).toFixed(2)),
    });
  };

  const handlePointerLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  return (
    <motion.div
      className="monument-card-shell"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.2, 0.8, 0.2, 1],
      }}
    >
      <button
        type="button"
        className={`monument-card ${isSelected ? "monument-card--selected" : ""}`}
        onClick={() => onSelect(monument)}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        aria-pressed={isSelected}
        style={{
          transform: `perspective(1000px) rotateY(${tilt.ry}deg) rotateX(${tilt.rx}deg)`,
        }}
      >
        <img
          src={monument.image}
          alt={monument.alt}
          className="monument-card-img"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="monument-card-scrim" />

        <div className="monument-card-top">
          <span className="monument-card-category">{monument.category}</span>
          <span className="monument-card-arrow" aria-hidden="true">
            <ArrowRight size={15} />
          </span>
        </div>

        <div className="monument-card-bottom">
          <h3 className="monument-card-title">{monument.title}</h3>
          <div className="monument-card-desc-wrap">
            <p className="monument-card-desc">{monument.description}</p>
          </div>
        </div>
      </button>
    </motion.div>
  );
}
