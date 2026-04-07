const express = require('express');

module.exports = (getPool) => {
    const router = express.Router();


    router.get('/usuario/:usuarioId', async (req, res) => {
        const { usuarioId } = req.params;
        try {
            const pool = getPool();
            const [rows] = await pool.query(
                'SELECT * FROM notificaciones WHERE usuario_id = ? ORDER BY creado_en DESC',
                [usuarioId]
            );
            res.json(rows);
        } catch (error) {
            console.error('Error al obtener notificaciones:', error.message);
            res.status(500).json({ error: error.message });
        }
    });

    
    router.get('/usuario/:usuarioId/no-leidas', async (req, res) => {
        const { usuarioId } = req.params;
        try {
            const pool = getPool();
            const [rows] = await pool.query(
                'SELECT * FROM notificaciones WHERE usuario_id = ? AND leida = FALSE ORDER BY creado_en DESC',
                [usuarioId]
            );
            res.json(rows);
        } catch (error) {
            console.error('Error al obtener notificaciones no leídas:', error.message);
            res.status(500).json({ error: error.message });
        }
    });

    
    router.post('/', async (req, res) => {
        const { usuario_id, mensaje } = req.body;
        try {
            const pool = getPool();
            const [result] = await pool.query(
                'INSERT INTO notificaciones (usuario_id, mensaje) VALUES (?, ?)',
                [usuario_id, mensaje]
            );
            res.status(201).json({ id: result.insertId, message: 'Notificación creada' });
        } catch (error) {
            console.error('Error al crear notificación:', error.message);
            res.status(500).json({ error: error.message });
        }
    });

    
    router.put('/:id/leer', async (req, res) => {
        const { id } = req.params;
        try {
            const pool = getPool();
            const [result] = await pool.query(
                'UPDATE notificaciones SET leida = TRUE WHERE id = ?',
                [id]
            );
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Notificación no encontrada' });
            }
            res.json({ message: 'Notificación marcada como leída' });
        } catch (error) {
            console.error('Error al marcar notificación:', error.message);
            res.status(500).json({ error: error.message });
        }
    });

   
    router.put('/usuario/:usuarioId/leer-todas', async (req, res) => {
        const { usuarioId } = req.params;
        try {
            const pool = getPool();
            await pool.query(
                'UPDATE notificaciones SET leida = TRUE WHERE usuario_id = ? AND leida = FALSE',
                [usuarioId]
            );
            res.json({ message: 'Todas las notificaciones marcadas como leídas' });
        } catch (error) {
            console.error('Error al marcar notificaciones:', error.message);
            res.status(500).json({ error: error.message });
        }
    });

    
    router.delete('/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const pool = getPool();
            const [result] = await pool.query('DELETE FROM notificaciones WHERE id = ?', [id]);
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Notificación no encontrada' });
            }
            res.json({ message: 'Notificación eliminada' });
        } catch (error) {
            console.error('Error al eliminar notificación:', error.message);
            res.status(500).json({ error: error.message });
        }
    });

    return router;
};