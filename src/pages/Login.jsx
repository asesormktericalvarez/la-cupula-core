import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
  e.preventDefault();
  // Leemos la variable del archivo .env
  const API_URL = import.meta.env.VITE_API_URL; 

  try {
    const res = await fetch(`${API_URL}/api/login`, { // <--- ASÍ DEBE QUEDAR {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('token', data.token); // Guardar llave de acceso
        // Recargar página para actualizar navbar
        window.location.href = '/dashboard'; 
      } else {
        alert(data.msg);
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión con La Cúpula");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="bg-[#0f1218] border border-gray-800 p-8 max-w-sm w-full shadow-2xl">
        <h2 className="text-2xl text-[#d4af37] font-bold text-center mb-6 uppercase tracking-widest">
          Acceso Restringido
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs text-gray-500 uppercase mb-1">Correo</label>
            <input type="email" className="w-full bg-black border border-gray-700 text-white p-2 focus:border-[#d4af37] outline-none" 
              onChange={e => setFormData({...formData, email: e.target.value})} required />
          </div>

          <div>
            <label className="block text-xs text-gray-500 uppercase mb-1">Contraseña</label>
            <input type="password" className="w-full bg-black border border-gray-700 text-white p-2 focus:border-[#d4af37] outline-none" 
              onChange={e => setFormData({...formData, password: e.target.value})} required />
          </div>

          <button type="submit" className="w-full bg-[#d4af37] text-black font-bold py-3 uppercase tracking-wider hover:bg-yellow-600 transition-colors">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;