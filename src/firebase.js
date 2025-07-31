// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA6csT7G7OZ5t7p69SEgbhjgEsCn8QC76w",
  authDomain: "gardengame-5953f.firebaseapp.com",
  projectId: "gardengame-5953f",
  storageBucket: "gardengame-5953f.appspot.com",
  messagingSenderId: "324380478391",
  appId: "1:324380478391:web:bd70f9294a1a48c10ab632"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
  auth,
  db,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  fbSignOut as signOut,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  updateDoc
};
