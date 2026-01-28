import React, { useEffect, useState } from 'react';

const Home = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    // Fetch a la API local que creamos antes
    fetch('http://localhost:3000/api/news')
      .then(res => res.json())
      .then(data => setNews(data))
      .catch(err => console.error("Error cargando noticias:", err));
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen">
      {/* Ticker de Noticias */}
      <div className="bg-[#8a0303] text-white overflow-hidden py-1">
        <div className="animate-marquee whitespace-nowrap text-xs font-bold uppercase tracking-widest">
          +++ ÚLTIMO MOMENTO: SE SUSPENDEN LAS CLASES DEL TURNO NOCHE POR ASAMBLEA GENERAL +++ IURIS CONFIRMA ALIANZA +++
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Columna Principal (Noticias) */}
        <div className="lg:col-span-8 space-y-12">
          {news.length > 0 ? news.map((item, index) => (
            <article key={item.id} className={`pb-8 ${index !== news.length -1 ? 'border-b border-gray-800' : ''}`}>
              <div className="flex items-center space-x-2 mb-3">
                <span className="bg-[#d4af37] text-black text-[0.6rem] font-bold px-2 py-0.5 uppercase">Política</span>
                <span className="text-gray-500 text-xs">{new Date(item.date).toLocaleDateString()}</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-100 leading-tight mb-4 hover:text-[#d4af37] cursor-pointer transition-colors">
                {item.title}
              </h2>
              <p className="text-gray-400 font-serif text-lg leading-relaxed">
                {item.content}
              </p>
            </article>
          )) : (
            <p className="text-gray-500">Cargando la verdad...</p>
          )}
        </div>

        {/* Sidebar (Lateral) */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="border border-gray-800 p-6 bg-[#0f1218]">
            <h3 className="text-[#d4af37] font-bold uppercase tracking-widest border-b border-gray-700 pb-2 mb-4">
              La Cúpula Opina
            </h3>
            <p className="text-sm text-gray-400 italic">
              "El poder no se pide, se arrebata. En Derecho UNA, solo los fuertes sobreviven al primer semestre."
            </p>
          </div>
          
          {/* Widget de Gremios */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-widest border-b border-[#8a0303] pb-2 mb-4">
              Gremios Activos
            </h3>
            <ul className="space-y-3">
              <li className="flex justify-between items-center text-sm text-gray-300 border-l-2 border-[#1e3a8a] pl-3">
                <span>Movimiento IURIS</span>
                <span className="text-green-500 text-xs">● Oficial</span>
              </li>
              <li className="flex justify-between items-center text-sm text-gray-300 border-l-2 border-[#b91c1c] pl-3">
                <span>Frente Renovador</span>
                <span className="text-yellow-500 text-xs">● Oposición</span>
              </li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Home;