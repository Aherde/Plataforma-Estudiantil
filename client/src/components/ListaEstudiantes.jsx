import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

  // Función para generar PDF de un estudiante específico
  const generarPDFEstudiante = async (estudiante) => {
    // Crear un elemento temporal con los datos del estudiante
    const contenidoPDF = document.createElement('div');
    contenidoPDF.style.padding = '20px';
    contenidoPDF.style.fontFamily = 'Segoe UI, sans-serif';
    contenidoPDF.style.backgroundColor = 'white';
    contenidoPDF.style.width = '800px';
    contenidoPDF.style.margin = '0 auto';
    
    // Obtener datos del estudiante
    const alumnoData = estudiante.alumno || {};
    const madreData = estudiante.madre || {};
    const padreData = estudiante.padre || {};
    const representanteData = estudiante.representante || {};
    const recordData = estudiante.record || {};
    
    // Encabezado institucional
    contenidoPDF.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #2c3e50; padding-bottom: 15px;">
        <h3 style="margin: 0;">República Bolivariana de Venezuela</h3>
        <h4 style="margin: 5px 0;">Ministerio del Poder Popular para la Educación</h4>
        <h2 style="margin: 5px 0; color: #2c3e50;">U.E.N.B DR. LUIS PADRINO</h2>
        <p style="margin: 5px 0;">Caracas - COD. DEA: OD07810103 RIF: J30757263-9</p>
        <h1 style="margin: 10px 0; color: #2c3e50;">FICHA DE INGRESO</h1>
        <p style="margin: 5px 0;">Fecha de emisión: ${new Date().toLocaleString()}</p>
      </div>
    `;
    
    // DATOS DEL ALUMNO
    contenidoPDF.innerHTML += `
      <div style="background: white; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 20px; overflow: hidden;">
        <div style="background: #2c3e50; color: white; padding: 12px; text-align: center;">
          <h3 style="margin: 0;">📚 DATOS DEL ALUMNO</h3>
        </div>
        <div style="padding: 15px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; width: 40%;"><strong>Apellidos y Nombres:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${alumnoData.apellidosNombres || '_________________________'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Fecha de Nacimiento:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${alumnoData.fechaNacimiento || '_________________________'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Edad:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${alumnoData.edad || '___'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Género:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${alumnoData.genero === 'M' ? 'Masculino' : alumnoData.genero === 'F' ? 'Femenino' : '_________________'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Lugar de Nacimiento:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${alumnoData.lugarNacimiento || '_________________________'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Entidad Federal:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${alumnoData.entidadFederal || '_________________________'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Dirección:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${alumnoData.direccion || '_________________________'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Teléfono:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${alumnoData.telefono || '_________________________'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Correo Electrónico:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${alumnoData.correo || '_________________________'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Cédula Escolar:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${alumnoData.cedulaEscolar || '_________________________'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Cédula de Identidad:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${alumnoData.cedulaIdentidad || '_________________________'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Grado / Año:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${alumnoData.grado || '_________________'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Sección:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${alumnoData.seccion || '_________________'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Tiene hermanos en el plantel:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${alumnoData.tieneHermanos || '_________________'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>¿Padece de alguna enfermedad?:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${alumnoData.enfermedadPadece || '_________________'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>¿Alérgico a algún medicamento?:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${alumnoData.alergicoMedicamento || '_________________'}</td></tr>
            ${alumnoData.alergicoMedicamento === 'Si' ? `<tr><td style="padding: 8px;"><strong>Indique la alergia:</strong></td><td style="padding: 8px;">${alumnoData.cualAlergia || '_________________'}</td></tr>` : ''}
          </table>
        </div>
      </div>
    `;
    
    // TALLAS Y COMEDOR
    contenidoPDF.innerHTML += `
      <div style="background: white; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 20px; overflow: hidden;">
        <div style="background: #2c3e50; color: white; padding: 12px; text-align: center;">
          <h3 style="margin: 0;">📏 TALLAS Y COMEDOR</h3>
        </div>
        <div style="padding: 15px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; width: 40%;"><strong>Talla Camisa:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${alumnoData.tallaCamisa || '_________________'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Talla Pantalón:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${alumnoData.tallaPantalon || '_________________'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Talla Zapatos:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${alumnoData.tallaZapatos || '_________________'}</td></tr>
            <tr><td style="padding: 8px;"><strong>¿Come en el comedor escolar?:</strong></td><td style="padding: 8px;">${alumnoData.comeComedor === 'Si' ? '✅ Sí' : '❌ No'}</td></tr>
          </table>
        </div>
      </div>
    `;
    
    // DATOS DE LA MADRE
    contenidoPDF.innerHTML += `
      <div style="background: white; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 20px; overflow: hidden;">
        <div style="background: #2c3e50; color: white; padding: 12px; text-align: center;">
          <h3 style="margin: 0;">👩 DATOS DE LA MADRE</h3>
        </div>
        <div style="padding: 15px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; width: 40%;"><strong>Nombre Completo:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${madreData.nombre || '_________________________'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Cédula de Identidad:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${madreData.cedula || '_________________________'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Grado de Instrucción:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${madreData.gradoInstruccion || '_________________'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Ocupación:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${madreData.ocupacion || '_________________'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Lugar de Trabajo:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${madreData.lugarTrabajo || '_________________'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Teléfono:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${madreData.telefono || '_________________'}</td></tr>
            <tr><td style="padding: 8px;"><strong>Dirección de Habitación:</strong></td><td style="padding: 8px;">${madreData.direccion || '_________________________'}</td></tr>
          </table>
          ${madreData.nombreEmergencia ? `
            <div style="margin-top: 15px;">
              <h4 style="margin: 0 0 10px 0; color: #e74c3c;">📞 Contacto de emergencia</h4>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee; width: 40%;"><strong>Nombre:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${madreData.nombreEmergencia || '_________________'}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Parentesco:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${madreData.parentescoEmergencia || '_________________'}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Teléfono:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${madreData.telefonoEmergencia || '_________________'}</td></tr>
                <tr><td style="padding: 8px;"><strong>Ocupación:</strong></td><td style="padding: 8px;">${madreData.ocupacionEmergencia || '_________________'}</td></tr>
              </table>
            </div>
          ` : ''}
        </div>
      </div>
    `;
    
    // DATOS DEL PADRE
    contenidoPDF.innerHTML += `
      <div style="background: white; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 20px; overflow: hidden;">
        <div style="background: #2c3e50; color: white; padding: 12px; text-align: center;">
          <h3 style="margin: 0;">👨 DATOS DEL PADRE</h3>
        </div>
        <div style="padding: 15px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; width: 40%;"><strong>Nombre Completo:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${padreData.nombre || '_________________________'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Cédula de Identidad:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${padreData.cedula || '_________________________'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Grado de Instrucción:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${padreData.gradoInstruccion || '_________________'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Ocupación:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${padreData.ocupacion || '_________________'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Lugar de Trabajo:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${padreData.lugarTrabajo || '_________________'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Teléfono:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${padreData.telefono || '_________________'}</td></tr>
            <tr><td style="padding: 8px;"><strong>Dirección de Habitación:</strong></td><td style="padding: 8px;">${padreData.direccion || '_________________________'}</td></tr>
          </table>
          ${padreData.nombreEmergencia ? `
            <div style="margin-top: 15px;">
              <h4 style="margin: 0 0 10px 0; color: #e74c3c;">📞 Contacto de emergencia</h4>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee; width: 40%;"><strong>Nombre:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${padreData.nombreEmergencia || '_________________'}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Parentesco:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${padreData.parentescoEmergencia || '_________________'}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Teléfono:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${padreData.telefonoEmergencia || '_________________'}</td></tr>
                <tr><td style="padding: 8px;"><strong>Ocupación:</strong></td><td style="padding: 8px;">${padreData.ocupacionEmergencia || '_________________'}</td></tr>
              </table>
            </div>
          ` : ''}
        </div>
      </div>
    `;
    
    // REPRESENTANTE LEGAL
    contenidoPDF.innerHTML += `
      <div style="background: white; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 20px; overflow: hidden;">
        <div style="background: #2c3e50; color: white; padding: 12px; text-align: center;">
          <h3 style="margin: 0;">📋 REPRESENTANTE LEGAL</h3>
        </div>
        <div style="padding: 15px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; width: 40%;"><strong>Nombre del Representante:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${representanteData.nombre || '_________________________'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Cédula de Identidad:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${representanteData.cedula || '_________________________'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Teléfono:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${representanteData.telefono || '_________________'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Ocupación:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${representanteData.ocupacion || '_________________'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Lugar de Trabajo:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${representanteData.lugarTrabajo || '_________________'}</td></tr>
            <tr><td style="padding: 8px;"><strong>Parentesco:</strong></td><td style="padding: 8px;">${representanteData.parentesco || '_________________'}</td></tr>
          </table>
          ${representanteData.vieneSolo === 'No' ? `
            <div style="margin-top: 15px;">
              <h4 style="margin: 0 0 10px 0; color: #e74c3c;">👤 Responsable de traer y retirar al niño</h4>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee; width: 40%;"><strong>Nombre:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${representanteData.responsableNombre || '_________________'}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Cédula:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${representanteData.responsableCedula || '_________________'}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Teléfono:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${representanteData.responsableTelefono || '_________________'}</td></tr>
                <tr><td style="padding: 8px;"><strong>Parentesco:</strong></td><td style="padding: 8px;">${representanteData.responsableParentesco || '_________________'}</td></tr>
              </table>
            </div>
          ` : ''}
        </div>
      </div>
    `;
    
    // RECORD DE PROSECUCIÓN
    contenidoPDF.innerHTML += `
      <div style="background: white; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 20px; overflow: hidden;">
        <div style="background: #2c3e50; color: white; padding: 12px; text-align: center;">
          <h3 style="margin: 0;">📖 RECORD DE PROSECUCIÓN</h3>
        </div>
        <div style="padding: 15px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: #f5f5f5;">
              <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Nivel / Grado</th>
              <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Literal / Calificación</th>
              <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Año Lectivo</th>
            </tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;">I Nivel</td><td style="padding: 8px; border: 1px solid #ddd;">${recordData.iNivel || '_________________'}</td><td style="padding: 8px; border: 1px solid #ddd;">${recordData.añoLectivo1 || '_________________'}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;">II Nivel</td><td style="padding: 8px; border: 1px solid #ddd;">${recordData.iiNivel || '_________________'}</td><td style="padding: 8px; border: 1px solid #ddd;">${recordData.añoLectivo2 || '_________________'}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;">III Nivel</td><td style="padding: 8px; border: 1px solid #ddd;">${recordData.iiiNivel || '_________________'}</td><td style="padding: 8px; border: 1px solid #ddd;">${recordData.añoLectivo3 || '_________________'}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;">1° Grado</td><td style="padding: 8px; border: 1px solid #ddd;">${recordData.primerGrado || '_________________'}</td><td style="padding: 8px; border: 1px solid #ddd;">${recordData.añoLectivo4 || '_________________'}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;">2° Grado</td><td style="padding: 8px; border: 1px solid #ddd;">${recordData.segundoGrado || '_________________'}</td><td style="padding: 8px; border: 1px solid #ddd;">${recordData.añoLectivo5 || '_________________'}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;">3° Grado</td><td style="padding: 8px; border: 1px solid #ddd;">${recordData.tercerGrado || '_________________'}</td><td style="padding: 8px; border: 1px solid #ddd;">${recordData.añoLectivo6 || '_________________'}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;">4° Grado</td><td style="padding: 8px; border: 1px solid #ddd;">${recordData.cuartoGrado || '_________________'}</td><td style="padding: 8px; border: 1px solid #ddd;">${recordData.añoLectivo7 || '_________________'}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;">5° Grado</td><td style="padding: 8px; border: 1px solid #ddd;">${recordData.quintoGrado || '_________________'}</td><td style="padding: 8px; border: 1px solid #ddd;">${recordData.añoLectivo8 || '_________________'}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;">6° Grado</td><td style="padding: 8px; border: 1px solid #ddd;">${recordData.sextoGrado || '_________________'}</td><td style="padding: 8px; border: 1px solid #ddd;">${recordData.añoLectivo9 || '_________________'}</td></tr>
          </table>
        </div>
      </div>
    `;
    
    // ACTA DE COMPROMISO
    contenidoPDF.innerHTML += `
      <div style="background: white; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 20px; overflow: hidden;">
        <div style="background: #2c3e50; color: white; padding: 12px; text-align: center;">
          <h3 style="margin: 0;">📝 ACTA DE COMPROMISO</h3>
        </div>
        <div style="padding: 15px;">
          <p style="line-height: 1.6; text-align: justify;">
            Yo, <strong>${representanteData.nombre || '_________________________'}</strong>, 
            representante del alumno: <strong>${alumnoData.apellidosNombres || '_________________________'}</strong>, 
            del grado <strong>${alumnoData.grado || '______'}</strong> 
            sección "<strong>${alumnoData.seccion || '___'}</strong>", 
            me comprometo ante la Dirección de la U.E.N.B "Dr. Luis Padrino" a sufragar los gastos ocasionados por mi representante en el plantel y a cumplir con el reglamento y normas internas de la institución.
          </p>
          <div style="display: flex; justify-content: space-around; margin-top: 40px;">
            <div style="text-align: center;">
              <div style="border-top: 1px solid black; width: 200px; padding-top: 5px;">Firma del Docente</div>
            </div>
            <div style="text-align: center;">
              <div style="border-top: 1px solid black; width: 200px; padding-top: 5px;">Firma del Representante</div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Agregar al body temporalmente
    document.body.appendChild(contenidoPDF);
    
    try {
      const canvas = await html2canvas(contenidoPDF, { scale: 2, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'letter'
      });
      const imgWidth = 215.9;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Ficha_${alumnoData.apellidosNombres || 'Estudiante'}.pdf`);
      setMensaje(`✅ Ficha de ${alumnoData.apellidosNombres || 'estudiante'} generada exitosamente`);
      setTimeout(() => setMensaje(''), 3000);
    } catch (error) {
      console.error("Error al generar PDF:", error);
      setMensaje('❌ Error al generar el PDF');
      setTimeout(() => setMensaje(''), 3000);
    }
    
    // Limpiar el elemento temporal
    document.body.removeChild(contenidoPDF);
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
                          onClick={() => generarPDFEstudiante(est)}
                          style={{
                            padding: '5px 12px',
                            marginRight: '8px',
                            backgroundColor: '#e74c3c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                          title="Descargar ficha PDF"
                        >
                          📄 PDF
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