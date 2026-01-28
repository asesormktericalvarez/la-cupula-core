const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Configuración de rutas
const DATA_DIR = path.join(__dirname, '../data');
const DB_PATH = path.join(DATA_DIR, 'database.json');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');

const init = async () => {
    console.log("⚠️  INICIANDO PROTOCOLO IMPERIUM v3.0 (Génesis de Datos)...");

    // 1. Crear directorios si no existen
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
    if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);

    // 2. Generar Hash para Usuarios Base
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    // 3. Estructura de Datos (Schema Relacional Simulado)
    const seedData = {
        users: [
            {
                id: "usr-admin-001",
                name: "El Canciller",
                email: "admin@lacupula.una.py",
                password: adminPassword,
                role: "admin", // Rol del sistema (admin/user)
                
                // --- NUEVA ARQUITECTURA DE PODER ---
                guildId: "gremio-iuris", // Vinculación por ID
                rankId: "rank-iuris-lider", // ID del rango dentro del gremio
                
                influence: 100,
                contributions: 50,
                ciPhoto: null,
                joinedAt: new Date().toISOString()
            },
            {
                id: "usr-free-001",
                name: "Estudiante Libre",
                email: "libre@derecho.una.py",
                password: userPassword,
                role: "user",
                
                // Usuario sin afiliación (Mercenario político)
                guildId: null,
                rankId: null,
                
                influence: 10,
                contributions: 0,
                ciPhoto: null,
                joinedAt: new Date().toISOString()
            }
        ],
        
        guilds: [
            {
                id: "gremio-iuris",
                name: "MOVIMIENTO IURIS",
                description: "Excelencia académica y tradición jurídica. El movimiento de la verdadera élite intelectual.",
                mission: "Mantener la hegemonía académica mediante el control estricto de las cátedras.",
                leaderId: "usr-admin-001", // Referencia al dueño
                foundedAt: new Date().toISOString(),
                colors: {
                    primary: "#1e3a8a", // Azul oscuro
                    secondary: "#d4af37" // Dorado
                },
                
                // SISTEMA DE RANGOS (RBAC - Role Based Access Control)
                ranks: [
                    {
                        id: "rank-iuris-lider",
                        name: "Líder Supremo",
                        level: 99, // Nivel jerárquico (mayor es más poder)
                        permissions: ["ALL"] // Acceso total
                    },
                    {
                        id: "rank-iuris-operador",
                        name: "Operador Político",
                        level: 50,
                        permissions: ["VIEW_INTEL", "RECRUIT_MEMBERS", "POST_INTEL"]
                    },
                    {
                        id: "rank-iuris-miembro",
                        name: "Miembro Oficial",
                        level: 10,
                        permissions: ["VIEW_INTEL"]
                    }
                ],

                // COLA DE SOLICITUDES (Burocracia)
                applicants: [
                    // Aquí irán los objetos { userId, ciPhoto, appliedAt, status: 'pending' }
                ]
            },
            {
                id: "gremio-fer",
                name: "FRENTE RENOVADOR",
                description: "La fuerza del cambio. Política de impacto y reforma estatutaria.",
                mission: "Derrocar a la vieja escuela y renovar el estatuto.",
                leaderId: "npc-fer-leader", 
                foundedAt: new Date().toISOString(),
                colors: {
                    primary: "#b91c1c", // Rojo
                    secondary: "#ffffff"
                },
                ranks: [
                    {
                        id: "rank-fer-lider",
                        name: "Secretario General",
                        level: 99,
                        permissions: ["ALL"]
                    },
                    {
                        id: "rank-fer-militante",
                        name: "Militante",
                        level: 10,
                        permissions: ["VIEW_INTEL"]
                    }
                ],
                applicants: []
            }
        ],

        // SISTEMA DE INTELIGENCIA (NOTICIAS SEGMENTADAS)
        news: [
            {
                id: 101,
                guildId: null, // NULL = GLOBAL (Visible para todos)
                title: "Tensión en el Consejo Directivo",
                content: "El Consejo ha llamado a cuarto intermedio. Se definen las fechas de exámenes finales.",
                date: new Date().toISOString(),
                author: "Redacción Central"
            },
            {
                id: 102,
                guildId: "gremio-iuris", // SOLO PARA MIEMBROS DE IURIS
                title: "[CLASIFICADO] Orden de Voto - Martes",
                content: "Todos los miembros deben votar EN CONTRA de la moción del FER. Sin excepciones.",
                date: new Date().toISOString(),
                author: "El Canciller"
            }
        ],
        
        system_logs: []
    };

    // 4. Escribir archivo (Sobreescritura total)
    fs.writeFileSync(DB_PATH, JSON.stringify(seedData, null, 2));

    console.log("✅ BASE DE DATOS REINICIADA (v3.0)");
    console.log("   Ubicación: " + DB_PATH);
    console.log("   Admin User: admin@lacupula.una.py (Pass: admin123)");
    console.log("   Free User:  libre@derecho.una.py (Pass: user123)");
    console.log("\nProtocolo Imperium activo. Esperando conexión del Backend.");
};

init();