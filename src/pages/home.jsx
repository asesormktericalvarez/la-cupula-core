import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, AlertTriangle, ArrowRight, TrendingUp, ChevronRight, Activity } from 'lucide-react';

// Componente Ticker Animado
const NewsTicker = () => {
  return (
    <div className="bg-cupula-red text-white overflow-hidden py-2 relative z-20 border-b border-red-900 shadow-lg shadow-red-900/20">
      <div className="flex whitespace-nowrap">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex space-x-8 text-xs font-bold uppercase tracking-widest"
        >
          {[...Array(3)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="flex items-center text-white/90">
                <AlertTriangle className="w-3 h-3 mr-2 text-yellow-400" />
                URGENTE: ASAMBLEA GENERAL CONVOCADA PARA ESTA NOCHE EN EL AULA MAGNA
              </span>
              <span className="text-red-300">///</span>
              <span className="flex items-center text-white/90">
                IURIS CONFIRMA ALIANZA ESTRATÉGICA CON ECONOMÍA
              </span>
              <span className="text-red-300">///</span>
              <span className="flex items-center text-white/90">
                REPORTE DE INCIDENTES EN PASILLOS DEL BLOQUE B
              </span>
              <span className="text-red-300">///</span>
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const Home = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;
    fetch(`${API_URL}/api/news`)
      .then(res => res.json())
      .then(data => {
        setNews(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando inteligencia:", err);
        setLoading(false);
      });
  }, []);

  // Variantes de animación para la entrada en cascada
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
  };

  return (
    <div className="bg-cupula-black min-h-screen relative">
      <NewsTicker />

      {/* Background FX */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-cupula-gold/5 to-transparent pointer-events-none" />

      <main className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        
        {/* COLUMNA PRINCIPAL (FEED) */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
            <h1 className="text-3xl md:text-4xl font-serif font-black text-white tracking-tight">
              Informe <span className="text-cupula-gold">Diario</span>
            </h1>
            <div className="flex items-center space-x-2 text-xs text-gray-500 uppercase tracking-widest">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
              <span>Sistema Online</span>
            </div>
          </div>

          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 bg-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-8"
            >
              {news.length > 0 ? news.map((item) => (
                <motion.article 
                  key={item.id} 
                  variants={itemVariants}
                  className="glass-card p-6 md:p-8 rounded-xl relative group overflow-hidden"
                >
                  {/* Etiqueta Flotante */}
                  <div className="absolute top-0 right-0 bg-white/5 border-l border-b border-white/5 px-3 py-1 rounded-bl-xl backdrop-blur-md">
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest text-cupula-gold">
                      {item.isPublic ? 'Acceso Público' : 'Clasificado'}
                    </span>
                  </div>

                  <div className="flex flex-col space-y-4">
                    {/* Meta Data */}
                    <div className="flex items-center space-x-4 text-xs text-gray-500 font-medium uppercase tracking-wider">
                      <div className="flex items-center text-cupula-gold">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(item.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(item.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} HRS
                      </div>
                    </div>

                    {/* Título */}
                    <h2 className="text-2xl font-bold text-gray-100 leading-tight group-hover:text-cupula-gold transition-colors duration-300">
                      {item.title}
                    </h2>

                    {/* Contenido (Truncado visualmente) */}
                    <p className="text-gray-400 font-serif text-lg leading-relaxed line-clamp-3">
                      {item.content}
                    </p>

                    {/* Botón Leer Más */}
                    <div className="pt-4 flex items-center text-xs font-bold text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors">
                      <span>Desplegar Informe</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300 text-cupula-gold" />
                    </div>
                  </div>
                </motion.article>
              )) : (
                <div className="text-center py-20 border border-dashed border-gray-800 rounded-xl">
                  <p className="text-gray-500 font-serif italic">No hay actividad reportada en los radares.</p>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* SIDEBAR (WIDGETS) */}
        <aside className="lg:col-span-4 space-y-8">
          
          {/* Widget 1: Tensión Política */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-panel p-6 rounded-xl border-t-2 border-t-cupula-red"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center">
                <Activity className="w-4 h-4 mr-2 text-cupula-red" />
                Tensión Política
              </h3>
              <span className="text-cupula-red text-xs font-bold animate-pulse">ALTA</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Estabilidad Académica</span>
                <span>32%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} animate={{ width: "68%" }} transition={{ duration: 1.5, delay: 0.8 }}
                  className="bg-cupula-red h-full shadow-[0_0_10px_rgba(138,3,3,0.5)]" 
                />
              </div>
              <p className="text-[0.65rem] text-gray-500 italic mt-2">
                *Datos basados en actividad de pasillo y redes sociales.
              </p>
            </div>
          </motion.div>

          {/* Widget 2: Gremios */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-panel p-0 rounded-xl overflow-hidden"
          >
            <div className="bg-white/5 p-4 border-b border-white/5">
              <h3 className="text-sm font-bold text-cupula-gold uppercase tracking-widest flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Fuerzas Activas
              </h3>
            </div>
            <div className="divide-y divide-white/5">
              {[
                { name: 'Movimiento IURIS', status: 'Oficial', color: 'text-blue-400' },
                { name: 'Frente Renovador', status: 'Oposición', color: 'text-red-400' },
                { name: 'Alianza Indep.', status: 'En Formación', color: 'text-green-400' }
              ].map((g, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-default group">
                  <span className="text-sm text-gray-300 font-medium group-hover:text-white transition-colors">{g.name}</span>
                  <span className={`text-[0.6rem] uppercase tracking-wider font-bold ${g.color} border border-white/10 px-2 py-0.5 rounded`}>
                    {g.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="p-3 bg-black/20 text-center">
              <button className="text-[0.65rem] text-gray-500 hover:text-cupula-gold uppercase tracking-widest transition-colors flex items-center justify-center w-full">
                Ver Directorio Completo <ChevronRight className="w-3 h-3 ml-1" />
              </button>
            </div>
          </motion.div>

          {/* Widget 3: Frase */}
          <div className="border border-dashed border-gray-800 p-6 rounded-xl text-center">
            <p className="font-serif text-lg text-gray-400 italic">
              "El poder no se pide, se arrebata. En Derecho UNA, solo los fuertes sobreviven al primer semestre."
            </p>
            <div className="w-8 h-1 bg-cupula-gold mx-auto mt-4" />
          </div>

        </aside>
      </main>
    </div>
  );
};

export default Home;