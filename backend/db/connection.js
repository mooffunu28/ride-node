const mysql = require('mysql2/promise');
require('dotenv').config();

console.log('========================================');
console.log('🔍 DIAGNÓSTICO DE CONEXIÓN A MYSQL');
console.log('========================================');
console.log('MYSQLHOST:', process.env.MYSQLHOST || 'No definido');
console.log('MYSQLPORT:', process.env.MYSQLPORT || 'No definido');
console.log('MYSQLUSER:', process.env.MYSQLUSER || 'No definido');
console.log('MYSQLDATABASE:', process.env.MYSQLDATABASE || 'No definido');
console.log('MYSQLPASSWORD:', process.env.MYSQLPASSWORD ? '✅ Definida' : '❌ No definida');
console.log('========================================');

const pool = mysql.createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: parseInt(process.env.MYSQLPORT || '3306'),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 30000
});

async function testConnection() {
    try {
        console.log('🔄 Intentando conectar a MySQL...');
        const connection = await pool.getConnection();
        console.log('✅ Conexión a MySQL establecida correctamente');
        connection.release();
    } catch (error) {
        console.error('❌ Error de conexión a MySQL:');
        console.error('Código:', error.code);
        console.error('Mensaje:', error.message);
        console.error('Host:', error.host || process.env.MYSQLHOST);
        console.error('Puerto:', error.port || process.env.MYSQLPORT);
    }
}

testConnection();

module.exports = pool;