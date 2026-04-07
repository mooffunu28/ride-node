const express = require('express');

module.exports = (getPool) => {
    const router = express.Router();

    
    router.get('/', async (req, res) => {
        try {
            const pool = getPool();
            const [rows] = await pool.query('SELECT * FROM riesgo ORDER BY fecha DESC');
            res.json(rows);
        } catch (error) {
            console.error('Error al obtener riesgos:', error.message);
            res.status(500).json({ error: error.message });
        }
    });

    
    router.get('/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const pool = getPool();
            const [rows] = await pool.query('SELECT * FROM riesgo WHERE id = ?', [id]);
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Reporte no encontrado' });
            }
            res.json(rows[0]);
        } catch (error) {
            console.error('Error al obtener riesgo:', error.message);
            res.status(500).json({ error: error.message });
        }
    });


    router.post('/', async (req, res) => {
        const { nivel, ubicacion, descripcion } = req.body;
        try {
            const pool = getPool();
            const [result] = await pool.query(
                'INSERT INTO riesgo (nivel, ubicacion, descripcion) VALUES (?, ?, ?)',
                [nivel, ubicacion, descripcion]
            );
            res.status(201).json({ id: result.insertId, message: 'Reporte de riesgo creado' });
        } catch (error) {
            console.error('Error al crear reporte de riesgo:', error.message);
            res.status(500).json({ error: error.message });
        }
    });

    
    router.put('/:id', async (req, res) => {
        const { id } = req.params;
        const { nivel, ubicacion, descripcion } = req.body;
        try {
            const pool = getPool();
            const [result] = await pool.query(
                'UPDATE riesgo SET nivel = ?, ubicacion = ?, descripcion = ? WHERE id = ?',
                [nivel, ubicacion, descripcion, id]
            );
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Reporte no encontrado' });
            }
            res.json({ message: 'Reporte actualizado' });
        } catch (error) {
            console.error('Error al actualizar reporte:', error.message);
            res.status(500).json({ error: error.message });
        }
    });

    
    router.delete('/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const pool = getPool();
            const [result] = await pool.query('DELETE FROM riesgo WHERE id = ?', [id]);
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Reporte no encontrado' });
            }
            res.json({ message: 'Reporte eliminado' });
        } catch (error) {
            console.error('Error al eliminar reporte:', error.message);
            res.status(500).json({ error: error.message });
        }
    });

    return router;
};