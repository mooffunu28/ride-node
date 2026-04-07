const express = require('express');
const router = express.Router();
const db = require('../db/connection');


router.get('/:id_usuario', async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const { limite = 10 } = req.query;
        
        const [notificaciones] = await db.query(
            `SELECT id_notif, mensaje, nivel_urgencia, fecha_hora
             FROM notificaciones_historial 
             WHERE id_usuario = ?
             ORDER BY fecha_hora DESC
             LIMIT ?`,
            [id_usuario, parseInt(limite)]
        );
        
        res.json({ success: true, data: notificaciones });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});


router.post('/', async (req, res) => {
    try {
        const { id_usuario, mensaje, nivel_urgencia } = req.body;
        
        if (!id_usuario || !mensaje) {
            return res.status(400).json({ success: false, error: 'Faltan datos requeridos' });
        }
        
        const [result] = await db.query(
            `INSERT INTO notificaciones_historial (id_usuario, mensaje, nivel_urgencia) 
             VALUES (?, ?, ?)`,
            [id_usuario, mensaje, nivel_urgencia || 'Medio']
        );
        
        res.json({ 
            success: true, 
            message: 'Notificación creada',
            id_notif: result.insertId
        });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});


router.delete('/limpiar/:id_usuario', async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const { dias = 30 } = req.query;
        
        const [result] = await db.query(
            `DELETE FROM notificaciones_historial 
             WHERE id_usuario = ? AND fecha_hora < DATE_SUB(NOW(), INTERVAL ? DAY)`,
            [id_usuario, parseInt(dias)]
        );
        
        res.json({ 
            success: true, 
            message: `Se eliminaron ${result.affectedRows} notificaciones antiguas`
        });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;