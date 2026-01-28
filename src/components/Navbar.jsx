import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Lock, Menu, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Verificación de autenticación (Token en LocalStorage)
  const isAuth = !!localStorage.getItem('token');

  // Detectar scroll para cambiar la opacidad del navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Links de navegación
  const navLinks = [
    { name: 'NOTICIAS', path: '/' },
    // Agregaremos más secciones luego, por ahora mantenemos lo esencial
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          isScrolled 
            ? 'bg-black/80 backdrop-blur-md border-white/10 py-2 shadow-2xl' 
            : 'bg-transparent border-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* LOGO DE MARCA */}
            <Link to="/" className="group flex items-center space-x-3 z-50">
              <div className="relative">
                <Shield className="h-9 w-9 text-cupula-gold transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-cupula-gold blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-black tracking-[0.2em] text-white group-hover:text-cupula-gold transition-colors uppercase font-serif leading-none">
                  La Cúpula
                </h1>
                <span className="text-[0.55rem] text-gray-400 uppercase tracking-[0.3em] mt-1 group-hover:text-gray-200 transition-colors">
                  Derecho UNA
                </span>
              </div>
            </Link>

            {/* MENÚ DE ESCRITORIO */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path}
                  className="relative text-xs font-bold tracking-widest text-gray-300 hover:text-white transition-colors py-2"
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.div 
                      layoutId="underline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-cupula-gold"
                    />
                  )}
                </Link>
              ))}

              <div className="h-4 w-[1px] bg-white/10 mx-2" />

              {!isAuth ? (
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/login" 
                    className="text-xs font-bold tracking-widest text-gray-400 hover:text-white transition-colors"
                  >
                    ACCESO
                  </Link>
                  <Link to="/register">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-cupula-red text-white text-xs font-bold px-5 py-2.5 rounded-sm tracking-widest border border-red-900/50 hover:bg-red-800 transition-colors shadow-[0_0_15px_rgba(138,3,3,0.3)] hover:shadow-[0_0_25px_rgba(138,3,3,0.5)]"
                    >
                      UNIRSE
                    </motion.button>
                  </Link>
                </div>
              ) : (
                <Link to="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 bg-cupula-gold/10 text-cupula-gold border border-cupula-gold/50 px-4 py-2 rounded-sm text-xs font-bold tracking-widest hover:bg-cupula-gold hover:text-black transition-all"
                  >
                    <Lock className="w-3 h-3" />
                    <span>PANEL</span>
                  </motion.button>
                </Link>
              )}
            </div>

            {/* BOTÓN MOVIL */}
            <button 
              className="md:hidden text-white p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* MENÚ MÓVIL (Overlay) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl md:hidden pt-24 px-6"
          >
            <div className="flex flex-col space-y-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-serif text-white hover:text-cupula-gold flex items-center justify-between border-b border-white/10 pb-4"
                >
                  {link.name}
                  <ChevronRight className="w-5 h-5 opacity-50" />
                </Link>
              ))}
              
              {!isAuth ? (
                <div className="flex flex-col space-y-4 mt-8">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center py-4 border border-white/20 text-gray-300 uppercase tracking-widest text-sm">
                    Ingresar
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center py-4 bg-cupula-red text-white uppercase tracking-widest text-sm font-bold shadow-lg shadow-red-900/20">
                    Solicitar Acceso
                  </Link>
                </div>
              ) : (
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center py-4 bg-cupula-gold text-black uppercase tracking-widest text-sm font-bold mt-8">
                  Ir al Panel
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;