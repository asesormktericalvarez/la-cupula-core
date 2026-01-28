import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulación de "Procesando" para dar peso a la acción
    // (A veces una respuesta inmediata se siente "barata" en sistemas de seguridad)
    const API_URL = import.meta.env.VITE_API_URL; 

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('token', data.token);
        
        // Notificación de Éxito
        toast.success('IDENTIDAD CONFIRMADA', {
          description: 'Bienvenido a La Cúpula, Colega.',
          duration: 2000,
        });

        // Pequeño delay para que el usuario vea el éxito antes de recargar
        setTimeout(() => {
          window.location.href = '/dashboard'; 
        }, 1000);
      } else {
        // Notificación de Error
        toast.error('ACCESO DENEGADO', {
          description: data.msg || 'Credenciales inválidas.',
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('ERROR DE CONEXIÓN', {
        description: 'No se pudo establecer enlace con el servidor central.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Fondo con efectos de luz ambiental */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-cupula-gold/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-cupula-red/5 rounded-full blur-[100px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card p-8 md:p-10 rounded-2xl shadow-2xl border border-white/5">
          
          {/* Encabezado */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cupula-gold/10 mb-4 border border-cupula-gold/20">
              <ShieldCheck className="w-8 h-8 text-cupula-gold" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-white tracking-widest uppercase">
              Acceso Restringido
            </h2>
            <p className="text-xs text-gray-500 mt-2 tracking-widest uppercase">
              Solo personal autorizado
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input Email */}
            <div className="space-y-1">
              <label className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider ml-1">
                Credencial (Email)
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-cupula-gold transition-colors" />
                </div>
                <input 
                  type="email" 
                  className="w-full bg-black/50 border border-gray-700 text-gray-200 text-sm rounded-lg focus:ring-1 focus:ring-cupula-gold focus:border-cupula-gold block w-full pl-10 p-3 placeholder-gray-600 transition-all outline-none" 
                  placeholder="usuario@derecho.una.py"
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  required 
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-1">
              <label className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider ml-1">
                Clave de Seguridad
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-cupula-gold transition-colors" />
                </div>
                <input 
                  type="password" 
                  className="w-full bg-black/50 border border-gray-700 text-gray-200 text-sm rounded-lg focus:ring-1 focus:ring-cupula-gold focus:border-cupula-gold block w-full pl-10 p-3 placeholder-gray-600 transition-all outline-none" 
                  placeholder="••••••••••••"
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                  required 
                />
              </div>
            </div>

            {/* Botón de Acción */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full group relative overflow-hidden bg-white text-black font-bold py-3.5 px-4 rounded-lg mt-2 transition-all hover:bg-cupula-gold disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <div className="relative z-10 flex items-center justify-center space-x-2">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-xs uppercase tracking-widest">Verificando...</span>
                  </>
                ) : (
                  <>
                    <span className="text-xs uppercase tracking-widest">Ingresar al Sistema</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center border-t border-gray-800 pt-6">
            <p className="text-gray-500 text-xs">
              ¿No tienes credenciales?{' '}
              <Link to="/register" className="text-cupula-gold hover:underline font-bold transition-colors">
                Solicitar Ingreso
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;