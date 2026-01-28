const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Configuración de rutas
const DATA_DIR = path.join(__dirname, '../data'); // Ajusta si lo corres desde raíz
const DB_PATH = path.join(DATA_DIR, 'database.json');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');

const init = async () => {
    console.log("⚠️  INICIANDO PROTOCOLO DE GÉNESIS DE DATOS...");

    // 1. Crear directorios si no existen
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
    if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);

    // 2. Generar Hash para el Admin (Password: 'admin123')
    // El sistema de login espera hashes, no texto plano.
    const adminPassword = await bcrypt.hash('admin123', 10);

    // 3. Estructura de Datos (Seed Data)
    const seedData = {
        users: [
            {
                id: "admin-master-001",
                name: "El Canciller",
                email: "admin@lacupula.una.py",
                password: adminPassword,
                role: "admin",
                status: "active",
                guildId: null,
                photoUrl: null,
                joinedAt: new Date().toISOString()
            }
        ],
        guilds: [
            {
                id: "gremio-iuris",
                name: "MOVIMIENTO IURIS",
                leaderId: "lid-001", 
                description: "Excelencia académica y tradición jurídica. El movimiento de la verdadera élite intelectual.",
                status: "Oficial",
                color: "#1e3a8a" // Azul oscuro
            },
            {
                id: "gremio-fer",
                name: "FRENTE RENOVADOR",
                leaderId: "lid-002",
                description: "La fuerza del cambio. Política de impacto y reforma estatutaria.",
                status: "Oposicion",
                color: "#b91c1c" // Rojo
            },
            {
                id: "gremio-ali",
                name: "ALIANZA INDEPENDIENTE",
                leaderId: "lid-003",
                description: "Sin ataduras políticas. Representación gremial pura para el estudiante.",
                status: "En Formación",
                color: "#047857" // Verde
            }
        ],
        news: [
            {
                id: 101,
                title: "Tensión en el Consejo Directivo: Se debate el nuevo reglamento de cátedras",
                content: "Fuentes internas confirman que la sesión de anoche se extendió hasta la madrugada. Los movimientos estudiantiles exigen transparencia en la asignación de docentes auxiliares para el semestre 2026.",
                date: new Date().toISOString(),
                isPublic: true,
                author: "Redacción Política"
            },
            {
                id: 102,
                title: "Elecciones 2026: IURIS presenta oficialmente a sus candidatos",
                content: "En un evento cerrado en el Aula Magna, el movimiento oficialista definió su lista para el Centro de Estudiantes. Prometen mantener la hegemonía política un año más.",
                date: new Date(Date.now() - 86400000).toISOString(), // Ayer
                isPublic: true,
                author: "Redacción Política"
            },
            {
                id: 103,
                title: "[RESTRINGIDO] Estrategia de Coalición para Octubre",
                content: "CONTENIDO PRIVADO: Solo miembros de la Cúpula pueden leer esto. Se discuten alianzas estratégicas con la facultad de Economía.",
                date: new Date(Date.now() - 172800000).toISOString(), // Anteayer
                isPublic: false, // Privada
                author: "El Canciller"
            }
        ],
        sessions: []
    };

    // 4. Escribir archivo
    fs.writeFileSync(DB_PATH, JSON.stringify(seedData, null, 2));

    console.log("✅ BASE DE DATOS CREADA EN: " + DB_PATH);
    console.log("✅ USUARIO ADMIN CREADO:");
    console.log("   User: admin@lacupula.una.py");
    console.log("   Pass: admin123");
    console.log("\nSistema listo para despliegue.");
};

init();