import React, { useState } from 'react';
import Reportes from '../components/Reportes';
import AlumnoForm from '../components/AlumnoForm';
import DashboardCards from '../components/DashboardCards';
import ListaEstudiantes from '../components/ListaEstudiantes';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const [activeTab, setActiveTab] = useState('inicio');
  const [estudianteAEditar, setEstudianteAEditar] = useState(null);
  const { signOut, user } = useAuth();

  const handleLogout = async () => {
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
            
            {/* Logo UNETI y encabezado */}
            <div style={{ 
              background: 'linear-gradient(135deg, #1a472a 0%, #2d6a4f 100%)', 
              borderRadius: '16px', 
              padding: '25px', 
              marginBottom: '25px',
              color: 'white',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
              flexWrap: 'wrap'
            }}>
              <img 
                src="/logo-uneti.png" 
                alt="Logo UNETI" 
                style={{ width: '60px', height: '60px', borderRadius: '12px', backgroundColor: 'white', padding: '5px', objectFit: 'contain' }}
              />
              <div>
                <h3 style={{ margin: 0 }}>Universidad Nacional Experimental de</h3>
                <h3 style={{ margin: 0 }}>Telecomunicaciones e Informática (UNETI)</h3>
                <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>PNF de Informática - Proyecto de Aplicación Web</p>
              </div>
            </div>

            {/* Información de la Plataforma */}
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

            {/* Equipo de Desarrollo con nombres */}
            <div style={{ 
              background: 'white', 
              borderRadius: '12px', 
              padding: '20px', 
              marginBottom: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#2c3e50', marginTop: 0 }}>👥 Equipo de Desarrollo</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                <div style={{ 
                  background: '#f8f9fa', 
                  padding: '15px', 
                  borderRadius: '8px',
                  borderLeft: '4px solid #1a472a'
                }}>
                  <strong>👩‍💻 ALEJANDRA HERDE</strong>
                  <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>Desarrolladora Frontend - React</p>
                </div>
                <div style={{ 
                  background: '#f8f9fa', 
                  padding: '15px', 
                  borderRadius: '8px',
                  borderLeft: '4px solid #1a472a'
                }}>
                  <strong>👩‍💻 IROMY LEON</strong>
                  <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>Desarrolladora de Base de Datos</p>
                </div>
              </div>
            </div>

            {/* Tecnologías Utilizadas */}
            <div style={{ 
              background: 'white', 
              borderRadius: '12px', 
              padding: '20px',
              marginBottom: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#2c3e50', marginTop: 0 }}>🛠️ Tecnologías Utilizadas</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                <span style={{ background: '#e3f2fd', padding: '5px 12px', borderRadius: '20px' }}>⚛️ React.js</span>
                <span style={{ background: '#fff3e0', padding: '5px 12px', borderRadius: '20px' }}>🔥 Firebase</span>
                <span style={{ background: '#e8f5e9', padding: '5px 12px', borderRadius: '20px' }}>📄 jsPDF</span>
                <span style={{ background: '#fce4ec', padding: '5px 12px', borderRadius: '20px' }}>📎 XLSX</span>
                <span style={{ background: '#f3e5f5', padding: '5px 12px', borderRadius: '20px' }}>🎨 HTML2Canvas</span>
              </div>
            </div>

            {/* Footer */}
            <div style={{ 
              background: '#2c3e50', 
              borderRadius: '12px', 
              padding: '20px',
              textAlign: 'center',
              color: 'white'
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '15px', flexWrap: 'wrap' }}>
                <img 
                  src="/logo-uneti.png" 
                  alt="Logo UNETI" 
                  style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'white', padding: '3px', objectFit: 'contain' }}
                />
                <span style={{ fontSize: '30px' }}>🎓</span>
                <span style={{ fontSize: '30px' }}>🏛️</span>
              </div>
              <p style={{ margin: 0 }}>
                © 2026 - Todos los derechos reservados<br />
                <strong>Universidad Nacional Experimental de Telecomunicaciones e Informática (UNETI)</strong><br />
                PNF de Informática - Proyecto de Aplicación Web
              </p>
              <p style={{ margin: '10px 0 0 0', fontSize: '12px', opacity: 0.8 }}>
                Desarrollado por: <strong>Alejandra Herde y Iromy Leon</strong>
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
        
        {/* Botón de Cerrar Sesión */}
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