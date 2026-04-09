import React, { useState } from 'react';
import { db } from '../firebase-config'; 
import { collection, addDoc } from 'firebase/firestore';

const Formulario = () => {
  // Estado para los datos del estudiante
  const [estudiante, setEstudiante] = useState({
    name: '',
    lastName: '',
    email: '',
    age: '',
    currentGrade: '',
    address: '',
    nationality: 'Venezolana',
    eatsOnSchool: false,
    hasBrothers: false
  });

  // Estado para los datos del tutor
  const [tutor, setTutor] = useState({
    tutorName: '',
    tutorLastName: '',
    tutorCi: '',
    tutorPhone: '',
    paymentCommitment: false
  });

  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ texto: 'Procesando registro...', tipo: 'info' });

    try {
      // Guardamos en la colección 'students' de tu Firestore
      await addDoc(collection(db, "students"), {
        ...estudiante,
        tutorData: tutor, 
        createdAt: new Date()
      });
      
      setMensaje({ texto: "¡Registro de alumno guardado con éxito!", tipo: 'success' });
      
      // Opcional: Limpiar el formulario después de guardar
      e.target.reset(); 
    } catch (error) {
      console.error("Error al guardar en Firebase:", error);
      setMensaje({ texto: "Error: Verifica las reglas de Firestore o tu conexión.", tipo: 'error' });
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial' }}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>U.E.N.B. Dr. Luis Padrino</h1>
      <h2 style={{ textAlign: 'center', color: '#34495e' }}>Registro de Estudiante</h2>
      
      {mensaje.texto && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '20px', 
          borderRadius: '5px',
          backgroundColor: mensaje.tipo === 'success' ? '#d4edda' : '#f8d7da',
          color: mensaje.tipo === 'success' ? '#155724' : '#721c24',
          textAlign: 'center'
        }}>
          {mensaje.texto}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <section>
          <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '5px' }}>Datos del Alumno</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <input type="text" placeholder="Nombre del Alumno" onChange={(e) => setEstudiante({...estudiante, name: e.target.value})} required style={inputStyle} />
            <input type="text" placeholder="Apellido del Alumno" onChange={(e) => setEstudiante({...estudiante, lastName: e.target.value})} required style={inputStyle} />
            <input type="number" placeholder="Edad" onChange={(e) => setEstudiante({...estudiante, age: e.target.value})} required style={inputStyle} />
            
            <select onChange={(e) => setEstudiante({...estudiante, currentGrade: e.target.value})} required style={inputStyle}>
              <option value="">Seleccione Grado</option>
              <option value="1">1er Grado</option>
              <option value="2">2do Grado</option>
              <option value="3">3er Grado</option>
              <option value="4">4to Grado</option>
              <option value="5">5to Grado</option>
              <option value="6">6to Grado</option>
            </select>
          </div>
          <input type="text" placeholder="Dirección de habitación" onChange={(e) => setEstudiante({...estudiante, address: e.target.value})} required style={{...inputStyle, width: '100%', marginTop: '10px'}} />
          
          <div style={{ marginTop: '10px' }}>
            <label>
              <input type="checkbox" onChange={(e) => setEstudiante({...estudiante, eatsOnSchool: e.target.checked})} />
               ¿Hace uso del comedor escolar?
            </label>
          </div>
        </section>

        <section style={{ marginTop: '20px' }}>
          <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '5px' }}>Datos del Representante (Tutor)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <input type="text" placeholder="Nombre Completo" onChange={(e) => setTutor({...tutor, tutorName: e.target.value})} required style={inputStyle} />
            <input type="text" placeholder="Cédula de Identidad" onChange={(e) => setTutor({...tutor, tutorCi: e.target.value})} required style={inputStyle} />
            <input type="text" placeholder="Teléfono de contacto" onChange={(e) => setTutor({...tutor, tutorPhone: e.target.value})} required style={inputStyle} />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label>
                <input type="checkbox" onChange={(e) => setTutor({...tutor, paymentCommitment: e.target.checked})} />
                 Compromiso de colaboración
              </label>
            </div>
          </div>
        </section>

        <button type="submit" style={{ 
          marginTop: '30px', 
          padding: '15px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px', 
          fontSize: '16px', 
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          Registrar Estudiante en el Sistema
        </button>
      </form>
    </div>
  );
};

// Estilo sencillo para los inputs
const inputStyle = {
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '14px'
};

export default Formulario;