const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// GET /api/chequeo?tipo=Cicla&idioma=es
router.get('/', async (req, res) => {
    try {
        const { tipo, idioma = 'es' } = req.query;
        
        if (!tipo) {
            return res.status(400).json({ 
                success: false, 
                error: 'Se requiere especificar tipo de vehículo (Moto o Cicla)' 
            });
        }
        
        // Convertir tipo a como está en la BD
        let tipoVehiculo = tipo === 'moto' ? 'Moto' : 'Cicla';
        
        const [componentes] = await db.query(
            `SELECT id_comp, nom_comp, estado_opt, prioridad
             FROM componentes_seguridad 
             WHERE tipo_veh = ?
             ORDER BY FIELD(prioridad, 'Alta', 'Media', 'Baja')`,
            [tipoVehiculo]
        );
        
        const data = componentes.map(c => ({
            id_comp: c.id_comp,
            nom_comp: c.nom_comp,
            estado_opt: c.estado_opt,
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

// POST /api/chequeo/verificar
router.post('/verificar', async (req, res) => {
    try {
        const { componenteId, estado_actual, id_usuario, idioma = 'es' } = req.body;
        
        const [componente] = await db.query(
            'SELECT nom_comp, estado_opt, prioridad FROM componentes_seguridad WHERE id_comp = ?',
            [componenteId]
        );
        
        if (componente.length === 0) {
            const msg = idioma === 'en' ? 'Component not found' : 'Componente no encontrado';
            return res.status(404).json({ success: false, error: msg });
        }
        
        const nombreComponente = componente[0].nom_comp;
        const estadoOptimo = componente[0].estado_opt;
        
        let nivel_urgencia = 'Bajo';
        let mensaje = '';
        
        if (estado_actual === 'malo') {
            nivel_urgencia = componente[0].prioridad === 'Alta' ? 'Crítico' : 'Alto';
            mensaje = `⚠️ ALERTA: Tu ${nombreComponente} necesita revisión. Estado óptimo: ${estadoOptimo}`;
        } else if (estado_actual === 'regular') {
            nivel_urgencia = 'Medio';
            mensaje = `ℹ️ Tu ${nombreComponente} está en estado regular. Recomendación: ${estadoOptimo}`;
        } else {
            mensaje = `✅ Tu ${nombreComponente} está en buen estado. ¡Sigue así!`;
        }
        
        // Guardar notificación si hay usuario
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
            mensaje: mensaje,
            nivel_urgencia: nivel_urgencia
        });
        
    } catch (error) {
        console.error('Error en /api/chequeo/verificar:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;