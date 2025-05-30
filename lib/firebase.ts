// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCVN8sHUReREq4L9ChF5JG0U0jddOA1l-g",
  authDomain: "urresources-aa70e.firebaseapp.com",
  databaseURL: "https://urresources-aa70e-default-rtdb.firebaseio.com",
  projectId: "urresources-aa70e",
  storageBucket: "urresources-aa70e.firebasestorage.app",
  messagingSenderId: "211334704289",
  appId: "1:211334704289:web:126a09b857939e03eb94e0",
  measurementId: "G-X36N607KFR",
};
// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Services
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null; // Analytics is only available in the browser
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const database = getDatabase(app);
const storage = getStorage(app);

// Export services
export { app,storage, analytics, auth, provider, database };
