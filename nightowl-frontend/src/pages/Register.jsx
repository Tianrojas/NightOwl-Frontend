import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        telefono: '',
        metodoPago: '',
        rol: 'Customer',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users/register', null, {
                params: formData,
            });
            alert('Registro exitoso');
            navigate('/');
        } catch (err) {
            console.error(err);
            alert('Error en el registro.');
        }
    };

    return (
        <div className="register-container">
            <form onSubmit={handleRegister} className="register-form">
                <h2>Crear Cuenta</h2>
                <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="telefono"
                    placeholder="Teléfono"
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="metodoPago"
                    placeholder="Método de Pago"
                    onChange={handleChange}
                    required
                />
                <select name="rol" onChange={handleChange} required>
                    <option value="Customer">Customer</option>
                    <option value="Hoster">Hoster</option>
                </select>
                <button type="submit" className="register-button">
                    Registrarse
                </button>
                <button
                    type="button"
                    className="back-button"
                    onClick={() => navigate('/')}
                >
                    Volver al Login
                </button>
            </form>
        </div>
    );
};

export default Register;
