import React, { useMemo, useState } from "react";
import "./PhotosPage.css";

const modules = import.meta.glob("../assets/images/*.{png,jpg,jpeg,webp,gif}", {
  eager: true,
});

function usePhotos() {
  return useMemo(() => {
    try {
      const entries = Object.entries(modules).sort(([a], [b]) =>
        a.localeCompare(b)
      );
      return entries.map(([path, mod]) => {
        const url = mod?.default || "";
        const file = path.split("/").pop() || "";
        const base = file.replace(/\.[^.]+$/, "");
        const caption = base
          .replace(/[-_]+/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        return { src: url, caption: caption || "Memory" };
      });
    } catch (e) {
      console.error("Photo glob failed:", e);
      return [];
    }
  }, []);
}

export default function PhotosPage() {
  const photos = usePhotos();
  const [selected, setSelected] = useState(null);

  if (!photos.length) {
    return (
      <div className="page photos-page">
        <h1 className="page-title">Fav Pics Of Us</h1>
        <p style={{ opacity: 0.8 }}>
          Drop images into <code>src/assets/images</code> then restart dev server.
        </p>
      </div>
    );
  }

  return (
    <div className="page photos-page">
      <h1 className="page-title">Fav Pics Of Us</h1>

      {/* internal vertical scroller with hidden scrollbar */}
      <div className="photos-scroll">
        <div className="polaroid-grid">
          {photos.map((p, i) => (
            <div
              key={p.src}
              className="polaroid"
              style={{
                transform: `rotate(${(i % 2 === 0 ? 1 : -1) * (5 + (i % 6))}deg)`,
              }}
              onClick={() => setSelected({ ...p, index: i })}
              title={p.caption}
            >
              <img src={p.src} alt={p.caption} />
              <span>{p.caption}</span>
            </div>
          ))}
        </div>

        {/* spacer so last row isn’t under the bottom nav */}
        <div style={{ height: 120 }} />
      </div>

      {selected && (
        <div className="overlay" onClick={() => setSelected(null)}>
          <img src={selected.src} alt={selected.caption} className="enlarged" />
          <p>{selected.caption}</p>
        </div>
      )}
    </div>
  );
}
