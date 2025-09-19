import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";

import Card from "./components/Card";
import RiddleHint from "./components/RiddleHint";
import Starfield from "./components/Starfield";
import IntroSlides from "./components/IntroSlides";
import BottomNav from "./components/BottomNav";
import MusicDock from "./components/MusicDock";

import MessagePage from "./pages/MessagePage";
import CounterPage from "./pages/CounterPage";
import LoveNotesPage from "./pages/LoveNotesPage";
import PhotosPage from "./pages/PhotosPage";
import TimelinePage from "./pages/TimelinePage";
import ExtraPage from "./pages/ExtraPage"; // fixed import

import useWindowSize from "./hooks/useWindowSize";
import "./App.css";

export default function App() {
  const [open, setOpen] = useState(false);           // heart card opened
  const [introDone, setIntroDone] = useState(false); // slides finished
  const [unlocked, setUnlocked] = useState(false);   // optional easter egg
  const [showConfetti, setShowConfetti] = useState(false);
  const [activePage, setActivePage] = useState("home"); // nav active page

  const { width, height } = useWindowSize();

  // Confetti burst for 2s when card opens
  useEffect(() => {
    if (open) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 2000);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Render current page based on activePage
  const renderPage = () => {
    // Before intro is done show only the heart card and slides
    if (activePage === "home" && !introDone) {
      return (
        <div className="page">
          <Card open={open} onOpen={() => setOpen(true)} />
          {open && !introDone && (
            <IntroSlides
              onComplete={() => {
                setIntroDone(true);
                setActivePage("home"); // land back on Home when slides finish
              }}
            />
          )}
        </div>
      );
    }

    // After intro is done allow full pages
    switch (activePage) {
      case "home":
        return (
          <div className="page">
            <Card open={true} onOpen={() => {}} />
          </div>
        );
      case "message":
        return <MessagePage />;
      case "counter":
        return <CounterPage />;
      case "notes":
        return <LoveNotesPage />;
      case "photos":
        return <PhotosPage />;
      case "timeline":
        return <TimelinePage />;
      case "extra":
        return <ExtraPage />;
      default:
        return null;
    }
  };

  return (
    <div className="app-root">
      {/* starry background */}
      <Starfield onSecretClick={() => setUnlocked(true)} />

      {/* confetti on open */}
      <AnimatePresence>
        {showConfetti && (
          <Confetti
            width={width}
            height={height}
            numberOfPieces={250}
            recycle={false}
          />
        )}
      </AnimatePresence>

      {/* main view */}
      <main className="content">{renderPage()}</main>

      {/* bottom nav shows only after intro is done */}
      {introDone && (
        <BottomNav activePage={activePage} setActivePage={setActivePage} />
      )}

      {/* folding music dock starts once intro is done */}
      {introDone && <MusicDock autoStart={true} autohideMs={2500} />}
    </div>
  );
}
