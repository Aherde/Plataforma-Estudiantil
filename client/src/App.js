import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Registro from './pages/Registro';

// ¡ESTA LÍNEA ES LA QUE FALTA! 
// Asegúrate de que la ruta sea correcta (si App.css está en la misma carpeta)
import './App.css'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/registro" element={<Registro />} />
        {/* Si entras a la raíz, te redirige al dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;