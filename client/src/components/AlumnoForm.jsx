import React, { useState, useRef } from "react"; // Añadido useRef
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const AlumnoForm = ({ alSiguiente }) => {
  const reportTemplateRef = useRef(null); // Referencia para el PDF

  // Estado unificado para manejar los datos del formulario y la tabla
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    cedula: "",
    fechaNacimiento: "",
    edad: "",
    genero: "",
    nacionalidad: "",
    lugarNacimiento: "",
    email: "",
    grado: "",
    seccion: "",
    tieneHermanos: "",
    tallaCamisa: "",
    tallaPantalon: "",
    tallaZapatos: "",
    direccion: "",
    enfermedad: "",
    alergias: "",
    record: [
      { nivel: "I Nivel", literal: "", año: "" },
      { nivel: "II Nivel", literal: "", año: "" },
      { nivel: "III Nivel", literal: "", año: "" },
      { nivel: "1° Grado", literal: "", año: "" },
      { nivel: "2° Grado", literal: "", año: "" },
      { nivel: "3° Grado", literal: "", año: "" },
      { nivel: "4° Grado", literal: "", año: "" },
      { nivel: "5° Grado", literal: "", año: "" },
      { nivel: "6° Grado", literal: "", año: "" },
    ]
  });

  // Manejador genérico para inputs simples
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRecordChange = (index, field, value) => {
    const newRecord = [...formData.record];
    newRecord[index][field] = value;
    setFormData({ ...formData, record: newRecord });
  };

  // Función para generar el PDF
  const handleDownloadPdf = async () => {
    const element = reportTemplateRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const data = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4'
    });

    const imgProps = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Ficha_${formData.nombreCompleto || 'Alumno'}.pdf`);
  };

  return (
    <div>
      {/* Contenedor del PDF */}
      <div ref={reportTemplateRef} style={{ background: "#fff", padding: "10px" }}>
        <div className="form-section-header">
          <h3>👤 DATOS DEL ALUMNO</h3>
        </div>

        <div className="form-grid">
          <div className="input-group">
            <label>Apellidos y Nombres *</label>
            <input type="text" name="nombreCompleto" placeholder="Ej: Pacheco Gomez Reyshell Aranza" onChange={handleChange} />
          </div>
          <div className="input-group">
            <label>Cédula Escolar / Identidad *</label>
            <input type="text" name="cedula" placeholder="12229826736" onChange={handleChange} />
          </div>
          <div className="input-group">
            <label>Fecha de Nacimiento *</label>
            <input type="date" name="fechaNacimiento" onChange={handleChange} />
          </div>
          <div className="input-group">
            <label>Edad</label>
            <input type="number" name="edad" placeholder="Ej: 6" onChange={handleChange} />
          </div>
          
          <div className="input-group">
            <label>Género *</label>
            <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
              <label style={{ fontWeight: "normal" }}><input type="radio" name="genero" value="F" onChange={handleChange} /> F</label>
              <label style={{ fontWeight: "normal" }}><input type="radio" name="genero" value="M" onChange={handleChange} /> M</label>
            </div>
          </div>

          <div className="input-group">
            <label>Nacionalidad *</label>
            <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
              <label style={{ fontWeight: "normal" }}><input type="radio" name="nacionalidad" value="V" onChange={handleChange} /> V</label>
              <label style={{ fontWeight: "normal" }}><input type="radio" name="nacionalidad" value="E" onChange={handleChange} /> E</label>
            </div>
          </div>

          <div className="input-group">
            <label>Lugar de Nacimiento</label>
            <input type="text" name="lugarNacimiento" placeholder="Caracas" onChange={handleChange} />
          </div>
          <div className="input-group">
            <label>Correo Electrónico</label>
            <input type="email" name="email" placeholder="ejemplo@correo.com" onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Grado / Año *</label>
            <input type="text" name="grado" placeholder="Ej: 1° Grado" onChange={handleChange} />
          </div>
          <div className="input-group">
            <label>Sección *</label>
            <input type="text" name="seccion" placeholder="Ej: U" onChange={handleChange} />
          </div>

          <div className="input-group" style={{ gridColumn: "span 2" }}>
            <label>¿Tiene hermanos en el plantel?</label>
            <div style={{ display: "flex", gap: "20px", marginTop: "5px" }}>
              <label style={{ fontWeight: "normal" }}><input type="radio" name="tieneHermanos" value="Si" onChange={handleChange} /> Sí</label>
              <label style={{ fontWeight: "normal" }}><input type="radio" name="tieneHermanos" value="No" onChange={handleChange} /> No</label>
            </div>
          </div>

          <div className="input-group" style={{ gridColumn: "span 2", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px", background: "#f8fafc", padding: "10px", borderRadius: "8px" }}>
            <div>
              <label>Talla Camisa</label>
              <input type="text" name="tallaCamisa" placeholder="Ej: 8" onChange={handleChange} />
            </div>
            <div>
              <label>Talla Pantalón</label>
              <input type="text" name="tallaPantalon" placeholder="Ej: 6" onChange={handleChange} />
            </div>
            <div>
              <label>Talla Zapatos</label>
              <input type="text" name="tallaZapatos" placeholder="Ej: 30" onChange={handleChange} />
            </div>
          </div>

          <div className="input-group" style={{ gridColumn: "span 2", marginTop: "10px" }}>
            <label style={{ color: "#1a365d", fontWeight: "bold", marginBottom: "10px", display: "block" }}>
              📊 RÉCORD DE PROSECUCIÓN
            </label>
            <div style={{ overflowX: "auto", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "10px", background: "#fff" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #f1f5f9" }}>
                    <th style={{ textAlign: "left", padding: "8px" }}>Nivel</th>
                    <th style={{ textAlign: "center", padding: "8px" }}>Literal</th>
                    <th style={{ textAlign: "center", padding: "8px" }}>Año Lectivo</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.record.map((item, index) => (
                    <tr key={index} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "8px", fontWeight: "500" }}>{item.nivel}</td>
                      <td style={{ textAlign: "center", padding: "5px" }}>
                        <input 
                          type="text" 
                          maxLength="1"
                          style={{ width: "40px", textAlign: "center", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                          value={item.literal}
                          onChange={(e) => handleRecordChange(index, "literal", e.target.value)}
                        />
                      </td>
                      <td style={{ textAlign: "center", padding: "5px" }}>
                        <input 
                          type="text" 
                          placeholder="24/25"
                          style={{ width: "70px", textAlign: "center", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                          value={item.año}
                          onChange={(e) => handleRecordChange(index, "año", e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="input-group" style={{ gridColumn: "span 2", background: "#f0f7ff", padding: "10px", borderRadius: "8px", marginTop: "15px" }}>
            <label style={{ color: "#2b6cb0" }}>🍴 Beneficio de Comedor</label>
            <div style={{ display: "flex", gap: "20px", marginTop: "5px" }}>
              <label style={{ fontWeight: "normal" }}><input type="radio" name="comedor" /> Sí</label>
              <label style={{ fontWeight: "normal" }}><input type="radio" name="comedor" /> No</label>
            </div>
          </div>

          <div className="input-group" style={{ gridColumn: "span 2" }}>
            <label>Dirección de Habitación *</label>
            <input type="text" name="direccion" placeholder="Urbanismo Los Teclares, Apure 4D" onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>¿Padece enfermedad?</label>
            <input type="text" name="enfermedad" placeholder="Indique cuál" onChange={handleChange} />
          </div>
          <div className="input-group">
            <label>¿Alergias?</label>
            <input type="text" name="alergias" placeholder="Medicamentos/Alimentos" onChange={handleChange} />
          </div>
        </div>
      </div>

      <div className="form-actions" style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
        <button 
          type="button" 
          className="btn-pdf" 
          onClick={handleDownloadPdf}
          style={{ background: "#e53e3e", color: "white", padding: "10px 20px", borderRadius: "8px", border: "none", cursor: "pointer" }}
        >
          Descargar PDF 📄
        </button>
        <button className="btn-next" onClick={alSiguiente}>Siguiente: Familiares →</button>
      </div>
    </div>
  );
};

export default AlumnoForm;