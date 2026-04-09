import React from "react";

export default function MadreForm({ setFormData, alSiguiente }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      madre: { ...prev.madre, [name]: value },
    }));
  };

  return (
    <div className="card">
      <div className="form-section-header">
        <h3 style={{ borderBottom: "2px solid #3182ce", paddingBottom: "10px" }}>
          👩 DATOS DE LA MADRE
        </h3>
      </div>

      <div className="form-grid">
        {/* Datos Personales según Planilla Escolar */}
        <div className="input-group">
          <label>Nombre y Apellido *</label>
          <input name="nombre" placeholder="Ej: Elimar Cristina Rivero" onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>Cédula de Identidad *</label>
          <input name="cedula" placeholder="Ej: 25284387" onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>Grado de Instrucción</label>
          <input name="instruccion" placeholder="Ej: Bachiller" onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>Ocupación / Oficio</label>
          <input name="ocupacion" placeholder="Ej: Asesora de Venta" onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>Lugar de Trabajo</label>
          <input name="lugarTrabajo" placeholder="Ej: La Candelaria" onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>Teléfono de Contacto *</label>
          <input name="telefono" placeholder="Ej: 04241336416" onChange={handleChange} />
        </div>

        {/* Sección de Emergencia (Obligatorio en Foto 1) */}
        <div style={{ gridColumn: "span 2", marginTop: "20px", color: "#e53e3e", fontWeight: "bold" }}>
          🚨 EN CASO DE EMERGENCIA LLAMAR A:
        </div>
        <div className="input-group">
          <label>Nombre del Contacto</label>
          <input name="emergenciaNombre" placeholder="Ej: Neva Rodriguez" onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>Parentesco / Teléfono</label>
          <input name="emergenciaTelf" placeholder="Abuela / 04149372379" onChange={handleChange} />
        </div>
      </div>

      <div className="form-actions" style={{ marginTop: "30px", display: "flex", justifyContent: "flex-end" }}>
        <button 
          type="button" 
          className="btn-next" 
          onClick={alSiguiente} 
          style={{ background: "#38a169", color: "white", padding: "10px 25px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold" }}
        >
          Siguiente: Datos del Padre →
        </button>
      </div>
    </div>
  );
}