import React, { useEffect, useRef, useState } from "react";

export default function TimingBar({ onResult }) {
  const [running, setRunning] = useState(true);
  const [position, setPosition] = useState(0);
  const direction = useRef(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => {
        const next = prev + direction.current * 5;
        if (next >= 100 || next <= 0) direction.current *= -1;
        return Math.max(0, Math.min(100, next));
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  function stop() {
    setRunning(false);
    if (position >= 40 && position <= 60) onResult("perfect");
    else if (position >= 30 && position <= 70) onResult("okay");
    else onResult("fail");
  }

  return (
    <div className="minigame">
      <div className="bar-container" onClick={stop}>
        <div className="bar-fill" style={{ left: `${position}%` }} />
        <div className="target" />
      </div>
      <p>Click when the bar is in the green zone!</p>
    </div>
  );
}
