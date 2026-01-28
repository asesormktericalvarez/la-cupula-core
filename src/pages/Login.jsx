import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Lock, Mail, ChevronRight, Loader2 } from 'lucide-react';

// URL SEGURA Y FIJA
const API_URL = 'http://localhost:3000';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        // 1. GUARDAR TOKEN (CRÍTICO)
        localStorage.setItem('token', data.token);
        
        // 2. Feedback Visual
        toast.success('ACCESO AUTORIZADO', {
          description: `Bienvenido de nuevo, ${data.user.name}.`,
          duration: 2000,
        });

        // 3. Redirección
        navigate('/dashboard');
      } else {
        toast.error('ACCESO DENEGADO', { description: data.msg });
      }
    } catch (error) {
      console.error(error);
      toast.error('ERROR DE CONEXIÓN', { description: 'El servidor central no responde.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cupula-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambiente Background */}
      <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-cupula-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card p-8 md:p-10 rounded-2xl shadow-2xl border border-white/5 bg-black/40 backdrop-blur-xl">
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-serif font-bold text-white tracking-widest uppercase mb-2">
              La Cúpula
            </h1>
            <p className="text-xs text-gray-500 tracking-[0.2em] uppercase">
              Sistema de Control Académico
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-[0.65rem] font-bold text-gray-500 uppercase tracking-wider ml-1">Credencial Institucional</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-500 group-focus-within:text-cupula-gold transition-colors" />
                </div>
                <input 
                  type="email" 
                  className="w-full bg-black/50 border border-gray-700 text-gray-200 text-sm rounded-lg focus:ring-1 focus:ring-cupula-gold focus:border-cupula-gold block pl-10 p-3 outline-none transition-all placeholder-gray-600"
                  placeholder="usuario@derecho.una.py"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[0.65rem] font-bold text-gray-500 uppercase tracking-wider ml-1">Clave de Acceso</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-500 group-focus-within:text-cupula-gold transition-colors" />
                </div>
                <input 
                  type="password" 
                  className="w-full bg-black/50 border border-gray-700 text-gray-200 text-sm rounded-lg focus:ring-1 focus:ring-cupula-gold focus:border-cupula-gold block pl-10 p-3 outline-none transition-all placeholder-gray-600"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-cupula-gold text-black font-bold py-3.5 rounded-lg mt-2 hover:bg-yellow-600 transition-all shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span className="text-xs uppercase tracking-widest">Iniciar Sesión</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          <div className="mt-8 text-center border-t border-gray-800 pt-6">
            <p className="text-gray-500 text-xs mb-3">¿Aún no tienes identidad en el sistema?</p>
            <Link to="/register" className="text-xs font-bold text-white hover:text-cupula-gold uppercase tracking-wider transition-colors">
              Solicitar Alta de Agente
            </Link>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default Login;