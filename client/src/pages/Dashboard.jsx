// 1. ESTA LÍNEA ES VITAL: Importar los Hooks de React
import React, { useState, useEffect } from "react"; 
import Layout from "../estructura/Layout";
import DashboardCards from "../components/DashboardCards";
import { subscribeToDashboardStats } from "../services/dashboardService";

// 2. LA FUNCIÓN DEBE EMPEZAR CON "export default"
export default function Dashboard() {
  const [metricas, setMetricas] = useState({
    totalEstudiantes: 0,
    comedor: 0,
    permisos: 0,
    totalRepresentantes: 0,
    porcentajeComedor: 0
  });

  useEffect(() => {
    // Nos suscribimos a Firebase
    const unsubscribe = subscribeToDashboardStats((nuevasStats) => {
      setMetricas(nuevasStats);
    });

    // Limpiamos la conexión cuando el usuario sale del Dashboard
    return () => unsubscribe();
  }, []);

  return (
    <Layout>
      <div className="main-content-padd">
        <header className="main-header">
          <h1>Panel de Control Institucional 🏫</h1>
          <p className="subtitle">U.E.N.B. DR. LUIS PADRINO</p>
        </header>

        {/* Las tarjetas ahora brillan con datos reales de Firebase */}
        <DashboardCards data={metricas} />

        <div className="main-layout-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px', marginTop: '30px' }}>
          <div className="card">
            <h3>Estadísticas por Grado</h3>
            <p>Gráfica cargando...</p>
          </div>
          
          <div className="card">
            <h4>Avisos Recientes</h4>
            <p>Datos actualizados en tiempo real desde Firebase.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}