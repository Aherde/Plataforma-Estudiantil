import { useState } from "react";

export default function HistorialForm({ setFormData }) {
  const [rows, setRows] = useState([]);

  const addRow = () => {
    const newRow = { anio: "", grado: "", seccion: "", plantel: "" };
    const updated = [...rows, newRow];
    setRows(updated);
    setFormData(prev => ({ ...prev, historial: updated }));
  };

  return (
    <div className="card">
      <h2>📚 Historial Académico</h2>
      {rows.map((row, index) => (
        <div key={index} className="grid" style={{ marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
          <input placeholder="Año Escolar" name="anio" />
          <input placeholder="Grado" name="grado" />
          <input placeholder="Sección" name="seccion" />
          <input placeholder="Plantel de Procedencia" name="plantel" />
        </div>
      ))}
      <button type="button" onClick={addRow} style={{ marginTop: '10px', background: '#27ae60' }}>
        + Agregar Año Escolar
      </button>
    </div>
  );
}