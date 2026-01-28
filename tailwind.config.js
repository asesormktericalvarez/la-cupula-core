module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'cupula-black': '#0a0a0a',      // Fondo ultra oscuro
        'cupula-navy': '#111827',       // Paneles secundarios
        'cupula-gold': '#d4af37',       // Detalles de lujo/poder
        'cupula-red': '#8a0303',        // Acentos de "Sangre/Poder"
        'cupula-paper': '#e5e5e5',      // Texto tipo periódico viejo (opcional)
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'], // Importar esta fuente de Google Fonts
        sans: ['"Inter"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}