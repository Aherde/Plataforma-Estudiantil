import React, { useState, useRef, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, updateDoc, doc, getDocs, query, where } from 'firebase/firestore';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const AlumnoForm = ({ estudianteAEditar, onFormReset }) => {
  const [activeTab, setActiveTab] = useState('alumno');
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState({});
  const formRef = useRef(null);

  // Navegación entre pestañas
  const tabs = ['alumno', 'madre', 'padre', 'representante', 'record'];
  const currentIndex = tabs.indexOf(activeTab);

  const irSiguiente = () => {
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const irAnterior = () => {
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  // DATOS DEL ALUMNO
  const [alumno, setAlumno] = useState({
    apellidosNombres: '',
    fechaNacimiento: '',
    edad: '',
    genero: '',
    lugarNacimiento: '',
    entidadFederal: '',
    direccion: '',
    telefono: '',
    correo: '',
    cedulaEscolar: '',
    cedulaIdentidad: '',
    tieneHermanos: '',
    grado: '',
    seccion: '',
    enfermedadPadece: '',
    alergicoMedicamento: '',
    cualAlergia: '',
    tallaCamisa: '',
    tallaPantalon: '',
    tallaZapatos: '',
    comeComedor: ''
  });

  // DATOS DE LA MADRE
  const [madre, setMadre] = useState({
    nombre: '',
    cedula: '',
    gradoInstruccion: '',
    ocupacion: '',
    lugarTrabajo: '',
    telefono: '',
    direccion: '',
    nombreEmergencia: '',
    parentescoEmergencia: '',
    telefonoEmergencia: '',
    ocupacionEmergencia: ''
  });

  // DATOS DEL PADRE
  const [padre, setPadre] = useState({
    nombre: '',
    cedula: '',
    gradoInstruccion: '',
    ocupacion: '',
    lugarTrabajo: '',
    telefono: '',
    direccion: '',
    nombreEmergencia: '',
    parentescoEmergencia: '',
    telefonoEmergencia: '',
    ocupacionEmergencia: ''
  });

  // REPRESENTANTE LEGAL
  const [representante, setRepresentante] = useState({
    nombre: '',
    cedula: '',
    telefono: '',
    ocupacion: '',
    lugarTrabajo: '',
    parentesco: '',
    vieneSolo: '',
    responsableNombre: '',
    responsableCedula: '',
    responsableTelefono: '',
    responsableParentesco: ''
  });

  // RECORD DE PROSECUCIÓN - ACTUALIZADO HASTA 6TO GRADO
  const [record, setRecord] = useState({
    iNivel: '',
    iiNivel: '',
    iiiNivel: '',
    primerGrado: '',
    segundoGrado: '',
    tercerGrado: '',
    cuartoGrado: '',
    quintoGrado: '',
    sextoGrado: '',
    añoLectivo1: '',
    añoLectivo2: '',
    añoLectivo3: '',
    añoLectivo4: '',
    añoLectivo5: '',
    añoLectivo6: '',
    añoLectivo7: '',
    añoLectivo8: '',
    añoLectivo9: '',
    grado1: '',
    grado2: '',
    firmaDocente1: '',
    firmaDocente2: '',
    firmaRepresentante1: '',
    firmaRepresentante2: '',
    nombreRepresentanteActa: '',
    nombreAlumnoActa: '',
    gradoActa: '',
    seccionActa: ''
  });

  // Función para verificar si el estudiante ya existe
  const verificarEstudianteExistente = async () => {
    if (estudianteAEditar?.id) return false;
    
    try {
      const studentsRef = collection(db, "students");
      
      if (alumno.cedulaIdentidad && alumno.cedulaIdentidad.trim() !== '') {
        const qCedula = query(studentsRef, where("alumno.cedulaIdentidad", "==", alumno.cedulaIdentidad));
        const querySnapshotCedula = await getDocs(qCedula);
        if (!querySnapshotCedula.empty) {
          setMensaje('⚠️ Ya existe un estudiante registrado con esta CÉDULA DE IDENTIDAD. Verifique los datos.');
          setTimeout(() => setMensaje(''), 5000);
          return true;
        }
      }
      
      if (alumno.cedulaEscolar && alumno.cedulaEscolar.trim() !== '') {
        const qEscolar = query(studentsRef, where("alumno.cedulaEscolar", "==", alumno.cedulaEscolar));
        const querySnapshotEscolar = await getDocs(qEscolar);
        if (!querySnapshotEscolar.empty) {
          setMensaje('⚠️ Ya existe un estudiante registrado con esta CÉDULA ESCOLAR. Verifique los datos.');
          setTimeout(() => setMensaje(''), 5000);
          return true;
        }
      }
      
      if (alumno.apellidosNombres && alumno.apellidosNombres.trim() !== '') {
        const qNombre = query(studentsRef, where("alumno.apellidosNombres", "==", alumno.apellidosNombres));
        const querySnapshotNombre = await getDocs(qNombre);
        if (!querySnapshotNombre.empty) {
          setMensaje('⚠️ Ya existe un estudiante registrado con este NOMBRE COMPLETO. Verifique los datos.');
          setTimeout(() => setMensaje(''), 5000);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error al verificar duplicado:", error);
      return false;
    }
  };

  // Efecto para cargar datos cuando se está editando
  useEffect(() => {
    if (estudianteAEditar) {
      // Cargar datos del alumno
      if (estudianteAEditar.alumno) {
        setAlumno(estudianteAEditar.alumno);
      }
      // Cargar datos de la madre
      if (estudianteAEditar.madre) {
        setMadre(estudianteAEditar.madre);
      }
      // Cargar datos del padre
      if (estudianteAEditar.padre) {
        setPadre(estudianteAEditar.padre);
      }
      // Cargar datos del representante
      if (estudianteAEditar.representante) {
        setRepresentante(estudianteAEditar.representante);
      }
      // Cargar record de prosecución
      if (estudianteAEditar.record) {
        setRecord(estudianteAEditar.record);
      }
      setMensaje('✏️ Editando estudiante. Modifique los campos y guarde.');
      setTimeout(() => setMensaje(''), 3000);
    }
  }, [estudianteAEditar]);

  // Función para limpiar el formulario después de guardar/editar
  const limpiarFormulario = () => {
    setAlumno({
      apellidosNombres: '',
      fechaNacimiento: '',
      edad: '',
      genero: '',
      lugarNacimiento: '',
      entidadFederal: '',
      direccion: '',
      telefono: '',
      correo: '',
      cedulaEscolar: '',
      cedulaIdentidad: '',
      tieneHermanos: '',
      grado: '',
      seccion: '',
      padeceenfermedad: '',
      alergicoMedicamento: '',
      cualAlergia: '',
      tallaCamisa: '',
      tallaPantalon: '',
      tallaZapatos: '',
      comeComedor: ''
    });
    setMadre({
      nombre: '',
      cedula: '',
      gradoInstruccion: '',
      ocupacion: '',
      lugarTrabajo: '',
      telefono: '',
      direccion: '',
      nombreEmergencia: '',
      parentescoEmergencia: '',
      telefonoEmergencia: '',
      ocupacionEmergencia: ''
    });
    setPadre({
      nombre: '',
      cedula: '',
      gradoInstruccion: '',
      ocupacion: '',
      lugarTrabajo: '',
      telefono: '',
      direccion: '',
      nombreEmergencia: '',
      parentescoEmergencia: '',
      telefonoEmergencia: '',
      ocupacionEmergencia: ''
    });
    setRepresentante({
      nombre: '',
      cedula: '',
      telefono: '',
      ocupacion: '',
      lugarTrabajo: '',
      parentesco: '',
      vieneSolo: '',
      responsableNombre: '',
      responsableCedula: '',
      responsableTelefono: '',
      responsableParentesco: ''
    });
    setRecord({
      iNivel: '',
      iiNivel: '',
      iiiNivel: '',
      primerGrado: '',
      segundoGrado: '',
      tercerGrado: '',
      cuartoGrado: '',
      quintoGrado: '',
      sextoGrado: '',
      añoLectivo1: '',
      añoLectivo2: '',
      añoLectivo3: '',
      añoLectivo4: '',
      añoLectivo5: '',
      añoLectivo6: '',
      añoLectivo7: '',
      añoLectivo8: '',
      añoLectivo9: '',
      grado1: '',
      grado2: '',
      firmaDocente1: '',
      firmaDocente2: '',
      firmaRepresentante1: '',
      firmaRepresentante2: '',
      nombreRepresentanteActa: '',
      nombreAlumnoActa: '',
      gradoActa: '',
      seccionActa: ''
    });
    setErrores({});
  };

  // Función para validar campos obligatorios
  const validarFormulario = () => {
    const nuevosErrores = {};

    // Validar Alumno
    if (!alumno.apellidosNombres.trim()) nuevosErrores.alumnoApellidosNombres = '⚠️ Los Apellidos y Nombres son obligatorios';
    if (!alumno.genero) nuevosErrores.alumnoGenero = '⚠️ El Género es obligatorio';
    if (!alumno.grado) nuevosErrores.alumnoGrado = '⚠️ El Grado / Año es obligatorio';

    // Validar Madre
    if (!madre.nombre.trim()) nuevosErrores.madreNombre = '⚠️ El nombre de la madre es obligatorio';
    if (!madre.cedula.trim()) nuevosErrores.madreCedula = '⚠️ La cédula de la madre es obligatoria';
    if (!madre.telefono.trim()) nuevosErrores.madreTelefono = '⚠️ El teléfono de la madre es obligatorio';

    // Validar Padre
    if (!padre.nombre.trim()) nuevosErrores.padreNombre = '⚠️ El nombre del padre es obligatorio';
    if (!padre.cedula.trim()) nuevosErrores.padreCedula = '⚠️ La cédula del padre es obligatoria';
    if (!padre.telefono.trim()) nuevosErrores.padreTelefono = '⚠️ El teléfono del padre es obligatorio';

    // Validar Representante
    if (!representante.nombre.trim()) nuevosErrores.representanteNombre = '⚠️ El nombre del representante es obligatorio';
    if (!representante.cedula.trim()) nuevosErrores.representanteCedula = '⚠️ La cédula del representante es obligatoria';
    if (!representante.parentesco) nuevosErrores.representanteParentesco = '⚠️ El parentesco es obligatorio';

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Función para limpiar errores de un campo específico
  const limpiarError = (campo) => {
    if (errores[campo]) {
      const nuevosErrores = { ...errores };
      delete nuevosErrores[campo];
      setErrores(nuevosErrores);
    }
  };

  // HandleChange modificado para limpiar errores
  const handleChange = (e, estado, setEstado, campoError = null) => {
    setEstado({ ...estado, [e.target.name]: e.target.value });
    if (campoError) {
      limpiarError(campoError);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar antes de enviar
    if (!validarFormulario()) {
      if (errores.alumnoApellidosNombres || errores.alumnoGenero || errores.alumnoGrado) {
        setActiveTab('alumno');
      } else if (errores.madreNombre || errores.madreCedula || errores.madreTelefono) {
        setActiveTab('madre');
      } else if (errores.padreNombre || errores.padreCedula || errores.padreTelefono) {
        setActiveTab('padre');
      } else if (errores.representanteNombre || errores.representanteCedula || errores.representanteParentesco) {
        setActiveTab('representante');
      }
      
      setMensaje('❌ Por favor complete todos los campos obligatorios marcados en rojo');
      setTimeout(() => setMensaje(''), 5000);
      return;
    }

    // Verificar si el estudiante ya existe (solo para nuevos registros)
    if (!estudianteAEditar?.id) {
      const existe = await verificarEstudianteExistente();
      if (existe) return;
    }

    setCargando(true);
    setMensaje('');

    try {
      if (estudianteAEditar?.id) {
        // ACTUALIZAR estudiante existente
        await updateDoc(doc(db, "students", estudianteAEditar.id), {
          alumno,
          madre,
          padre,
          representante,
          record,
          fechaActualizacion: new Date().toISOString(),
          fechaRegistro: estudianteAEditar.fechaRegistro || new Date().toISOString()
        });
        setMensaje('✅ ¡Estudiante actualizado exitosamente! Los datos han sido modificados en Firebase.');
        
        // Resetear modo edición después de actualizar
        if (onFormReset) {
          onFormReset();
        }
        limpiarFormulario();
      } else {
        // CREAR nuevo estudiante
        await addDoc(collection(db, "students"), {
          alumno,
          madre,
          padre,
          representante,
          record,
          fechaRegistro: new Date().toISOString()
        });
        setMensaje('✅ ¡Estudiante registrado exitosamente! Los datos han sido guardados en Firebase.');
        limpiarFormulario();
      }
      setTimeout(() => setMensaje(''), 4000);
    } catch (error) {
      console.error("Error:", error);
      setMensaje('❌ Error al conectar con Firebase. Por favor, verifique su conexión e intente nuevamente.');
      setTimeout(() => setMensaje(''), 5000);
    }
    setCargando(false);
  };

  const descargarPDF = async () => {
    const element = formRef.current;
    try {
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'letter'
      });
      const imgWidth = 215.9;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Ficha_Institucional_${alumno.apellidosNombres || 'Estudiante'}.pdf`);
      setMensaje('✅ PDF generado exitosamente');
      setTimeout(() => setMensaje(''), 3000);
    } catch (error) {
      console.error("Error al generar PDF:", error);
      setMensaje('❌ Error al generar el PDF');
      setTimeout(() => setMensaje(''), 3000);
    }
  };

  // Estilo para input con error
  const inputErrorStyle = {
    width: '100%',
    padding: '8px',
    border: '2px solid #e74c3c',
    borderRadius: '4px',
    fontSize: '14px',
    backgroundColor: '#fff5f5'
  };

  const tabStyle = (tabName) => ({
    padding: '10px 20px',
    cursor: 'pointer',
    backgroundColor: activeTab === tabName ? '#2c3e50' : '#ecf0f1',
    color: activeTab === tabName ? '#fff' : '#333',
    border: 'none',
    borderRadius: '5px',
    fontWeight: activeTab === tabName ? '600' : '400',
    transition: 'all 0.3s ease'
  });

  const inputStyle = {
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: '500',
    color: '#333'
  };

  const labelErrorStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: '500',
    color: '#e74c3c'
  };

  const sectionStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    marginBottom: '20px'
  };

  const headerStyle = {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '15px',
    borderRadius: '8px 8px 0 0',
    margin: '-20px -20px 20px -20px',
    textAlign: 'center'
  };

  const thStyle = {
    border: '1px solid #ddd',
    padding: '10px',
    backgroundColor: '#f5f5f5',
    textAlign: 'left'
  };

  const tdStyle = {
    border: '1px solid #ddd',
    padding: '8px'
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Encabezado */}
      <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid #2c3e50', paddingBottom: '15px' }}>
        <h3 style={{ margin: 0 }}>República Bolivariana de Venezuela</h3>
        <h4 style={{ margin: '5px 0' }}>Ministerio del Poder Popular para la Educación</h4>
        <h2 style={{ margin: '5px 0', color: '#2c3e50' }}>U.E.N.B DR. LUIS PADRINO</h2>
        <p style={{ margin: '5px 0' }}>Caracas - COD. DEA: OD07810103 RIF: J30757263-9</p>
        <h1 style={{ margin: '10px 0', color: '#2c3e50' }}>FICHA DE INGRESO</h1>
      </div>

      {/* Mensaje interactivo */}
      {mensaje && (
        <div style={{
          padding: '15px',
          backgroundColor: mensaje.includes('✅') ? '#d4edda' : mensaje.includes('✏️') ? '#cce5ff' : mensaje.includes('⚠️') ? '#fff3cd' : '#f8d7da',
          color: mensaje.includes('✅') ? '#155724' : mensaje.includes('✏️') ? '#004085' : mensaje.includes('⚠️') ? '#856404' : '#721c24',
          borderRadius: '4px',
          marginBottom: '20px',
          textAlign: 'center',
          fontWeight: '500',
          border: `1px solid ${mensaje.includes('✅') ? '#c3e6cb' : mensaje.includes('✏️') ? '#b8daff' : mensaje.includes('⚠️') ? '#ffeeba' : '#f5c6cb'}`
        }}>
          {mensaje}
        </div>
      )}

      {/* Indicador de modo edición */}
      {estudianteAEditar && (
        <div style={{
          padding: '10px',
          backgroundColor: '#f39c12',
          color: 'white',
          borderRadius: '4px',
          marginBottom: '20px',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          ✏️ MODO EDICIÓN - Estás modificando: {estudianteAEditar.alumno?.apellidosNombres}
        </div>
      )}

      {/* Botones de navegación superiores */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button onClick={() => setActiveTab('alumno')} style={tabStyle('alumno')}>📚 Datos del Alumno</button>
        <button onClick={() => setActiveTab('madre')} style={tabStyle('madre')}>👩 Datos de la Madre</button>
        <button onClick={() => setActiveTab('padre')} style={tabStyle('padre')}>👨 Datos del Padre</button>
        <button onClick={() => setActiveTab('representante')} style={tabStyle('representante')}>📋 Representante Legal</button>
        <button onClick={() => setActiveTab('record')} style={tabStyle('record')}>📖 Record de Prosecución</button>
      </div>

      <div ref={formRef}>
        <form onSubmit={handleSubmit}>
          {/* TAB 1: DATOS DEL ALUMNO */}
          {activeTab === 'alumno' && (
            <div style={sectionStyle}>
              <div style={headerStyle}><h3 style={{ margin: 0 }}>DATOS DEL ALUMNO</h3></div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '15px' }}>
                <div>
                  <label style={errores.alumnoApellidosNombres ? labelErrorStyle : labelStyle}>Apellidos y Nombres *</label>
                  <input type="text" name="apellidosNombres" value={alumno.apellidosNombres} onChange={(e) => handleChange(e, alumno, setAlumno, 'alumnoApellidosNombres')} placeholder="Ej: CORTEZ FERMIN ALAN DAVID" style={errores.alumnoApellidosNombres ? inputErrorStyle : inputStyle} required />
                  {errores.alumnoApellidosNombres && <small style={{ color: '#e74c3c', fontSize: '12px' }}>{errores.alumnoApellidosNombres}</small>}
                </div>
                <div><label style={labelStyle}>Fecha de Nacimiento</label><input type="date" name="fechaNacimiento" value={alumno.fechaNacimiento} onChange={(e) => handleChange(e, alumno, setAlumno)} style={inputStyle} /></div>
                <div><label style={labelStyle}>Edad</label><input type="number" name="edad" value={alumno.edad} onChange={(e) => handleChange(e, alumno, setAlumno)} placeholder="Ej: 3" style={inputStyle} /></div>
                <div>
                  <label style={errores.alumnoGenero ? labelErrorStyle : labelStyle}>Género *</label>
                  <select name="genero" value={alumno.genero} onChange={(e) => handleChange(e, alumno, setAlumno, 'alumnoGenero')} style={errores.alumnoGenero ? inputErrorStyle : inputStyle} required>
                    <option value="">Seleccione</option>
                    <option value="F">Femenino</option>
                    <option value="M">Masculino</option>
                  </select>
                  {errores.alumnoGenero && <small style={{ color: '#e74c3c', fontSize: '12px' }}>{errores.alumnoGenero}</small>}
                </div>
                <div><label style={labelStyle}>Lugar de Nacimiento</label><input type="text" name="lugarNacimiento" value={alumno.lugarNacimiento} onChange={(e) => handleChange(e, alumno, setAlumno)} placeholder="Ej: LA GUAIRA" style={inputStyle} /></div>
                <div><label style={labelStyle}>Entidad Federal</label><input type="text" name="entidadFederal" value={alumno.entidadFederal} onChange={(e) => handleChange(e, alumno, setAlumno)} placeholder="Ej: Distrito Capital" style={inputStyle} /></div>
                <div><label style={labelStyle}>Dirección</label><input type="text" name="direccion" value={alumno.direccion} onChange={(e) => handleChange(e, alumno, setAlumno)} placeholder="Dirección completa" style={inputStyle} /></div>
                <div><label style={labelStyle}>Teléfono</label><input type="text" name="telefono" value={alumno.telefono} onChange={(e) => handleChange(e, alumno, setAlumno)} placeholder="Ej: 0412-310250" style={inputStyle} /></div>
                <div><label style={labelStyle}>Correo Electrónico</label><input type="email" name="correo" value={alumno.correo} onChange={(e) => handleChange(e, alumno, setAlumno)} placeholder="ejemplo@correo.com" style={inputStyle} /></div>
                <div><label style={labelStyle}>Cédula Escolar</label><input type="text" name="cedulaEscolar" value={alumno.cedulaEscolar} onChange={(e) => handleChange(e, alumno, setAlumno)} placeholder="Ej: 12229826936" style={inputStyle} /></div>
                <div><label style={labelStyle}>Cédula de Identidad</label><input type="text" name="cedulaIdentidad" value={alumno.cedulaIdentidad} onChange={(e) => handleChange(e, alumno, setAlumno)} placeholder="Ej: 28.820.736" style={inputStyle} /></div>
                <div>
                  <label style={errores.alumnoGrado ? labelErrorStyle : labelStyle}>Grado / Año *</label>
                  <input type="text" name="grado" value={alumno.grado} onChange={(e) => handleChange(e, alumno, setAlumno, 'alumnoGrado')} placeholder="Ej: 4TO" style={errores.alumnoGrado ? inputErrorStyle : inputStyle} required />
                  {errores.alumnoGrado && <small style={{ color: '#e74c3c', fontSize: '12px' }}>{errores.alumnoGrado}</small>}
                </div>
                <div><label style={labelStyle}>Sección</label><input type="text" name="seccion" value={alumno.seccion} onChange={(e) => handleChange(e, alumno, setAlumno)} placeholder="Ej: U" style={inputStyle} /></div>
                <div><label style={labelStyle}>¿Tiene hermanos en el plantel?</label><select name="tieneHermanos" value={alumno.tieneHermanos} onChange={(e) => handleChange(e, alumno, setAlumno)} style={inputStyle}><option value="">Seleccione</option><option value="Si">Si</option><option value="No">No</option></select></div>
                <div><label style={labelStyle}>¿Padece de alguna enfermedad?</label><select name="enfermedadPadece" value={alumno.enfermedadPadece} onChange={(e) => handleChange(e, alumno, setAlumno)} style={inputStyle}><option value="">Seleccione</option><option value="Si">Si</option><option value="No">No</option></select></div>
                <div><label style={labelStyle}>¿Alérgico a algún medicamento?</label><select name="alergicoMedicamento" value={alumno.alergicoMedicamento} onChange={(e) => handleChange(e, alumno, setAlumno)} style={inputStyle}><option value="">Seleccione</option><option value="Si">Si</option><option value="No">No</option></select></div>
                {alumno.alergicoMedicamento === 'Si' && <div><label style={labelStyle}>Indique la alergia</label><input type="text" name="cualAlergia" value={alumno.cualAlergia} onChange={(e) => handleChange(e, alumno, setAlumno)} placeholder="Ej: Penicilina" style={inputStyle} /></div>}
              </div>
              
              <hr style={{ margin: '20px 0' }} />
              <h4>📏 TALLAS Y COMEDOR</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                <div><label style={labelStyle}>Talla Camisa</label><input type="text" name="tallaCamisa" value={alumno.tallaCamisa} onChange={(e) => handleChange(e, alumno, setAlumno)} placeholder="Ej: 8" style={inputStyle} /></div>
                <div><label style={labelStyle}>Talla Pantalón</label><input type="text" name="tallaPantalon" value={alumno.tallaPantalon} onChange={(e) => handleChange(e, alumno, setAlumno)} placeholder="Ej: 6" style={inputStyle} /></div>
                <div><label style={labelStyle}>Talla Zapatos</label><input type="text" name="tallaZapatos" value={alumno.tallaZapatos} onChange={(e) => handleChange(e, alumno, setAlumno)} placeholder="Ej: 30" style={inputStyle} /></div>
                <div><label style={labelStyle}>¿Come en el comedor escolar?</label><select name="comeComedor" value={alumno.comeComedor} onChange={(e) => handleChange(e, alumno, setAlumno)} style={inputStyle}><option value="">Seleccione</option><option value="Si">Si</option><option value="No">No</option></select></div>
              </div>
              
              {/* Botón Siguiente */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={irSiguiente}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Siguiente → 📚
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: DATOS DE LA MADRE */}
          {activeTab === 'madre' && (
            <div style={sectionStyle}>
              <div style={headerStyle}><h3 style={{ margin: 0 }}>DATOS DE LA MADRE</h3></div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '15px' }}>
                <div>
                  <label style={errores.madreNombre ? labelErrorStyle : labelStyle}>Nombre Completo *</label>
                  <input type="text" name="nombre" value={madre.nombre} onChange={(e) => handleChange(e, madre, setMadre, 'madreNombre')} placeholder="Ej: Elimar Cristina Rivero Rodríguez" style={errores.madreNombre ? inputErrorStyle : inputStyle} />
                  {errores.madreNombre && <small style={{ color: '#e74c3c', fontSize: '12px' }}>{errores.madreNombre}</small>}
                </div>
                <div>
                  <label style={errores.madreCedula ? labelErrorStyle : labelStyle}>Cédula de Identidad *</label>
                  <input type="text" name="cedula" value={madre.cedula} onChange={(e) => handleChange(e, madre, setMadre, 'madreCedula')} placeholder="Ej: 25-294387" style={errores.madreCedula ? inputErrorStyle : inputStyle} />
                  {errores.madreCedula && <small style={{ color: '#e74c3c', fontSize: '12px' }}>{errores.madreCedula}</small>}
                </div>
                <div><label style={labelStyle}>Grado de Instrucción</label><input type="text" name="gradoInstruccion" value={madre.gradoInstruccion} onChange={(e) => handleChange(e, madre, setMadre)} placeholder="Ej: Bachiller" style={inputStyle} /></div>
                <div><label style={labelStyle}>Ocupación</label><input type="text" name="ocupacion" value={madre.ocupacion} onChange={(e) => handleChange(e, madre, setMadre)} placeholder="Ej: Asesora de Venta" style={inputStyle} /></div>
                <div><label style={labelStyle}>Lugar de Trabajo</label><input type="text" name="lugarTrabajo" value={madre.lugarTrabajo} onChange={(e) => handleChange(e, madre, setMadre)} placeholder="Ej: La Candelaria" style={inputStyle} /></div>
                <div>
                  <label style={errores.madreTelefono ? labelErrorStyle : labelStyle}>Teléfono *</label>
                  <input type="text" name="telefono" value={madre.telefono} onChange={(e) => handleChange(e, madre, setMadre, 'madreTelefono')} placeholder="Ej: 0424-336416" style={errores.madreTelefono ? inputErrorStyle : inputStyle} />
                  {errores.madreTelefono && <small style={{ color: '#e74c3c', fontSize: '12px' }}>{errores.madreTelefono}</small>}
                </div>
                <div><label style={labelStyle}>Dirección de Habitación</label><input type="text" name="direccion" value={madre.direccion} onChange={(e) => handleChange(e, madre, setMadre)} placeholder="Dirección" style={inputStyle} /></div>
              </div>
              <hr style={{ margin: '20px 0' }} />
              <h4>En caso de emergencia (Contacto alterno)</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '15px' }}>
                <div><label style={labelStyle}>Nombre</label><input type="text" name="nombreEmergencia" value={madre.nombreEmergencia} onChange={(e) => handleChange(e, madre, setMadre)} placeholder="Ej: Elmar Rodríguez" style={inputStyle} /></div>
                <div><label style={labelStyle}>Parentesco</label><input type="text" name="parentescoEmergencia" value={madre.parentescoEmergencia} onChange={(e) => handleChange(e, madre, setMadre)} placeholder="Ej: Abuela materna" style={inputStyle} /></div>
                <div><label style={labelStyle}>Teléfono</label><input type="text" name="telefonoEmergencia" value={madre.telefonoEmergencia} onChange={(e) => handleChange(e, madre, setMadre)} placeholder="Ej: 0414-9324379" style={inputStyle} /></div>
                <div><label style={labelStyle}>Ocupación</label><input type="text" name="ocupacionEmergencia" value={madre.ocupacionEmergencia} onChange={(e) => handleChange(e, madre, setMadre)} placeholder="Ej: Del hogar" style={inputStyle} /></div>
              </div>
              
              {/* Botones Anterior y Siguiente */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={irAnterior}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  ← Anterior 👩
                </button>
                <button
                  type="button"
                  onClick={irSiguiente}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Siguiente → 👨
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: DATOS DEL PADRE */}
          {activeTab === 'padre' && (
            <div style={sectionStyle}>
              <div style={headerStyle}><h3 style={{ margin: 0 }}>DATOS DEL PADRE</h3></div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '15px' }}>
                <div>
                  <label style={errores.padreNombre ? labelErrorStyle : labelStyle}>Nombre Completo *</label>
                  <input type="text" name="nombre" value={padre.nombre} onChange={(e) => handleChange(e, padre, setPadre, 'padreNombre')} placeholder="Ej: Angelo Mora" style={errores.padreNombre ? inputErrorStyle : inputStyle} />
                  {errores.padreNombre && <small style={{ color: '#e74c3c', fontSize: '12px' }}>{errores.padreNombre}</small>}
                </div>
                <div>
                  <label style={errores.padreCedula ? labelErrorStyle : labelStyle}>Cédula de Identidad *</label>
                  <input type="text" name="cedula" value={padre.cedula} onChange={(e) => handleChange(e, padre, setPadre, 'padreCedula')} placeholder="Ej: 27607999" style={errores.padreCedula ? inputErrorStyle : inputStyle} />
                  {errores.padreCedula && <small style={{ color: '#e74c3c', fontSize: '12px' }}>{errores.padreCedula}</small>}
                </div>
                <div><label style={labelStyle}>Grado de Instrucción</label><input type="text" name="gradoInstruccion" value={padre.gradoInstruccion} onChange={(e) => handleChange(e, padre, setPadre)} placeholder="Ej: Bachiller" style={inputStyle} /></div>
                <div><label style={labelStyle}>Ocupación</label><input type="text" name="ocupacion" value={padre.ocupacion} onChange={(e) => handleChange(e, padre, setPadre)} placeholder="Ej: Delivery" style={inputStyle} /></div>
                <div><label style={labelStyle}>Lugar de Trabajo</label><input type="text" name="lugarTrabajo" value={padre.lugarTrabajo} onChange={(e) => handleChange(e, padre, setPadre)} placeholder="Lugar de trabajo" style={inputStyle} /></div>
                <div>
                  <label style={errores.padreTelefono ? labelErrorStyle : labelStyle}>Teléfono *</label>
                  <input type="text" name="telefono" value={padre.telefono} onChange={(e) => handleChange(e, padre, setPadre, 'padreTelefono')} placeholder="Ej: 0424-2730085" style={errores.padreTelefono ? inputErrorStyle : inputStyle} />
                  {errores.padreTelefono && <small style={{ color: '#e74c3c', fontSize: '12px' }}>{errores.padreTelefono}</small>}
                </div>
                <div><label style={labelStyle}>Dirección de Habitación</label><input type="text" name="direccion" value={padre.direccion} onChange={(e) => handleChange(e, padre, setPadre)} placeholder="Ej: La Vega" style={inputStyle} /></div>
              </div>
              <hr style={{ margin: '20px 0' }} />
              <h4>En caso de emergencia (Contacto alterno)</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '15px' }}>
                <div><label style={labelStyle}>Nombre</label><input type="text" name="nombreEmergencia" value={padre.nombreEmergencia} onChange={(e) => handleChange(e, padre, setPadre)} placeholder="Ej: Elmar Rivera" style={inputStyle} /></div>
                <div><label style={labelStyle}>Parentesco</label><input type="text" name="parentescoEmergencia" value={padre.parentescoEmergencia} onChange={(e) => handleChange(e, padre, setPadre)} placeholder="Parentesco" style={inputStyle} /></div>
                <div><label style={labelStyle}>Teléfono</label><input type="text" name="telefonoEmergencia" value={padre.telefonoEmergencia} onChange={(e) => handleChange(e, padre, setPadre)} placeholder="Teléfono" style={inputStyle} /></div>
                <div><label style={labelStyle}>Ocupación</label><input type="text" name="ocupacionEmergencia" value={padre.ocupacionEmergencia} onChange={(e) => handleChange(e, padre, setPadre)} placeholder="Ocupación" style={inputStyle} /></div>
              </div>
              
              {/* Botones Anterior y Siguiente */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={irAnterior}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  ← Anterior 👨
                </button>
                <button
                  type="button"
                  onClick={irSiguiente}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Siguiente → 📋
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: REPRESENTANTE LEGAL */}
          {activeTab === 'representante' && (
            <div style={sectionStyle}>
              <div style={headerStyle}><h3 style={{ margin: 0 }}>REPRESENTANTE LEGAL ANTE LA INSTITUCIÓN</h3></div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '15px' }}>
                <div>
                  <label style={errores.representanteNombre ? labelErrorStyle : labelStyle}>Nombre del Representante *</label>
                  <input type="text" name="nombre" value={representante.nombre} onChange={(e) => handleChange(e, representante, setRepresentante, 'representanteNombre')} placeholder="Ej: Madre" style={errores.representanteNombre ? inputErrorStyle : inputStyle} />
                  {errores.representanteNombre && <small style={{ color: '#e74c3c', fontSize: '12px' }}>{errores.representanteNombre}</small>}
                </div>
                <div>
                  <label style={errores.representanteCedula ? labelErrorStyle : labelStyle}>Cédula de Identidad *</label>
                  <input type="text" name="cedula" value={representante.cedula} onChange={(e) => handleChange(e, representante, setRepresentante, 'representanteCedula')} placeholder="Ej: 25-294387" style={errores.representanteCedula ? inputErrorStyle : inputStyle} />
                  {errores.representanteCedula && <small style={{ color: '#e74c3c', fontSize: '12px' }}>{errores.representanteCedula}</small>}
                </div>
                <div><label style={labelStyle}>Teléfono</label><input type="text" name="telefono" value={representante.telefono} onChange={(e) => handleChange(e, representante, setRepresentante)} placeholder="Ej: 0424-1336416" style={inputStyle} /></div>
                <div><label style={labelStyle}>Ocupación</label><input type="text" name="ocupacion" value={representante.ocupacion} onChange={(e) => handleChange(e, representante, setRepresentante)} placeholder="Ej: Asesora de Venta" style={inputStyle} /></div>
                <div><label style={labelStyle}>Lugar de Trabajo</label><input type="text" name="lugarTrabajo" value={representante.lugarTrabajo} onChange={(e) => handleChange(e, representante, setRepresentante)} placeholder="Ej: La Candelaria" style={inputStyle} /></div>
                <div>
                  <label style={errores.representanteParentesco ? labelErrorStyle : labelStyle}>Parentesco *</label>
                  <select name="parentesco" value={representante.parentesco} onChange={(e) => handleChange(e, representante, setRepresentante, 'representanteParentesco')} style={errores.representanteParentesco ? inputErrorStyle : inputStyle}>
                    <option value="">Seleccione</option>
                    <option value="Madre">Madre</option>
                    <option value="Padre">Padre</option>
                    <option value="Abuela">Abuela</option>
                    <option value="Abuelo">Abuelo</option>
                    <option value="Tía">Tía</option>
                    <option value="Tío">Tío</option>
                    <option value="Hermana">Hermana</option>
                    <option value="Hermano">Hermano</option>
                    <option value="Otro">Otro</option>
                  </select>
                  {errores.representanteParentesco && <small style={{ color: '#e74c3c', fontSize: '12px' }}>{errores.representanteParentesco}</small>}
                </div>
              </div>
              <hr style={{ margin: '20px 0' }} />
              <h4>¿El niño se viene solo a la escuela?</h4>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <label><input type="radio" name="vieneSolo" value="Si" onChange={(e) => handleChange(e, representante, setRepresentante)} /> Si</label>
                <label><input type="radio" name="vieneSolo" value="No" onChange={(e) => handleChange(e, representante, setRepresentante)} /> No</label>
              </div>
              {representante.vieneSolo === 'No' && (
                <div>
                  <h4>Persona responsable de traer y retirar al niño del plantel</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '15px' }}>
                    <div><label style={labelStyle}>Nombre y Apellido</label><input type="text" name="responsableNombre" value={representante.responsableNombre} onChange={(e) => handleChange(e, representante, setRepresentante)} placeholder="Ej: Abuela Rodríguez" style={inputStyle} /></div>
                    <div><label style={labelStyle}>Cédula de Identidad</label><input type="text" name="responsableCedula" value={representante.responsableCedula} onChange={(e) => handleChange(e, representante, setRepresentante)} placeholder="Ej: 1557743" style={inputStyle} /></div>
                    <div><label style={labelStyle}>Teléfono</label><input type="text" name="responsableTelefono" value={representante.responsableTelefono} onChange={(e) => handleChange(e, representante, setRepresentante)} placeholder="Ej: 0414-3932379" style={inputStyle} /></div>
                    <div><label style={labelStyle}>Parentesco</label><input type="text" name="responsableParentesco" value={representante.responsableParentesco} onChange={(e) => handleChange(e, representante, setRepresentante)} placeholder="Ej: Abuela" style={inputStyle} /></div>
                  </div>
                </div>
              )}
              
              {/* Botones Anterior y Siguiente */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={irAnterior}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  ← Anterior 📋
                </button>
                <button
                  type="button"
                  onClick={irSiguiente}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Siguiente → 📖
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: RECORD DE PROSECUCIÓN - CON BOTÓN PDF Y ANTERIOR */}
          {activeTab === 'record' && (
            <div style={sectionStyle}>
              <div style={headerStyle}><h3 style={{ margin: 0 }}>RECORD DE PROSECUCIÓN</h3></div>
              
              {/* Botones: Anterior y PDF */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={irAnterior}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  ← Anterior
                </button>
                <button 
                  type="button"
                  onClick={descargarPDF} 
                  style={{ 
                    backgroundColor: '#e74c3c', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: '5px', 
                    padding: '10px 20px', 
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  📄 Descargar Ficha Completa PDF
                </button>
              </div>
              
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Nivel / Grado</th>
                    <th style={thStyle}>Literal / Calificación</th>
                    <th style={thStyle}>Año Lectivo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style={tdStyle}>I Nivel</td><td style={tdStyle}><input type="text" name="iNivel" value={record.iNivel} onChange={(e) => handleChange(e, record, setRecord)} style={{ width: '100%', border: 'none' }} placeholder="Ej: U" /></td><td style={tdStyle}><input type="text" name="añoLectivo1" value={record.añoLectivo1} onChange={(e) => handleChange(e, record, setRecord)} placeholder="Ej: 24/25" style={{ width: '100%', border: 'none' }} /></td></tr>
                  <tr><td style={tdStyle}>II Nivel</td><td style={tdStyle}><input type="text" name="iiNivel" value={record.iiNivel} onChange={(e) => handleChange(e, record, setRecord)} style={{ width: '100%', border: 'none' }} placeholder="Ej: U" /></td><td style={tdStyle}><input type="text" name="añoLectivo2" value={record.añoLectivo2} onChange={(e) => handleChange(e, record, setRecord)} placeholder="Ej: 24/25" style={{ width: '100%', border: 'none' }} /></td></tr>
                  <tr><td style={tdStyle}>III Nivel</td><td style={tdStyle}><input type="text" name="iiiNivel" value={record.iiiNivel} onChange={(e) => handleChange(e, record, setRecord)} style={{ width: '100%', border: 'none' }} placeholder="Ej: U" /></td><td style={tdStyle}><input type="text" name="añoLectivo3" value={record.añoLectivo3} onChange={(e) => handleChange(e, record, setRecord)} placeholder="Ej: 24/25" style={{ width: '100%', border: 'none' }} /></td></tr>
                  <tr><td style={tdStyle}>1° Grado</td><td style={tdStyle}><input type="text" name="primerGrado" value={record.primerGrado} onChange={(e) => handleChange(e, record, setRecord)} style={{ width: '100%', border: 'none' }} placeholder="Ej: A" /></td><td style={tdStyle}><input type="text" name="añoLectivo4" value={record.añoLectivo4} onChange={(e) => handleChange(e, record, setRecord)} placeholder="Ej: 24/25" style={{ width: '100%', border: 'none' }} /></td></tr>
                  <tr><td style={tdStyle}>2° Grado</td><td style={tdStyle}><input type="text" name="segundoGrado" value={record.segundoGrado} onChange={(e) => handleChange(e, record, setRecord)} style={{ width: '100%', border: 'none' }} placeholder="Ej: A" /></td><td style={tdStyle}><input type="text" name="añoLectivo5" value={record.añoLectivo5} onChange={(e) => handleChange(e, record, setRecord)} placeholder="Ej: 24/25" style={{ width: '100%', border: 'none' }} /></td></tr>
                  <tr><td style={tdStyle}>3° Grado</td><td style={tdStyle}><input type="text" name="tercerGrado" value={record.tercerGrado} onChange={(e) => handleChange(e, record, setRecord)} style={{ width: '100%', border: 'none' }} placeholder="Ej: A" /></td><td style={tdStyle}><input type="text" name="añoLectivo6" value={record.añoLectivo6} onChange={(e) => handleChange(e, record, setRecord)} placeholder="Ej: 24/25" style={{ width: '100%', border: 'none' }} /></td></tr>
                  <tr><td style={tdStyle}>4° Grado</td><td style={tdStyle}><input type="text" name="cuartoGrado" value={record.cuartoGrado} onChange={(e) => handleChange(e, record, setRecord)} style={{ width: '100%', border: 'none' }} placeholder="Ej: A" /></td><td style={tdStyle}><input type="text" name="añoLectivo7" value={record.añoLectivo7} onChange={(e) => handleChange(e, record, setRecord)} placeholder="Ej: 24/25" style={{ width: '100%', border: 'none' }} /></td></tr>
                  <tr><td style={tdStyle}>5° Grado</td><td style={tdStyle}><input type="text" name="quintoGrado" value={record.quintoGrado} onChange={(e) => handleChange(e, record, setRecord)} style={{ width: '100%', border: 'none' }} placeholder="Ej: A" /></td><td style={tdStyle}><input type="text" name="añoLectivo8" value={record.añoLectivo8} onChange={(e) => handleChange(e, record, setRecord)} placeholder="Ej: 24/25" style={{ width: '100%', border: 'none' }} /></td></tr>
                  <tr><td style={tdStyle}>6° Grado</td><td style={tdStyle}><input type="text" name="sextoGrado" value={record.sextoGrado} onChange={(e) => handleChange(e, record, setRecord)} style={{ width: '100%', border: 'none' }} placeholder="Ej: A" /></td><td style={tdStyle}><input type="text" name="añoLectivo9" value={record.añoLectivo9} onChange={(e) => handleChange(e, record, setRecord)} placeholder="Ej: 24/25" style={{ width: '100%', border: 'none' }} /></td></tr>
                </tbody>
              </table>

              <hr style={{ margin: '20px 0' }} />
              
              <h3 style={{ textAlign: 'center' }}>ACTA DE COMPROMISO</h3>
              <p style={{ marginBottom: '20px' }}>
                Yo, <input type="text" name="nombreRepresentanteActa" value={record.nombreRepresentanteActa} onChange={(e) => handleChange(e, record, setRecord)} placeholder="Nombre del representante" style={{ width: '200px', display: 'inline', margin: '0 5px', border: 'none', borderBottom: '1px solid #000' }} /> 
                representante del alumno: <input type="text" name="nombreAlumnoActa" value={record.nombreAlumnoActa} onChange={(e) => handleChange(e, record, setRecord)} placeholder="Nombre del alumno" style={{ width: '200px', display: 'inline', margin: '0 5px', border: 'none', borderBottom: '1px solid #000' }} />
                del grado <input type="text" name="gradoActa" value={record.gradoActa} onChange={(e) => handleChange(e, record, setRecord)} placeholder="Grado" style={{ width: '80px', display: 'inline', margin: '0 5px', border: 'none', borderBottom: '1px solid #000' }} /> 
                seccion <input type="text" name="seccionActa" value={record.seccionActa} onChange={(e) => handleChange(e, record, setRecord)} placeholder="Seccion" style={{ width: '50px', display: 'inline', margin: '0 5px', border: 'none', borderBottom: '1px solid #000' }} />, 
                me comprometo ante la Dirección de la U.E.N.B &quot;Dr. Luis Padrino&quot; a sufragar los gastos ocasionados por mi representante en el plantel y a cumplir con el reglamento y normas internas de la institución.
              </p>

              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f0f0f0' }}>
                    <th style={thStyle}>Año Lectivo</th>
                    <th style={thStyle}>Grado</th>
                    <th style={thStyle}>Firma del Docente</th>
                    <th style={thStyle}>Firma del Representante</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={tdStyle}><input type="text" name="añoLectivo1" value={record.añoLectivo1} onChange={(e) => handleChange(e, record, setRecord)} placeholder="Ej: 25-26" style={{ width: '100%', border: 'none' }} /></td>
                    <td style={tdStyle}><input type="text" name="grado1" value={record.grado1} onChange={(e) => handleChange(e, record, setRecord)} placeholder="Ej: I nivel" style={{ width: '100%', border: 'none' }} /></td>
                    <td style={tdStyle}><input type="text" name="firmaDocente1" value={record.firmaDocente1} onChange={(e) => handleChange(e, record, setRecord)} placeholder="Ej: Ingrid Osorio" style={{ width: '100%', border: 'none' }} /></td>
                    <td style={tdStyle}><input type="text" name="firmaRepresentante1" value={record.firmaRepresentante1} onChange={(e) => handleChange(e, record, setRecord)} placeholder="Firma" style={{ width: '100%', border: 'none' }} /></td>
                  </tr>
                  <tr>
                    <td style={tdStyle}><input type="text" name="añoLectivo2" value={record.añoLectivo2} onChange={(e) => handleChange(e, record, setRecord)} placeholder="Ej: 26-27" style={{ width: '100%', border: 'none' }} /></td>
                    <td style={tdStyle}><input type="text" name="grado2" value={record.grado2} onChange={(e) => handleChange(e, record, setRecord)} placeholder="Ej: II nivel" style={{ width: '100%', border: 'none' }} /></td>
                    <td style={tdStyle}><input type="text" name="firmaDocente2" value={record.firmaDocente2} onChange={(e) => handleChange(e, record, setRecord)} placeholder="Firma docente" style={{ width: '100%', border: 'none' }} /></td>
                    <td style={tdStyle}><input type="text" name="firmaRepresentante2" value={record.firmaRepresentante2} onChange={(e) => handleChange(e, record, setRecord)} placeholder="Firma" style={{ width: '100%', border: 'none' }} /></td>
                  </tr>
                </tbody>
              </table>

              {/* BOTÓN GUARDAR */}
              <button 
                type="submit" 
                disabled={cargando} 
                style={{ 
                  width: '100%', 
                  padding: '15px', 
                  backgroundColor: estudianteAEditar ? '#f39c12' : '#27ae60', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '5px', 
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  cursor: 'pointer', 
                  marginTop: '30px' 
                }}
              >
                {cargando ? '⏳ PROCESANDO...' : (estudianteAEditar ? '✏️ ACTUALIZAR ESTUDIANTE' : '💾 REGISTRAR ESTUDIANTE')}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AlumnoForm;