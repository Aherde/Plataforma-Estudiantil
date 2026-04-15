import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const ListaEstudiantes = ({ onEditar }) => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [eliminando, setEliminando] = useState(false);

  // Cargar estudiantes desde Firebase
  const cargarEstudiantes = async () => {
    setCargando(true);
    try {
      const querySnapshot = await getDocs(collection(db, "students"));
      const lista = [];
      querySnapshot.forEach((doc) => {
        lista.push({ id: doc.id, ...doc.data() });
      });
      // Ordenar por nombre alfabéticamente
      lista.sort((a, b) => {
        const nombreA = a.alumno?.apellidosNombres || '';
        const nombreB = b.alumno?.apellidosNombres || '';
        return nombreA.localeCompare(nombreB);
      });
      setEstudiantes(lista);
    } catch (error) {
      console.error("Error al cargar:", error);
      setMensaje('❌ Error al cargar los estudiantes');
      setTimeout(() => setMensaje(''), 3000);
    }
    setCargando(false);
  };

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  // Eliminar estudiante
  const eliminarEstudiante = async (id, nombre) => {
    if (window.confirm(`⚠️ ¿Está seguro que desea eliminar a "${nombre}"?\n\nEsta acción no se puede deshacer.`)) {
      setEliminando(true);
      try {
        await deleteDoc(doc(db, "students", id));
        setMensaje(`✅ ${nombre} ha sido eliminado correctamente`);
        setTimeout(() => setMensaje(''), 3000);
        cargarEstudiantes();
      } catch (error) {
        console.error("Error al eliminar:", error);
        setMensaje('❌ Error al eliminar el estudiante');
        setTimeout(() => setMensaje(''), 3000);
      }
      setEliminando(false);
    }
  };

  // Filtrar estudiantes por búsqueda
  const estudiantesFiltrados = estudiantes.filter(est => {
    const nombreCompleto = est.alumno?.apellidosNombres || '';
    const cedula = est.alumno?.cedulaIdentidad || est.alumno?.cedulaEscolar || '';
    const grado = est.alumno?.grado || '';
    const seccion = est.alumno?.seccion || '';
    const representante = est.representante?.nombre || est.madre?.nombre || '';
    
    return nombreCompleto.toLowerCase().includes(busqueda.toLowerCase()) ||
           cedula.includes(busqueda) ||
           grado.toLowerCase().includes(busqueda.toLowerCase()) ||
           seccion.toLowerCase().includes(busqueda.toLowerCase()) ||
           representante.toLowerCase().includes(busqueda.toLowerCase());
  });

  // Exportar a CSV
  const exportarCSV = () => {
    let csvContent = "\uFEFFNombre,Cédula,Grado,Sección,Representante,Teléfono\n";
    estudiantesFiltrados.forEach(est => {
      csvContent += `"${est.alumno?.apellidosNombres || ''}","${est.alumno?.cedulaIdentidad || est.alumno?.cedulaEscolar || ''}","${est.alumno?.grado || ''}","${est.alumno?.seccion || ''}","${est.representante?.nombre || est.madre?.nombre || ''}","${est.madre?.telefono || est.padre?.telefono || ''}"\n`;
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Lista_Estudiantes_${new Date().toLocaleDateString()}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    setMensaje('✅ Lista exportada a CSV');
    setTimeout(() => setMensaje(''), 2000);
  };

  const thStyle = {
    border: '1px solid #ddd',
    padding: '12px',
    backgroundColor: '#2c3e50',
    color: 'white',
    textAlign: 'left'
  };

  const tdStyle = {
    border: '1px solid #ddd',
    padding: '10px',
    verticalAlign: 'top'
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h2 style={{ margin: 0, color: '#2c3e50' }}>📋 Lista de Estudiantes Registrados</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="🔍 Buscar por nombre, cédula, grado..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{
              padding: '10px',
              width: '280px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '14px'
            }}
          />
          <button
            onClick={exportarCSV}
            style={{
              padding: '10px 15px',
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            📎 Exportar CSV
          </button>
          <button
            onClick={cargarEstudiantes}
            style={{
              padding: '10px 15px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
            disabled={cargando}
          >
            {cargando ? '⏳ Cargando...' : '🔄 Actualizar'}
          </button>
        </div>
      </div>

      {mensaje && (
        <div style={{
          padding: '10px',
          backgroundColor: mensaje.includes('✅') ? '#d4edda' : '#f8d7da',
          color: mensaje.includes('✅') ? '#155724' : '#721c24',
          borderRadius: '4px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          {mensaje}
        </div>
      )}

      {cargando ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Cargando estudiantes...</p>
        </div>
      ) : (
        <>
          <p style={{ marginBottom: '10px', color: '#666' }}>
            📊 Total de estudiantes: <strong>{estudiantesFiltrados.length}</strong>
            {estudiantes.length !== estudiantesFiltrados.length && 
              ` (Filtrado de ${estudiantes.length} total)`}
          </p>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={thStyle}>#</th>
                  <th style={thStyle}>Nombre Completo</th>
                  <th style={thStyle}>Cédula</th>
                  <th style={thStyle}>Grado</th>
                  <th style={thStyle}>Sección</th>
                  <th style={thStyle}>Representante</th>
                  <th style={thStyle}>Teléfono</th>
                  <th style={thStyle}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {estudiantesFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                      {busqueda ? '🔍 No se encontraron resultados para tu búsqueda' : '📭 No hay estudiantes registrados'}
                    </td>
                  </tr>
                ) : (
                  estudiantesFiltrados.map((est, index) => (
                    <tr key={est.id} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                      <td style={tdStyle}>{index + 1}</td>
                      <td style={tdStyle}>
                        <strong>{est.alumno?.apellidosNombres || 'N/A'}</strong>
                        {est.alumno?.tallaCamisa && (
                          <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                            🏷️ Talla: C{est.alumno?.tallaCamisa} | P{est.alumno?.tallaPantalon} | Z{est.alumno?.tallaZapatos}
                          </div>
                        )}
                      </td>
                      <td style={tdStyle}>{est.alumno?.cedulaIdentidad || est.alumno?.cedulaEscolar || 'N/A'}</td>
                      <td style={tdStyle}>{est.alumno?.grado || 'N/A'}</td>
                      <td style={tdStyle}>{est.alumno?.seccion || 'N/A'}</td>
                      <td style={tdStyle}>{est.representante?.nombre || est.madre?.nombre || 'N/A'}</td>
                      <td style={tdStyle}>{est.madre?.telefono || est.padre?.telefono || 'N/A'}</td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => onEditar(est)}
                          style={{
                            padding: '5px 12px',
                            marginRight: '8px',
                            backgroundColor: '#f39c12',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                          title="Editar estudiante"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => eliminarEstudiante(est.id, est.alumno?.apellidosNombres || 'el estudiante')}
                          style={{
                            padding: '5px 12px',
                            backgroundColor: '#e74c3c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                          disabled={eliminando}
                          title="Eliminar estudiante"
                        >
                          🗑️ Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ListaEstudiantes;