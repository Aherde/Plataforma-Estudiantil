import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

const DashboardCards = () => {
  const [estadisticas, setEstadisticas] = useState({
    totalEstudiantes: 0,
    totalNiños: 0,
    totalNiñas: 0,
    usanComedor: 0,
    permisosEspeciales: 0,
    representantesActivos: 0,
    porGrado: []
  });
  const [cargando, setCargando] = useState(true);
  const [fechaActual, setFechaActual] = useState(new Date());

  useEffect(() => {
    const obtenerEstadisticas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "students"));
        let total = 0;
        let niños = 0;
        let niñas = 0;
        let comedor = 0;
        let permisos = 0;
        const representantesSet = new Set();
        const porGradoMap = new Map();

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const infoAlumno = data.alumno || {};
          const genero = infoAlumno.genero || "";
          const grado = infoAlumno.grado || "Sin especificar";
          
          total++;
          
          if (genero.toLowerCase() === 'm' || genero.toLowerCase() === 'masculino') niños++;
          if (genero.toLowerCase() === 'f' || genero.toLowerCase() === 'femenino') niñas++;
          
          if (infoAlumno.comeComedor === 'Si' || data.comedor === 'Si') comedor++;
          
          if (infoAlumno.permisosEspeciales === 'Si' || data.permisosEspeciales === 'Si') permisos++;
          
          const cedulaRep = data.madre?.cedula || data.padre?.cedula || data.representante?.cedula;
          if (cedulaRep) representantesSet.add(cedulaRep);
          
          if (!porGradoMap.has(grado)) {
            porGradoMap.set(grado, { total: 0, niños: 0, niñas: 0 });
          }
          const gradoStats = porGradoMap.get(grado);
          gradoStats.total++;
          if (genero.toLowerCase() === 'm' || genero.toLowerCase() === 'masculino') gradoStats.niños++;
          if (genero.toLowerCase() === 'f' || genero.toLowerCase() === 'femenino') gradoStats.niñas++;
        });

        const porGradoArray = Array.from(porGradoMap.entries())
          .map(([grado, stats]) => ({ grado, ...stats }))
          .sort((a, b) => a.grado.localeCompare(b.grado));

        setEstadisticas({
          totalEstudiantes: total,
          totalNiños: niños,
          totalNiñas: niñas,
          usanComedor: comedor,
          permisosEspeciales: permisos,
          representantesActivos: representantesSet.size,
          porGrado: porGradoArray
        });
        setCargando(false);
      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
        setCargando(false);
      }
    };
    obtenerEstadisticas();
    
    const interval = setInterval(() => setFechaActual(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const porcentajeComedor = estadisticas.totalEstudiantes > 0 
    ? ((estadisticas.usanComedor / estadisticas.totalEstudiantes) * 100).toFixed(1)
    : 0;

  const porcentajePermisos = estadisticas.totalEstudiantes > 0 
    ? ((estadisticas.permisosEspeciales / estadisticas.totalEstudiantes) * 100).toFixed(1)
    : 0;

  // Estilos profesionales (solo los que se usan)
  const gradientCardStyle = (color1, color2) => ({
    background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    color: 'white',
    transition: 'transform 0.3s ease',
    cursor: 'pointer'
  });

  if (cargando) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <p>Cargando datos del sistema...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Encabezado con logo y fecha */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#2c3e50',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }}>
            <span style={{ fontSize: '40px' }}>🏫</span>
          </div>
          <div>
            <h1 style={{ margin: 0, color: '#2c3e50', fontSize: '28px' }}>Panel de Control</h1>
            <p style={{ margin: '5px 0 0 0', color: '#666' }}>U.E.N.B. DR. LUIS PADRINO</p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            📅 {fechaActual.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p style={{ margin: '5px 0 0 0', color: '#999', fontSize: '12px' }}>
            🕐 {fechaActual.toLocaleTimeString('es-ES')}
          </p>
        </div>
      </div>

      {/* Tarjetas de estadísticas principales */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '20px', 
        marginBottom: '30px' 
      }}>
        <div 
          style={gradientCardStyle('#667eea', '#764ba2')}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>Total Estudiantes</p>
              <h2 style={{ margin: '10px 0', fontSize: '48px' }}>{estadisticas.totalEstudiantes}</h2>
              <p style={{ margin: 0, opacity: 0.8, fontSize: '12px' }}>Registrados en el sistema</p>
            </div>
            <span style={{ fontSize: '48px', opacity: 0.8 }}>👨‍🎓</span>
          </div>
        </div>

        <div 
          style={gradientCardStyle('#4facfe', '#00f2fe')}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>Total Niños</p>
              <h2 style={{ margin: '10px 0', fontSize: '48px' }}>{estadisticas.totalNiños}</h2>
              <p style={{ margin: 0, opacity: 0.8, fontSize: '12px' }}>{((estadisticas.totalNiños / estadisticas.totalEstudiantes) * 100).toFixed(1)}% del total</p>
            </div>
            <span style={{ fontSize: '48px', opacity: 0.8 }}>👦</span>
          </div>
        </div>

        <div 
          style={gradientCardStyle('#f093fb', '#f5576c')}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>Total Niñas</p>
              <h2 style={{ margin: '10px 0', fontSize: '48px' }}>{estadisticas.totalNiñas}</h2>
              <p style={{ margin: 0, opacity: 0.8, fontSize: '12px' }}>{((estadisticas.totalNiñas / estadisticas.totalEstudiantes) * 100).toFixed(1)}% del total</p>
            </div>
            <span style={{ fontSize: '48px', opacity: 0.8 }}>👧</span>
          </div>
        </div>
      </div>

      {/* Segunda fila de tarjetas */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '20px', 
        marginBottom: '30px' 
      }}>
        <div 
          style={gradientCardStyle('#43e97b', '#38f9d7')}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>Comedor Escolar</p>
              <h2 style={{ margin: '10px 0', fontSize: '48px' }}>{estadisticas.usanComedor}</h2>
              <p style={{ margin: 0, opacity: 0.8, fontSize: '12px' }}>{porcentajeComedor}% del total</p>
            </div>
            <span style={{ fontSize: '48px', opacity: 0.8 }}>🍽️</span>
          </div>
        </div>

        <div 
          style={gradientCardStyle('#fa709a', '#fee140')}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>Permisos Especiales</p>
              <h2 style={{ margin: '10px 0', fontSize: '48px' }}>{estadisticas.permisosEspeciales}</h2>
              <p style={{ margin: 0, opacity: 0.8, fontSize: '12px' }}>{porcentajePermisos}% del total</p>
            </div>
            <span style={{ fontSize: '48px', opacity: 0.8 }}>📋</span>
          </div>
        </div>

        <div 
          style={gradientCardStyle('#a8edea', '#fed6e3')}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '14px', color: '#333' }}>Representantes</p>
              <h2 style={{ margin: '10px 0', fontSize: '48px', color: '#333' }}>{estadisticas.representantesActivos}</h2>
              <p style={{ margin: 0, opacity: 0.8, fontSize: '12px', color: '#333' }}>Activos registrados</p>
            </div>
            <span style={{ fontSize: '48px', opacity: 0.8 }}>👥</span>
          </div>
        </div>
      </div>

      {/* Estadísticas por Grado */}
      <div style={{ 
        background: 'white', 
        borderRadius: '16px', 
        padding: '24px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        marginBottom: '30px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '3px solid #3498db', paddingBottom: '10px' }}>
          <span style={{ fontSize: '24px' }}>📊</span>
          <h3 style={{ margin: 0, color: '#2c3e50' }}>Estadísticas por Grado</h3>
        </div>
        
        {estadisticas.porGrado.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>No hay datos de estudiantes registrados</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Grado</th>
                  <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>👨 Niños</th>
                  <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>👩 Niñas</th>
                  <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>📚 Total</th>
                </tr>
              </thead>
              <tbody>
                {estadisticas.porGrado.map((grado, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{grado.grado}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{grado.niños}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{grado.niñas}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}><strong>{grado.total}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mensaje de bienvenida */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        borderRadius: '16px', 
        padding: '30px',
        color: 'white',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: 0, fontSize: '20px' }}>🎓 Bienvenido a la Plataforma Estudiantil</h3>
        <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>
          Sistema de gestión académica U.E.N.B. Dr. Luis Padrino - Datos actualizados en tiempo real desde Firebase
        </p>
        <p style={{ margin: '15px 0 0 0', fontSize: '12px', opacity: 0.7 }}>
          Última actualización: {fechaActual.toLocaleString('es-ES')}
        </p>
      </div>
    </div>
  );
};

export default DashboardCards;