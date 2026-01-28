import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', guildChoice: 'gremio-iuris'
  });
  const [file, setFile] = useState(null);
const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('guildChoice', formData.guildChoice);
    if (file) data.append('ciPhoto', file); // Clave exacta que espera Multer

    try {
      const API_URL = import.meta.env.VITE_API_URL; // Definir variable
const res = await fetch(`${API_URL}/api/register`, { // Usar variable {
        method: 'POST',
        body: data // Fetch maneja el Content-Type multipart/form-data automáticamente
      });
      const result = await res.json();
      if (res.ok) {
      alert("Solicitud enviada. La Cúpula evaluará tu ingreso.");
      navigate('/');
    } else {
      alert(result.msg);
    }
  } catch (error) {
    console.error(error);
    alert("Error de conexión");
  } finally {
    setLoading(false); // <--- 2. Desactiva carga siempre
  }
};

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="bg-[#0f1218] border border-gray-800 p-8 max-w-md w-full shadow-2xl">
        <h2 className="text-2xl text-[#d4af37] font-bold text-center mb-6 uppercase tracking-widest">Solicitud de Ingreso</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 uppercase mb-1">Nombre Completo</label>
            <input type="text" className="w-full bg-black border border-gray-700 text-white p-2 focus:border-[#d4af37] outline-none" 
              onChange={e => setFormData({...formData, name: e.target.value})} required />
          </div>

          <div>
            <label className="block text-xs text-gray-500 uppercase mb-1">Correo Institucional</label>
            <input type="email" className="w-full bg-black border border-gray-700 text-white p-2 focus:border-[#d4af37] outline-none" 
              onChange={e => setFormData({...formData, email: e.target.value})} required />
          </div>

          <div>
            <label className="block text-xs text-gray-500 uppercase mb-1">Contraseña</label>
            <input type="password" className="w-full bg-black border border-gray-700 text-white p-2 focus:border-[#d4af37] outline-none" 
              onChange={e => setFormData({...formData, password: e.target.value})} required />
          </div>

          <div>
            <label className="block text-xs text-gray-500 uppercase mb-1">Lealtad (Gremio)</label>
            <select className="w-full bg-black border border-gray-700 text-white p-2 focus:border-[#d4af37] outline-none"
              onChange={e => setFormData({...formData, guildChoice: e.target.value})}>
              <option value="gremio-iuris">Movimiento IURIS</option>
              <option value="gremio-fer">Frente Renovador</option>
              <option value="gremio-ali">Alianza Independiente</option>
            </select>
          </div>

          <div className="border-t border-gray-800 pt-4">
            <label className="block text-xs text-[#8a0303] font-bold uppercase mb-2">Requisito de Seguridad: Foto de C.I.</label>
            <input type="file" accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:bg-[#1e1e1e] file:text-[#d4af37] file:border-0 hover:file:bg-gray-900"
              onChange={e => setFile(e.target.files[0])} required />
          </div>

          <button 
  type="submit" 
  disabled={loading} // Bloquea si está cargando
  className={`w-full font-bold py-3 uppercase tracking-wider transition-colors mt-6 ${
    loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#d4af37] text-black hover:bg-yellow-600'
  }`}
>
  {loading ? 'PROCESANDO...' : 'ENVIAR SOLICITUD'}
</button>
        </form>
      </div>
    </div>
  );
};

export default Register;