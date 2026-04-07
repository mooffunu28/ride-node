const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ride_db',  
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

async function testConnection() {
    try {
        const [result] = await promisePool.query('SELECT 1');
        console.log('✅ Conexión a MySQL establecida correctamente');
    } catch (error) {
        console.error('❌ Error de conexión a MySQL:', error.message);
    }
}

testConnection();

module.exports = promisePool;