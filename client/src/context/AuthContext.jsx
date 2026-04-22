// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cargandoAuth, setCargandoAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCargandoAuth(false);
    });
    return () => unsubscribe();
  }, []);

  // Función para cerrar sesión
  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, cargandoAuth, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);