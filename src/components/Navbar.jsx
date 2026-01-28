import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock } from 'lucide-react'; // Iconos

const Navbar = () => {
  const isAuth = localStorage.getItem('token'); // Verificación simple

  return (
    <nav className="bg-[#0f1218] border-b border-[#d4af37]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo / Marca */}
          <Link to="/" className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-[#d4af37]" />
            <div>
              <h1 className="text-2xl font-black tracking-[0.2em] text-[#d4af37] uppercase">La Cúpula</h1>
              <span className="text-[0.6rem] text-gray-400 uppercase tracking-widest block">Derecho UNA - Portal Oficial</span>
            </div>
          </Link>

          {/* Menú */}
          <div className="flex space-x-6 text-sm font-medium tracking-wide">
            <Link to="/" className="hover:text-[#d4af37] transition-colors">NOTICIAS</Link>
            <Link to="/directory" className="hover:text-[#d4af37] transition-colors">GREMIOS</Link>
            
            {!isAuth ? (
              <>
                <Link to="/login" className="text-gray-400 hover:text-white">ACCESO</Link>
                <Link to="/register" className="bg-[#8a0303] hover:bg-red-900 text-white px-4 py-2 rounded-sm transition-colors">
                  UNIRSE
                </Link>
              </>
            ) : (
              <Link to="/dashboard" className="flex items-center text-[#d4af37] border border-[#d4af37] px-4 py-2 rounded-sm">
                <Lock className="w-3 h-3 mr-2" />
                PANEL DE CONTROL
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;