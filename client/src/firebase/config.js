import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCAdt2iFiP86mROJpJ8YYGRNySnJg4Fgjw",
  authDomain: "platafotmaeducativacolegio.firebaseapp.com",
  projectId: "platafotmaeducativacolegio",
  storageBucket: "platafotmaeducativacolegio.firebasestorage.app",
  messagingSenderId: "613250448326",
  appId: "1:613250448326:web:ce32efa9df8ea749d0d0c7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);