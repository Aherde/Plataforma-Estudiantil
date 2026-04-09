import React, { useState } from "react";
import Layout from "../estructura/Layout"; 
import Tabs from "../components/Tabs";
import AlumnoForm from "../components/AlumnoForm";
import MadreForm from "../components/MadreForm";
import PadreForm from "../components/PadreForm";
import RepresentanteForm from "../components/RepresentanteForm";

export default function Registro() {
  const [activeTab, setActiveTab] = useState("Alumno");

  // 1. Agregamos el estado global que unificará todo para Firebase
  const [formData, setFormData] = useState({
    alumno: {},
    madre: {},
    padre: {},
    representante: {}
  });

  const irASiguiente = () => {
    const pasos = ["Alumno", "Madre", "Padre", "Representante"];
    const currentIndex = pasos.indexOf(activeTab);
    if (currentIndex < pasos.length - 1) {
      setActiveTab(pasos[currentIndex + 1]);
    }
  };

  return (
    <Layout>
      <div className="header-info">
        <h1 style={{ fontSize: "2rem", marginBottom: "0" }}>Ficha de Ingreso 🏫</h1>
        <p style={{ color: "#666" }}>U.E.N.B. DR. LUIS PADRINO</p>
      </div>

      <Tabs active={activeTab} setActive={setActiveTab} />

      <div className="form-card-white">
        {/* 2. Pasamos setFormData y formData a cada componente */}
        {activeTab === "Alumno" && (
          <AlumnoForm 
            formData={formData} 
            setFormData={setFormData} 
            alSiguiente={irASiguiente} 
          />
        )}
        
        {activeTab === "Madre" && (
          <MadreForm 
            formData={formData} 
            setFormData={setFormData} 
            alSiguiente={irASiguiente} 
          />
        )}
        
        {activeTab === "Padre" && (
          <PadreForm 
            formData={formData} 
            setFormData={setFormData} 
            alSiguiente={irASiguiente} 
          />
        )}
        
        {activeTab === "Representante" && (
          <RepresentanteForm 
            formData={formData} 
            setFormData={setFormData} 
          />
        )}
      </div>
    </Layout>
  );
}