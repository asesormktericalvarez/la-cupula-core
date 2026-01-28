import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Check, X, Eye, 
  User, Clock, AlertTriangle, ArrowLeft, Loader2 
} from 'lucide-react';

// DECLARACIÓN SEGURA DE LA URL API (Fuera del componente y protegida)
const API_URL = (import.meta.env && import.meta.env.VITE_API_URL) || 'http://localhost:3000';

const GuildControlPanel = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [applicants, setApplicants] = useState([]);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  // Cargar Solicitudes
  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const res = await fetch(`${API_URL}/api/guilds/manage/applicants`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setApplicants(data);
      } else {
        toast.error('Acceso Denegado', { description: 'No tienes rango suficiente para ver esto.' });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error de conexión con el Alto Mando');
    } finally {
      setLoading(false);
    }
  };

  // Ejecutar Decisión
  const handleDecision = async (appId, decision) => {
    setProcessingId(appId);
    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${API_URL}/api/guilds/manage/applicants/${appId}/resolve`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ decision }) // 'ACCEPT' o 'REJECT'
      });

      if (res.ok) {
        toast.success(decision === 'ACCEPT' ? 'Recluta Aceptado' : 'Solicitud Rechazada');
        // Actualizar lista localmente
        setApplicants(prev => prev.filter(a => a.id !== appId));
      } else {
        const data = await res.json();
        toast.error('Error', { description: data.msg });
      }
    } catch (error) {
      toast.error('Fallo al ejecutar la orden');
    } finally {
      setProcessingId(null);
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
    <div className="min-h-screen bg-cupula-black pt-24 px-4 pb-12 relative overflow-hidden">
      {/* Ambiente Táctico */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-red-900/10 to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-serif font-bold text-white tracking-wide uppercase flex items-center gap-3">
                <Shield className="w-8 h-8 text-red-500" />
                Sala de Guerra
              </h1>
              <p className="text-xs text-red-400 font-mono uppercase tracking-widest mt-1">
                Panel de Control de Alto Mando • Nivel 90+
              </p>
            </div>
          </div>
          
          <div className="bg-red-900/20 border border-red-500/30 px-4 py-2 rounded-lg flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-xs font-bold text-red-200 uppercase tracking-wider">
              Solicitudes Pendientes: {applicants.length}
            </span>
          </div>
        </header>

        {/* Lista de Aspirantes */}
        <div className="space-y-4">
          <AnimatePresence>
            {applicants.length > 0 ? (
              applicants.map((app) => (
                <motion.div
                  key={app.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="glass-card border-l-4 border-l-gray-600 p-6 rounded-r-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-l-cupula-gold transition-colors group"
                >
                  {/* Datos del Aspirante */}
                  <div className="flex-grow">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{app.userName}</h3>
                      <span className="text-[0.6rem] font-bold bg-gray-800 text-gray-400 px-2 py-0.5 rounded uppercase tracking-wider">
                        Aspirante
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1.5 opacity-50" />
                        {app.userEmail}
                      </div>
                      <div className="flex items-center font-mono text-xs">
                        <Clock className="w-3 h-3 mr-1.5 opacity-50" />
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center space-x-3 w-full md:w-auto">
                    
                    {/* Ver Evidencia */}
                    <button 
                      onClick={() => setSelectedEvidence(app.ciPhoto)}
                      className="flex-1 md:flex-none px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Revisar C.I.
                    </button>

                    <div className="h-8 w-[1px] bg-gray-700 hidden md:block" />

                    {/* Aprobar */}
                    <button 
                      onClick={() => handleDecision(app.id, 'ACCEPT')}
                      disabled={processingId === app.id}
                      className="flex-1 md:flex-none px-4 py-2 bg-green-900/30 border border-green-500/30 hover:bg-green-900/50 text-green-400 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      {processingId === app.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      Reclutar
                    </button>

                    {/* Rechazar */}
                    <button 
                      onClick={() => handleDecision(app.id, 'REJECT')}
                      disabled={processingId === app.id}
                      className="flex-1 md:flex-none px-4 py-2 bg-red-900/30 border border-red-500/30 hover:bg-red-900/50 text-red-400 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      {processingId === app.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                      Rechazar
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-20 border-2 border-dashed border-gray-800 rounded-xl"
              >
                <Shield className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-500 uppercase tracking-widest">Sin Solicitudes</h3>
                <p className="text-gray-600 text-sm mt-2">La burocracia está al día. No hay aspirantes en cola.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* MODAL DE EVIDENCIA (C.I.) */}
      <AnimatePresence>
        {selectedEvidence && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedEvidence(null)}
          >
            <motion.div 
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-xl border border-gray-700 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedEvidence(null)}
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-red-600 transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="absolute top-4 left-4 bg-black/70 px-3 py-1 rounded border border-white/10 text-xs font-bold text-white uppercase tracking-widest z-10">
                Evidencia Digital
              </div>
              
              <img 
                src={`${API_URL}${selectedEvidence}`} 
                alt="Documento de Identidad" 
                className="w-full h-full object-contain max-h-[85vh] bg-gray-900"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default GuildControlPanel;