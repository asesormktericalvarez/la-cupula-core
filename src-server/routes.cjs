const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readDB, writeDB } = require('./db.cjs');

const SECRET = 'SECRET_KEY_LA_CUPULA_ELITE'; // Cambiar en producción

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
  const { name, email, password, guildChoice } = req.body;
  
  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ msg: 'El usuario ya existe.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password: hashedPassword,
    role: 'student', // 'admin', 'leader', 'student'
    status: 'pending', // Requiere aprobación del líder
    guildId: guildChoice || null,
    photoUrl: req.file ? `/uploads/${req.file.filename}` : null,
    joinedAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDB(db);
  
  res.json({ msg: 'Solicitud enviada. Espere aprobación de La Cúpula.' });
});

// Login
router.post('/login', async (req, res) => {
  const db = readDB();
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ msg: 'Credenciales inválidas.' });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, SECRET);
  res.json({ token, user: { name: user.name, role: user.role, status: user.status } });
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