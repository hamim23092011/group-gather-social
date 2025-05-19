
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDsykDBpNQlnK6la6CTrK3SIBYeu8-Z0IU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "hobby-hub-901b1.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "hobby-hub-901b1",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "hobby-hub-901b1.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "96261501187",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:96261501187:web:7e6c2d3c7c91306e84b936"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, auth, storage };
