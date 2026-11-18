import { useCallback, useEffect, useState } from "react";
import { MotionConfig } from "motion/react";
import Navbar from "./components/Navbar.jsx";
import CinematicStory from "./components/CinematicStory.jsx";
import MonumentCollection from "./components/MonumentCollection.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  const [isLightNav, setIsLightNav] = useState(false);
  const [preselectedMonument, setPreselectedMonument] = useState("");

  useEffect(() => {
    const checkNavTheme = () => {
      const monumentsEl = document.getElementById("monuments");
      if (!monumentsEl) return;
      const rect = monumentsEl.getBoundingClientRect();
      setIsLightNav(rect.top <= 76);
    };

    checkNavTheme();
    window.addEventListener("scroll", checkNavTheme, { passive: true });
    window.addEventListener("resize", checkNavTheme, { passive: true });
    return () => {
      window.removeEventListener("scroll", checkNavTheme);
      window.removeEventListener("resize", checkNavTheme);
    };
  }, []);

  const handleNavigate = useCallback((href) => {
    if (href === "#top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleExploreMonuments = useCallback(() => {
    const target = document.getElementById("monuments");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleRequestMonumentQuote = useCallback((monumentLabel) => {
    setPreselectedMonument(monumentLabel);
    const contactEl = document.getElementById("contact");
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div id="top">
        <Navbar isLightNav={isLightNav} onNavigate={handleNavigate} />
        <main>
          <CinematicStory onExploreMonuments={handleExploreMonuments} />
          <MonumentCollection
            onRequestMonumentQuote={handleRequestMonumentQuote}
          />
        </main>
        <Footer preselectedMonument={preselectedMonument} />
      </div>
    </MotionConfig>
  );
}
