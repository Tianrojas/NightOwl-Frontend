import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../styles/customerDashboard.css';

const CustomerDashboard = () => {
    const [events, setEvents] = useState([]);
    const [purchasedTickets, setPurchasedTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simula la carga de eventos desde un endpoint ficticio
        const fetchEvents = async () => {
            try {
                // Datos ficticios simulados
                const fakeEvents = [
                    { id: 1, nombre: "Concierto de Rock", ciudad: "Bogotá", precio: 50000 },
                    { id: 2, nombre: "Partido de Fútbol", ciudad: "Medellín", precio: 80000 },
                    { id: 3, nombre: "Festival de Cine", ciudad: "Cali", precio: 30000 },
                ];
                setEvents(fakeEvents);

                // Simula la carga de boletas compradas
                const fakeTickets = [
                    { id: 1, eventName: "Concierto de Rock", price: 50000, purchaseDate: "2024-12-01T12:00:00" },
                ];
                setPurchasedTickets(fakeTickets);

                setLoading(false);
            } catch (err) {
                setError("Error al cargar los eventos. Intenta nuevamente.");
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const handlePurchase = (event) => {
        // Simula la compra de un evento
        const newTicket = {
            id: purchasedTickets.length + 1,
            eventName: event.nombre,
            price: event.precio,
            purchaseDate: new Date().toISOString(),
        };

        setPurchasedTickets([...purchasedTickets, newTicket]);
        alert(`Has comprado un boleto para el evento: ${event.nombre}`);
    };

    if (loading) return <p>Cargando eventos...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Eventos Disponibles</h1>
            <ul>
                {events.map((event) => (
                    <li key={event.id}>
                        <span>
                            <strong>Nombre:</strong> {event.nombre} | <strong>Ciudad:</strong> {event.ciudad} |{" "}
                            <strong>Precio:</strong> {event.precio} COP
                        </span>
                        <button onClick={() => handlePurchase(event)}>Comprar</button>
                    </li>
                ))}
            </ul>

            <h2>Mis Boletas</h2>
            <ul>
                {purchasedTickets.map((ticket) => (
                    <li key={ticket.id}>
                        <span>
                            <strong>Evento:</strong> {ticket.eventName} | <strong>Precio:</strong> {ticket.price} COP |{" "}
                            <strong>Fecha de Compra:</strong> {new Date(ticket.purchaseDate).toLocaleString()}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CustomerDashboard;