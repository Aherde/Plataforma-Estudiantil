import React, { useState } from "react";
import { db } from "../firebase/config"; // Importamos tu configuración real
import { collection, addDoc } from "firebase/firestore";

export default function RepresentanteForm({ formData, setFormData }) {
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      representante: { 
        ...prev.representante, 
        [name]: type === "checkbox" ? checked : value 
      },
    }));
  };

  // FUNCIÓN PARA GUARDAR EN FIREBASE
  const finalizarRegistro = async () => {
    // Validación de seguridad
    if (!formData.representante?.aceptaCompromiso) {
      alert("Debe aceptar el Acta de Compromiso para finalizar.");
      return;
    }

    setCargando(true);
    try {
      // Guardamos en la colección 'students' (como aparece en tu consola de Firebase)
      await addDoc(collection(db, "students"), {
        ...formData,
        fechaRegistro: new Date().toLocaleString(),
        status: "Activo"
      });

      alert("✅ ¡Estudiante registrado con éxito en el sistema!");
      window.location.href = "/dashboard"; // Redirige al dashboard para ver el contador actualizado
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al conectar con Firebase. Revisa la consola.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="card">
      <div className="form-section-header">
        <h3 style={{ borderBottom: "2px solid #3182ce", paddingBottom: "10px" }}>
          ⚖️ DATOS DEL REPRESENTANTE LEGAL
        </h3>
      </div>

      <div className="form-grid">
        <div className="input-group">
          <label>Nombre y Apellido *</label>
          <input name="nombre" placeholder="Ej: Elimar Rivero" onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>Cédula de Identidad *</label>
          <input name="cedula" placeholder="Ej: 25284387" onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>Parentesco *</label>
          <input name="parentesco" placeholder="Ej: Madre, Abuela, Tío" onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>Teléfono de Contacto *</label>
          <input name="telefono" placeholder="Ej: 04241336416" onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>Ocupación</label>
          <input name="ocupacion" placeholder="Ej: Asesora de Venta" onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>Lugar de Trabajo</label>
          <input name="lugarTrabajo" placeholder="Ej: La Candelaria" onChange={handleChange} />
        </div>

        <div className="input-group" style={{ gridColumn: "span 2", background: "#fff5f5", padding: "15px", borderRadius: "8px", border: "1px solid #feb2b2" }}>
          <label style={{ color: "#c53030", fontWeight: "bold" }}>¿El niño se viene solo a la escuela? *</label>
          <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
            <label style={{ fontWeight: "normal" }}><input type="radio" name="seVieneSolo" value="si" onChange={handleChange} /> Sí</label>
            <label style={{ fontWeight: "normal" }}><input type="radio" name="seVieneSolo" value="no" onChange={handleChange} /> No</label>
          </div>
          <input name="responsableRetiro" placeholder="Nombre del responsable de retiro" onChange={handleChange} style={{ marginTop: "5px" }} />
        </div>

        <div style={{ gridColumn: "span 2", backgroundColor: "#f8fafc", padding: "20px", borderRadius: "10px", marginTop: "20px", border: "1px solid #e2e8f0" }}>
          <h4 style={{ margin: "0 0 10px 0", color: "#2d3748" }}>📜 ACTA DE COMPROMISO</h4>
          <p style={{ fontSize: "0.85rem", color: "#4a5568", lineHeight: "1.5", textAlign: "justify" }}>
            Me comprometo ante la Dirección de la <strong>U.E.N.B "Dr. Luis Padrino"</strong> a sufragar los gastos 
            ocasionados por mi representado en el plantel y a cumplir con el reglamento...
          </p>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "15px" }}>
            <input type="checkbox" name="aceptaCompromiso" onChange={handleChange} style={{ width: "18px", height: "18px" }} />
            <label style={{ fontWeight: "bold", color: "#2d3748" }}>Acepto el compromiso y las normas del plantel.</label>
          </div>
        </div>
      </div>

      <div className="form-actions" style={{ marginTop: "30px" }}>
        <button 
          type="button" 
          className="btn-save" 
          onClick={finalizarRegistro}
          disabled={cargando}
          style={{ width: "100%", background: cargando ? "#cbd5e1" : "#1a365d", color: "white", padding: "15px", borderRadius: "10px", fontWeight: "bold", fontSize: "1rem", cursor: "pointer" }}
        >
          {cargando ? "Guardando en Firebase..." : "Finalizar y Guardar Estudiante"}
        </button>
      </div>
    </div>
  );
}