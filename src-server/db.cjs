const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/database.json');

// Estructura inicial si el archivo no existe
const INITIAL_DB = {
  users: [],      // { id, name, ci, password, role, guildId, status: 'pending'|'active', photoUrl }
  news: [],       // { id, title, content, date, isPublic, author }
  guilds: [],     // { id, name, history, leaderId, status: 'oficial' }
  sessions: []
};

const readDB = () => {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL_DB, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
};

const writeDB = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

module.exports = { readDB, writeDB };