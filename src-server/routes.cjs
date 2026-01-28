const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readDB, writeDB } = require('./db.cjs');

const SECRET = 'SECRET_KEY_LA_CUPULA_ELITE'; // Cambiar en producción

const sanitize = (text) => {
  if (typeof text !== 'string') return '';
  return text
    .trim() // Quita espacios en blanco al inicio y final
    .replace(/</g, "&lt;") // Convierte '<' en código seguro
    .replace(/>/g, "&gt;") // Convierte '>' en código seguro
    .replace(/"/g, "&quot;")
    .slice(0, 500); // Límite de caracteres (Anti-spam masivo)
};

// 2. Validador de Email básico
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Configuración de Multer para subir C.I.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../data/uploads');
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'CI-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// --- AUTH & REGISTRO ---

// Registro de Aspirante (Sube Foto C.I.)
router.post('/register', upload.single('ciPhoto'), async (req, res) => {
  const db = readDB();
  
  // 1. LIMPIEZA DE DATOS (Sanitización)
  const cleanName = sanitize(req.body.name);
  const cleanEmail = sanitize(req.body.email).toLowerCase(); // Emails siempre en minúscula
  const cleanGuild = sanitize(req.body.guildChoice);
  const rawPassword = req.body.password; // La contraseña NO se sanitiza, se hashea

  // 2. VALIDACIÓN (Reglas de negocio)
  if (!cleanName || !cleanEmail || !rawPassword) {
    return res.status(400).json({ msg: 'Todos los campos son obligatorios.' });
  }
  if (!isValidEmail(cleanEmail)) {
    return res.status(400).json({ msg: 'Formato de correo inválido.' });
  }
  if (db.users.find(u => u.email === cleanEmail)) {
    return res.status(400).json({ msg: 'El usuario ya existe.' });
  }

  // Si pasa los filtros, procedemos...
  const hashedPassword = await bcrypt.hash(rawPassword, 10);
  
  const newUser = {
    id: Date.now().toString(),
    name: cleanName,    // Guardamos la versión limpia
    email: cleanEmail,  // Guardamos la versión limpia
    password: hashedPassword,
    role: 'student',
    status: 'pending',
    guildId: cleanGuild,
    photoUrl: req.file ? `/uploads/${req.file.filename}` : null,
    joinedAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDB(db);
  
  res.json({ msg: 'Solicitud enviada. Espere aprobación de La Cúpula.' });
});

// Login
router.post('/news', (req, res) => {
  const db = readDB();
  
  // Limpiamos título y contenido
  const cleanTitle = sanitize(req.body.title); 
  // Nota: Si en el futuro quieres permitir negritas/cursivas, necesitarás un sanitizador más complejo.
  // Por ahora, bloqueamos todo HTML para máxima seguridad.
  const cleanContent = sanitize(req.body.content); 
  const isPublic = req.body.isPublic;
  const author = sanitize(req.body.author || 'Anónimo');

  if (!cleanTitle || !cleanContent) {
    return res.status(400).json({ msg: 'Título y contenido requeridos.' });
  }
  
  const newPost = {
    id: Date.now(),
    title: cleanTitle,
    content: cleanContent,
    date: new Date(),
    isPublic: isPublic === 'true' || isPublic === true,
    author: author
  };
  
  db.news.unshift(newPost);
  writeDB(db);
  res.json({ msg: 'Noticia publicada en La Cúpula.' });
});

// --- NOTICIAS ---

// Obtener noticias (Públicas vs Privadas)
router.get('/news', (req, res) => {
  const db = readDB();
  // En producción, decodificar token para ver si mostrar noticias privadas
  const publicNews = db.news.filter(n => n.isPublic); 
  res.json(publicNews);
});

// Postear Noticia (Solo Líderes/Admins)
router.post('/news', (req, res) => {
  // Aquí deberías verificar el token JWT (middleware simplificado)
  const db = readDB();
  const { title, content, isPublic, author } = req.body;
  
  const newPost = {
    id: Date.now(),
    title,
    content,
    date: new Date(),
    isPublic: isPublic === 'true',
    author
  };
  
  db.news.unshift(newPost); // Noticias nuevas primero
  writeDB(db);
  res.json({ msg: 'Noticia publicada en La Cúpula.' });
});

// --- GESTIÓN DE GREMIOS (PANEL DE CONTROL) ---

// Ver aspirantes pendientes (Solo para líderes)
router.get('/aspirants/:guildId', (req, res) => {
  const db = readDB();
  const { guildId } = req.params;
  // Filtrar usuarios pendientes de ese gremio
  const aspirants = db.users.filter(u => u.guildId === guildId && u.status === 'pending');
  res.json(aspirants);
});

// Aprobar/Rechazar Aspirante
router.post('/admit', (req, res) => {
  const db = readDB();
  const { userId, decision } = req.body; // decision: 'active' o 'rejected'
  
  const userIndex = db.users.findIndex(u => u.id === userId);
  if (userIndex > -1) {
    db.users[userIndex].status = decision;
    writeDB(db);
    res.json({ msg: `Usuario ${decision === 'active' ? 'ADMITIDO' : 'RECHAZADO'}.` });
  } else {
    res.status(404).json({ msg: 'Usuario no encontrado' });
  }
});

module.exports = router;