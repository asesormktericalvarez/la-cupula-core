import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Users, Shield, ChevronRight, Loader2, Upload, FileText, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// URL SEGURA Y FIJA
const API_URL = 'http://localhost:3000';

const GuildsBrowser = () => {
  const navigate = useNavigate();
  const [guilds, setGuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuild, setSelectedGuild] = useState(null); // Para el modal
  const [file, setFile] = useState(null);
  const [applying, setApplying] = useState(false);

  // Cargar Gremios
  useEffect(() => {
    const fetchGuilds = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await fetch(`${API_URL}/api/guilds`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setGuilds(data);
        } else {
          toast.error('Error al cargar el directorio de facciones.');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuilds();
  }, [navigate]);

  // Manejar Aplicación
  const handleApply = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Falta Evidencia', { description: 'Debes adjuntar tu C.I. o carta de intención.' });
      return;
    }

    setApplying(true);
    const formData = new FormData();
    formData.append('evidence', file);

    try {
      const token = localStorage.getItem('token');
      
      const res = await fetch(`${API_URL}/api/guilds/${selectedGuild.id}/apply`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const result = await res.json();

      if (res.ok) {
        toast.success('SOLICITUD ENVIADA', { 
          description: 'El Alto Mando revisará tu perfil. Mantente a la espera.',
          duration: 4000
        });
        setSelectedGuild(null); // Cerrar modal
        setFile(null);
      } else {
        toast.error('Solicitud Rechazada', { description: result.msg });
      }
    } catch (error) {
      toast.error('Error de Conexión');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cupula-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cupula-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cupula-black pt-24 pb-12 px-4 relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />

      <main className="max-w-7xl mx-auto relative z-10">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-black text-white tracking-tight mb-4">
            Mercado de <span className="text-cupula-gold">Lealtades</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto font-serif text-lg">
            "En la política universitaria no existen los neutrales. Solo existen los aliados y los objetivos."
          </p>
          <div className="mt-8 flex justify-center">
             <span className="px-4 py-1.5 rounded-full border border-gray-700 bg-gray-900/50 text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">
                Facciones Activas: {guilds.length}
             </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guilds.map((guild, index) => (
            <motion.div
              key={guild.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-xl overflow-hidden group flex flex-col h-full"
            >
              {/* Header con Color de Facción */}
              <div 
                className="h-2 w-full" 
                style={{ backgroundColor: guild.colors?.primary || '#333' }} 
              />
              
              <div className="p-8 flex-grow flex flex-col">
                <div className="flex items-start justify-between mb-6">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10 group-hover:border-white/20 transition-colors">
                    <Shield className="w-8 h-8" style={{ color: guild.colors?.primary || '#fff' }} />
                  </div>
                  <div className="flex items-center text-xs font-bold text-gray-500 bg-black/30 px-3 py-1 rounded-full">
                    <Users className="w-3 h-3 mr-2" />
                    {guild.memberCount} M
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2 font-serif uppercase tracking-wider">
                  {guild.name}
                </h2>
                
                <p className="text-sm text-gray-400 mb-6 flex-grow leading-relaxed">
                  {guild.description}
                </p>

                <div className="mt-auto pt-6 border-t border-white/5">
                  <div className="mb-4">
                    <p className="text-[0.6rem] text-gray-500 uppercase tracking-widest mb-1">Misión Principal</p>
                    <p className="text-xs text-gray-300 font-medium italic">"{guild.mission}"</p>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedGuild(guild)}
                    className="w-full group/btn relative overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center space-x-2"
                  >
                    <span className="text-xs uppercase tracking-widest">Solicitar Ingreso</span>
                    <ChevronRight className="w-4 h-4 text-cupula-gold group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </main>

      {/* MODAL DE APLICACIÓN */}
      <AnimatePresence>
        {selectedGuild && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0a0a0a] border border-gray-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative"
            >
              <button 
                onClick={() => { setSelectedGuild(null); setFile(null); }}
                className="absolute top-4 right-4 text-gray-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="h-2 w-full" style={{ backgroundColor: selectedGuild.colors?.primary }} />
              
              <div className="p-8">
                <div className="text-center mb-6">
                  <Shield className="w-12 h-12 mx-auto mb-4" style={{ color: selectedGuild.colors?.primary }} />
                  <h3 className="text-xl font-bold text-white uppercase tracking-widest">
                    Unirse a {selectedGuild.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-2">
                    Estás a punto de jurar lealtad. Esta acción será auditada.
                  </p>
                </div>

                <form onSubmit={handleApply} className="space-y-6">
                  <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                    <label className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider mb-3 block">
                      Confirmación de Identidad
                    </label>
                    <div className="relative border-2 border-dashed border-gray-700 hover:border-gray-500 rounded-lg p-4 transition-colors text-center cursor-pointer group">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => setFile(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {file ? (
                        <div className="flex items-center justify-center space-x-2 text-green-400">
                          <FileText className="w-5 h-5" />
                          <span className="text-xs font-bold truncate max-w-[150px]">{file.name}</span>
                        </div>
                      ) : (
                        <div className="text-gray-500 group-hover:text-gray-300">
                          <Upload className="w-6 h-6 mx-auto mb-2" />
                          <span className="text-xs">Click para adjuntar C.I.</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={applying}
                    className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {applying ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span className="text-xs uppercase tracking-widest">Enviar Solicitud Oficial</span>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GuildsBrowser;