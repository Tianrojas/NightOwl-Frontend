import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../services/api'; // Asegúrate de importar `api` si lo estás utilizando

const PrivateRoute = ({ children, role }) => {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token');
            const userRole = localStorage.getItem('userRole');

            if (!token) {
                alert('Debes iniciar sesión primero.');
                setIsAuthorized(false);
                return;
            }

            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const decodedToken = JSON.parse(atob(base64));
                const currentTime = Math.floor(Date.now() / 1000);

                // Si el token ha expirado
                if (decodedToken.exp < currentTime) {
                    console.warn('Token expirado, intentando renovar...');
                    const refreshToken = localStorage.getItem('refreshToken');

                    if (!refreshToken) {
                        alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
                        localStorage.clear();
                        setIsAuthorized(false);
                        return;
                    }

                    try {
                        const response = await api.post('/users/refresh-token', { refreshToken });
                        const newToken = response.data.token;
                        localStorage.setItem('token', newToken);
                        console.log('Token renovado');
                    } catch (err) {
                        console.error('Error al renovar el token:', err);
                        alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
                        localStorage.clear();
                        setIsAuthorized(false);
                        return;
                    }
                }

                // Si el rol no coincide
                if (userRole !== role) {
                    alert('No tienes permisos para acceder a esta página.');
                    setIsAuthorized(false);
                    return;
                }

                setIsAuthorized(true);
            } catch (error) {
                console.error('Error al verificar el token:', error);
                alert('Hubo un problema con la sesión. Por favor, inicia sesión nuevamente.');
                localStorage.clear();
                setIsAuthorized(false);
            }
        };

        verifyToken();
    }, [role]);

    if (isAuthorized === null) {
        return <div>Cargando...</div>; // Mientras verifica la autorización
    }

    return isAuthorized ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
