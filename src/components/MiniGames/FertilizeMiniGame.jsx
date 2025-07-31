import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function FertilizeMiniGame({ onResult }) {
  const [position, setPosition] = useState(0);
  const [running, setRunning] = useState(true);
  const direction = useRef(1);

  useEffect(() => {
    const iv = setInterval(() => {
      if (!running) return;
      setPosition(p => {
        let next = p + direction.current * 3;
        if (next >= 100 || next <= 0) direction.current *= -1;
        return Math.max(0, Math.min(100, next));
      });
    }, 30);
    return () => clearInterval(iv);
  }, [running]);

  function stop() {
    setRunning(false);
    let result = "fail";
    if (position >= 40 && position <= 60) result = "perfect";
    else if (position >= 30 && position <= 70) result = "okay";
    onResult(result);
  }

  return createPortal(
    <div className="minigame-overlay">
      <div className="minigame">
        <h3>🌱 Fertilizing Mini-Game</h3>
        <div className="bar-container" onClick={stop}>
          <div className="target" />
          <div className="bar-fill" style={{ left: `${position}%` }} />
        </div>
        <p>Click when the blue bar is inside the green zone!</p>
      </div>
    </div>,
    document.body
  );
}
