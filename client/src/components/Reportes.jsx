import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import * as XLSX from 'xlsx';

const Reportes = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroGrado, setFiltroGrado] = useState("");
  const [filtroSeccion, setFiltroSeccion] = useState("");
  const [gradosDisponibles, setGradosDisponibles] = useState([]);
  const [seccionesDisponibles, setSeccionesDisponibles] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    totalNiños: 0,
    totalNiñas: 0,
    totalComedor: 0,
    totalEstudiantes: 0,
    representantesUnicos: 0,
    porGrado: [],
    tallas: {
      camisa: {},
      pantalon: {},
      zapatos: {}
    }
  });

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "students"));
        const listaTemporal = [];
        const gradosSet = new Set();
        const seccionesSet = new Set();
        const porGradoMap = new Map();
        const tallasCamisa = {};
        const tallasPantalon = {};
        const tallasZapatos = {};
        
        let totalNiños = 0;
        let totalNiñas = 0;
        let totalComedor = 0;
        const representantesSet = new Set();

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const infoAlumno = data.alumno || {};
          const infoMadre = data.madre || {};
          const infoPadre = data.padre || {};
          const grado = infoAlumno.grado || "Sin especificar";
          const seccion = infoAlumno.seccion || "Sin especificar";
          
          const genero = infoAlumno.genero || "";
          if (genero.toLowerCase() === 'm' || genero.toLowerCase() === 'masculino') totalNiños++;
          if (genero.toLowerCase() === 'f' || genero.toLowerCase() === 'femenino') totalNiñas++;
          
          if (infoAlumno.comeComedor === 'Si' || data.comedor === 'Si') totalComedor++;
          
          const cedulaRep = infoMadre.cedula || infoPadre.cedula || data.representante?.cedula;
          if (cedulaRep) representantesSet.add(cedulaRep);
          
          if (!porGradoMap.has(grado)) {
            porGradoMap.set(grado, { niños: 0, niñas: 0, total: 0, comedor: 0, secciones: new Map() });
          }
          const gradoStats = porGradoMap.get(grado);
          if (genero.toLowerCase() === 'm' || genero.toLowerCase() === 'masculino') gradoStats.niños++;
          if (genero.toLowerCase() === 'f' || genero.toLowerCase() === 'femenino') gradoStats.niñas++;
          gradoStats.total++;
          if (infoAlumno.comeComedor === 'Si') gradoStats.comedor++;
          
          if (!gradoStats.secciones.has(seccion)) {
            gradoStats.secciones.set(seccion, { niños: 0, niñas: 0, total: 0 });
          }
          const seccionStats = gradoStats.secciones.get(seccion);
          if (genero.toLowerCase() === 'm' || genero.toLowerCase() === 'masculino') seccionStats.niños++;
          if (genero.toLowerCase() === 'f' || genero.toLowerCase() === 'femenino') seccionStats.niñas++;
          seccionStats.total++;
          
          const tallaCamisa = infoAlumno.tallaCamisa;
          const tallaPantalon = infoAlumno.tallaPantalon;
          const tallaZapatos = infoAlumno.tallaZapatos;
          
          if (tallaCamisa && tallaCamisa !== '-') {
            tallasCamisa[tallaCamisa] = (tallasCamisa[tallaCamisa] || 0) + 1;
          }
          if (tallaPantalon && tallaPantalon !== '-') {
            tallasPantalon[tallaPantalon] = (tallasPantalon[tallaPantalon] || 0) + 1;
          }
          if (tallaZapatos && tallaZapatos !== '-') {
            tallasZapatos[tallaZapatos] = (tallasZapatos[tallaZapatos] || 0) + 1;
          }
          
          gradosSet.add(grado);
          seccionesSet.add(seccion);
          
          listaTemporal.push({
            id: doc.id,
            nombreCompleto: `${infoAlumno.nombre || ''} ${infoAlumno.apellido || ''}`.trim() || infoAlumno.apellidosNombres || "Sin nombre",
            genero: infoAlumno.genero || "N/A",
            grado: grado,
            seccion: seccion,
            tipoIngreso: infoAlumno.tipoIngreso || "Nuevo Ingreso",
            tallaCamisa: infoAlumno.tallaCamisa || "-",
            tallaPantalon: infoAlumno.tallaPantalon || "-",
            tallaZapatos: infoAlumno.tallaZapatos || "-",
            comeComedor: infoAlumno.comeComedor || data.comedor || "No",
            representante: infoMadre.nombre || infoPadre.nombre || data.representante?.nombre || "N/A",
            cedulaRep: infoMadre.cedula || infoPadre.cedula || data.representante?.cedula || null
          });
        });
        
        const porGradoArray = Array.from(porGradoMap.entries()).map(([grado, stats]) => ({
          grado,
          ...stats,
          secciones: Array.from(stats.secciones.entries()).map(([seccion, secStats]) => ({
            seccion,
            ...secStats
          }))
        })).sort((a, b) => a.grado.localeCompare(b.grado));
        
        setEstadisticas({
          totalNiños,
          totalNiñas,
          totalComedor,
          totalEstudiantes: listaTemporal.length,
          representantesUnicos: representantesSet.size,
          porGrado: porGradoArray,
          tallas: {
            camisa: tallasCamisa,
            pantalon: tallasPantalon,
            zapatos: tallasZapatos
          }
        });
        
        setEstudiantes(listaTemporal);
        setGradosDisponibles(Array.from(gradosSet).sort());
        setSeccionesDisponibles(Array.from(seccionesSet).sort());
        setCargando(false);
      } catch (error) {
        console.error("Error:", error);
        setCargando(false);
      }
    };
    obtenerDatos();
  }, []);

  const estudiantesFiltrados = estudiantes.filter(est => {
    return est.nombreCompleto.toLowerCase().includes(busqueda.toLowerCase()) &&
           (filtroGrado === "" || est.grado === filtroGrado) &&
           (filtroSeccion === "" || est.seccion === filtroSeccion);
  });

  const representantesPorGrado = () => {
    const mapa = new Map();
    estudiantes.forEach(est => {
      if (!mapa.has(est.grado)) {
        mapa.set(est.grado, new Map());
      }
      const gradoMap = mapa.get(est.grado);
      if (est.representante !== "N/A" && est.cedulaRep) {
        gradoMap.set(est.cedulaRep, {
          nombre: est.representante,
          estudiante: est.nombreCompleto
        });
      }
    });
    
    const resultado = [];
    mapa.forEach((gradoMap, grado) => {
      resultado.push({
        grado,
        representantes: Array.from(gradoMap.values())
      });
    });
    return resultado.sort((a, b) => a.grado.localeCompare(b.grado));
  };

  // Función profesional para exportar a Excel con múltiples hojas
  const exportarExcelProfesional = () => {
    // 1. Hoja de Resumen General
    const resumenData = [
      ['📊 REPORTE GENERAL DE ESTUDIANTES'],
      ['Fecha de generación:', new Date().toLocaleString()],
      [''],
      ['ESTADÍSTICAS GENERALES'],
      ['Total de Estudiantes', estadisticas.totalEstudiantes],
      ['Total de Niños', estadisticas.totalNiños],
      ['Total de Niñas', estadisticas.totalNiñas],
      ['Estudiantes que usan Comedor', estadisticas.totalComedor],
      ['Porcentaje de Comedor', `${((estadisticas.totalComedor / estadisticas.totalEstudiantes) * 100).toFixed(1)}%`],
      ['Representantes Únicos', estadisticas.representantesUnicos],
      [''],
      ['DISTRIBUCIÓN POR GRADO'],
      ['Grado', 'Niños', 'Niñas', 'Total', 'Comedor']
    ];
    
    estadisticas.porGrado.forEach(g => {
      resumenData.push([g.grado, g.niños, g.niñas, g.total, g.comedor]);
    });
    
    // 2. Hoja de Lista de Estudiantes
    const estudiantesData = [
      ['📋 LISTA COMPLETA DE ESTUDIANTES'],
      ['Fecha:', new Date().toLocaleString()],
      [],
      ['N°', 'Nombre Completo', 'Grado', 'Sección', 'Género', 'Talla Camisa', 'Talla Pantalón', 'Talla Zapatos', 'Come Comedor', 'Representante']
    ];
    
    estudiantes.forEach((est, index) => {
      estudiantesData.push([
        index + 1,
        est.nombreCompleto,
        est.grado,
        est.seccion,
        est.genero,
        est.tallaCamisa,
        est.tallaPantalon,
        est.tallaZapatos,
        est.comeComedor === 'Si' ? 'Sí' : 'No',
        est.representante
      ]);
    });
    
    // 3. Hoja de Tallas
    const tallasData = [
      ['👕 REPORTE DE TALLAS'],
      ['Fecha:', new Date().toLocaleString()],
      [],
      ['TALLAS DE CAMISAS'],
      ['Talla', 'Cantidad']
    ];
    
    Object.entries(estadisticas.tallas.camisa).sort((a,b) => Number(a[0]) - Number(b[0])).forEach(([talla, cantidad]) => {
      tallasData.push([talla, cantidad]);
    });
    
    tallasData.push([], ['TALLAS DE PANTALONES'], ['Talla', 'Cantidad']);
    Object.entries(estadisticas.tallas.pantalon).sort((a,b) => Number(a[0]) - Number(b[0])).forEach(([talla, cantidad]) => {
      tallasData.push([talla, cantidad]);
    });
    
    tallasData.push([], ['TALLAS DE ZAPATOS'], ['Talla', 'Cantidad']);
    Object.entries(estadisticas.tallas.zapatos).sort((a,b) => Number(a[0]) - Number(b[0])).forEach(([talla, cantidad]) => {
      tallasData.push([talla, cantidad]);
    });
    
    // 4. Hoja de Representantes por Grado
    const representantesData = [
      ['👥 REPRESENTANTES POR GRADO'],
      ['Fecha:', new Date().toLocaleString()],
      []
    ];
    
    representantesPorGrado().forEach(item => {
      representantesData.push([`📚 GRADO: ${item.grado}`, '', '']);
      representantesData.push(['Representante', 'Estudiante', '']);
      item.representantes.forEach(rep => {
        representantesData.push([rep.nombre, rep.estudiante, '']);
      });
      representantesData.push([]);
    });
    
    // 5. Hoja de Estadísticas por Sección
    const seccionesData = [
      ['📖 ESTADÍSTICAS POR SECCIÓN'],
      ['Fecha:', new Date().toLocaleString()],
      [],
      ['Grado', 'Sección', 'Niños', 'Niñas', 'Total']
    ];
    
    estadisticas.porGrado.forEach(grado => {
      grado.secciones.forEach(seccion => {
        seccionesData.push([grado.grado, seccion.seccion, seccion.niños, seccion.niñas, seccion.total]);
      });
    });
    
    // Crear libro de trabajo
    const wb = XLSX.utils.book_new();
    
    // Agregar hojas
    const wsResumen = XLSX.utils.aoa_to_sheet(resumenData);
    const wsEstudiantes = XLSX.utils.aoa_to_sheet(estudiantesData);
    const wsTallas = XLSX.utils.aoa_to_sheet(tallasData);
    const wsRepresentantes = XLSX.utils.aoa_to_sheet(representantesData);
    const wsSecciones = XLSX.utils.aoa_to_sheet(seccionesData);
    
    // Ajustar anchos de columnas
    wsEstudiantes['!cols'] = [{wch:6},{wch:35},{wch:15},{wch:10},{wch:10},{wch:12},{wch:14},{wch:12},{wch:12},{wch:25}];
    wsResumen['!cols'] = [{wch:25},{wch:20}];
    wsTallas['!cols'] = [{wch:15},{wch:12}];
    wsRepresentantes['!cols'] = [{wch:30},{wch:30},{wch:10}];
    wsSecciones['!cols'] = [{wch:15},{wch:12},{wch:10},{wch:10},{wch:10}];
    
    // Agregar hojas al libro
    XLSX.utils.book_append_sheet(wb, wsResumen, '📊 Resumen General');
    XLSX.utils.book_append_sheet(wb, wsEstudiantes, '📋 Lista Estudiantes');
    XLSX.utils.book_append_sheet(wb, wsTallas, '👕 Reporte Tallas');
    XLSX.utils.book_append_sheet(wb, wsRepresentantes, '👥 Representantes');
    XLSX.utils.book_append_sheet(wb, wsSecciones, '📖 Estadísticas por Sección');
    
    // Guardar archivo
    const fecha = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    XLSX.writeFile(wb, `Reporte_Estudiantes_${fecha}.xlsx`);
  };

  if (cargando) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>
      <p>Cargando datos desde Firebase...</p>
    </div>;
  }

  const cardStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center'
  };

  const sectionTitleStyle = {
    color: '#2c3e50',
    borderBottom: '3px solid #3498db',
    paddingBottom: '10px',
    marginBottom: '20px'
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Segoe UI, sans-serif', maxWidth: '1400px', margin: '0 auto' }}>
      <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>📊 Reportes de Estudiantes</h2>
      
      {/* Botón de exportación profesional */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button 
          onClick={exportarExcelProfesional} 
          style={{ 
            padding: '12px 24px', 
            backgroundColor: '#27ae60', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          📎 Exportar a Excel Profesional (Múltiples Hojas)
        </button>
      </div>
      
      {/* Tarjetas de estadísticas generales */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
        gap: '15px', 
        marginBottom: '30px' 
      }}>
        <div style={cardStyle}>
          <h3 style={{ fontSize: '14px', color: '#666', margin: 0 }}>Total Estudiantes</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0', color: '#2c3e50' }}>{estadisticas.totalEstudiantes}</p>
        </div>
        <div style={{ ...cardStyle, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <h3 style={{ fontSize: '14px', margin: 0, opacity: 0.9 }}>Total Niños</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>{estadisticas.totalNiños}</p>
        </div>
        <div style={{ ...cardStyle, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
          <h3 style={{ fontSize: '14px', margin: 0, opacity: 0.9 }}>Total Niñas</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>{estadisticas.totalNiñas}</p>
        </div>
        <div style={{ ...cardStyle, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
          <h3 style={{ fontSize: '14px', margin: 0, opacity: 0.9 }}>Comedor Escolar</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>{estadisticas.totalComedor}</p>
          <small>{((estadisticas.totalComedor / estadisticas.totalEstudiantes) * 100).toFixed(1)}% del total</small>
        </div>
        <div style={{ ...cardStyle, background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
          <h3 style={{ fontSize: '14px', margin: 0, opacity: 0.9 }}>Representantes</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>{estadisticas.representantesUnicos}</p>
        </div>
      </div>

      {/* Estadísticas por Grado */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h3 style={sectionTitleStyle}>📚 Estadísticas por Grado</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Grado</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>👨 Niños</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>👩 Niñas</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>Total</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>🍽️ Comedor</th>
              </tr>
            </thead>
            <tbody>
              {estadisticas.porGrado.map((grado, idx) => (
                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                  <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold' }}>{grado.grado}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{grado.niños}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{grado.niñas}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{grado.total}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{grado.comedor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reporte de Tallas - Versión con Badges (Mejorada visualmente) */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h3 style={sectionTitleStyle}>👕 Reporte de Tallas</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          
          {/* Camisas */}
          <div style={{ backgroundColor: '#fef5f5', borderRadius: '12px', padding: '15px' }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#e74c3c', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>👕</span> Camisas
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {Object.keys(estadisticas.tallas.camisa).length === 0 ? (
                <span style={{ color: '#999' }}>Sin datos registrados</span>
              ) : (
                Object.entries(estadisticas.tallas.camisa)
                  .sort((a, b) => Number(a[0]) - Number(b[0]))
                  .map(([talla, cantidad]) => (
                    <div key={talla} style={{ 
                      backgroundColor: '#e74c3c', 
                      color: 'white', 
                      padding: '8px 15px', 
                      borderRadius: '20px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      <strong>Talla {talla}</strong>
                      <span style={{ backgroundColor: 'rgba(255,255,255,0.3)', padding: '2px 8px', borderRadius: '20px' }}>{cantidad}</span>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Pantalones */}
          <div style={{ backgroundColor: '#e8f4fd', borderRadius: '12px', padding: '15px' }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#3498db', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>👖</span> Pantalones
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {Object.keys(estadisticas.tallas.pantalon).length === 0 ? (
                <span style={{ color: '#999' }}>Sin datos registrados</span>
              ) : (
                Object.entries(estadisticas.tallas.pantalon)
                  .sort((a, b) => Number(a[0]) - Number(b[0]))
                  .map(([talla, cantidad]) => (
                    <div key={talla} style={{ 
                      backgroundColor: '#3498db', 
                      color: 'white', 
                      padding: '8px 15px', 
                      borderRadius: '20px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      <strong>Talla {talla}</strong>
                      <span style={{ backgroundColor: 'rgba(255,255,255,0.3)', padding: '2px 8px', borderRadius: '20px' }}>{cantidad}</span>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Zapatos */}
          <div style={{ backgroundColor: '#e8f8f0', borderRadius: '12px', padding: '15px' }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#2ecc71', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>👟</span> Zapatos
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {Object.keys(estadisticas.tallas.zapatos).length === 0 ? (
                <span style={{ color: '#999' }}>Sin datos registrados</span>
              ) : (
                Object.entries(estadisticas.tallas.zapatos)
                  .sort((a, b) => Number(a[0]) - Number(b[0]))
                  .map(([talla, cantidad]) => (
                    <div key={talla} style={{ 
                      backgroundColor: '#2ecc71', 
                      color: 'white', 
                      padding: '8px 15px', 
                      borderRadius: '20px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      <strong>Talla {talla}</strong>
                      <span style={{ backgroundColor: 'rgba(255,255,255,0.3)', padding: '2px 8px', borderRadius: '20px' }}>{cantidad}</span>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Representantes por Grado */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h3 style={sectionTitleStyle}>👥 Representantes por Grado</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
          {representantesPorGrado().map((item, idx) => (
            <div key={idx} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ backgroundColor: '#3498db', color: 'white', padding: '10px', fontWeight: 'bold' }}>{item.grado}</div>
              <div style={{ padding: '10px' }}>
                {item.representantes.length === 0 ? (
                  <p>No hay representantes registrados</p>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {item.representantes.map((rep, i) => (
                      <li key={i} style={{ marginBottom: '5px' }}>{rep.nombre} <small>({rep.estudiante})</small></li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lista detallada de estudiantes con filtros */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h3 style={sectionTitleStyle}>📋 Lista Detallada de Estudiantes</h3>
        
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="🔍 Buscar por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ padding: '10px', flex: '1', minWidth: '200px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <select value={filtroGrado} onChange={(e) => setFiltroGrado(e.target.value)} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <option value="">Todos los grados</option>
            {gradosDisponibles.map(grado => <option key={grado} value={grado}>{grado}</option>)}
          </select>
          <select value={filtroSeccion} onChange={(e) => setFiltroSeccion(e.target.value)} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <option value="">Todas las secciones</option>
            {seccionesDisponibles.map(seccion => <option key={seccion} value={seccion}>{seccion}</option>)}
          </select>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Nombre</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Grado</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Sección</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Género</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Talla Camisa</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Talla Pantalón</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Talla Zapatos</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Come Comedor</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Representante</th>
              </tr>
            </thead>
            <tbody>
              {estudiantesFiltrados.map((estudiante, idx) => (
                <tr key={estudiante.id} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{estudiante.nombreCompleto}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{estudiante.grado}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{estudiante.seccion}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{estudiante.genero}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{estudiante.tallaCamisa}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{estudiante.tallaPantalon}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{estudiante.tallaZapatos}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{estudiante.comeComedor === 'Si' ? '✅ Sí' : '❌ No'}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{estudiante.representante}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {estudiantesFiltrados.length === 0 && (
          <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>No se encontraron resultados con los filtros seleccionados</p>
        )}
      </div>
    </div>
  );
};

export default Reportes;