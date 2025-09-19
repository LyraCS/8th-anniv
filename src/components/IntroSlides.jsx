// src/components/IntroSlides.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import slides from "../data/introSlides";

export default function IntroSlides({ onComplete }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < slides.length - 1) {
      const timer = setTimeout(() => {
        setIndex(index + 1);
      }, 3000); // 1.8s per slide
      return () => clearTimeout(timer);
    } else {
      // last slide, go to main content after a pause
      const timer = setTimeout(() => {
        onComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [index]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#0d0b1a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      <AnimatePresence mode="wait">
        <motion.h1
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8 }}
          style={{
            color: "white",
            fontSize: "2rem",
            textAlign: "center",
            fontWeight: "700",
          }}
        >
          {slides[index]}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
}
