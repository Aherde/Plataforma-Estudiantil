import React from "react";

export default function PadreForm({ setFormData, alSiguiente }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      padre: { ...prev.padre, [name]: value },
    }));
  };

  return (
    <div className="card">
      <div className="form-section-header">
        <h3 style={{ borderBottom: "2px solid #3182ce", paddingBottom: "10px" }}>
          👨 DATOS DEL PADRE
        </h3>
      </div>

      <div className="form-grid">
        {/* Datos Personales basados en la planilla física */}
        <div className="input-group">
          <label>Nombre y Apellido</label>
          <input name="nombre" placeholder="Ej: Angelo Mora" onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>Cédula de Identidad</label>
          <input name="cedula" placeholder="Ej: 27607999" onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>Grado de Instrucción</label>
          <input name="instruccion" placeholder="Ej: Bachiller" onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>Ocupación / Oficio</label>
          <input name="ocupacion" placeholder="Ej: Delivery" onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>Lugar de Trabajo</label>
          <input name="lugarTrabajo" placeholder="Ej: La Vega" onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>Teléfono de Contacto</label>
          <input name="telefono" placeholder="Ej: 04242730085" onChange={handleChange} />
        </div>

        {/* Sección de Emergencia para el Padre */}
        <div style={{ gridColumn: "span 2", marginTop: "20px", fontWeight: "bold" }}>
          ¿EN CASO DE EMERGENCIA, A QUIÉN PODEMOS LLAMAR?
        </div>
        <div className="input-group">
          <label>Nombre del Contacto</label>
          <input name="emergenciaNombrePadre" placeholder="Nombre" onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>Parentesco / Teléfono</label>
          <input name="emergenciaTelfPadre" placeholder="Vínculo y Número" onChange={handleChange} />
        </div>
      </div>

      <div className="form-actions" style={{ marginTop: "30px", display: "flex", justifyContent: "flex-end" }}>
        <button 
          type="button" 
          className="btn-next" 
          onClick={alSiguiente} 
          style={{ background: "#38a169", color: "white", padding: "10px 25px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold" }}
        >
          Siguiente: Representante Legal →
        </button>
      </div>
    </div>
  );
}