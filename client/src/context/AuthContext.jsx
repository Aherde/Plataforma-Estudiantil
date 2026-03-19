// client/src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut 
} from 'firebase/auth';
import { auth } from '../firebase-config'; // Asegúrate de que la ruta sea correcta

const AuthContext = createContext();

// Hook personalizado (se mantiene como exportación nombrada)
export const useAuth = () => {
    return useContext(AuthContext);
};

// Componente AuthProvider
const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Función para iniciar sesión
    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Función para cerrar sesión
    const logout = () => {
        return signOut(auth);
    };

    useEffect(() => {
        // Suscribirse a los cambios de estado de autenticación de Firebase
        const unsubscribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user);
            setLoading(false);
        });

        // Limpiar la suscripción al desmontar el componente
        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        login,
        logout
    };

    // Solo renderiza la aplicación si no está cargando (ya verificó el estado de Firebase)
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// ¡EXPORTACIÓN POR DEFECTO!
export default AuthProvider;