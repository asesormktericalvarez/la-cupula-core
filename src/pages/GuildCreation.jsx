import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { 
  Shield, PenTool, Flag, Target, 
  ArrowLeft, Loader2, Save 
} from 'lucide-react';

// URL SEGURA
const API_URL = (import.meta.env && import.meta.env.VITE_API_URL) || 'http://localhost:3000';

const GuildCreation = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    mission: '',
    primaryColor: '#1e3a8a', // Azul por defecto
    secondaryColor: '#d4af37' // Dorado por defecto
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      const res = await fetch(`${API_URL}/api/guilds`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('GREMIO FUNDADO', {
          description: `El movimiento ${formData.name} ha nacido. Tú eres el Líder Supremo.`,
          duration: 5000,
        });
        navigate('/dashboard'); // Redirigir al dashboard para ver el nuevo estatus
      } else {
        toast.error('Error de Fundación', { description: data.msg });
      }
    } catch (error) {
      console.error(error);
      toast.error('Fallo del Sistema', { description: 'No se pudo registrar la nueva facción.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cupula-black pt-24 px-4 pb-12 relative overflow-hidden">
      {/* Ambiente Solemne */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-cupula-gold/5 to-transparent rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-start">
        
        {/* LADO IZQUIERDO: EL ACTA (FORMULARIO) */}
        <div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-500 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="text-xs font-bold uppercase tracking-widest">Cancelar Operación</span>
          </button>

          <div className="mb-8">
            <h1 className="text-4xl font-serif font-bold text-white mb-2">Fundar Movimiento</h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              Estás a punto de crear una nueva estructura de poder. Define su identidad, sus colores y su propósito.
              Como fundador, asumirás el rango de <span className="text-cupula-gold font-bold">Líder Supremo</span>.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Nombre */}
            <div className="glass-card p-6 rounded-xl border border-gray-800">
              <label className="flex items-center text-xs font-bold text-cupula-gold uppercase tracking-widest mb-4">
                <Flag className="w-4 h-4 mr-2" />
                Denominación Oficial
              </label>
              <input 
                type="text" 
                required
                maxLength={40}
                placeholder="Ej: FRENTE UNIDO"
                className="w-full bg-black/50 border border-gray-700 text-white text-lg font-bold rounded-lg p-4 focus:ring-1 focus:ring-cupula-gold focus:border-cupula-gold outline-none placeholder-gray-600 uppercase tracking-wide"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            {/* Ideología y Misión */}
            <div className="glass-card p-6 rounded-xl border border-gray-800">
              <label className="flex items-center text-xs font-bold text-cupula-gold uppercase tracking-widest mb-4">
                <PenTool className="w-4 h-4 mr-2" />
                Dogma & Propósito
              </label>
              
              <div className="space-y-4">
                <div>
                  <span className="text-[0.65rem] text-gray-500 uppercase font-bold block mb-1">Descripción Pública</span>
                  <textarea 
                    required
                    rows={3}
                    maxLength={200}
                    placeholder="Describe la ideología de tu movimiento en pocas palabras..."
                    className="w-full bg-black/50 border border-gray-700 text-gray-300 text-sm rounded-lg p-3 focus:ring-1 focus:ring-cupula-gold outline-none resize-none"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                
                <div>
                  <span className="text-[0.65rem] text-gray-500 uppercase font-bold block mb-1">Misión Principal</span>
                  <div className="relative">
                    <Target className="absolute top-3 left-3 w-4 h-4 text-gray-500" />
                    <input 
                      type="text" 
                      required
                      maxLength={100}
                      placeholder="El objetivo final (Ej: Reformar el estatuto)"
                      className="w-full bg-black/50 border border-gray-700 text-gray-300 text-sm rounded-lg pl-10 p-3 focus:ring-1 focus:ring-cupula-gold outline-none italic"
                      value={formData.mission}
                      onChange={e => setFormData({...formData, mission: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Simbología (Colores) */}
            <div className="glass-card p-6 rounded-xl border border-gray-800">
              <label className="flex items-center text-xs font-bold text-cupula-gold uppercase tracking-widest mb-4">
                <Shield className="w-4 h-4 mr-2" />
                Simbología Cromática
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[0.65rem] text-gray-500 uppercase font-bold block mb-2">Color Primario</span>
                  <div className="flex items-center space-x-3 bg-black/50 p-2 rounded-lg border border-gray-700">
                    <input 
                      type="color" 
                      className="w-8 h-8 rounded cursor-pointer border-none bg-transparent p-0"
                      value={formData.primaryColor}
                      onChange={e => setFormData({...formData, primaryColor: e.target.value})}
                    />
                    <span className="text-xs font-mono text-gray-400">{formData.primaryColor}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[0.65rem] text-gray-500 uppercase font-bold block mb-2">Color Secundario</span>
                  <div className="flex items-center space-x-3 bg-black/50 p-2 rounded-lg border border-gray-700">
                    <input 
                      type="color" 
                      className="w-8 h-8 rounded cursor-pointer border-none bg-transparent p-0"
                      value={formData.secondaryColor}
                      onChange={e => setFormData({...formData, secondaryColor: e.target.value})}
                    />
                    <span className="text-xs font-mono text-gray-400">{formData.secondaryColor}</span>
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm uppercase tracking-widest">Registrando Facción...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span className="text-sm uppercase tracking-widest">Firmar Acta Fundacional</span>
                </>
              )}
            </button>

          </form>
        </div>

        {/* LADO DERECHO: LA VISUALIZACIÓN (PREVIEW) */}
        <div className="hidden lg:block sticky top-24">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 text-center">
            Vista Previa de Identidad
          </h3>

          {/* Tarjeta de Gremio Simulada */}
          <motion.div 
            layout
            className="glass-card rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative max-w-md mx-auto"
          >
            {/* Header Color */}
            <div 
              className="h-32 w-full relative flex items-end p-6"
              style={{ background: `linear-gradient(to bottom right, ${formData.primaryColor}, ${formData.secondaryColor})` }}
            >
              <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-white/80 text-[0.6rem] font-bold uppercase tracking-widest border border-white/10">
                Fundado: 2026
              </div>
            </div>

            <div className="p-8 pt-12 relative">
              {/* Escudo Flotante */}
              <div 
                className="absolute -top-10 left-8 w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl border-4 border-[#0a0a0a]"
                style={{ backgroundColor: formData.primaryColor }}
              >
                <Shield className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-3xl font-serif font-bold text-white mb-2 uppercase tracking-wide leading-none">
                {formData.name || "NOMBRE DEL GREMIO"}
              </h2>
              
              <div className="h-1 w-20 bg-gray-800 my-4 rounded-full" />

              <p className="text-gray-400 text-sm mb-6 leading-relaxed min-h-[60px]">
                {formData.description || "Aquí aparecerá la descripción pública de tu movimiento político para que los aspirantes la lean."}
              </p>

              <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                <p className="text-[0.6rem] text-gray-500 uppercase tracking-widest mb-1">Misión Principal</p>
                <p className="text-xs text-gray-300 font-medium italic">
                  "{formData.mission || "Objetivo estratégico..."}"
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-gray-500 font-bold uppercase">Reclutamiento Activo</span>
                </div>
                <div className="text-xs text-gray-600 font-mono">1 Miembro</div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default GuildCreation;