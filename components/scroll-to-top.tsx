"use client";

import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 520);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  function goToTop() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          animate={{ opacity: 1, scale: 1, y: 0 }}
          aria-label="Scroll back to top"
          className="scroll-to-top group"
          exit={{ opacity: 0, scale: 0.88, y: 10 }}
          initial={{ opacity: 0, scale: 0.88, y: 10 }}
          onClick={goToTop}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.94 }}
        >
          <span className="scroll-to-top-ring" />
          <ArrowUp aria-hidden="true" size={18} />
          <span className="scroll-to-top-label">Back to top</span>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
