const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db/connection');

const JWT_SECRET = process.env.JWT_SECRET || 'mi_secreto_super_seguro';


router.post('/register', async (req, res) => {
    try {
        const { nombre, correo, password, edad, tipo_vehiculo, cil_val } = req.body;
        
        if (!nombre || !correo || !password || !edad || !tipo_vehiculo) {
            return res.status(400).json({ 
                success: false, 
                error: 'Todos los campos son requeridos' 
            });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await db.query(
            `INSERT INTO usuario (nombre, correo, password, edad, tipo_vehiculo, cil_val) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [nombre, correo, hashedPassword, edad, tipo_vehiculo, cil_val || null]
        );
        
        res.json({ 
            success: true, 
            message: 'Usuario registrado exitosamente',
            id_usuario: result.insertId
        });
        
    } catch (error) {
        console.error('Error en registro:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ 
                success: false, 
                error: 'El correo ya está registrado' 
            });
        }
        res.status(500).json({ success: false, error: error.message });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { correo, password } = req.body;
        
        if (!correo || !password) {
            return res.status(400).json({ 
                success: false, 
                error: 'Correo y contraseña son requeridos' 
            });
        }
        
        const [rows] = await db.query(
            'SELECT id_usuario, nombre, correo, password, edad, tipo_vehiculo FROM usuario WHERE correo = ?',
            [correo]
        );
        
        if (rows.length === 0) {
            return res.status(401).json({ 
                success: false, 
                error: 'Correo o contraseña incorrectos' 
            });
        }
        
        const user = rows[0];
        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            return res.status(401).json({ 
                success: false, 
                error: 'Correo o contraseña incorrectos' 
            });
        }
        
        const token = jwt.sign(
            { id: user.id_usuario, nombre: user.nombre, tipo_vehiculo: user.tipo_vehiculo },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            success: true,
            token: token,
            user: {
                id: user.id_usuario,
                nombre: user.nombre,
                correo: user.correo,
                edad: user.edad,
                tipo_vehiculo: user.tipo_vehiculo
            }
        });
        
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});


router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ success: false, error: 'Token no proporcionado' });
        }
        
        const decoded = jwt.verify(token, JWT_SECRET);
        
        const [rows] = await db.query(
            'SELECT id_usuario, nombre, correo, edad, tipo_vehiculo FROM usuario WHERE id_usuario = ?',
            [decoded.id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
        }
        
        res.json({ success: true, user: rows[0] });
        
    } catch (error) {
        console.error('Error en /me:', error);
        res.status(401).json({ success: false, error: 'Token inválido' });
    }
});

module.exports = router;