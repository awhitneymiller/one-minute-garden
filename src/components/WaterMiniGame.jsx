import { useState, useEffect, useRef } from "react";

export default function WaterMiniGame({ onComplete }) {
  const [phase, setPhase] = useState("waiting"); // waiting, ready
  const [message, setMessage] = useState("Get Ready...");
  const startRef = useRef(0);

  useEffect(() => {
    const delay = 1000 + Math.random() * 2000;
    const timer = setTimeout(() => {
      setPhase("ready");
      setMessage("GO!");
      startRef.current = performance.now();
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  const handleStop = () => {
    if (phase !== "ready") return;
    const rt = performance.now() - startRef.current;
    onComplete(rt);
  };

  return (
    <div className="minigame-overlay">
      <div className="minigame-box">
        <p>{message}</p>
        {phase === "ready" && (
          <button onClick={handleStop}>STOP</button>
        )}
      </div>
    </div>
  );
}
