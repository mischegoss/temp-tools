import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD1kuD4OO3PYPEIC5duM7yS8v5NW992_O4",
  authDomain: "learning-forms.firebaseapp.com",
  projectId: "learning-forms",
  storageBucket: "learning-forms.firebasestorage.app",
  messagingSenderId: "891444568232",
  appId: "1:891444568232:web:75a99e7ce6c1bd2735e29d",
  measurementId: "G-2R4492J3BJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Set persistence to local (session persists until browser is closed)
setPersistence(auth, browserLocalPersistence);
