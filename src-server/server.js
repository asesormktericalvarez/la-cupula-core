const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes.cjs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir imágenes subidas (C.I.) - PROTEGE ESTA RUTA EN PRODUCCIÓN SI ES NECESARIO
app.use('/uploads', express.static(path.join(__dirname, '../data/uploads')));

// API Routes
app.use('/api', apiRoutes);

// Servir Frontend (Build de React)
app.use(express.static(path.join(__dirname, '../public')));
// CORRECCIÓN: Usar '/*' o una expresión regular
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`LA CÚPULA - Sistema Operativo en Puerto: ${PORT}`);
  console.log('Modo: Elite | Persistencia: Local JSON');
});