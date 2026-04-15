import React, { useState } from 'react';
import Reportes from '../components/Reportes';
import AlumnoForm from '../components/AlumnoForm';
import DashboardCards from '../components/DashboardCards';
import ListaEstudiantes from '../components/ListaEstudiantes';

const Layout = () => {
  const [activeTab, setActiveTab] = useState('inicio');
  const [estudianteAEditar, setEstudianteAEditar] = useState(null);

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
            <p>Panel de configuración del sistema</p>
            <hr />
            <h3>Información</h3>
            <p>Versión: 1.0.0</p>
            <p>Desarrollado para U.E.N.B DR. LUIS PADRINO</p>
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
      </nav>

      {/* Contenido principal - Aquí se renderiza la pestaña activa */}
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