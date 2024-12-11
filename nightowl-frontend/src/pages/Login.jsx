import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/users/login', null, {
                params: { email, password },
            });

            const token = response.data.token;
            localStorage.setItem('token', token);

            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const decodedData = JSON.parse(atob(base64));
            const userRole = decodedData.role;
            localStorage.setItem('userRole', userRole);

            if (userRole === 'Customer') {
                navigate('/customer');
            } else if (userRole === 'Hoster') {
                navigate('/hoster');
            }
        } catch (err) {
            alert('Credenciales inválidas o error en el servidor.');
        }
    };

    const goToRegister = () => {
        navigate('/register'); // Redirige al formulario de registro
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-form">
                <h2>Iniciar Sesión</h2>
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="login-button">Iniciar Sesión</button>
                <button
                    type="button"
                    className="register-button"
                    onClick={goToRegister}
                >
                    Crear Cuenta
                </button>
            </form>
        </div>
    );
};

export default Login;
