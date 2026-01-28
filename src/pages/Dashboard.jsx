import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [aspirants, setAspirants] = useState([]);
  // En producción, obtener esto del JWT decodificado
  const currentGuildId = "gremio-iuris"; 

  useEffect(() => {
    fetch(`http://localhost:3000/api/aspirants/${currentGuildId}`)
      .then(res => res.json())
      .then(data => setAspirants(data));
  }, []);

  const handleDecision = async (userId, decision) => {
    await fetch('http://localhost:3000/api/admit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, decision })
    });
    // Actualizar lista visualmente
    setAspirants(aspirants.filter(a => a.id !== userId));
  };

  return (
    <div className="min-h-screen bg-[#050505] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl text-[#d4af37] font-bold mb-8 border-b border-gray-800 pb-4">
          PANEL DE CONTROL: <span className="text-white">Aspirantes Pendientes</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aspirants.map(user => (
            <div key={user.id} className="bg-[#0f1218] border border-gray-800 p-4 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-white font-bold text-lg">{user.name}</h3>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                </div>
                <span className="bg-yellow-900 text-yellow-200 text-xs px-2 py-1 rounded">Pendiente</span>
              </div>

              {/* Visualización de C.I. */}
              <div className="mb-4 bg-black h-48 flex items-center justify-center border border-gray-700 overflow-hidden relative group">
                {user.photoUrl ? (
                  <img 
                    src={`http://localhost:3000${user.photoUrl}`} 
                    alt="C.I." 
                    className="object-cover w-full h-full opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <span className="text-gray-600">Sin Foto</span>
                )}
                <div className="absolute bottom-0 left-0 bg-black/80 w-full p-1 text-center text-xs text-gray-400">
                  DOCUMENTO DE IDENTIDAD
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-auto">
                <button 
                  onClick={() => handleDecision(user.id, 'rejected')}
                  className="bg-transparent border border-[#8a0303] text-[#8a0303] py-2 text-sm hover:bg-[#8a0303] hover:text-white transition-colors">
                  RECHAZAR
                </button>
                <button 
                  onClick={() => handleDecision(user.id, 'active')}
                  className="bg-[#d4af37] text-black font-bold py-2 text-sm hover:bg-yellow-600 transition-colors">
                  APROBAR
                </button>
              </div>
            </div>
          ))}
          
          {aspirants.length === 0 && (
            <p className="text-gray-500 col-span-3 text-center py-12">No hay solicitudes pendientes de revisión.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;