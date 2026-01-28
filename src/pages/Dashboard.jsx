import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LogOut, Shield, Users, Award, 
  TrendingUp, AlertCircle, Briefcase, 
  Crown, FileText, ChevronRight 
} from 'lucide-react';
import { toast } from 'sonner';

// URL SEGURA Y FIJA
const API_URL = 'http://localhost:3000';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // 1. Obtener perfil enriquecido
        const userRes = await fetch(`${API_URL}/api/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);

          // 2. Obtener noticias solo si el usuario es válido
          const newsRes = await fetch(`${API_URL}/api/news`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (newsRes.ok) {
            setNews(await newsRes.json());
          }
        } else {
          // Si el token es inválido o expiró
          console.log("Token inválido, cerrando sesión...");
          localStorage.removeItem('token');
          navigate('/login');
        }
      } catch (error) {
        console.error("Error crítico en Dashboard:", error);
        // Opcional: No redirigir inmediatamente en error de red para ver el log
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.info("Sesión finalizada", { description: "Has desconectado del sistema." });
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cupula-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cupula-gold"></div>
      </div>
    );
  }

  // Protección contra renderizado nulo si falló la carga pero no redirigió aún
  if (!user) return null;

  // --- MODO 1: AGENTE LIBRE (Sin Gremio) ---
  if (!user.guild) {
    return (
      <div className="min-h-screen bg-cupula-black pt-24 px-4 pb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gray-900/50 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <header className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-3xl font-serif text-white mb-1">
                Bienvenido, <span className="text-gray-400">{user.name}</span>
              </h1>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[0.65rem] font-bold bg-gray-800 text-gray-400 uppercase tracking-wider border border-gray-700">
                  Agente Libre
                </span>
                <span className="text-xs text-gray-600 uppercase tracking-widest">
                  Sin Afiliación Política
                </span>
              </div>
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </header>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="glass-card p-8 rounded-2xl border-l-4 border-l-cupula-gold relative group cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => navigate('/guilds')}
            >
              <div className="absolute top-4 right-4 p-2 bg-cupula-gold/10 rounded-lg text-cupula-gold">
                <Briefcase className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">Mercado de Lealtades</h2>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Explora las facciones activas, analiza sus misiones y ofrece tus servicios. 
                El poder requiere estructura.
              </p>
              <div className="flex items-center text-cupula-gold text-xs font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                Ver Facciones <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className="glass-card p-8 rounded-2xl border-l-4 border-l-gray-700 relative group cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => navigate('/guild/create')}
            >
              <div className="absolute top-4 right-4 p-2 bg-white/10 rounded-lg text-white">
                <Crown className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">Fundar Movimiento</h2>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                ¿Ninguna facción te representa? Reúne los recursos necesarios para iniciar tu propia dinastía política.
              </p>
              <div className="flex items-center text-white text-xs font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                Iniciar Fundación <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </motion.div>
          </div>

          <div className="mt-12">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 border-b border-gray-800 pb-2">
              Boletín Público
            </h3>
            <div className="grid gap-4">
              {news.length > 0 ? news.map((item) => (
                <div key={item.id} className="bg-black/40 border border-gray-800 p-6 rounded-lg hover:border-gray-600 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-blue-400 font-bold uppercase tracking-wider bg-blue-900/20 px-2 py-1 rounded">
                      Global
                    </span>
                    <span className="text-[0.65rem] text-gray-600 uppercase">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-200 mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-400">{item.content}</p>
                </div>
              )) : (
                <p className="text-gray-600 italic text-sm">Sin novedades en el campus.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- MODO 2: MIEMBRO DE FACCION ---
  const isLeader = user.rank?.level >= 90;

  return (
    <div className="min-h-screen bg-cupula-black pt-24 px-4 pb-12 relative overflow-hidden">
      <div 
        className="absolute top-0 left-0 w-full h-[300px] opacity-10 pointer-events-none"
        style={{ background: `linear-gradient(to bottom, ${user.guild.colors?.primary}, transparent)` }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="flex items-center space-x-6">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl border border-white/10"
              style={{ backgroundColor: user.guild.colors?.primary }}
            >
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-white tracking-wide uppercase">
                {user.guild.name}
              </h1>
              <div className="flex items-center space-x-3 mt-1">
                <div className="flex items-center space-x-1 text-cupula-gold text-xs font-bold uppercase tracking-widest bg-cupula-gold/10 px-2 py-0.5 rounded border border-cupula-gold/20">
                  <Award className="w-3 h-3" />
                  <span>{user.rank?.name || 'Iniciado'}</span>
                </div>
                <span className="text-xs text-gray-500">|</span>
                <span className="text-xs text-gray-400">{user.name}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {isLeader && (
              <button 
                onClick={() => navigate('/guild/manage')}
                className="px-5 py-2 bg-red-900/30 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-red-900/50 transition-colors flex items-center gap-2"
              >
                <Crown className="w-4 h-4" />
                Alto Mando
              </button>
            )}
            <button onClick={handleLogout} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 rounded-xl">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Tu Rendimiento</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Influencia</span>
                  <span className="text-lg font-bold text-white font-mono">{user.influence} pts</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5">
                  <div className="bg-cupula-gold h-1.5 rounded-full" style={{ width: `${Math.min(user.influence, 100)}%` }}></div>
                </div>
                
                <div className="pt-4 border-t border-gray-800 flex justify-between items-center">
                  <span className="text-sm text-gray-400">Aportes</span>
                  <span className="text-sm font-bold text-white">{user.contributions}</span>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-xl">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Estado de Facción</h3>
              <div className="flex items-center space-x-3 mb-3 text-green-400">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm font-bold">Dominante</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                El gremio mantiene control sobre el 60% de las delegaturas. Se requiere mantener la presión.
              </p>
            </motion.div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Inteligencia & Novedades
            </h3>

            <div className="space-y-4">
              {news.map((item, idx) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`p-6 rounded-xl border relative overflow-hidden group hover:bg-white/5 transition-all ${
                    item.guildId 
                      ? 'bg-red-900/5 border-red-900/30'
                      : 'bg-black/40 border-gray-800'
                  }`}
                >
                  <div className="absolute top-0 right-0 p-3">
                    {item.guildId ? (
                       <span className="flex items-center gap-1 text-[0.6rem] font-bold text-red-400 uppercase tracking-widest bg-red-950/50 px-2 py-1 rounded border border-red-900/50">
                          <AlertCircle className="w-3 h-3" /> Clasificado
                       </span>
                    ) : (
                       <span className="text-[0.6rem] font-bold text-gray-600 uppercase tracking-widest bg-gray-900 px-2 py-1 rounded">
                          Público
                       </span>
                    )}
                  </div>

                  <div className="mb-3">
                    <span className="text-[0.65rem] text-gray-500 uppercase font-mono">
                      {new Date(item.date).toLocaleDateString()} • {item.author || 'Sistema'}
                    </span>
                  </div>
                  
                  <h4 className={`text-lg font-bold mb-3 ${item.guildId ? 'text-red-100' : 'text-gray-200'}`}>
                    {item.title}
                  </h4>
                  
                  <p className={`text-sm leading-relaxed ${item.guildId ? 'text-red-200/70' : 'text-gray-400'}`}>
                    {item.content}
                  </p>
                </motion.div>
              ))}

              {news.length === 0 && (
                <div className="text-center py-12 border border-dashed border-gray-800 rounded-xl">
                  <p className="text-gray-600">Los canales de inteligencia están en silencio.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;