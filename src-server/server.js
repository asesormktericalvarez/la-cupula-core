const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const routes = require('./routes.cjs');
const { initDB } = require('./db.cjs');

const app = express();
const PORT = 3000;

// === INICIALIZACIÓN DE INFRAESTRUCTURA === //

// 1. Iniciar Protocolo de Base de Datos
initDB();

// 2. Asegurar Bóveda de Evidencias (Crear carpeta uploads si no existe)
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
    console.log('📂 [SISTEMA] Bóveda de evidencias (uploads) creada.');
}

// === MIDDLEWARES DE SEGURIDAD === //
app.use(cors()); // Habilita conexiones cruzadas desde el Frontend
app.use(express.json()); // Permite interpretar paquetes de datos JSON

// === ACCESO A ARCHIVOS === //
// Permitir visualizar las fotos de perfil subidas
// URL de acceso: http://localhost:3000/uploads/nombre-archivo.jpg
app.use('/uploads', express.static(uploadsDir));

// === ENRUTAMIENTO TÁCTICO === //
app.use('/api', routes);

// === ARRANQUE DEL SISTEMA === //
app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🛡️  LA CÚPULA - SISTEMA CENTRAL ACTIVO v2.0`);
    console.log(`==================================================`);
    console.log(`📡  Frecuencia de Escucha: http://localhost:${PORT}`);
    console.log(`📂  Ruta de Evidencias:    ${uploadsDir}`);
    console.log(`==================================================\n`);
});