export default function ActaForm({ setFormData }) {
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      acta: { ...prev.acta, [e.target.name]: e.target.value }
    }));
  };

  return (
    <div className="card">
      <h2>📄 Datos del Acta de Nacimiento</h2>
      <div className="grid">
        <input name="numActa" placeholder="N° de Acta" onChange={handleChange} />
        <input name="folio" placeholder="Folio" onChange={handleChange} />
        <input name="libro" placeholder="Libro" onChange={handleChange} />
        <input name="fechaRegistro" type="date" onChange={handleChange} />
      </div>
    </div>
  );
}