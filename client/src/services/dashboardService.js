import { db } from "../firebase/config"; 
import { collection, onSnapshot } from "firebase/firestore";

export const subscribeToDashboardStats = (callback) => {
  // 1. Apuntamos a la colección 'students' (la que verificamos en tu captura)
  const colRef = collection(db, "students");
  
  return onSnapshot(colRef, (snapshot) => {
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // 2. Lógica de filtrado inteligente
    const stats = {
      totalEstudiantes: docs.length,

      // COMEDOR: Busca 'si', 'Sí' o 'true' en la raíz o dentro del objeto alumno
      comedor: docs.filter(d => {
        const valor = d.comedor || d.alumno?.comedor || d.eatsOnSchool; 
        return valor?.toString().toLowerCase().includes("si") || valor === true;
      }).length,

      // PERMISOS: Busca si existe el campo de permisos especiales
      permisos: docs.filter(d => d.permisosEspeciales === true || d.tienePermiso === "si").length,

      // REPRESENTANTES: Cuenta cédulas únicas para que no se repitan
      totalRepresentantes: [...new Set(docs.map(d => 
        d.representante?.cedula || d.cedula || d.tutorData?.cedula
      ))].filter(Boolean).length,

      // PORCENTAJE: Cálculo automático para la tarjeta azul
      porcentajeComedor: docs.length > 0 
        ? Math.round((docs.filter(d => {
            const v = d.comedor || d.alumno?.comedor || d.eatsOnSchool;
            return v?.toString().toLowerCase().includes("si") || v === true;
          }).length / docs.length) * 100) 
        : 0
    };

    callback(stats);
  }, (error) => {
    console.error("Error en tiempo real:", error);
  });
};