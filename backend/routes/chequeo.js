const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.get('/', async (req, res) => {
    try {
        const { tipo, idioma = 'es' } = req.query;
        
        console.log('📥 [CHEQUEO] Request recibido:', { tipo, idioma });
        
        if (!tipo) {
            return res.status(400).json({ 
                success: false, 
                error: 'Se requiere especificar tipo de vehículo (Moto o Cicla)' 
            });
        }
        
        let tipoVehiculo = tipo === 'moto' ? 'Moto' : (tipo === 'bicicleta' ? 'Cicla' : tipo);
        
        
        let selectFields = 'id_comp, nom_comp, estado_opt, prioridad, tipo_veh';
        
        if (idioma === 'en') {
            selectFields = `
                id_comp, 
                COALESCE(nom_comp_en, nom_comp) AS nom_comp,
                COALESCE(estado_opt_en, estado_opt) AS estado_opt,
                COALESCE(prioridad_en, prioridad) AS prioridad,
                tipo_veh
            `;
        }
        
        const query = `
            SELECT ${selectFields}
            FROM componentes_seguridad 
            WHERE tipo_veh = ? OR tipo_veh = 'Ambos'
            ORDER BY FIELD(prioridad, 'Alta', 'Media', 'Baja')
        `;
        
        console.log('📝 [CHEQUEO] Query:', query);
        console.log('📝 [CHEQUEO] Params:', [tipoVehiculo]);
        
        const [componentes] = await db.query(query, [tipoVehiculo]);
        
        console.log(`📊 [CHEQUEO] Encontrados ${componentes.length} componentes`);
        if (componentes.length > 0) {
            console.log('📝 [CHEQUEO] Primer componente:', JSON.stringify(componentes[0]));
        }
        
        const data = componentes.map(c => ({
            id_comp: c.id_comp,
            nom_comp: c.nom_comp,
            estado_opt: c.estado_opt || (idioma === 'en' ? 'No description available' : 'Sin descripción'),
            prioridad: c.prioridad
        }));
        
        res.json({ success: true, data: data });
        
    } catch (error) {
        console.error('❌ [CHEQUEO] Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;