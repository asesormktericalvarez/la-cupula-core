const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const { readDB, writeDB } = require('./db.cjs');

// === CONFIGURACIÓN DE SEGURIDAD === //

const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Storage para C.I. (Evidencias)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../data/uploads');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'evidence-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// === MIDDLEWARE DE AUTENTICACIÓN === //
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'Acceso Denegado. Falta Token.' });

  const db = readDB();
  const user = db.users.find(u => u.token === token);

  if (!user) return res.status(403).json({ msg: 'Sesión Expirada o Inválida.' });

  req.user = user; // Inyectamos el usuario en la request
  req.db = db;     // Inyectamos la DB para uso directo
  next();
};

// === RUTAS PÚBLICAS === //

// 1. REGISTRO (AHORA SIN GREMIO)
router.post('/register', upload.single('ciPhoto'), (req, res) => {
  try {
    const { name, email, password } = req.body;
    const db = readDB();

    if (db.users.find(u => u.email === email)) {
      return res.status(400).json({ msg: 'Este correo ya está en el sistema.' });
    }

    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password: hashPassword(password),
      role: 'user', 
      
      // ESTADO INICIAL: LIBRE
      guildId: null,
      rankId: null,

      influence: 5,
      contributions: 0,
      joinDate: new Date().toISOString(),
      ciPhoto: req.file ? `/uploads/${req.file.filename}` : null,
      token: null
    };

    db.users.push(newUser);
    writeDB(db);

    console.log(`[ALTA] Nuevo agente libre: ${email}`);
    res.status(201).json({ msg: 'Identidad creada. Eres un Agente Libre.', userId: newUser.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error crítico en registro.' });
  }
});

// 2. LOGIN
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const db = readDB();

  const user = db.users.find(u => u.email === email && u.password === hashPassword(password));

  if (!user) {
    return res.status(401).json({ msg: 'Credenciales inválidas.' });
  }

  const token = generateToken();
  user.token = token;
  writeDB(db);

  res.json({ 
    token, 
    user: { 
      name: user.name, 
      email: user.email, 
      id: user.id
    } 
  });
});

// === RUTAS PROTEGIDAS (PROTOCOLO IMPERIUM) === //

// 3. PERFIL DEL AGENTE (DATA ENRIQUECIDA)
router.get('/me', authenticate, (req, res) => {
  const { user, db } = req;
  
  // Buscar datos del gremio si tiene uno
  let guildData = null;
  let rankData = null;

  if (user.guildId) {
    const guild = db.guilds.find(g => g.id === user.guildId);
    if (guild) {
      guildData = {
        id: guild.id,
        name: guild.name,
        colors: guild.colors
      };
      
      const rank = guild.ranks.find(r => r.id === user.rankId);
      if (rank) {
        rankData = rank;
      }
    }
  }

  res.json({
    ...user,
    password: null, // Seguridad
    token: null,    // Seguridad
    guild: guildData,
    rank: rankData
  });
});

// 4. MERCADO DE GREMIOS (LISTAR)
router.get('/guilds', authenticate, (req, res) => {
  const { db } = req;
  // Devolver resumen de gremios
  const guildsSummary = db.guilds.map(g => ({
    id: g.id,
    name: g.name,
    description: g.description,
    mission: g.mission,
    colors: g.colors,
    memberCount: db.users.filter(u => u.guildId === g.id).length
  }));
  res.json(guildsSummary);
});

// 5. APLICAR A UN GREMIO (REQ. EVIDENCIA)
router.post('/guilds/:guildId/apply', authenticate, upload.single('evidence'), (req, res) => {
  const { guildId } = req.params;
  const { user, db } = req;

  if (user.guildId) {
    return res.status(400).json({ msg: 'Traición detectada: Ya perteneces a un gremio.' });
  }

  if (!req.file) {
    return res.status(400).json({ msg: 'Prueba de identidad (C.I.) requerida para aplicar.' });
  }

  const guild = db.guilds.find(g => g.id === guildId);
  if (!guild) return res.status(404).json({ msg: 'Gremio no encontrado.' });

  // Verificar si ya aplicó
  if (guild.applicants.some(a => a.userId === user.id)) {
    return res.status(400).json({ msg: 'Ya existe una solicitud pendiente.' });
  }

  // Crear Solicitud
  const application = {
    id: crypto.randomUUID(),
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    ciPhoto: `/uploads/${req.file.filename}`, // Nueva foto específica para la aplicación
    appliedAt: new Date().toISOString(),
    status: 'pending'
  };

  guild.applicants.push(application);
  writeDB(db);

  res.json({ msg: 'Solicitud enviada al Alto Mando del gremio.' });
});

// 6. INTELIGENCIA (NOTICIAS SEGMENTADAS)
router.get('/news', authenticate, (req, res) => {
  const { user, db } = req;
  
  // Filtrar noticias:
  // 1. Noticias Globales (guildId === null)
  // 2. Noticias de MI Gremio (guildId === user.guildId)
  
  const relevantNews = db.news.filter(n => {
    return n.guildId === null || (user.guildId && n.guildId === user.guildId);
  });

  // Ordenar por fecha descendente
  relevantNews.sort((a, b) => new Date(b.date) - new Date(a.date));

  res.json(relevantNews);
});

// 7. GESTIÓN DE GREMIO (SOLO LÍDERES) - OBTENER APLICANTES
router.get('/guilds/manage/applicants', authenticate, (req, res) => {
  const { user, db } = req;

  if (!user.guildId || !user.rankId) {
    return res.status(403).json({ msg: 'No tienes rango para esto.' });
  }

  const guild = db.guilds.find(g => g.id === user.guildId);
  const rank = guild.ranks.find(r => r.id === user.rankId);

  // Verificar permiso (Simplificado: Solo nivel > 50 puede ver)
  if (rank.level < 50) {
    return res.status(403).json({ msg: 'Nivel de seguridad insuficiente.' });
  }

  res.json(guild.applicants || []);
});

// 8. GESTIÓN DE GREMIO - RESOLVER SOLICITUD
router.post('/guilds/manage/applicants/:appId/resolve', authenticate, (req, res) => {
  const { user, db } = req;
  const { decision } = req.body; // 'ACCEPT' or 'REJECT'
  const { appId } = req.params;

  if (!user.guildId) return res.status(403).json({ msg: 'No perteneces a un gremio.' });

  const guild = db.guilds.find(g => g.id === user.guildId);
  const rank = guild.ranks.find(r => r.id === user.rankId);

  // Verificar Poder: Solo nivel 90+ (Líderes) pueden decidir
  if (rank.level < 90) return res.status(403).json({ msg: 'Solo el Alto Mando tiene autoridad para decidir.' });

  const applicantIndex = guild.applicants.findIndex(a => a.id === appId);
  if (applicantIndex === -1) return res.status(404).json({ msg: 'Solicitud no encontrada.' });

  const applicant = guild.applicants[applicantIndex];

  if (decision === 'ACCEPT') {
    // 1. Mover usuario al gremio
    const targetUser = db.users.find(u => u.id === applicant.userId);
    if (targetUser) {
        targetUser.guildId = guild.id;
        // Asignar el rango más bajo disponible como punto de entrada
        const lowestRank = guild.ranks.sort((a, b) => a.level - b.level)[0];
        targetUser.rankId = lowestRank.id;
        
        console.log(`[RECLUTAMIENTO] ${targetUser.email} ha jurado lealtad a ${guild.name}`);
    }
    // 2. Eliminar solicitud
    guild.applicants.splice(applicantIndex, 1);
    
  } else if (decision === 'REJECT') {
    // Solo eliminar solicitud
    guild.applicants.splice(applicantIndex, 1);
    console.log(`[RECLUTAMIENTO] Solicitud rechazada para ${applicant.userEmail}`);
  } else {
    return res.status(400).json({ msg: 'Decisión inválida. Use ACCEPT o REJECT.' });
  }

  writeDB(db);
  res.json({ msg: `Decisión ejecutada: ${decision === 'ACCEPT' ? 'APROBADO' : 'RECHAZADO'}.` });
});

// 9. FUNDAR GREMIO (NUEVO)
router.post('/guilds', authenticate, (req, res) => {
  const { name, description, mission, primaryColor, secondaryColor } = req.body;
  const { user, db } = req;

  if (user.guildId) {
    return res.status(400).json({ msg: 'Ya sirves a una facción. No puedes fundar otra.' });
  }
  
  // Validar nombre único
  if (db.guilds.some(g => g.name.toLowerCase() === name.toLowerCase())) {
    return res.status(400).json({ msg: 'Ese nombre ya está registrado por otra facción.' });
  }

  const newGuildId = crypto.randomUUID();
  const leaderRankId = crypto.randomUUID();
  const memberRankId = crypto.randomUUID();

  const newGuild = {
    id: newGuildId,
    name,
    description,
    mission,
    leaderId: user.id,
    foundedAt: new Date().toISOString(),
    colors: {
      primary: primaryColor || '#000000',
      secondary: secondaryColor || '#ffffff'
    },
    // GÉNESIS DE RANGOS: Creamos la jerarquía inicial
    ranks: [
      {
        id: leaderRankId,
        name: "Líder Supremo",
        level: 100,
        permissions: ["ALL"]
      },
      {
        id: memberRankId,
        name: "Miembro Fundador",
        level: 10,
        permissions: ["VIEW_INTEL"]
      }
    ],
    applicants: []
  };

  // ASCENSO INMEDIATO: El creador se convierte en Líder
  user.guildId = newGuildId;
  user.rankId = leaderRankId;
  
  // Guardamos el nuevo orden mundial
  db.guilds.push(newGuild);
  
  // Propaganda automática
  db.news.unshift({
    id: crypto.randomUUID(),
    guildId: null, // Noticia Global
    title: `NUEVA POTENCIA: ${name.toUpperCase()}`,
    content: `El movimiento ${name} ha sido fundado oficialmente bajo el férreo mando de ${user.name}.`,
    date: new Date().toISOString(),
    author: "Sistema Central"
  });

  writeDB(db);

  console.log(`[FUNDACIÓN] ${user.name} ha fundado ${name}`);
  res.status(201).json({ msg: 'Facción establecida. Larga vida al Líder.', guildId: newGuildId });
});

module.exports = router;