import React, { useState, useEffect, useRef } from "react";

export default function WaterMiniGame({ onResult }) {
  const [position, setPosition] = useState(0);
  const [running, setRunning] = useState(true);
  const direction = useRef(1);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!running) return;
      setPosition((prev) => {
        let next = prev + direction.current * 3;
        if (next >= 100 || next <= 0) direction.current *= -1;
        return Math.max(0, Math.min(100, next));
      });
    }, 30);
    return () => clearInterval(interval);
  }, [running]);

  function stop() {
    setRunning(false);
    let result = "fail";
    if (position >= 40 && position <= 60) result = "perfect";
    else if (position >= 30 && position <= 70) result = "okay";
    onResult(result);
  }

  return (
    <div className="minigame-overlay">
      <div className="minigame">
        <h3>💧 Watering Mini-Game</h3>
        <div className="bar-container" onClick={stop}>
          <div className="target" />
          <div className="bar-fill" style={{ left: `${position}%` }} />
        </div>
        <p>Click when the blue bar is inside the green zone!</p>
      </div>
    </div>
  );
}