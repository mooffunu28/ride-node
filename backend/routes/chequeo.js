const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.get('/', async (req, res) => {
    try {
        const { tipo, idioma = 'es' } = req.query;
        
        console.log('🔍 Chequeo request:', { tipo, idioma });
        
        // Consulta simple sin filtrar por tipo primero para ver si hay datos
        const [todos] = await db.query('SELECT * FROM componentes_seguridad');
        console.log('📊 Total registros en BD:', todos.length);
        
        // Consulta filtrando por tipo
        let query = 'SELECT id_comp, nom_comp, estado_opt, prioridad, tipo_veh FROM componentes_seguridad';
        let params = [];
        
        if (tipo === 'Moto') {
            query += ' WHERE tipo_veh = ? OR tipo_veh = ?';
            params = ['Moto', 'Ambos'];
        } else if (tipo === 'Cicla') {
            query += ' WHERE tipo_veh = ? OR tipo_veh = ?';
            params = ['Cicla', 'Ambos'];
        }
        
        query += ' ORDER BY FIELD(prioridad, "Alta", "Media", "Baja")';
        
        const [rows] = await db.query(query, params);
        console.log('📊 Registros filtrados:', rows.length);
        
        res.json({ success: true, data: rows });
        
    } catch (error) {
        console.error('Error en /api/chequeo:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;