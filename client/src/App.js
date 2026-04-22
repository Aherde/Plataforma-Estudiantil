import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Dashboard from './pages/Dashboard';
import Registro from './pages/Registro';
import Layout from './estructura/Layout';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginScreen from './components/LoginScreen';

function RutaProtegida({ children }) {
  const { user, cargandoAuth } = useAuth();
  
  if (cargandoAuth) {
    return <div>Cargando...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
}

function AppRoutes() {
  const { cargandoAuth } = useAuth();
  
  if (cargandoAuth) {
    return <div>Cargando...</div>;
  }
  
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/dashboard" element={
        <RutaProtegida>
          <Layout />
        </RutaProtegida>
      } />
      <Route path="/registro" element={
        <RutaProtegida>
          <Registro />
        </RutaProtegida>
      } />
      <Route path="/" element={<Navigate to="/login" />} />  {/* ← SOLO ESTO CAMBIA */}
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;