import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar.jsx';
import Home from './pages/home.jsx';
import Register from './pages/register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';

// Extraemos el contenido a un sub-componente para poder usar el hook useLocation
// (useLocation solo funciona si está DENTRO de BrowserRouter)
const AppContent = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-cupula-black text-gray-200 font-sans selection:bg-cupula-gold selection:text-black">
      <Navbar />
      
      {/* Contenedor Principal */}
      <main className="flex-grow relative overflow-hidden">
        {/* AnimatePresence detecta cuando una ruta cambia para animar la salida de la anterior */}
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Pie de Página Elite */}
      <footer className="bg-black border-t border-cupula-gold/20 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-xs font-serif tracking-[0.2em] uppercase">
            La Cúpula © 2026 — Facultad de Derecho UNA
          </p>
          <p className="text-gray-700 text-[0.6rem] mt-2 tracking-wide uppercase">
            Sistema de Inteligencia & Control Académico
          </p>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      {/* Configuración Global de Notificaciones */}
      <Toaster 
        richColors 
        theme="dark" 
        position="top-center" 
        toastOptions={{
          style: { 
            background: 'rgba(15, 18, 24, 0.95)', 
            border: '1px solid rgba(255,255,255,0.1)', 
            backdropFilter: 'blur(10px)',
            fontFamily: '"Inter", sans-serif'
          },
        }}
      />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;