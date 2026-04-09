const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// GET /api/normas?tipo=moto&idioma=es
router.get('/', async (req, res) => {
    try {
        const { tipo, idioma = 'es' } = req.query;
        
        // Si no hay tipo, devolver todas las normas
        let sql = `
            SELECT id_norma, art_num, desc_es, desc_en, tipo_multa
            FROM normas_transito 
        `;
        const params = [];
        
        if (tipo && tipo !== 'todos') {
            // Para filtrar por tipo de vehículo necesitas agregar columna tipo_vehiculo
            // Por ahora devolvemos todas
        }
        
        sql += ` ORDER BY id_norma`;
        
        const [rows] = await db.query(sql, params);
        
        const data = rows.map(row => ({
            id_norma: row.id_norma,
            art_num: row.art_num,
            descripcion: idioma === 'en' ? row.desc_en : row.desc_es,
            tipo_multa: row.tipo_multa
        }));
        
        res.json({ success: true, data: data });
        
    } catch (error) {
        console.error('Error en /api/normas:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/normas/:id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { idioma = 'es' } = req.query;
        
        const [rows] = await db.query(
            `SELECT id_norma, art_num, tipo_multa, desc_es, desc_en
             FROM normas_transito WHERE id_norma = ?`,
            [id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Norma no encontrada' });
        }
        
        const row = rows[0];
        const data = {
            id_norma: row.id_norma,
            art_num: row.art_num,
            descripcion: idioma === 'en' ? row.desc_en : row.desc_es,
            tipo_multa: row.tipo_multa
        };
        
        res.json({ success: true, data: data });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;