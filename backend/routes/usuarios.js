const express = require('express');
const router = express.Router();
const { getPool } = require('../db/connection');


router.get('/', async (req, res) => {
    try {
        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM usuarios');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener usuarios:', error.message);
        res.status(500).json({ error: error.message });
    }
});


router.post('/', async (req, res) => {
    const { nombre, email, telefono, tipo } = req.body;
    try {
        const pool = getPool();
        const [result] = await pool.query(
            'INSERT INTO usuarios (nombre, email, telefono, tipo) VALUES (?, ?, ?, ?)',
            [nombre, email, telefono, tipo]
        );
        res.status(201).json({ id: result.insertId, message: 'Usuario creado' });
    } catch (error) {
        console.error('Error al crear usuario:', error.message);
        res.status(500).json({ error: error.message });
    }
});


router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener usuario:', error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;