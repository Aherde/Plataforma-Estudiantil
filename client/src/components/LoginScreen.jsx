// src/components/LoginScreen.jsx
import React, { useState } from 'react';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; // ← AGREGAR ESTO

const LoginScreen = () => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // ← AGREGAR ESTO

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, correo, password);
      navigate('/dashboard'); // ← AGREGAR ESTO (redirige después del login)
    } catch (error) {
      console.error("Error detallado:", error.code, error.message); // ← AGREGAR ESTO (para ver el error en consola)
      if (error.code === 'auth/invalid-credential') {
        setError('❌ Correo o contraseña incorrectos');
      } else if (error.code === 'auth/user-not-found') {
        setError('❌ Usuario no encontrado');
      } else if (error.code === 'auth/wrong-password') {
        setError('❌ Contraseña incorrecta');
      } else {
        setError('❌ Error al iniciar sesión: ' + error.message);
      }
    }
    setCargando(false);
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#2c3e50',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 15px'
          }}>
            <span style={{ fontSize: '40px' }}>🏫</span>
          </div>
          <h2 style={{ margin: '10px 0 0', color: '#2c3e50' }}>Plataforma Estudiantil</h2>
          <p style={{ color: '#666', marginTop: '5px' }}>U.E.N.B. Dr. Luis Padrino</p>
        </div>

        {error && (
          <div style={{
            padding: '10px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            borderRadius: '4px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Correo Electrónico</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px'
              }}
              placeholder="admin@drluispadrino.com"
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>
          <button
            type="submit"
            disabled={cargando}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              opacity: cargando ? 0.7 : 1
            }}
          >
            {cargando ? '⏳ Iniciando sesión...' : '🚪 Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;