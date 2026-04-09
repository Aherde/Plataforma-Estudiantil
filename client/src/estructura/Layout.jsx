import React from "react";
import { Link, useLocation } from "react-router-dom";
// Importamos el icono de la librería que instalamos
import { FaUserGraduate } from 'react-icons/fa'; 

const Layout = ({ children }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "sans-serif" }}>
      {/* Sidebar Azul Oscuro */}
      <aside style={{ 
        width: "260px", 
        backgroundColor: "#0d1b2a", 
        color: "white", 
        position: "fixed", 
        height: "100vh", 
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "4px 0px 10px rgba(0,0,0,0.3)",
        zIndex: 100
      }}>
        
        {/* --- SECCIÓN DEL ICONO (NUEVA) --- */}
        <div style={{ textAlign: "center", marginBottom: "35px", width: "100%" }}>
          <div style={{
            width: "80px",
            height: "80px",
            backgroundColor: "#3182ce", // Azul brillante para resaltar
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 15px",
            boxShadow: "0px 4px 12px rgba(49, 130, 206, 0.4)"
          }}>
            {/* El Icono sustituye a la imagen Base64 */}
            <FaUserGraduate size={40} color="white" />
          </div>
          
          <h2 style={{ fontSize: "0.9rem", margin: 0, fontWeight: "bold", color: "#E2E8F0", letterSpacing: "1px" }}>
            UENB LUIS PADRINO
          </h2>
          <div style={{ width: "40px", height: "2px", backgroundColor: "#3182ce", margin: "10px auto" }}></div>
        </div>

        {/* Navegación */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
          <Link to="/dashboard" style={navStyle(isActive("/dashboard"))}>
            <span style={{ marginRight: "12px" }}>📊</span> Dashboard
          </Link>
          <Link to="/registro" style={navStyle(isActive("/registro"))}>
            <span style={{ marginRight: "12px" }}>👤</span> Registro
          </Link>
        </nav>
      </aside>

      {/* Contenido Principal */}
      <main style={{ flex: 1, marginLeft: "260px", padding: "40px", backgroundColor: "#f1f5f9", minHeight: "100vh" }}>
        {children}
      </main>
    </div>
  );
};

const navStyle = (active) => ({
  padding: "14px 20px",
  color: "white",
  textDecoration: "none",
  borderRadius: "10px",
  backgroundColor: active ? "#3182ce" : "transparent",
  display: "flex",
  alignItems: "center",
  fontWeight: active ? "600" : "400",
  transition: "all 0.3s ease",
  border: active ? "none" : "1px solid rgba(255,255,255,0.1)"
});

export default Layout;