// src/components/Auth.jsx
import { useState } from "react";
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "../firebase";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async () => {
    setError("");
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, pass);
      } else {
        await signInWithEmailAndPassword(auth, email, pass);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{
      maxWidth: "400px",
      margin: "5rem auto",
      padding: "2rem",
      background: "#fff",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}>
      <h2>{isSignup ? "Sign Up" : "Log In"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ width: "100%", padding: ".5rem", marginBottom: ".5rem" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={pass}
        onChange={e => setPass(e.target.value)}
        style={{ width: "100%", padding: ".5rem", marginBottom: ".5rem" }}
      />
      <button onClick={handleAuth} style={{ width: "100%", padding: ".5rem" }}>
        {isSignup ? "Sign Up" : "Log In"}
      </button>
      <p style={{ marginTop: ".5rem", textAlign: "center" }}>
        {isSignup ? "Already have an account?" : "No account yet?"}{" "}
        <span
          onClick={() => {
            setIsSignup(!isSignup);
            setError("");
          }}
          style={{ color: "#15803d", cursor: "pointer" }}
        >
          {isSignup ? "Log In" : "Sign Up"}
        </span>
      </p>
    </div>
  );
}
