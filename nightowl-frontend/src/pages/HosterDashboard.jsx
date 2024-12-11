import React, { useEffect, useState } from "react";
import api from "../services/api";
import '../styles/hosterDashboard.css';

const HosterDashboard = () => {
    const [events, setEvents] = useState([]);
    const [formData, setFormData] = useState({
        nombre: "",
        direccion: "",
        ciudad: "",
        telefono: "",
        tipo: "",
    });
    const [hosterName, setHosterName] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get("/venues"); // Obtiene los eventos existentes
                setEvents(response.data);

                // Decodificar el token JWT para obtener el nombre del hoster
                const token = localStorage.getItem("token");
                if (token) {
                    const base64Url = token.split(".")[1];
                    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
                    const decodedToken = JSON.parse(atob(base64));
                    setHosterName(decodedToken.sub); // Supongamos que el email del Hoster está en el "sub"
                }

                setLoading(false);
            } catch (err) {
                setError("Error al cargar los eventos. Intenta nuevamente.");
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddVenue = async (e) => {
        e.preventDefault();
        try {
            // Incluye el nombre del Hoster en el venue
            const newVenue = {
                ...formData,
            };
            await api.post("/venues", newVenue);
            alert("Venue añadido exitosamente.");
            setFormData({
                nombre: "",
                direccion: "",
                ciudad: "",
                telefono: "",
                tipo: "",
            });
            setEvents([...events, newVenue]);
        } catch (err) {
            alert("Error al añadir el venue.");
        }
    };

    if (loading) return <p>Cargando eventos...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Bienvenido, {hosterName}</h1>
            <h2>Eventos Publicados</h2>
            <ul>
                {events.map((event) => (
                    <li key={event.id}>
                        Nombre: {event.nombre} - Ciudad: {event.ciudad}
                    </li>
                ))}
            </ul>

            <h2>Añadir Nuevo Venue</h2>
            <form onSubmit={handleAddVenue}>
                <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre del Venue"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="direccion"
                    placeholder="Dirección"
                    value={formData.direccion}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="ciudad"
                    placeholder="Ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="telefono"
                    placeholder="Teléfono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                />
                <select name="tipo" value={formData.tipo} onChange={handleChange} required>
                    <option value="">Selecciona el tipo</option>
                    <option value="Deportivo">Deportivo</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Concierto">Concierto</option>
                </select>
                <button type="submit">Añadir Venue</button>
            </form>
        </div>
    );
};

export default HosterDashboard;
