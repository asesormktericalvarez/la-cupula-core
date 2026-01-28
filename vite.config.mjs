import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  // Esto arregla el error de __DEFINES__ si el plugin falla al inyectar
  define: {
    'process.env': {}
  }
})