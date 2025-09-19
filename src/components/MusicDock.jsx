import { useCallback, useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import { motion, AnimatePresence } from "framer-motion";
import playlist from "../data/playlist";

export default function MusicDock({ autoStart = true, autohideMs = 3000 }) {
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [isPlaying, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [blocked, setBlocked] = useState(false);
  const soundRef = useRef(null);
  const hideTimerRef = useRef(null);
  const rafRef = useRef(null);

  const current = playlist[index];

  const clearHideTimer = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const scheduleAutoHide = () => {
    clearHideTimer();
    hideTimerRef.current = setTimeout(() => setExpanded(false), autohideMs);
  };

  const startRaf = () => {
    cancelAnimationFrame(rafRef.current);
    const tick = () => {
      const s = soundRef.current;
      if (s && s.playing() && s.duration()) {
        const p = s.seek() / s.duration();
        setProgress(Number.isFinite(p) ? p : 0);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const stopRaf = () => cancelAnimationFrame(rafRef.current);

  const loadTrack = useCallback((i) => {
    const t = playlist[i];
    if (!t) return;

    if (soundRef.current) {
      try {
        soundRef.current.unload();
      } catch {}
      soundRef.current = null;
    }

    const howl = new Howl({
      src: [t.url],
      html5: true,
      volume:  t.volume ?? 0.1,
      onload: () => {
        setExpanded(true);
        setBlocked(false);
        try {
          howl.play();
          setPlaying(true);
          startRaf();
          scheduleAutoHide();
        } catch (e) {
          console.warn("Autoplay blocked:", e);
          setBlocked(true);
          setExpanded(true);
        }
      },
      onplayerror: (id, err) => {
        console.warn("onplayerror:", err);
        setBlocked(true);
        setExpanded(true);
      },
      onloaderror: (id, err) => {
        console.error("Failed to load audio:", t.url, err);
      },
      onend: () => next(),
    });

    soundRef.current = howl;
    setProgress(0);
  }, []);

  const next = useCallback(() => {
    setIndex((prev) => {
      const ni = (prev + 1) % playlist.length;
      setTimeout(() => loadTrack(ni), 0);
      return ni;
    });
  }, [loadTrack]);

  const prev = useCallback(() => {
    setIndex((prev) => {
      const pi = (prev - 1 + playlist.length) % playlist.length;
      setTimeout(() => loadTrack(pi), 0);
      return pi;
    });
  }, [loadTrack]);

  const toggle = useCallback(() => {
    const s = soundRef.current;
    if (!s) return;
    if (s.playing()) {
      s.pause();
      setPlaying(false);
      stopRaf();
    } else {
      s.play();
      setPlaying(true);
      startRaf();
    }
  }, []);

  useEffect(() => {
    if (!autoStart) return;
    loadTrack(index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  useEffect(() => {
    return () => {
      clearHideTimer();
      stopRaf();
      if (soundRef.current) try { soundRef.current.unload(); } catch {}
    };
  }, []);

  const userStart = () => {
    if (!soundRef.current) {
      loadTrack(index);
      return;
    }
    setBlocked(false);
    setExpanded(true);
    try {
      soundRef.current.play();
      setPlaying(true);
      startRaf();
      scheduleAutoHide();
    } catch (e) {
      console.warn("Play failed:", e);
    }
  };

  const widthCollapsed = 56;
  const widthExpanded = 340;

  return (
    <>
      {/* collapsed button only visible when not expanded */}
      {!expanded && (
        <motion.button
          aria-label="Open player"
          onClick={() => {
            if (blocked || !soundRef.current) {
              userStart();
              return;
            }
            setExpanded(true);
            if (isPlaying) scheduleAutoHide();
          }}
          style={{
            position: "fixed",
            right: 16,
            bottom: 16,
            width: widthCollapsed,
            height: widthCollapsed,
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.12)",
            overflow: "hidden",
            padding: 0,
            cursor: "pointer",
            zIndex: 70,
            background: "#1a1630",
          }}
        >
          {current?.cover ? (
            <img
              src={current.cover}
              alt="" // no tooltip
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => {
                console.error("Cover failed to load:", current.cover);
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 20,
              }}
            >
              🎵
            </div>
          )}
        </motion.button>
      )}

      {/* expanded dock */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="dock"
            initial={{ opacity: 0, x: 20, width: widthCollapsed }}
            animate={{ opacity: 1, x: 0, width: widthExpanded }}
            exit={{ opacity: 0, x: 20, width: widthCollapsed }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{
              position: "fixed",
              right: 16,
              bottom: 16,
              height: 64,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 14,
              background: "rgba(26,22,48,0.95)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#fff",
              zIndex: 69,
              backdropFilter: "blur(10px)",
              boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
              overflow: "hidden",
            }}
            onMouseEnter={() => clearHideTimer()}
            onMouseLeave={() => {
              if (isPlaying && !blocked) scheduleAutoHide();
            }}
          >
            {/* cover */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 8,
                overflow: "hidden",
                flex: "0 0 auto",
                background: "#2a2547",
              }}
            >
              {current?.cover ? (
                <img
                  src={current.cover}
                  alt="" // no tooltip
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                  }}
                >
                  🎵
                </div>
              )}
            </div>

            {/* meta + progress */}
            <div style={{ minWidth: 0, flex: "1 1 auto" }}>
              <div style={{ fontSize: 11, opacity: 0.75, letterSpacing: 1 }}>
                {blocked ? "Tap to start" : "Now playing"}
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={current?.title}
              >
                {current?.title}
              </div>
              <div
                style={{
                  fontSize: 12,
                  opacity: 0.85,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={current?.artist}
              >
                {current?.artist}
              </div>

              <div
                style={{
                  height: 4,
                  marginTop: 6,
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: 999,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${Math.max(0, Math.min(100, progress * 100))}%`,
                    height: "100%",
                    background: "linear-gradient(90deg,#ff5bc4,#7cf4ff)",
                  }}
                />
              </div>
            </div>

            {/* controls */}
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <IconBtn label="Prev" onClick={prev}>⏮</IconBtn>
              <IconBtn
                label="Play or pause"
                onClick={() => {
                  if (blocked) { userStart(); return; }
                  toggle();
                }}
              >
                {isPlaying ? "⏸" : "▶️"}
              </IconBtn>
              <IconBtn label="Next" onClick={next}>⏭</IconBtn>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function IconBtn({ label, onClick, children }) {
  return (
    <button
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      style={{
        border: 0,
        borderRadius: 10,
        padding: "6px 8px",
        cursor: "pointer",
        background: "rgba(255,255,255,0.1)",
        color: "#fff",
        fontWeight: 700,
      }}
    >
      {children}
    </button>
  );
}
