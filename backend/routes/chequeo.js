const express = require('express');

module.exports = (getPool) => {
    const router = express.Router();

   
    router.get('/', async (req, res) => {
        try {
            const pool = getPool();
            const [rows] = await pool.query(`
                SELECT c.*, u.nombre as usuario_nombre 
                FROM chequeo c 
                LEFT JOIN usuarios u ON c.usuario_id = u.id 
                ORDER BY c.fecha DESC
            `);
            res.json(rows);
        } catch (error) {
            console.error('Error al obtener chequeos:', error.message);
            res.status(500).json({ error: error.message });
        }
    });

    
    router.get('/usuario/:usuarioId', async (req, res) => {
        const { usuarioId } = req.params;
        try {
            const pool = getPool();
            const [rows] = await pool.query(
                'SELECT * FROM chequeo WHERE usuario_id = ? ORDER BY fecha DESC',
                [usuarioId]
            );
            res.json(rows);
        } catch (error) {
            console.error('Error al obtener chequeos del usuario:', error.message);
            res.status(500).json({ error: error.message });
        }
    });

    
    router.post('/', async (req, res) => {
        const { usuario_id, tipo_vehiculo, estado } = req.body;
        try {
            const pool = getPool();
            const [result] = await pool.query(
                'INSERT INTO chequeo (usuario_id, tipo_vehiculo, estado) VALUES (?, ?, ?)',
                [usuario_id, tipo_vehiculo, estado || 'pendiente']
            );
            res.status(201).json({ id: result.insertId, message: 'Chequeo registrado' });
        } catch (error) {
            console.error('Error al crear chequeo:', error.message);
            res.status(500).json({ error: error.message });
        }
    });

    
    router.put('/:id', async (req, res) => {
        const { id } = req.params;
        const { estado } = req.body;
        try {
            const pool = getPool();
            const [result] = await pool.query(
                'UPDATE chequeo SET estado = ? WHERE id = ?',
                [estado, id]
            );
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Chequeo no encontrado' });
            }
            res.json({ message: 'Chequeo actualizado' });
        } catch (error) {
            console.error('Error al actualizar chequeo:', error.message);
            res.status(500).json({ error: error.message });
        }
    });

    
    router.delete('/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const pool = getPool();
            const [result] = await pool.query('DELETE FROM chequeo WHERE id = ?', [id]);
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Chequeo no encontrado' });
            }
            res.json({ message: 'Chequeo eliminado' });
        } catch (error) {
            console.error('Error al eliminar chequeo:', error.message);
            res.status(500).json({ error: error.message });
        }
    });

    return router;
};