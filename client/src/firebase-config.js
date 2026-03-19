// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // <-- DEBEMOS IMPORTAR getAuth

// Tu configuración de la aplicación web de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCAdt2iFiP86mROJpJ8YYGRNySnJg4Fgjw",
  authDomain: "platafotmaeducativacolegio.firebaseapp.com",
  projectId: "platafotmaeducativacolegio",
  storageBucket: "platafotmaeducativacolegio.firebasestorage.app",
  messagingSenderId: "613250448326",
  appId: "1:613250448326:web:ce32efa9df8ea749d0d0c7"
};

// 1. Inicializar Firebase
const app = initializeApp(firebaseConfig);

// 2. Obtener la instancia de Authentication
// Esta instancia es la que se usa para iniciar sesión, cerrar sesión, etc.
export const auth = getAuth(app);