// src/components/Card.jsx
import { motion } from "framer-motion";

export default function Card({ open, onOpen }) {
  return (
    <motion.div
      className="card"
      style={{
        width: 320,
        height: 200,
        perspective: 1000,
        cursor: "pointer",
        margin: "0 auto",
        position: "relative",
      }}
      onClick={() => !open && onOpen()}
      title={open ? "Opened" : "Tap to open"}
    >
      {/* inner wrapper */}
      <motion.div
        initial={{ rotateY: 0 }}
        animate={{ rotateY: open ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 12 }}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
        }}
      >
        {/* front */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 30,
          }}
        >
          💖  Click Here To Open!
        </div>

        {/* back */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 30,
            transform: "rotateY(180deg)", // only the back flips
          }}
        >
          💕 Opened
        </div>
      </motion.div>
    </motion.div>
  );
}
