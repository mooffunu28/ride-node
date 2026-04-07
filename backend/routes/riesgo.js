const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.post('/calcular', async (req, res) => {
    try {
        const { velocidad, tipo_vehiculo, componentes, id_usuario, idioma = 'es' } = req.body;
        
        let puntaje = 0;
        let factores = [];
        let recomendaciones = [];
        let multasRelacionadas = [];
        
        if (tipo_vehiculo === 'Moto') {
            if (velocidad > 80) {
                puntaje += 50;
                factores.push(idioma === 'es' ? 'Velocidad extremadamente alta (>80km/h)' : 'Extremely high speed (>80km/h)');
                recomendaciones.push(idioma === 'es' ? '🚨 Reduce tu velocidad inmediatamente' : '🚨 Reduce your speed immediately');
                
                const [multas] = await db.query(
                    "SELECT art_num, desc_es FROM normas_transito WHERE desc_es LIKE '%velocidad%' OR desc_es LIKE '%exceso%' LIMIT 1"
                );
                if (multas.length > 0) multasRelacionadas.push(multas[0]);
            } else if (velocidad > 60) {
                puntaje += 25;
                factores.push(idioma === 'es' ? 'Velocidad moderadamente alta (>60km/h)' : 'Moderately high speed (>60km/h)');
                recomendaciones.push(idioma === 'es' ? '⚠️ Disminuye la velocidad en zonas urbanas' : '⚠️ Reduce speed in urban areas');
            }
        } else { 
            if (velocidad > 30) {
                puntaje += 40;
                factores.push(idioma === 'es' ? 'Velocidad extremadamente alta (>30km/h)' : 'Extremely high speed (>30km/h)');
                recomendaciones.push(idioma === 'es' ? '🚨 Reduce tu velocidad, máximo seguro 25km/h' : '🚨 Reduce your speed, safe maximum 25km/h');
            } else if (velocidad > 20) {
                puntaje += 15;
                factores.push(idioma === 'es' ? 'Velocidad moderadamente alta (>20km/h)' : 'Moderately high speed (>20km/h)');
            }
        }
        
 
        if (componentes) {
            if (!componentes.casco) {
                puntaje += 35;
                factores.push(idioma === 'es' ? 'No uso de casco' : 'Not wearing a helmet');
                recomendaciones.push(idioma === 'es' ? '🚨 CASCO OBLIGATORIO. Reduce un 70% el riesgo de muerte' : '🚨 HELMET MANDATORY. Reduces death risk by 70%');
                
                const [multas] = await db.query(
                    "SELECT art_num, desc_es FROM normas_transito WHERE desc_es LIKE '%casco%' LIMIT 1"
                );
                if (multas.length > 0) multasRelacionadas.push(multas[0]);
            }
            
            if (!componentes.luces) {
                puntaje += 25;
                factores.push(idioma === 'es' ? 'Sin luces funcionando' : 'No working lights');
                recomendaciones.push(idioma === 'es' ? '💡 Usa luces delantera y trasera. Sé visible' : '💡 Use front and rear lights. Be visible');
            }
            
            if (!componentes.frenos) {
                puntaje += 30;
                factores.push(idioma === 'es' ? 'Frenos en mal estado' : 'Brakes in poor condition');
                recomendaciones.push(idioma === 'es' ? '🔧 Revisa tus frenos antes de salir' : '🔧 Check your brakes before riding');
            }
            
            if (tipo_vehiculo === 'Cicla' && !componentes.reflectivos) {
                puntaje += 15;
                factores.push(idioma === 'es' ? 'Sin elementos reflectivos' : 'No reflective elements');
                recomendaciones.push(idioma === 'es' ? '🦺 Usa chaleco reflectivo o bandas reflectivas' : '🦺 Use reflective vest or reflective bands');
            }
            
            if (tipo_vehiculo === 'Moto' && !componentes.espejos) {
                puntaje += 10;
                factores.push(idioma === 'es' ? 'Espejos en mal estado o ausentes' : 'Mirrors in poor condition or missing');
                recomendaciones.push(idioma === 'es' ? '🔍 Ajusta tus espejos correctamente' : '🔍 Adjust your mirrors correctly');
            }
        }
        
       
        let nivel, color, mensaje;
        
        if (puntaje >= 70) {
            nivel = 'crítico';
            color = 'danger';
            mensaje = idioma === 'es' ? '🚨 ¡ALTO RIESGO! Detente ahora. Revisa tu vehículo.' : '🚨 HIGH RISK! Stop now. Check your vehicle.';
        } else if (puntaje >= 40) {
            nivel = 'moderado';
            color = 'warning';
            mensaje = idioma === 'es' ? '⚠️ Riesgo moderado. Toma precauciones.' : '⚠️ Moderate risk. Take precautions.';
        } else if (puntaje >= 20) {
            nivel = 'leve';
            color = 'info';
            mensaje = idioma === 'es' ? 'ℹ️ Riesgo leve. Pequeñas mejoras aumentan tu seguridad.' : 'ℹ️ Low risk. Small improvements increase your safety.';
        } else {
            nivel = 'seguro';
            color = 'success';
            mensaje = idioma === 'es' ? '✅ ¡Vas bien! Mantén estos hábitos.' : '✅ You are doing well! Keep these habits.';
        }
        

        if (id_usuario && puntaje >= 40) {
            await db.query(
                `INSERT INTO notificaciones_historial (id_usuario, mensaje, nivel_urgencia) 
                 VALUES (?, ?, ?)`,
                [id_usuario, mensaje, nivel === 'crítico' ? 'Crítico' : 'Alto']
            );
        }
        
        res.json({
            success: true,
            nivel,
            color,
            puntaje,
            mensaje,
            factores,
            recomendaciones,
            multas: multasRelacionadas
        });
        
    } catch (error) {
        console.error('Error en /api/riesgo/calcular:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;