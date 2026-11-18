import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function Footer({ preselectedMonument }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    monumentType: preselectedMonument || "Upright Monuments",
    notes: "",
  });
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (preselectedMonument) {
      setFormData((prev) => ({ ...prev, monumentType: preselectedMonument }));
      setSubmitted(false);
    }
  }, [preselectedMonument]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Please share your name so we know who to address.");
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
    if (!emailOk && !formData.phone.trim()) {
      setError("Please provide a valid email address or phone number.");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  return (
    <footer id="contact" className="site-footer">
      <div className="footer-inner">
        <div className="consultation-grid">
          <div>
            <span className="chip">Consultation &amp; Quote Request</span>
            <h2
              style={{
                marginTop: "16px",
                fontFamily: "var(--serif)",
                fontWeight: 500,
                fontSize: "clamp(34px, 3.8vw, 52px)",
                lineHeight: 1.04,
                letterSpacing: "-0.03em",
                textWrap: "balance",
              }}
            >
              Let Us Help You Honor a Cherished Life.
            </h2>
            <p
              style={{
                marginTop: "16px",
                fontSize: "15.5px",
                lineHeight: 1.7,
                color: "rgba(247, 246, 242, 0.78)",
                maxWidth: "46ch",
              }}
            >
              Share what you have in mind—whether an upright family monument, a
              companion memorial, or a lawn-level marker—and we will respond
              with thoughtful design guidance and transparent options.
            </p>
          </div>

          <div>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                style={{
                  padding: "28px",
                  borderRadius: "10px",
                  background: "rgba(247, 246, 242, 0.06)",
                  border: "1px solid rgba(210, 188, 145, 0.45)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    color: "var(--gold2)",
                    marginBottom: "10px",
                  }}
                >
                  <CheckCircle2 size={20} />
                  <span className="mono">Request Received</span>
                </div>
                <h3
                  style={{
                    fontFamily: "var(--serif)",
                    fontSize: "28px",
                    fontWeight: 500,
                    marginBottom: "10px",
                  }}
                >
                  Thank you, {formData.name}.
                </h3>
                <p
                  style={{
                    fontSize: "14.5px",
                    lineHeight: 1.65,
                    color: "rgba(247, 246, 242, 0.82)",
                    marginBottom: "18px",
                  }}
                >
                  We have recorded your inquiry for{" "}
                  <strong style={{ color: "#f7f6f2" }}>
                    {formData.monumentType}
                  </strong>{" "}
                  and will follow up thoughtfully with design options and
                  next steps.
                </p>
                <button
                  type="button"
                  className="memorial-cta-back"
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Note
                </button>
              </motion.div>
            ) : (
              <form className="consult-form" onSubmit={handleSubmit} noValidate>
                <div className="consult-field">
                  <label htmlFor="consult-name" className="mono">
                    Full Name
                  </label>
                  <input
                    id="consult-name"
                    name="name"
                    type="text"
                    className="consult-input"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="consult-field">
                  <label htmlFor="consult-email" className="mono">
                    Email Address
                  </label>
                  <input
                    id="consult-email"
                    name="email"
                    type="email"
                    className="consult-input"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="consult-field">
                  <label htmlFor="consult-phone" className="mono">
                    Phone Number
                  </label>
                  <input
                    id="consult-phone"
                    name="phone"
                    type="tel"
                    className="consult-input"
                    placeholder="Optional phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="consult-field">
                  <label htmlFor="consult-type" className="mono">
                    Monument Style
                  </label>
                  <input
                    id="consult-type"
                    name="monumentType"
                    type="text"
                    className="consult-input"
                    value={formData.monumentType}
                    onChange={handleChange}
                  />
                </div>

                <div className="consult-field consult-field--full">
                  <label htmlFor="consult-notes" className="mono">
                    Inscription Ideas or Questions
                  </label>
                  <textarea
                    id="consult-notes"
                    name="notes"
                    rows="3"
                    className="consult-input"
                    placeholder="Share preferred granite tones, floral carvings, or cemetery requirements..."
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </div>

                {error && (
                  <p
                    role="alert"
                    className="consult-field--full"
                    style={{ color: "#f3c79b", fontSize: "13px" }}
                  >
                    {error}
                  </p>
                )}

                <div className="consult-field--full">
                  <button type="submit" className="consult-submit">
                    Request a Personal Quote
                    <ArrowRight size={14} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                fontFamily: "var(--serif)",
                fontSize: "20px",
                color: "#f7f6f2",
              }}
            >
              C &amp; M Monument Company
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              fontFamily: "var(--mono)",
              fontSize: "10.5px",
              letterSpacing: "0.13em",
              textTransform: "uppercase",
            }}
          >
            <a href="#top">Home</a>
            <a href="#about">About Us</a>
            <a href="#monuments">Our Monuments</a>
            <a href="#gallery">Gallery</a>
            <a href="#services">Services</a>
          </div>

          <p className="mono">
            &copy; {new Date().getFullYear()} C &amp; M Monument Company
          </p>
        </div>
      </div>
    </footer>
  );
}
