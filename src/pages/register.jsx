import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { User, Mail, Lock, Upload, FileText, Loader2, Shield, X } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', guildChoice: 'gremio-iuris'
  });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // Manejador de archivo con vista previa inmediata
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
    
    // Validación de archivo en cliente antes de enviar
    if (!file) {
      toast.error('DOCUMENTACIÓN REQUERIDA', {
        description: 'Debes adjuntar una foto de tu C.I. para validación.',
      });
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('guildChoice', formData.guildChoice);
    data.append('ciPhoto', file);

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        body: data
      });
      const result = await res.json();
      
      if (res.ok) {
        toast.success('SOLICITUD ENCRIPTADA Y ENVIADA', {
            description: 'La Cúpula analizará tu perfil. Espera instrucciones.',
            duration: 4000,
            icon: '🔒'
        });
        // Delay elegante antes de redirigir
        setTimeout(() => navigate('/'), 2000);
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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden py-24">
      {/* Ambiente Background */}
      <div className="absolute top-[10%] right-[20%] w-[400px] h-[400px] bg-cupula-gold/5 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="glass-card p-8 md:p-10 rounded-2xl shadow-2xl border border-white/5">
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-serif font-bold text-white tracking-widest uppercase">
              Nuevo Expediente
            </h2>
            <p className="text-xs text-gray-500 mt-2 tracking-widest uppercase">
              Formulario de Ingreso a la Facultad
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Nombre */}
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

            {/* Email */}
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

            {/* Password */}
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

            {/* Guild Selector */}
            <div className="space-y-1">
                <label className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider ml-1">Declaración de Lealtad</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Shield className="h-4 w-4 text-gray-500 group-focus-within:text-cupula-gold transition-colors" />
                    </div>
                    <select className="w-full bg-black/50 border border-gray-700 text-gray-200 text-sm rounded-lg focus:ring-1 focus:ring-cupula-gold focus:border-cupula-gold block w-full pl-10 p-2.5 outline-none appearance-none transition-all cursor-pointer"
                        onChange={e => setFormData({...formData, guildChoice: e.target.value})}>
                        <option value="gremio-iuris">Movimiento IURIS (Oficialismo)</option>
                        <option value="gremio-fer">Frente Renovador (Oposición)</option>
                        <option value="gremio-ali">Alianza Independiente</option>
                    </select>
                </div>
            </div>

            {/* File Upload Visual - EL TOQUE PROFESIONAL */}
            <div className="pt-2">
                <label className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-2 block">
                    Prueba de Identidad (C.I.)
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
                            <p className="text-xs text-gray-400 font-medium group-hover:text-gray-300">Click para subir evidencia</p>
                            <p className="text-[0.6rem] text-gray-600 mt-1">Formatos Seguros: JPG, PNG</p>
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
                                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB • Listo para subir</p>
                            </div>
                            <button type="button" onClick={removeFile} className="p-2 hover:bg-red-900/30 text-gray-400 hover:text-red-500 rounded-full transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Submit */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-cupula-gold text-black font-bold py-3.5 rounded-lg mt-4 hover:bg-yellow-600 transition-all shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-xs uppercase tracking-widest">Transmitiendo...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-widest">Presentar Solicitud</span>
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link to="/login" className="text-xs text-gray-500 hover:text-cupula-gold transition-colors">
              ¿Ya tienes expediente? Acceder aquí
            </Link>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default Register;