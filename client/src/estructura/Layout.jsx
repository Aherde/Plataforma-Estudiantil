import React, { useState } from 'react';
import Reportes from '../components/Reportes';
import AlumnoForm from '../components/AlumnoForm';
import DashboardCards from '../components/DashboardCards';
import ListaEstudiantes from '../components/ListaEstudiantes';
import { useAuth } from '../context/AuthContext'; // ← NUEVO

const Layout = () => {
  const [activeTab, setActiveTab] = useState('inicio');
  const [estudianteAEditar, setEstudianteAEditar] = useState(null);
  const { signOut, user } = useAuth(); // ← NUEVO

  const handleLogout = async () => { // ← NUEVO
    await signOut();
  };

  // Función para manejar la edición desde la lista
  const handleEditar = (estudiante) => {
    setEstudianteAEditar(estudiante);
    setActiveTab('estudiantes');
  };

  // Función para resetear el modo edición después de guardar
  const handleFormReset = () => {
    setEstudianteAEditar(null);
  };

  // Función que renderiza el componente según la pestaña activa
  const renderContent = () => {
    switch(activeTab) {
      case 'reportes':
        return <Reportes />;
      case 'estudiantes':
        return <AlumnoForm estudianteAEditar={estudianteAEditar} onFormReset={handleFormReset} />;
      case 'lista':
        return <ListaEstudiantes onEditar={handleEditar} />;
            case 'configuracion':
        return (
          <div style={{ padding: '20px' }}>
            <h2>⚙️ Configuración del Sistema</h2>
            <hr />
            
            <div style={{ 
              background: 'white', 
              borderRadius: '12px', 
              padding: '20px', 
              marginBottom: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#2c3e50', marginTop: 0 }}>📋 Información de la Plataforma</h3>
              <p><strong>Versión:</strong> 1.0.0</p>
              <p><strong>Institución:</strong> U.E.N.B DR. LUIS PADRINO</p>
              <p><strong>Desarrollado por:</strong> Estudiantes de la UNETI - PNF de Informática</p>
            </div>

            <div style={{ 
              background: 'white', 
              borderRadius: '12px', 
              padding: '20px', 
              marginBottom: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#2c3e50', marginTop: 0 }}>👥 Equipo de Desarrollo</h3>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                <li>Estudiantes del PNF de Informática - UNETI</li>
                <li>Proyecto de Aplicación Web</li>
              </ul>
            </div>

            <div style={{ 
              background: 'white', 
              borderRadius: '12px', 
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#2c3e50', marginTop: 0 }}>🛠️ Tecnologías Utilizadas</h3>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                <li>React.js - Frontend</li>
                <li>Firebase - Base de datos y Autenticación</li>
                <li>HTML2Canvas + jsPDF - Generación de PDF</li>
                <li>XLSX - Exportación a Excel</li>
              </ul>
              <p style={{ marginTop: '15px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
                © 2026 - Todos los derechos reservados<br />
                Universidad Nacional Experimental de las Telecomunicaciones e Informatica (UNETI)<br />
                PNF de Informática
              </p>
            </div>
          </div>
        );
      
      default:
        return <DashboardCards />;
    }
  };

  const navStyle = (active) => ({
    alignItems: 'center',
    fontWeight: active ? "600" : "400",
    transition: "all 0.3s ease",
    border: active ? "none" : "1px solid rgba(255,255,255,0.1)",
    cursor: 'pointer',
    padding: '10px 20px',
    borderRadius: '8px',
    backgroundColor: active ? '#007bff' : 'transparent',
    color: active ? '#fff' : '#333'
  });

  const menuItems = [
    { id: 'inicio', label: '🏠 Inicio' },
    { id: 'reportes', label: '📊 Reportes' },
    { id: 'estudiantes', label: '✏️ Registrar Estudiante' },
    { id: 'lista', label: '📋 Lista de Estudiantes' },
    { id: 'configuracion', label: '⚙️ Configuración' }
  ];

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar o menú de navegación */}
      <nav style={{ 
        width: '250px', 
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRight: '1px solid #dee2e6'
      }}>
        <h2 style={{ marginBottom: '20px', fontSize: '18px' }}>Plataforma Estudiantil</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {menuItems.map(item => (
            <li key={item.id} style={{ marginBottom: '10px' }}>
              <div
                onClick={() => setActiveTab(item.id)}
                style={navStyle(activeTab === item.id)}
              >
                {item.label}
              </div>
            </li>
          ))}
        </ul>
        
        {/* Botón de Cerrar Sesión */}  {/* ← NUEVO */}
        <div style={{ marginTop: '30px', borderTop: '1px solid #dee2e6', paddingTop: '15px' }}>
          <div
            onClick={handleLogout}
            style={{
              alignItems: 'center',
              fontWeight: '400',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              padding: '10px 20px',
              borderRadius: '8px',
              backgroundColor: '#e74c3c',
              color: '#fff',
              textAlign: 'center'
            }}
          >
            🚪 Cerrar Sesión
          </div>
          {user && (
            <small style={{ display: 'block', textAlign: 'center', marginTop: '8px', fontSize: '11px', color: '#666' }}>
              {user.email}
            </small>
          )}
        </div>
      </nav>

      {/* Contenido principal */}
      <main style={{ 
        flex: 1, 
        padding: '20px',
        overflowY: 'auto',
        backgroundColor: '#f4f6f9'
      }}>
        {renderContent()}
      </main>
    </div>
  );
};

export default Layout;