import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import MonumentCard from "./MonumentCard.jsx";

const MONUMENTS = [
  {
    id: "upright",
    category: "Collection 01 · Upright",
    title: "Upright Monuments",
    description: "Traditional and custom upright memorial designs.",
    image: "/src/assets/images/craftsmanship_monument_close_1795006425218.jpg",
    alt: "Polished dark granite upright monument with carved floral shoulder details in a misty cemetery",
    extendedCopy:
      "Standing gracefully atop a matched granite base, our upright monuments offer generous surface area for custom family lettering, carved floral borders, and personal symbolic motifs.",
    finishes: ["Charcoal Granite", "Classic Silver-Grey", "Warm Mahogany Rose"],
  },
  {
    id: "companion",
    category: "Collection 02 · Companion",
    title: "Companion Monuments",
    description:
      "Memorial designs created to commemorate two loved ones.",
    image: "/src/assets/images/companion_monument_1795006424293.jpg",
    alt: "Double companion granite memorial with twin carved panels and floral relief",
    extendedCopy:
      "Thoughtfully proportioned double memorials uniting two tributes side by side, balanced with shared family inscriptions and hand-carved botanical relief.",
    finishes: ["Warm Rose-Grey Granite", "Charcoal Granite", "Soft Pearl Grey"],
  },
  {
    id: "markers",
    category: "Collection 03 · Markers",
    title: "Flat & Slant Markers",
    description: "Elegant, space-conscious memorial options.",
    image: "/src/assets/images/flat_slant_marker_1795006427071.jpg",
    alt: "Polished grey granite slant marker and flush lawn-level marker in sunlit cemetery grass",
    extendedCopy:
      "Clean lawn-level flat markers and angled slant memorials crafted to meet cemetery park guidelines while preserving crisp engraving clarity and dignified presence.",
    finishes: ["Classic Silver-Grey", "Charcoal Granite", "Warm Heather Grey"],
  },
];

const HIGHLIGHTS = [
  {
    title: "Thoughtful Design",
    desc: "Balanced proportions tailored to honor each individual life.",
  },
  {
    title: "Quality Materials",
    desc: "Enduring natural granite finished for lasting clarity.",
  },
  {
    title: "Personalization",
    desc: "Custom lettering, borders, and meaningful emblems.",
  },
  {
    title: "Lasting Remembrance",
    desc: "Created with care to preserve precious family memories.",
  },
];

const SERVICES_STEPS = [
  {
    num: "01",
    title: "Compassionate Design Consultation",
    desc: "We listen closely to the stories and small details that remind you of your loved one, guiding you through shapes, granite colors, and inscriptions without pressure.",
  },
  {
    num: "02",
    title: "Custom Layout & Lettering Proofs",
    desc: "Before a single cut is carved, we prepare clear layout drawings showing typography, emblems, and border proportions for your review.",
  },
  {
    num: "03",
    title: "Precision Carving & Finishing",
    desc: "Skilled craftspeople shape beveled edges, polished planes, and deep, legible engravings designed to remain dignified through every season.",
  },
  {
    num: "04",
    title: "Cemetery Coordination & Placement",
    desc: "We ensure every monument meets specific memorial park sizing and foundation standards for respectful, lasting placement.",
  },
];

export default function MonumentCollection({ onRequestMonumentQuote }) {
  const [selected, setSelected] = useState(MONUMENTS[0]);
  const [selectedFinish, setSelectedFinish] = useState(MONUMENTS[0].finishes[0]);

  const handleSelectMonument = (monument) => {
    setSelected(monument);
    setSelectedFinish(monument.finishes[0]);
  };

  return (
    <section id="monuments" aria-label="Monument Collection">
      <div className="monuments-container">
        <motion.div
          className="monuments-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <span className="chip chip--light">Our Monuments</span>
          <h2 className="monuments-title">
            A Beautiful Tribute for Every Memory.
          </h2>
          <p className="monuments-subtitle">
            Discover meaningful memorial designs created to honor loved ones
            and preserve their memories for generations.
          </p>
        </motion.div>

        <div className="monuments-grid">
          {MONUMENTS.map((monument, idx) => (
            <MonumentCard
              key={monument.id}
              monument={monument}
              index={idx}
              isSelected={selected.id === monument.id}
              onSelect={handleSelectMonument}
            />
          ))}
        </div>

        {/* Interactive Monument Detail Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selected.id}
            className="monument-detail-panel"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <img
              src={selected.image}
              alt={selected.alt}
              className="monument-detail-img"
              referrerPolicy="no-referrer"
            />
            <div>
              <p className="mono" style={{ color: "#8f723f", marginBottom: "8px" }}>
                {selected.category}
              </p>
              <h3
                style={{
                  fontFamily: "var(--serif)",
                  fontSize: "clamp(26px, 2.4vw, 34px)",
                  fontWeight: 500,
                  lineHeight: 1.1,
                  marginBottom: "10px",
                }}
              >
                {selected.title}
              </h3>
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: 1.65,
                  color: "var(--ink2)",
                  marginBottom: "18px",
                  maxWidth: "56ch",
                }}
              >
                {selected.extendedCopy}
              </p>

              <div style={{ marginBottom: "20px" }}>
                <p
                  className="mono"
                  style={{ color: "var(--ink2)", marginBottom: "8px" }}
                >
                  Available Granite Finishes
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {selected.finishes.map((finish) => {
                    const active = selectedFinish === finish;
                    return (
                      <button
                        key={finish}
                        type="button"
                        onClick={() => setSelectedFinish(finish)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "7px 12px",
                          borderRadius: "4px",
                          fontFamily: "var(--mono)",
                          fontSize: "10.5px",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          border: active
                            ? "1px solid #8f723f"
                            : "1px solid rgba(41, 44, 41, 0.16)",
                          background: active
                            ? "rgba(182, 154, 103, 0.16)"
                            : "#fff",
                          color: "var(--ink)",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {active && <Check size={12} aria-hidden="true" />}
                        {finish}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                className="memorial-cta-primary"
                onClick={() =>
                  onRequestMonumentQuote(`${selected.title} (${selectedFinish})`)
                }
              >
                Inquire About {selected.title}
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Four Non-Numeric Service Highlights */}
        <div className="highlights-grid">
          {HIGHLIGHTS.map((item, idx) => (
            <motion.div
              key={item.title}
              className="highlight-item"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
            >
              <h3 className="highlight-heading">{item.title}</h3>
              <p className="highlight-desc">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* About Us Band */}
        <div id="about" className="editorial-band">
          <div className="services-split">
            <div>
              <span className="chip chip--light">About Us</span>
              <h2 className="monuments-title">
                Every Life Deserves a Beautiful Tribute.
              </h2>
            </div>
            <div>
              <p
                style={{
                  fontSize: "17px",
                  lineHeight: 1.7,
                  color: "var(--ink)",
                  marginBottom: "16px",
                }}
              >
                C &amp; M Monument Company was born from the belief that we
                could help loved ones in time of loss by providing quality
                markers of remembrance at an affordable cost.
              </p>
              <p
                style={{
                  fontSize: "15.5px",
                  lineHeight: 1.7,
                  color: "var(--ink2)",
                }}
              >
                Our goal is to offer monuments that beautifully celebrate the
                life of the one who has passed on. We care about the little
                things that remind us of our loved ones and the life they lived.
              </p>
            </div>
          </div>
        </div>

        {/* Gallery Showcase Band */}
        <div id="gallery" className="editorial-band">
          <span className="chip chip--light">Gallery</span>
          <h2 className="monuments-title">
            Memorials Set in Quiet Natural Surroundings.
          </h2>
          <div className="gallery-showcase-grid">
            <div className="gallery-frame">
              <img
                src="/src/assets/images/hero_cemetery_still_1795006422575.jpg"
                alt="Upright charcoal granite monument along a stone cemetery walkway"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="gallery-caption">
                <p className="mono" style={{ color: "var(--gold2)" }}>
                  Estate &amp; Park Setting
                </p>
                <p style={{ fontFamily: "var(--serif)", fontSize: "22px" }}>
                  Classical Upright Granite
                </p>
              </div>
            </div>

            <div className="gallery-frame">
              <img
                src="/src/assets/images/companion_monument_1795006424293.jpg"
                alt="Warm rose-grey companion granite monument with carved floral pillar"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="gallery-caption">
                <p className="mono" style={{ color: "var(--gold2)" }}>
                  Shared Tribute
                </p>
                <p style={{ fontFamily: "var(--serif)", fontSize: "22px" }}>
                  Carved Floral Companion
                </p>
              </div>
            </div>

            <div className="gallery-frame">
              <img
                src="/src/assets/images/flat_slant_marker_1795006427071.jpg"
                alt="Slant and flat granite lawn-level markers"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="gallery-caption">
                <p className="mono" style={{ color: "var(--gold2)" }}>
                  Lawn &amp; Slant Profiles
                </p>
                <p style={{ fontFamily: "var(--serif)", fontSize: "22px" }}>
                  Engraved Bevel Markers
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Services Band */}
        <div id="services" className="editorial-band">
          <div className="services-split">
            <div>
              <span className="chip chip--light">Services</span>
              <h2 className="monuments-title">
                Guided Support From First Sketch to Placement.
              </h2>
              <p className="monuments-subtitle">
                We make choosing and personalizing a memorial clear, calm, and
                thoughtful for every family.
              </p>
            </div>

            <div className="service-step-list">
              {SERVICES_STEPS.map((step) => (
                <div key={step.num} className="service-step-row">
                  <span
                    className="mono tabular-nums"
                    style={{ color: "#8f723f", fontWeight: 600 }}
                  >
                    {step.num}
                  </span>
                  <div>
                    <h3
                      style={{
                        fontFamily: "var(--serif)",
                        fontSize: "24px",
                        fontWeight: 500,
                        lineHeight: 1.2,
                        marginBottom: "6px",
                      }}
                    >
                      {step.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "14.5px",
                        lineHeight: 1.65,
                        color: "var(--ink2)",
                      }}
                    >
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
