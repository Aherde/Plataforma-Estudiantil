// src/components/LoginScreen.jsx
import React, { useState } from 'react';
import { auth } from '../firebase/config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail 
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const LoginScreen = () => {
  const [modo, setModo] = useState('login'); // 'login', 'registro', 'recuperar'
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const navigate = useNavigate();

  // Iniciar sesión
  const handleLogin = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, correo, password);
      navigate('/dashboard');
    } catch (error) {
      console.error("Error detallado:", error.code, error.message);
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

  // Registrarse
  const handleRegistro = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');
    
    if (password !== confirmPassword) {
      setError('❌ Las contraseñas no coinciden');
      setCargando(false);
      return;
    }
    
    if (password.length < 6) {
      setError('❌ La contraseña debe tener al menos 6 caracteres');
      setCargando(false);
      return;
    }
    
    try {
      await createUserWithEmailAndPassword(auth, correo, password);
      setMensajeExito('✅ Cuenta creada exitosamente. Ahora puedes iniciar sesión.');
      setTimeout(() => {
        setModo('login');
        setMensajeExito('');
        setCorreo('');
        setPassword('');
        setConfirmPassword('');
      }, 3000);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('❌ Este correo ya está registrado');
      } else if (error.code === 'auth/invalid-email') {
        setError('❌ Correo electrónico inválido');
      } else {
        setError('❌ Error al crear la cuenta');
      }
    }
    setCargando(false);
  };

  // Recuperar contraseña
  const handleRecuperarPassword = async (e) => {
    e.preventDefault();
    if (!correo) {
      setError('❌ Ingresa tu correo electrónico');
      return;
    }
    
    setCargando(true);
    setError('');
    
    try {
      await sendPasswordResetEmail(auth, correo);
      setMensajeExito('✅ Se ha enviado un enlace de recuperación a tu correo electrónico');
      setTimeout(() => {
        setModo('login');
        setMensajeExito('');
        setCorreo('');
      }, 5000);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        setError('❌ No existe una cuenta con este correo');
      } else {
        setError('❌ Error al enviar el correo de recuperación');
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

        {/* Mensajes de éxito */}
        {mensajeExito && (
          <div style={{
            padding: '10px',
            backgroundColor: '#d4edda',
            color: '#155724',
            borderRadius: '4px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {mensajeExito}
          </div>
        )}

        {/* Mensajes de error */}
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

        {/* Tabs de navegación */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
          <button
            onClick={() => { setModo('login'); setError(''); setMensajeExito(''); }}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: modo === 'login' ? '#3498db' : 'transparent',
              color: modo === 'login' ? 'white' : '#666',
              border: 'none',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontWeight: modo === 'login' ? 'bold' : 'normal'
            }}
          >
            🔐 Iniciar Sesión
          </button>
          <button
            onClick={() => { setModo('registro'); setError(''); setMensajeExito(''); }}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: modo === 'registro' ? '#3498db' : 'transparent',
              color: modo === 'registro' ? 'white' : '#666',
              border: 'none',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontWeight: modo === 'registro' ? 'bold' : 'normal'
            }}
          >
            📝 Registrarse
          </button>
        </div>

        {/* MODO LOGIN */}
        {modo === 'login' && (
          <form onSubmit={handleLogin}>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type={mostrarPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  style={{
                    padding: '12px',
                    backgroundColor: '#ecf0f1',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  {mostrarPassword ? '🙈' : '👁️'}
                </button>
              </div>
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
            <div style={{ textAlign: 'center', marginTop: '15px' }}>
              <button
                type="button"
                onClick={() => setModo('recuperar')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3498db',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </form>
        )}

        {/* MODO REGISTRO */}
        {modo === 'registro' && (
          <form onSubmit={handleRegistro}>
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
                placeholder="ejemplo@correo.com"
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Contraseña</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type={mostrarPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  style={{
                    padding: '12px',
                    backgroundColor: '#ecf0f1',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  {mostrarPassword ? '🙈' : '👁️'}
                </button>
              </div>
              <small style={{ color: '#666', fontSize: '12px' }}>Mínimo 6 caracteres</small>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Confirmar Contraseña</label>
              <input
                type={mostrarPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                backgroundColor: '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                opacity: cargando ? 0.7 : 1
              }}
            >
              {cargando ? '⏳ Creando cuenta...' : '📝 Registrarse'}
            </button>
            <div style={{ textAlign: 'center', marginTop: '15px' }}>
              <button
                type="button"
                onClick={() => { setModo('login'); setError(''); setMensajeExito(''); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3498db',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                ¿Ya tienes cuenta? Inicia sesión
              </button>
            </div>
          </form>
        )}

        {/* MODO RECUPERAR CONTRASEÑA */}
        {modo === 'recuperar' && (
          <form onSubmit={handleRecuperarPassword}>
            <div style={{ marginBottom: '20px' }}>
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
                placeholder="tu@correo.com"
              />
            </div>
            <button
              type="submit"
              disabled={cargando}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#f39c12',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                opacity: cargando ? 0.7 : 1
              }}
            >
              {cargando ? '⏳ Enviando...' : '📧 Enviar enlace de recuperación'}
            </button>
            <div style={{ textAlign: 'center', marginTop: '15px' }}>
              <button
                type="button"
                onClick={() => { setModo('login'); setError(''); setMensajeExito(''); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3498db',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                ← Volver a Iniciar Sesión
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginScreen;