// client/src/App.js

import React from 'react';
// Importamos las herramientas necesarias para definir las rutas (páginas)
import { Routes, Route } from 'react-router-dom';
import './App.css'; 

// Importamos los componentes que creamos en la carpeta 'components'
import Login from './components/Login';
import Formulario from './components/Formulario';
import Reportes from './components/Reportes';

function App() {
  return (
    <div className="App">
      {/* 
        El componente <Routes> envuelve todas las rutas de nuestra aplicación.
        Cuando la URL en el navegador coincide con el 'path', se muestra el 
        componente asociado en el atributo 'element'.
      */}
      <Routes>
        {/* Ruta raíz (URL: /): Muestra el componente Login */}
        <Route path="/" element={<Login />} />
        
        {/* Ruta para el Formulario (URL: /formulario): Muestra el componente Formulario */}
        <Route path="/formulario" element={<Formulario />} />
        
        {/* Ruta para los Reportes (URL: /reportes): Muestra el componente Reportes */}
        <Route path="/reportes" element={<Reportes />} />
      </Routes>
    </div>
  );
}

export default App;