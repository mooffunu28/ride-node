const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.get('/', async (req, res) => {
    try {
        const { tipo, q, idioma = 'es' } = req.query;
        
        let sql = `
            SELECT id_norma, art_num, tipo_multa,
                   desc_es, desc_en
            FROM normas_transito 
            WHERE 1=1
        `;
        const params = [];
        
  
        if (tipo && tipo !== 'todos') {
            sql += ` AND (tipo_vehiculo = ? OR tipo_vehiculo = 'Ambos')`;
            let tipoVehiculo = tipo === 'moto' ? 'Moto' : (tipo === 'bicicleta' ? 'Cicla' : tipo);
            params.push(tipoVehiculo);
        }
        
        
        if (q) {
            sql += ` AND (desc_es LIKE ? OR desc_en LIKE ? OR art_num LIKE ?)`;
            params.push(`%${q}%`, `%${q}%`, `%${q}%`);
        }
        
        sql += ` ORDER BY CAST(art_num AS UNSIGNED)`;
        
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