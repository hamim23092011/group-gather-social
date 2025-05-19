
// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsykDBpNQlnK6la6CTrK3SIBYeu8-Z0IU",
  authDomain: "hobby-hub-901b1.firebaseapp.com",
  projectId: "hobby-hub-901b1",
  storageBucket: "hobby-hub-901b1.firebasestorage.app",
  messagingSenderId: "96261501187",
  appId: "1:96261501187:web:7e6c2d3c7c91306e84b936"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, auth, storage };
