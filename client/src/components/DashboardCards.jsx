import React from "react";

/**
 * Componente de tarjetas de estadísticas profesional.
 * Recibe 'data' como prop para mostrar información real de la base de datos de Firebase.
 */
export default function DashboardCards({ data }) {
  // Configuración de las tarjetas basada en la estructura visual requerida
  const stats = [
    { 
      label: "Total Estudiantes", 
      value: data?.totalEstudiantes || "0", // Asegúrate de que Firebase devuelva 'totalEstudiantes'
      icon: "👥", 
      color: "#3182ce", // Azul Institucional
      subtitle: "Registrados" 
    },
    { 
      label: "Uso de Comedor", 
      value: data?.comedor || "0", 
      icon: "🍴", 
      color: "#38a169", // Verde
      // Si porcentajeComedor es null, muestra 0
      subtitle: `${data?.porcentajeComedor || 0}% del total` 
    },
    { 
      label: "Permisos Especiales", 
      value: data?.permisos || "0", 
      icon: "🛡️", 
      color: "#dd6b20", // Naranja
      subtitle: "Pendientes" 
    },
    { 
      label: "Representantes", 
      value: data?.totalRepresentantes || "0", 
      icon: "👤", 
      color: "#805ad5", // Morado
      subtitle: "Activos"
    }
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <div className="stat-card" key={index}>
          {/* Contenedor del Icono con fondo translúcido y color de icono */}
          <div 
            className="stat-icon" 
            style={{ 
              // '15' al final hace el color 15% opaco (translúcido)
              backgroundColor: `${stat.color}15`, 
              color: stat.color 
            }}
          >
            {/* Tamaño del emoji optimizado */}
            <span style={{ fontSize: '1.6rem' }}>{stat.icon}</span>
          </div>
          
          <div className="stat-info">
            {/* Clases depuradas para que coincidan con el CSS */}
            <p className="stat-label">{stat.label}</p>
            <h2 className="stat-value">{stat.value}</h2>
            
            {/* Subtítulo dinámico con el color de la tarjeta */}
            {stat.subtitle && (
              <p className="stat-subtitle" style={{ color: stat.color }}>
                {stat.subtitle}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}