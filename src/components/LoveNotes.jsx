// src/components/LoveNotes.jsx
import { useState } from "react";
import notes from "../data/loveNotes";

export default function LoveNotes() {
  const [note, setNote] = useState(notes[0] ?? "Still love you if the light goes out.");
  const next = () => setNote(notes[Math.floor(Math.random() * notes.length)]);
  return (
    <div className="card" style={{ maxWidth: 720 }}>
      <h3 style={{ marginTop: 0, fontSize: 25 }}>Lyrics Snippets!</h3>
      <p style={{ fontSize: 18 }}>{note}</p>
      <button className="button" onClick={next}>CLICK HERE TO RANDOMIZE</button>
    </div>
  );
}
