const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const { readDB, writeDB } = require('./db.cjs');

// === CONFIGURACIÓN DE SEGURIDAD === //

// Hash simple para contraseñas (SHA-256)
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Generador de Tokens de Sesión
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Configuración de almacenamiento para C.I. (Multer)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    // Asegurar que la carpeta existe (fs es necesario aquí si no existe, 
    // pero asumiremos que el server.js la crea o ya existe)
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Nombre de archivo único y seguro
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'evidence-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// === RUTAS DE AUTORIDAD === //

// 1. REGISTRO DE AGENTES
router.post('/register', upload.single('ciPhoto'), (req, res) => {
  try {
    const { name, email, password, guildChoice } = req.body;
    const db = readDB();

    // Validar duplicados
    if (db.users.find(u => u.email === email)) {
      return res.status(400).json({ msg: 'Este correo ya está registrado en el sistema.' });
    }

    // Crear Perfil de Elite
    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password: hashPassword(password), // Nunca guardar texto plano
      guild: guildChoice === 'gremio-iuris' ? 'Movimiento IURIS' : 
             guildChoice === 'gremio-fer' ? 'Frente Renovador' : 'Alianza Independiente',
      role: 'Aspirante', // Rango inicial
      influence: 5,      // Comienzas desde abajo
      contributions: 0,
      joinDate: new Date().toLocaleDateString('es-PY', { month: 'short', year: 'numeric' }).toUpperCase(),
      ciPhoto: req.file ? `/uploads/${req.file.filename}` : null,
      token: null
    };

    db.users.push(newUser);
    writeDB(db);

    // Registro de auditoría
    console.log(`[ALTA] Nuevo aspirante registrado: ${email}`);

    res.status(201).json({ msg: 'Expediente creado con éxito.', userId: newUser.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error interno en el protocolo de registro.' });
  }
});

// 2. ACCESO AL SISTEMA (LOGIN)
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const db = readDB();

  const user = db.users.find(u => u.email === email && u.password === hashPassword(password));

  if (!user) {
    return res.status(401).json({ msg: 'Credenciales inválidas o acceso revocado.' });
  }

  // Generar nueva sesión
  const token = generateToken();
  user.token = token; // Guardar sesión activa
  writeDB(db);

  res.json({ 
    token, 
    user: { 
      name: user.name, 
      email: user.email, 
      role: user.role 
    } 
  });
});

// 3. RECUPERAR DATOS DEL AGENTE (ME)
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN
  if (!token) return res.status(401).json({ msg: 'Falta autorización.' });

  const db = readDB();
  const user = db.users.find(u => u.token === token);

  if (!user) return res.status(403).json({ msg: 'Sesión expirada.' });

  // Devolver solo datos públicos/seguros
  res.json({
    name: user.name,
    email: user.email,
    role: user.role,
    guild: user.guild,
    influence: user.influence,
    contributions: user.contributions,
    joinDate: user.joinDate,
    ciPhoto: user.ciPhoto
  });
});

// 4. FEED DE INTELIGENCIA (NOTICIAS)
router.get('/news', (req, res) => {
  const db = readDB();
  
  // Si no hay noticias, devolver datos simulados para que el frontend no se vea vacío
  if (!db.news || db.news.length === 0) {
    return res.json([
      {
        id: 1,
        title: "Reforma del Estatuto Estudiantil",
        content: "El Consejo Directivo ha aprobado la revisión del artículo 45. Se esperan movilizaciones del sector opositor para la próxima semana. Mantener la vigilancia.",
        date: new Date().toISOString(),
        isPublic: true
      },
      {
        id: 2,
        title: "Filtración de Exámenes: Bloque C",
        content: "Fuentes confidenciales indican que se han vulnerado los protocolos de seguridad en la cátedra de Derecho Romano. Se ha iniciado una investigación interna.",
        date: new Date(Date.now() - 86400000).toISOString(),
        isPublic: false
      }
    ]);
  }

  res.json(db.news);
});

module.exports = router;