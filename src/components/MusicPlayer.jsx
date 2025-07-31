// src/components/MusicPlayer.jsx
import React, { useEffect, useRef, useState } from "react";
import familiarWalk from "../assets/audio/FamiliarWalk.mp3";
import sneakyRacoons from "../assets/audio/SneakyRacoons.mp3";
import farmersMarket from "../assets/audio/FarmersMarket.mp3";
import drought from "../assets/audio/Drought.mp3";

const playlist = [familiarWalk, sneakyRacoons, farmersMarket, drought];

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(() => {
    return localStorage.getItem("musicMuted") !== "true";
  });
  const [trackIndex, setTrackIndex] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = playlist[trackIndex];
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
    localStorage.setItem("musicMuted", (!isPlaying).toString());
  }, [isPlaying, trackIndex]);

  const handleEnded = () => {
    setTrackIndex(prev => (prev + 1) % playlist.length);
  };

  return (
    <div style={{ position: "fixed", bottom: "1rem", right: "1rem", zIndex: 1000 }}>
      <button onClick={() => setIsPlaying(prev => !prev)}>
        {isPlaying ? "🔊 Music On" : "🔇 Music Off"}
      </button>
      <audio
        ref={audioRef}
        loop={false}
        onEnded={handleEnded}
        preload="auto"
      />
    </div>
  );
}
