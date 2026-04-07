const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;


app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));


let pool = null;

function getPool() {
    if (!pool) {
        console.log('📡 Inicializando conexión a MySQL...');
        pool = mysql.createPool({
            host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
            user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
            password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
            database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'ride_db',
            port: process.env.MYSQLPORT || 3306,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }
    return pool.promise();
}

async function testConnection() {
    try {
        const pool = getPool();
        const [result] = await pool.query('SELECT 1');
        console.log('✅ Conexión a MySQL establecida correctamente');
        return true;
    } catch (error) {
        console.error('❌ Error de conexión a MySQL:', error.message);
        return false;
    }
}

const normasRoutes = require('./routes/normas')(getPool);
const usuariosRoutes = require('./routes/usuarios')(getPool);
const riesgoRoutes = require('./routes/riesgo')(getPool);
const chequeoRoutes = require('./routes/chequeo')(getPool);
const notificacionesRoutes = require('./routes/notificaciones')(getPool);


app.use('/api/normas', normasRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/riesgo', riesgoRoutes);
app.use('/api/chequeo', chequeoRoutes);
app.use('/api/notificaciones', notificacionesRoutes);


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});


app.listen(PORT, async () => {
    console.log(`🚀 Servidor R.I.D.E. corriendo en:`);
    console.log(`   📱 Frontend: http://localhost:${PORT}`);
    console.log(`   🔌 API: http://localhost:${PORT}/api/normas`);
    console.log(`   👤 Usuarios: http://localhost:${PORT}/api/usuarios`);
    console.log(`   📊 Riesgo: http://localhost:${PORT}/api/riesgo`);
    console.log(`   🔧 Chequeo: http://localhost:${PORT}/api/chequeo`);
    console.log(`   🔔 Notificaciones: http://localhost:${PORT}/api/notificaciones`);
    console.log(`   Presiona Ctrl+C para detener`);
    await testConnection();});

module.exports = app;