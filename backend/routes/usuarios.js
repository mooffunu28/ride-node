const express = require('express');
const router = express.Router();
const db = require('../db/connection');


router.post('/registrar', async (req, res) => {
    try {
        const { nombre, correo, edad, tipo_vehiculo, cil_val, mensaje_mot } = req.body;
        
       
        if (!nombre || !correo || !edad || !tipo_vehiculo) {
            return res.status(400).json({ 
                success: false, 
                error: 'Nombre, correo, edad y tipo de vehículo son obligatorios' 
            });
        }
        
        if (edad < 16) {
            return res.status(400).json({ 
                success: false, 
                error: 'Debes tener al menos 16 años para usar esta plataforma' 
            });
        }
        

        const [existe] = await db.query(
            'SELECT id_usuario FROM usuario WHERE correo = ?',
            [correo]
        );
        
        if (existe.length > 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'Este correo ya está registrado' 
            });
        }
        

        const [result] = await db.query(
            `INSERT INTO usuario (nombre, correo, edad, tipo_vehiculo, cil_val, mensaje_mot, fecha_rev) 
             VALUES (?, ?, ?, ?, ?, ?, CURDATE())`,
            [nombre, correo, edad, tipo_vehiculo, cil_val || null, mensaje_mot || null]
        );
        

        const mensajeBienvenida = mensaje_mot || `¡Bienvenido ${nombre}! Recuerda: tu seguridad es lo primero. 🛡️`;
        
        res.json({
            success: true,
            message: 'Usuario registrado exitosamente',
            usuario_id: result.insertId,
            mensaje_bienvenida: mensajeBienvenida
        });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const [rows] = await db.query(
            `SELECT id_usuario, nombre, correo, edad, tipo_vehiculo, cil_val, mensaje_mot, fecha_rev
             FROM usuario WHERE id_usuario = ?`,
            [id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
        }
        
        res.json({ success: true, data: rows[0] });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});


router.get('/buscar/email/:correo', async (req, res) => {
    try {
        const { correo } = req.params;
        
        const [rows] = await db.query(
            `SELECT id_usuario, nombre, correo, edad, tipo_vehiculo, cil_val, mensaje_mot, fecha_rev
             FROM usuario WHERE correo = ?`,
            [correo]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
        }
        
        res.json({ success: true, data: rows[0] });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, edad, tipo_vehiculo, cil_val, mensaje_mot } = req.body;
        
        const [result] = await db.query(
            `UPDATE usuario 
             SET nombre = ?, edad = ?, tipo_vehiculo = ?, cil_val = ?, mensaje_mot = ?, fecha_rev = CURDATE()
             WHERE id_usuario = ?`,
            [nombre, edad, tipo_vehiculo, cil_val || null, mensaje_mot || null, id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
        }
        
        res.json({ success: true, message: 'Usuario actualizado correctamente' });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;