import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set, update, onValue, off } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBUYl2ibHOiFj66cjzCgNtfPpv3YULHNvI",
  authDomain: "logitrack-90e52.firebaseapp.com",
  databaseURL:
    "https://logitrack-90e52-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "logitrack-90e52",
  storageBucket: "logitrack-90e52.firebasestorage.app",
  messagingSenderId: "801763183519",
  appId: "1:801763183519:web:1662082c578dde9f790baa",
  measurementId: "G-746WZ8RRXR",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export { ref, push, set, update, onValue, off };
export type { DataSnapshot } from "firebase/database";
