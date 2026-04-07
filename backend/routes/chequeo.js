const express = require('express');
const router = express.Router();
const db = require('../db/connection');


router.get('/', async (req, res) => {
    try {
        const { tipo, idioma = 'es' } = req.query;
        
        if (!tipo) {
            return res.status(400).json({ 
                success: false, 
                error: 'Se requiere especificar tipo de vehículo (Moto o Cicla)' 
            });
        }
        
        let tipoVehiculo = tipo === 'moto' ? 'Moto' : 'Cicla';
        
        const [componentes] = await db.query(
            `SELECT id_comp, nom_comp, nom_comp_en, estado_opt, estado_opt_en, prioridad
             FROM componentes_seguridad 
             WHERE tipo_veh = ? OR tipo_veh = 'Ambos'
             ORDER BY FIELD(prioridad, 'Alta', 'Media', 'Baja')`,
            [tipoVehiculo]
        );
        
        const data = componentes.map(c => ({
            id_comp: c.id_comp,
            nom_comp: (idioma === 'en' && c.nom_comp_en) ? c.nom_comp_en : c.nom_comp,
            estado_opt: (idioma === 'en' && c.estado_opt_en) ? c.estado_opt_en : c.estado_opt,
            prioridad: c.prioridad,
            prioridad_text: traducirPrioridad(c.prioridad, idioma)
        }));
        
        res.json({ success: true, data: data });
        
    } catch (error) {
        console.error('Error en /api/chequeo:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});


function traducirPrioridad(prioridad, idioma) {
    if (idioma === 'en') {
        const prioridades = {
            'Alta': 'High',
            'Media': 'Medium',
            'Baja': 'Low'
        };
        return prioridades[prioridad] || prioridad;
    }
    return prioridad;
}


router.post('/verificar', async (req, res) => {
    try {
        const { componenteId, estado_actual, id_usuario, idioma = 'es' } = req.body;
        
        const [componente] = await db.query(
            `SELECT nom_comp, nom_comp_en, estado_opt, estado_opt_en, prioridad 
             FROM componentes_seguridad WHERE id_comp = ?`,
            [componenteId]
        );
        
        if (componente.length === 0) {
            const msg = idioma === 'en' ? 'Component not found' : 'Componente no encontrado';
            return res.status(404).json({ success: false, error: msg });
        }
        
        const nombreComponente = (idioma === 'en' && componente[0].nom_comp_en) 
            ? componente[0].nom_comp_en 
            : componente[0].nom_comp;
            
        const estadoOptimo = (idioma === 'en' && componente[0].estado_opt_en) 
            ? componente[0].estado_opt_en 
            : componente[0].estado_opt;
        
        let nivel_urgencia = 'Bajo';
        let nivel_urgencia_en = 'Low';
        let mensaje = '';
        let mensaje_en = '';
        
        if (estado_actual === 'malo') {
            nivel_urgencia = componente[0].prioridad === 'Alta' ? 'Crítico' : 'Alto';
            nivel_urgencia_en = componente[0].prioridad === 'Alta' ? 'Critical' : 'High';
            mensaje = `⚠️ ALERTA: Tu ${nombreComponente} necesita revisión. Estado óptimo: ${estadoOptimo}`;
            mensaje_en = `⚠️ ALERT: Your ${nombreComponente} needs revision. Optimal condition: ${estadoOptimo}`;
        } else if (estado_actual === 'regular') {
            nivel_urgencia = 'Medio';
            nivel_urgencia_en = 'Medium';
            mensaje = `ℹ️ Tu ${nombreComponente} está en estado regular. Recomendación: ${estadoOptimo}`;
            mensaje_en = `ℹ️ Your ${nombreComponente} is in regular condition. Recommendation: ${estadoOptimo}`;
        } else {
            mensaje = `✅ Tu ${nombreComponente} está en buen estado. ¡Sigue así!`;
            mensaje_en = `✅ Your ${nombreComponente} is in good condition. Keep it up!`;
        }
        
        
        if (id_usuario && estado_actual !== 'bueno') {
            await db.query(
                `INSERT INTO notificaciones_historial (id_usuario, mensaje, nivel_urgencia) 
                 VALUES (?, ?, ?)`,
                [id_usuario, mensaje, nivel_urgencia]
            );
        }
        
        res.json({
            success: true,
            componente: nombreComponente,
            estado_optimo: estadoOptimo,
            prioridad: componente[0].prioridad,
            mensaje: idioma === 'en' ? mensaje_en : mensaje,
            nivel_urgencia: idioma === 'en' ? nivel_urgencia_en : nivel_urgencia
        });
        
    } catch (error) {
        console.error('Error en /api/chequeo/verificar:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;