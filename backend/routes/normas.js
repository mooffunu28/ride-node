const express = require('express');

module.exports = (getPool) => {
    const router = express.Router();

   
    router.get('/', async (req, res) => {
        try {
            const pool = getPool();
            const [rows] = await pool.query('SELECT * FROM normas ORDER BY id DESC');
            res.json(rows);
        } catch (error) {
            console.error('Error al obtener normas:', error.message);
            res.status(500).json({ error: error.message });
        }
    });

    
    router.get('/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const pool = getPool();
            const [rows] = await pool.query('SELECT * FROM normas WHERE id = ?', [id]);
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Norma no encontrada' });
            }
            res.json(rows[0]);
        } catch (error) {
            console.error('Error al obtener norma:', error.message);
            res.status(500).json({ error: error.message });
        }
    });

    
    router.post('/', async (req, res) => {
        const { titulo, descripcion, categoria } = req.body;
        try {
            const pool = getPool();
            const [result] = await pool.query(
                'INSERT INTO normas (titulo, descripcion, categoria) VALUES (?, ?, ?)',
                [titulo, descripcion, categoria]
            );
            res.status(201).json({ id: result.insertId, message: 'Norma creada' });
        } catch (error) {
            console.error('Error al crear norma:', error.message);
            res.status(500).json({ error: error.message });
        }
    });

    
    router.put('/:id', async (req, res) => {
        const { id } = req.params;
        const { titulo, descripcion, categoria } = req.body;
        try {
            const pool = getPool();
            const [result] = await pool.query(
                'UPDATE normas SET titulo = ?, descripcion = ?, categoria = ? WHERE id = ?',
                [titulo, descripcion, categoria, id]
            );
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Norma no encontrada' });
            }
            res.json({ message: 'Norma actualizada' });
        } catch (error) {
            console.error('Error al actualizar norma:', error.message);
            res.status(500).json({ error: error.message });
        }
    });

    router.delete('/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const pool = getPool();
            const [result] = await pool.query('DELETE FROM normas WHERE id = ?', [id]);
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Norma no encontrada' });
            }
            res.json({ message: 'Norma eliminada' });
        } catch (error) {
            console.error('Error al eliminar norma:', error.message);
            res.status(500).json({ error: error.message });
        }
    });

    return router;
};