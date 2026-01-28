import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { User, Mail, Lock, Upload, FileText, Loader2, X } from 'lucide-react';

// URL SEGURA Y FIJA
const API_URL = 'http://localhost:3000';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', password: ''
  });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('DOCUMENTACIÓN REQUERIDA', {
        description: 'Debes adjuntar una foto de tu C.I. para validar tu identidad en el sistema.',
      });
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('ciPhoto', file);

    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        body: data
      });
      const result = await res.json();
      
      if (res.ok) {
        toast.success('IDENTIDAD REGISTRADA', {
            description: 'Bienvenido, Agente Libre. Tu perfil ha sido creado.',
            duration: 3000,
            icon: 'fp'
        });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error('ERROR EN EL PROTOCOLO', { description: result.msg });
      }
    } catch (error) {
      console.error(error);
      toast.error('FALLO DE CONEXIÓN', { description: 'El servidor central no responde.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden py-24 bg-cupula-black">
      <div className="absolute top-[10%] right-[20%] w-[400px] h-[400px] bg-cupula-gold/5 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="glass-card p-8 md:p-10 rounded-2xl shadow-2xl border border-white/5 bg-black/40 backdrop-blur-xl">
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-serif font-bold text-white tracking-widest uppercase">
              Alta de Agente
            </h2>
            <p className="text-xs text-gray-500 mt-2 tracking-widest uppercase">
              Registro Único de Estudiantes
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-1">
                <label className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider ml-1">Identidad (Nombre Completo)</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-gray-500 group-focus-within:text-cupula-gold transition-colors" />
                    </div>
                    <input type="text" className="w-full bg-black/50 border border-gray-700 text-gray-200 text-sm rounded-lg focus:ring-1 focus:ring-cupula-gold focus:border-cupula-gold block w-full pl-10 p-2.5 outline-none transition-all placeholder-gray-600"
                        placeholder="Juan Pérez"
                        onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider ml-1">Correo Institucional</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-gray-500 group-focus-within:text-cupula-gold transition-colors" />
                    </div>
                    <input type="email" className="w-full bg-black/50 border border-gray-700 text-gray-200 text-sm rounded-lg focus:ring-1 focus:ring-cupula-gold focus:border-cupula-gold block w-full pl-10 p-2.5 outline-none transition-all placeholder-gray-600"
                        placeholder="alumno@derecho.una.py"
                        onChange={e => setFormData({...formData, email: e.target.value})} required />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider ml-1">Establecer Clave</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-gray-500 group-focus-within:text-cupula-gold transition-colors" />
                    </div>
                    <input type="password" className="w-full bg-black/50 border border-gray-700 text-gray-200 text-sm rounded-lg focus:ring-1 focus:ring-cupula-gold focus:border-cupula-gold block w-full pl-10 p-2.5 outline-none transition-all placeholder-gray-600"
                        placeholder="••••••••"
                        onChange={e => setFormData({...formData, password: e.target.value})} required />
                </div>
            </div>

            <div className="pt-2">
                <label className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-2 block">
                    Validación de Identidad (C.I.)
                </label>
                
                <AnimatePresence mode="wait">
                    {!file ? (
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="relative border-2 border-dashed border-gray-700 hover:border-cupula-gold/50 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-black/30 group"
                        >
                            <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleFileChange} required />
                            <div className="p-3 bg-gray-800 rounded-full mb-3 group-hover:bg-cupula-gold/20 transition-colors">
                                <Upload className="h-6 w-6 text-gray-400 group-hover:text-cupula-gold" />
                            </div>
                            <p className="text-xs text-gray-400 font-medium group-hover:text-gray-300">Subir evidencia digital</p>
                            <p className="text-[0.6rem] text-gray-600 mt-1">Requerido para activar perfil</p>
                        </motion.div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className="relative rounded-lg overflow-hidden border border-gray-700 bg-black/50 p-2 flex items-center space-x-4"
                        >
                            <div className="h-16 w-16 flex-shrink-0 rounded bg-gray-800 overflow-hidden relative border border-gray-600">
                                {previewUrl && <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{file.name}</p>
                                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB • Verificado</p>
                            </div>
                            <button type="button" onClick={removeFile} className="p-2 hover:bg-red-900/30 text-gray-400 hover:text-red-500 rounded-full transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-cupula-gold text-black font-bold py-3.5 rounded-lg mt-4 hover:bg-yellow-600 transition-all shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-xs uppercase tracking-widest">Procesando Alta...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-widest">Crear Perfil</span>
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link to="/login" className="text-xs text-gray-500 hover:text-cupula-gold transition-colors">
              ¿Ya estás en el sistema? Acceder aquí
            </Link>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default Register;