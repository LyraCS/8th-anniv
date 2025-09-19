// src/components/RiddleHint.jsx
import { useState } from "react";

export default function RiddleHint({ onSolved }) {
  const [open, setOpen] = useState(false);
  const riddle = "I glow at night and whisper your name. Tap my sparkle to unlock the flame.";

  return (
    <div style={{ position: "fixed", top: 16, right: 16, zIndex: 20 }}>
      <button className="button" onClick={() => setOpen(v => !v)}>?</button>
      {open && (
        <div className="card" style={{ marginTop: 8, width: 260 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Riddle</div>
          <div style={{ fontSize: 14, lineHeight: 1.5 }}>{riddle}</div>
          <button className="button" style={{ marginTop: 10 }} onClick={() => onSolved?.()}>
            I solved it
          </button>
        </div>
      )}
    </div>
  );
}
