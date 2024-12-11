import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerDashboard from './pages/CustomerDashboard';
import HosterDashboard from './pages/HosterDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
              path="/customer"
              element={<PrivateRoute role="Customer"><CustomerDashboard /></PrivateRoute>}
          />
          <Route
              path="/hoster"
              element={<PrivateRoute role="Hoster"><HosterDashboard /></PrivateRoute>}
          />
        </Routes>
      </Router>
  );
};

export default App;
