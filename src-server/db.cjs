const fs = require('fs');
const path = require('path');

// Ruta absoluta a la base de datos
const DB_PATH = path.join(__dirname, '../data/database.json');

// Estructura inicial ROBUSTA (v3.0)
const INITIAL_DB = {
  users: [],
  guilds: [], // Ahora almacena objetos complejos de gremios
  news: [],
  system_logs: []
};

// Inicializar DB si no existe
function initDB() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL_DB, null, 2));
    console.log('⚡ [DB] Base de datos inicializada (v3.0) en:', DB_PATH);
  }
}

// Leer DB con manejo de errores
function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      initDB();
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('🔥 [DB ERROR] Corrupción detectada o error de lectura:', error);
    return INITIAL_DB;
  }
}

// Escribir en DB de forma atómica
function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('🔥 [DB ERROR] No se pudo guardar:', error);
    return false;
  }
}

module.exports = { 
  readDB, 
  writeDB, 
  initDB,
  DB_PATH 
};