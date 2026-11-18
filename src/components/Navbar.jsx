import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "#top" },
  { label: "About Us", href: "#about" },
  { label: "Our Monuments", href: "#monuments" },
  { label: "Gallery", href: "#gallery" },
  { label: "Services", href: "#services" },
];

export default function Navbar({ isLightNav, onNavigate }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    if (onNavigate) {
      onNavigate(href);
    } else {
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header className={`site-nav ${isLightNav ? "site-nav--light" : ""}`}>
        <a
          href="#top"
          className="nav-brand"
          onClick={(e) => handleLinkClick(e, "#top")}
          aria-label="C & M Monument Company Home"
        >
          <svg
            className="nav-brand-mark"
            viewBox="0 0 36 36"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="18"
              cy="18"
              r="15.5"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <circle
              cx="18"
              cy="18"
              r="12"
              stroke="#b69a67"
              strokeWidth="1"
              strokeOpacity="0.8"
            />
            <text
              x="18"
              y="21.5"
              textAnchor="middle"
              fill="currentColor"
              style={{
                fontFamily: "var(--serif)",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.02em",
              }}
            >
              C&amp;M
            </text>
          </svg>
          <span className="nav-brand-text">C &amp; M Monument Company</span>
        </a>

        <nav className="nav-links" aria-label="Primary Navigation">
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="nav-link"
              onClick={(e) => handleLinkClick(e, item.href)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <a
            href="#contact"
            className="nav-cta"
            onClick={(e) => handleLinkClick(e, "#contact")}
          >
            <span className="nav-cta-label">Request a Quote</span>
            <span className="nav-cta-square" aria-hidden="true">
              <ArrowRight size={13} strokeWidth={2} />
            </span>
          </a>

          <button
            type="button"
            className="nav-mobile-toggle"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-drawer"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
          >
            {NAV_LINKS.map((item, idx) => (
              <motion.a
                key={item.href}
                href={item.href}
                className="mobile-drawer-link"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + idx * 0.04, duration: 0.28 }}
                onClick={(e) => handleLinkClick(e, item.href)}
              >
                {item.label}
              </motion.a>
            ))}
            <motion.a
              href="#contact"
              className="memorial-cta-primary"
              style={{ marginTop: "16px", alignSelf: "flex-start" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.26 }}
              onClick={(e) => handleLinkClick(e, "#contact")}
            >
              Request a Quote
              <ArrowRight size={14} />
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
