// client/src/components/Login.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importamos el hook que creamos
// Importamos los estilos de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
    // 1. Estados para capturar email, contraseña y posibles errores
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // 2. Obtener la función de login del contexto
    const { login } = useAuth(); 
    const navigate = useNavigate(); // Hook para redireccionar

    // 3. Función que se ejecuta al enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Llama a la función login del AuthContext (que usa Firebase)
            await login(email, password); 
            
            // Si tiene éxito, redirige a una ruta privada
            navigate('/formulario'); 
        } catch (err) {
            // Manejo de errores de Firebase
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError('Credenciales inválidas. Verifica tu email y contraseña.');
            } else {
                setError('Falló el inicio de sesión. Inténtalo de nuevo.');
            }
        }

        setLoading(false);
    };

    // 4. Renderizado del formulario (usando clases de Bootstrap para el diseño)
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="card shadow">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4">Acceso Administrativo</h3>
                            
                            {/* Muestra el mensaje de error si existe */}
                            {error && <div className="alert alert-danger">{error}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="password" className="form-label">Contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-100" 
                                    disabled={loading} // Deshabilita el botón mientras carga
                                >
                                    {loading ? 'Cargando...' : 'Iniciar Sesión'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;