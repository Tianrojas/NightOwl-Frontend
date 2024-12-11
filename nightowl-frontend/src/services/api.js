import axios from 'axios';

// Crear la instancia base de Axios
const api = axios.create({
    baseURL: 'http://localhost:8090', // Cambiar por la URL de tu backend
});

// Interceptor para adjuntar el token JWT en cada solicitud
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Error al configurar la solicitud:', error);
        return Promise.reject(error);
    }
);

// Interceptor para manejar respuestas con errores (p. ej., token expirado)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('Refresh token no encontrado');
                }

                const response = await axios.post(
                    'http://localhost:8090/users/refresh-token',
                    { refreshToken }
                );

                const newToken = response.data.token;
                localStorage.setItem('token', newToken);

                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                console.error('Error al refrescar el token:', refreshError);
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
