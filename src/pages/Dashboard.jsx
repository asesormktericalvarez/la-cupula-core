import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { 
  LogOut, User, Shield, Activity, FilePlus, 
  Settings, Award, Briefcase, ChevronRight 
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulación de carga de datos del usuario
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error('ACCESO NO AUTORIZADO', {
        description: 'Protocolo de seguridad activado.',
      });
      navigate('/login');
      return;
    }

    // Aquí haríamos un fetch real al endpoint /api/me
    // Por ahora, decodificamos o simulamos para mantener el diseño
    setTimeout(() => {
      // Simulación de datos (En producción, esto viene de tu API)
      setUser({
        name: 'Agente IURIS',
        email: 'usuario@derecho.una.py',
        role: 'Operador Político',
        guild: 'Movimiento IURIS',
        influence: 85,
        contributions: 12,
        joinDate: 'ENE 2026'
      });
      setLoading(false);
    }, 800);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast('SESIÓN FINALIZADA', {
      description: 'Desconectando del servidor central...',
      icon: '🔌'
    });
    setTimeout(() => navigate('/login'), 1000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cupula-black text-cupula-gold space-y-4">
        <Activity className="w-12 h-12 animate-pulse" />
        <p className="text-xs uppercase tracking-[0.3em] animate-pulse">Sincronizando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cupula-black pt-24 pb-12 px-4 relative overflow-hidden">
      {/* Background Grid FX */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      
      <main className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl font-serif font-bold text-white tracking-tight">
              Centro de <span className="text-cupula-gold">Mando</span>
            </h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-2">
              Bienvenido, {user.name}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <span className="px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-[0.6rem] font-bold uppercase tracking-widest animate-pulse">
              Conexión Segura
            </span>
          </div>
        </header>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* COLUMNA IZQUIERDA: PERFIL */}
          <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
            
            {/* Tarjeta de Identidad */}
            <div className="glass-card rounded-xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-50">
                <Shield className="w-24 h-24 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
              </div>
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-gray-800 border-2 border-cupula-gold p-1 mb-4 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                  <div className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                    <User className="w-10 h-10 text-gray-400" />
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-white">{user.name}</h2>
                <p className="text-sm text-cupula-gold font-medium mt-1">{user.guild}</p>
                
                <div className="mt-6 w-full border-t border-gray-800 pt-4 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-[0.6rem] text-gray-500 uppercase tracking-widest">Rango</p>
                    <p className="text-sm font-bold text-gray-300">{user.role}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[0.6rem] text-gray-500 uppercase tracking-widest">Ingreso</p>
                    <p className="text-sm font-bold text-gray-300">{user.joinDate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones de Cuenta */}
            <div className="glass-panel rounded-xl p-1">
              <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 rounded-lg group transition-colors">
                <div className="flex items-center space-x-3">
                  <Settings className="w-4 h-4 text-gray-400 group-hover:text-white" />
                  <span className="text-sm text-gray-400 group-hover:text-white font-medium">Configuración</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-4 hover:bg-red-900/10 rounded-lg group transition-colors border-t border-white/5"
              >
                <div className="flex items-center space-x-3">
                  <LogOut className="w-4 h-4 text-red-400/70 group-hover:text-red-400" />
                  <span className="text-sm text-red-400/70 group-hover:text-red-400 font-medium">Abortar Sesión</span>
                </div>
              </button>
            </div>
          </motion.div>

          {/* COLUMNA DERECHA: ESTADÍSTICAS Y OPERACIONES */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
            
            {/* Panel de Estado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="glass-card p-6 rounded-xl border-l-4 border-l-cupula-gold">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nivel de Influencia</h3>
                  <Award className="w-5 h-5 text-cupula-gold" />
                </div>
                <div className="flex items-end space-x-2">
                  <span className="text-4xl font-black text-white">{user.influence}%</span>
                  <span className="text-xs text-green-400 mb-1.5 font-bold">+2.4% esta semana</span>
                </div>
                <div className="w-full bg-gray-800 h-1.5 rounded-full mt-4 overflow-hidden">
                  <div className="bg-cupula-gold h-full w-[85%] shadow-[0_0_10px_rgba(212,175,55,0.5)]"></div>
                </div>
              </div>

              <div className="glass-card p-6 rounded-xl border-l-4 border-l-blue-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Contribuciones</h3>
                  <Briefcase className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex items-end space-x-2">
                  <span className="text-4xl font-black text-white">{user.contributions}</span>
                  <span className="text-xs text-gray-400 mb-1.5 font-bold">Informes activos</span>
                </div>
                <div className="w-full bg-gray-800 h-1.5 rounded-full mt-4 overflow-hidden">
                  <div className="bg-blue-500 h-full w-[40%] shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                </div>
              </div>
            </div>

            {/* Zona de Operaciones */}
            <div className="glass-panel p-6 rounded-xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center">
                <Activity className="w-4 h-4 mr-2 text-cupula-red" />
                Operaciones Disponibles
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="group relative overflow-hidden bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cupula-gold/30 p-6 rounded-lg text-left transition-all">
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <FilePlus className="w-12 h-12 text-cupula-gold" />
                  </div>
                  <FilePlus className="w-6 h-6 text-cupula-gold mb-3" />
                  <h4 className="font-bold text-gray-200 group-hover:text-white">Redactar Informe</h4>
                  <p className="text-xs text-gray-500 mt-1">Crear una nueva entrada de noticias o reporte.</p>
                </button>
                
                <button className="group relative overflow-hidden bg-white/5 hover:bg-white/10 border border-white/5 hover:border-gray-500/30 p-6 rounded-lg text-left transition-all">
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Shield className="w-12 h-12 text-gray-400" />
                  </div>
                  <Shield className="w-6 h-6 text-gray-400 mb-3" />
                  <h4 className="font-bold text-gray-200 group-hover:text-white">Solicitar Credencial</h4>
                  <p className="text-xs text-gray-500 mt-1">Gestionar permisos o cambiar de gremio.</p>
                </button>
              </div>
            </div>

          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;