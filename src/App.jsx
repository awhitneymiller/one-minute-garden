import { useState, useEffect } from "react";
import { format, subDays } from "date-fns";
import "./index.css";

import {
  auth,
  db,
  signOut,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "./firebase";

import { weatherEvents } from "./data/weather";
import { allPlants } from "./data/plants";
import { generateForecast } from "./logic/generateForecast";
import { generateGoals } from "./logic/generateGoals";
import { storyBeats } from "./data/story";

import Auth from "./components/Auth";
import DebugMenu from "./components/DebugMenu";
import WeatherForecast from "./components/WeatherForecast";
import SeedInventory from "./components/SeedInventory";
import StoryPanel from "./components/StoryPanel";
import Journal from "./components/Journal";
import PlantCard from "./components/PlantCard";
import MapView from "./components/MapView";
import PlantRecipes from "./components/PlantRecipes";
import TimerSelector from "./components/TimerSelector";
import StreakDisplay from "./components/StreakDisplay";
import CalendarView from "./components/CalendarView";
import ThemeToggle from "./components/ThemeToggle";
import MusicPlayer from "./components/MusicPlayer"; // ✅ added

export default function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const starterSeeds = allPlants.slice(0, 3).map(({ id, name }) => ({ id, name }));
  const [inventory, setInventory] = useState(starterSeeds);
  const [plantedPlants, setPlantedPlants] = useState([]);
  const [storyIndex, setStoryIndex] = useState(0);

  const [view, setView] = useState("garden");
  const [journal, setJournal] = useState("");
  const [forecast, setForecast] = useState(generateForecast());
  const [dailyGoals, setDailyGoals] = useState(generateGoals());

  const [sessionLength, setSessionLength] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [sessionActive, setSessionActive] = useState(false);

  const [lastSessionDate, setLastSessionDate] = useState(null);
  const [streak, setStreak] = useState(0);
  const [sessionDates, setSessionDates] = useState([]);

  const [coins, setCoins] = useState(0);
  const [xp, setXp] = useState(0);

  const [theme, setTheme] = useState(
    () => localStorage.getItem("omg-theme") || "light"
  );

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem("omg-theme", theme);
  }, [theme]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setAuthChecked(true);
      if (u) {
        setUser(u);
        const ref = doc(db, "users", u.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const d = snap.data();
          const mergedInventory = [
            ...starterSeeds,
            ...(d.inventory || []).filter(
              (item) => !starterSeeds.find((s) => s.id === item.id)
            )
          ];
          setInventory(mergedInventory);
          setPlantedPlants(
            (d.plantedPlants || []).map((p, i) => ({
              ...p,
              instanceId: p.instanceId || `${p.id}-${i}`
            }))
          );
          setStoryIndex(d.storyIndex);
          setLastSessionDate(d.lastSessionDate);
          setStreak(d.streak);
          setSessionDates(d.sessionDates || []);
          setCoins(d.coins || 0);
          setXp(d.xp || 0);
        } else {
          const init = {
            inventory: starterSeeds,
            plantedPlants: [],
            storyIndex: 0,
            lastSessionDate: null,
            streak: 0,
            sessionDates: [],
            coins: 0,
            xp: 0
          };
          await setDoc(ref, init);
          setInventory(starterSeeds);
        }
      } else {
        setUser(null);
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) return;
    updateDoc(doc(db, "users", user.uid), {
      inventory,
      plantedPlants,
      storyIndex,
      lastSessionDate,
      streak,
      sessionDates,
      coins,
      xp
    }).catch(console.error);
  }, [
    user,
    inventory,
    plantedPlants,
    storyIndex,
    lastSessionDate,
    streak,
    sessionDates,
    coins,
    xp
  ]);

  useEffect(() => {
    if (!sessionActive) return;
    if (sessionLength === 0 || timeLeft <= 0) {
      completeSession();
      return;
    }
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [sessionActive, timeLeft, sessionLength]);

  if (!authChecked) return null;
  if (!user) return <Auth />;

  const todayKey = format(new Date(), "yyyy-MM-dd");

  function completeSession() {
    setSessionActive(false);
  }

  function startSession() {
    setSessionActive(true);
    setTimeLeft(sessionLength * 60);
  }

  function plantSeed(p) {
    setInventory((inv) => inv.filter((i) => i.id !== p.id));
    setPlantedPlants((plants) => [
      ...plants,
      {
        ...p,
        stage: 0,
        watered: false,
        fertilized: false,
        rewarded: false,
        instanceId: `${p.id}-${Date.now()}`
      }
    ]);
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🌿 One Minute Garden</h1>
        <nav className="nav">
          {["garden", "map", "recipes"].map((v) => (
            <button
              key={v}
              className={view === v ? "active" : ""}
              onClick={() => setView(v)}
            >
              {v}
            </button>
          ))}
        </nav>
        <ThemeToggle theme={theme} setTheme={setTheme} />
        <button className="logout-btn" onClick={() => signOut(auth)}>
          Log Out
        </button>
      </header>

      {view === "garden" && (
        <main className="dashboard">
          <section className="card goals">
            <h3>🎯 Daily Goals</h3>
            <ul>
              {dailyGoals.map((g) => (
                <li key={g.id}>{g.description}</li>
              ))}
            </ul>
          </section>

          <section className="card controls">
            <TimerSelector
              sessionLength={sessionLength}
              setSessionLength={setSessionLength}
            />
            <DebugMenu
              onFastForward={() => setTimeLeft((t) => Math.max(0, t - 30))}
              onStartSession={startSession}
            />
            {sessionActive && <p>⏳ {timeLeft}s</p>}
          </section>

          <section className="card inventory">
            <SeedInventory inventory={inventory} onPlant={plantSeed} />
          </section>

          <section className="card garden">
            <h3>🌼 Your Garden</h3>
            {plantedPlants.length === 0 ? (
              <p className="empty">Your garden is empty. Plant seeds!</p>
            ) : (
              <div className="plant-grid">
                {plantedPlants.map((p) => (
                  <PlantCard
                    key={p.instanceId}
                    plant={p}
                    onWater={() => {}}
                    onFertilize={() => {}}
                    sessionActive={sessionActive}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      )}

      {view === "map" && (
        <main className="single-pane">
          <MapView bloomCount={plantedPlants.filter((p) => p.stage === 3).length} />
        </main>
      )}

      {view === "recipes" && (
        <main className="single-pane">
          <PlantRecipes plants={allPlants} />
        </main>
      )}

      {/* ✅ Music toggle button always present */}
      <MusicPlayer />
    </div>
  );
}
