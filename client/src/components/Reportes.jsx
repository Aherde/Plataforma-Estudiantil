import React, { useEffect, useState } from 'react';
// Importamos la conexión que configuramos en firebase-config.js
import { db } from '../firebase-config';
// Importamos las herramientas de Firebase para traer colecciones y documentos
import { collection, getDocs } from 'firebase/firestore';

const Reportes = () => {
  // Estado para guardar la lista de alumnos
  const [estudiantes, setEstudiantes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        // 1. Hacemos la petición a la colección "students" en Firestore
        const querySnapshot = await getDocs(collection(db, "students"));
        const listaTemporal = [];
        
        // 2. Recorremos cada documento encontrado y lo guardamos en un array
        querySnapshot.forEach((doc) => {
          listaTemporal.push({ ...doc.data(), id: doc.id });
        });
        
        // 3. Actualizamos el estado con la lista de alumnos
        setEstudiantes(listaTemporal);
        setCargando(false);
      } catch (error) {
        console.error("Error al obtener los datos de Firebase:", error);
        setCargando(false);
      }
    };

    obtenerDatos();
  }, []);

  if (cargando) return <p style={{ textAlign: 'center', padding: '20px' }}>Cargando datos del colegio...</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#2c3e50', textAlign: 'center' }}>
        Listado de Alumnos - U.E.N.B. Dr. Luis Padrino
      </h2>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#2c3e50', color: 'white' }}>
            <th style={estiloCelda}>Nombre</th>
            <th style={estiloCelda}>Apellido</th>
            <th style={estiloCelda}>Grado</th>
            <th style={estiloCelda}>Representante</th>
            <th style={estiloCelda}>Teléfono</th>
          </tr>
        </thead>
        <tbody>
          {estudiantes.map((alumno) => (
            <tr key={alumno.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={estiloCelda}>{alumno.name}</td>
              <td style={estiloCelda}>{alumno.lastName}</td>
              <td style={estiloCelda}>{alumno.currentGrade}° Grado</td>
              {/* Usamos el encadenamiento opcional ?. por si algún dato falta */}
              <td style={estiloCelda}>{alumno.tutorData?.tutorName}</td>
              <td style={estiloCelda}>{alumno.tutorData?.tutorPhone}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {estudiantes.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#7f8c8d' }}>
          Aún no hay alumnos inscritos en el sistema.
        </p>
      )}
    </div>
  );
};

// Estilos básicos para la tabla
const estiloCelda = {
  padding: '12px',
  textAlign: 'left',
  border: '1px solid #dee2e6'
};

export default Reportes;