// client/src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
// Importamos los estilos de Bootstrap para el diseño
import 'bootstrap/dist/css/bootstrap.min.css';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// 1. Importar las herramientas de navegación
import { BrowserRouter } from 'react-router-dom';

// 2. Importar el proveedor de autenticación que creamos
// ¡CORRECCIÓN! Usamos importación por defecto (sin llaves) y la extensión .jsx
import AuthProvider from './context/AuthContext.jsx'; 

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* 3. El BrowserRouter permite la navegación */}
    <BrowserRouter>
      {/* 4. El AuthProvider permite que toda la app use el estado de Login/Logout */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Si quieres empezar a medir el rendimiento de la aplicación, puedes dejar esta función
reportWebVitals();
