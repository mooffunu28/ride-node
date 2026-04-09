const db = require('../db/connection');
const bcrypt = require('bcryptjs');

class User {
    // Buscar usuario por correo
    static async findByEmail(correo) {
        const [rows] = await db.query(
            'SELECT id_usuario, nombre, correo, password, edad, tipo_vehiculo, cil_val, fecha_rev FROM usuario WHERE correo = ?',
            [correo]
        );
        return rows[0] || null;
    }

    // Buscar usuario por ID
    static async findById(id) {
        const [rows] = await db.query(
            'SELECT id_usuario, nombre, correo, edad, tipo_vehiculo, cil_val, fecha_rev FROM usuario WHERE id_usuario = ?',
            [id]
        );
        return rows[0] || null;
    }

    // Crear nuevo usuario
    static async create(userData) {
        const { nombre, correo, password, edad, tipo_vehiculo, cil_val } = userData;
        
        // Hashear contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await db.query(
            `INSERT INTO usuario (nombre, correo, password, edad, tipo_vehiculo, cil_val) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [nombre, correo, hashedPassword, edad, tipo_vehiculo, cil_val || null]
        );
        
        return result.insertId;
    }

    // Verificar contraseña
    static async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = User;