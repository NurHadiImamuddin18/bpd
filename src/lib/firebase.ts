import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, onSnapshot, query, orderBy, deleteDoc, doc, limit, updateDoc, getDoc, increment, where } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAN1xdFKYq4EzGAyfHWzIbwAfhIAnoLx6M",
  authDomain: "bpd-probolinggo.firebaseapp.com",
  projectId: "bpd-probolinggo",
  storageBucket: "bpd-probolinggo.firebasestorage.app",
  messagingSenderId: "758532936997",
  appId: "1:758532936997:web:c097986ca11fd8c40eb6cc",
  measurementId: "G-R453M6W9Q4"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db, collection, addDoc, getDocs, onSnapshot, query, orderBy, deleteDoc, doc, limit, updateDoc, getDoc, increment, where };
