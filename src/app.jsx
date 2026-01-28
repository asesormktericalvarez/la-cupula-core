import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/home.jsx';
import Register from './pages/register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx'; // Asumimos que crearás un login simple similar a Register

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
        <footer className="bg-black text-gray-600 text-center py-6 text-xs border-t border-gray-900">
          LA CÚPULA © 2026 - Facultad de Derecho UNA - Sistema Interno
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;