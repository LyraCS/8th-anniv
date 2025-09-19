import { useEffect, useRef, useState } from "react";
import "./ExtraPage.css";

const extraSongs = [
  {
    title: "Halo",
    artist: "Poppy",
    message: "'I'm hanging on 'cause I trust It's easier than giving up.'",
    url: "tracks/halo.mp3",
    cover: "images/ns.jpg",
    volume: 0.2,
    link: "https://genius.com/Poppy-halo-lyrics",
  },
  {
    title: "Just Pretend",
    artist: "Bad Omens",
    message: "'Way down, would you say I'm worthy?'",
    url: "tracks/justpretend.mp3",
    cover: "images/tdopom.jpg",
    volume: 0.2,
    link: "https://genius.com/Bad-omens-just-pretend-lyrics",
  },
  {
    title: "One Day The Only Butterflies Left Will Be In Your Chest As You March Towards Your Death",
    artist: "Bring Me The Horizon x Amy Lee",
    message: "'The hole I wore into your soul has got too big to overlook.'",
    url: "tracks/oneday.mp3",
    cover: "images/posthuman.jpg",
    volume: 0.2,
    link: "https://genius.com/Bring-me-the-horizon-one-day-the-only-butterflies-left-will-be-in-your-chest-as-you-march-towards-your-death-lyrics",
  },
  {
    title: "Losing My Mind",
    artist: "Dead Sara",
    message: "'I hate seeing you this way'",
    url: "tracks/lose.mp3",
    cover: "images/tragic.jpg",
    volume: 0.2,
    link: "https://genius.com/Dead-sara-losing-my-mind-lyrics",
  },
  {
    title: "When You're Gone",
    artist: "Avril Lavigne",
    message: "'Do you see how much I need you right now?'",
    url: "tracks/gone.mp3",
    cover: "images/thing.jpg",
    volume: 0.2,
    link: "https://genius.com/Avril-lavigne-when-youre-gone-lyrics",
  },
   {
    title: "Wish You Were Here",
    artist: "Avril Lavigne",
    message: "'You're always there, you're everywhere'",
    url: "tracks/here.mp3",
    cover: "images/lullaby.jpg",
    volume: 0.2,
    link: "https://genius.com/Avril-lavigne-wish-you-were-here-lyrics",
  },
   {
    title: "Is That Love?",
    artist: "cloudyfield",
    message: "'Even in paradise, The sun sets at times'",
    url: "tracks/is that love_.mp3",
    cover: "images/love.jpg",
    volume: 0.2,
    link: "https://genius.com/Cloudyfield-is-that-love-lyrics",
  },
  {
   title: "Another Life",
    artist: "Motionless In White",
    message: "'And I hate that your heart was the casualty'",
    url: "tracks/anlife.mp3",
    cover: "images/disguise.jpg",
    volume: 0.2,
    link: "https://genius.com/Motionless-in-white-another-life-lyrics",
  },
];

export default function ExtraPage() {
  const [idx, setIdx] = useState(0);
  const [isPlaying, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1
  const [curTime, setCurTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(extraSongs[0]?.volume ?? 0.8);

  const audioRef = useRef(null);
  const track = extraSongs[idx];

  // Load track when index changes — DO NOT autoplay
  useEffect(() => {
    const a = audioRef.current;
    if (!a || !track) return;

    a.src = track.url;
    a.volume = track.volume ?? 0.8;
    a.currentTime = 0;
    a.pause();                 // ensure paused on load
    setVolume(a.volume);
    setPlaying(false);
    setProgress(0);
    setCurTime(0);
    setDuration(0);
  }, [idx, track]);

  // Bind audio events so UI matches the real state
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTime = () => {
      if (!Number.isFinite(a.duration)) return;
      setCurTime(a.currentTime || 0);
      setDuration(a.duration || 0);
      setProgress(a.duration ? a.currentTime / a.duration : 0);
    };
    const onLoaded = () => setDuration(a.duration || 0);
    const onEnded = () => {
      // stay paused at end; do NOT auto-advance unless you want
      setPlaying(false);
    };

    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onLoaded);
    a.addEventListener("ended", onEnded);

    return () => {
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onLoaded);
      a.removeEventListener("ended", onEnded);
    };
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play().catch(() => {}); // start only on user gesture
    else a.pause();
  };

  const seek = (e) => {
    const a = audioRef.current;
    if (!a || !duration) return;
    const val = Number(e.target.value); // 0..100
    a.currentTime = (val / 100) * duration;
  };

  const changeVolume = (e) => {
    const a = audioRef.current;
    if (!a) return;
    const v = Number(e.target.value) / 100;
    a.volume = v;
    setVolume(v);
  };

  const prev = () => setIdx((i) => (i - 1 + extraSongs.length) % extraSongs.length);
  const next = () => setIdx((i) => (i + 1) % extraSongs.length);

  const fmt = (s) => {
    if (!Number.isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  if (!track) {
    return (
      <div className="page extra-player">
        <h1 className="page-title">Extra Songs</h1>
        <p className="extra-empty">
          Drop songs in <code>public/tracks</code> and covers in{" "}
          <code>public/images</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="page extra-player">
      <h1 className="page-title">Extra Galau Page</h1>
      <p className="page-caption">
      Songs that I listen to when our moments are tough. gausah di dengerin gapapa kok wkwkwk
      </p>

      <div className="player-card">
        {/* Cover (tap to toggle play/pause if you want) */}
        <div className="player-cover" onClick={toggle}>
          {track.cover ? (
            <img
              src={track.cover}
              alt=""
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          ) : (
            <div className="cover-fallback">🎵</div>
          )}
        </div>

        {/* Meta */}
        <div className="player-meta">
            <div className="player-title">{track.title}</div>
            <div className="player-artist">{track.artist}</div>
        {track.message && <p className="player-note">{track.message}</p>}
        {track.link && (
            <a 
                href={track.link}
                target="_blank"
                rel="noopener noreferrer"
                className="player-link"
            >
            View Lyrics ↗
            </a>
        )}
</div>


        {/* Progress */}
        <div className="player-progress">
          <input
            className="seek"
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={progress * 100}
            onChange={seek}
            style={{ backgroundSize: `${Math.max(0, Math.min(100, progress * 100))}% 100%` }}
          />
          <div className="time">
            <span>{fmt(curTime)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="player-controls">
          <button className="pill" onClick={prev} aria-label="Previous">⏮</button>
          <button className="pill main" onClick={toggle} aria-label="Play or pause">
            {isPlaying ? "⏸" : "▶️"}
          </button>
          <button className="pill" onClick={next} aria-label="Next">⏭</button>
        </div>

        {/* Volume */}
        <div className="player-volume">
          <span>🔊</span>
          <input
            className="vol"
            type="range"
            min={0}
            max={100}
            value={Math.round((volume ?? 0.2) * 100)}
            onChange={changeVolume}
          />
        </div>
      </div>

      {/* spacer so it doesn't collide with bottom nav */}
      <div style={{ height: 90 }} />

      <audio ref={audioRef} preload="metadata" playsInline />
    </div>
  );
}
