const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.post('/calcular', async (req, res) => {
    try {
        const { velocidad, distancia, clima, tipoVia, chequeo, tipo_vehiculo, id_usuario, idioma = 'es' } = req.body;
        
        let puntaje = 0;
        let factores = [];
        let recomendaciones = [];
        
        // Mapeo de nombres de componentes a las claves esperadas
        const tieneCasco = chequeo['Casco'] === true;
        const tieneFrenos = chequeo['Frenos Delanteros'] === true || chequeo['Frenos Traseros'] === true || chequeo['Frenos'] === true;
        const tieneLuces = chequeo['Luces Delanteras'] === true || chequeo['Luces Traseras'] === true || chequeo['Luces'] === true;
        const tieneReflectivos = chequeo['Chaleco Reflectivo'] === true || chequeo['Reflectivos'] === true;
        const tieneEspejos = chequeo['Espejos Retrovisores'] === true;
        const tieneNeumaticos = chequeo['Neumáticos'] === true;
        
        // 1. FACTORES DEL CHEQUEO PREVENTIVO (PESO ALTO)
        if (!tieneCasco) {
            puntaje += 40;
            factores.push(idioma === 'es' ? '❌ CASCO: No verificado o en mal estado' : '❌ HELMET: Not verified or in bad condition');
            recomendaciones.push(idioma === 'es' ? '🚨 Usar casco certificado puede salvar tu vida' : '🚨 Wearing a certified helmet can save your life');
        }
        
        if (!tieneFrenos) {
            puntaje += 35;
            factores.push(idioma === 'es' ? '❌ FRENOS: No verificados' : '❌ BRAKES: Not verified');
            recomendaciones.push(idioma === 'es' ? '🔧 Revisa tus frenos antes de cualquier salida' : '🔧 Check your brakes before any ride');
        }
        
        if (!tieneNeumaticos && distancia > 10) {
            puntaje += 20;
            factores.push(idioma === 'es' ? '❌ NEUMÁTICOS: Estado no verificado para viaje largo' : '❌ TYRES: Condition not verified for long trip');
            recomendaciones.push(idioma === 'es' ? '🛞 Verifica presión y dibujo de los neumáticos' : '🛞 Check tyre pressure and tread');
        }
        
        // 2. FACTORES DE VISIBILIDAD (dependen del clima)
        if ((clima === 'noche' || clima === 'niebla') && !tieneLuces) {
            puntaje += 30;
            factores.push(idioma === 'es' ? '❌ LUCES: No funcionan para circular de noche/niebla' : '❌ LIGHTS: Not working for night/fog riding');
            recomendaciones.push(idioma === 'es' ? '💡 Instala y verifica tus luces antes de salir' : '💡 Install and check your lights before riding');
        }
        
        if ((clima === 'noche' || clima === 'niebla') && !tieneReflectivos) {
            puntaje += 15;
            factores.push(idioma === 'es' ? '⚠️ REFLECTIVOS: No tienes elementos reflectivos para poca visibilidad' : '⚠️ REFLECTIVE: No reflective elements for low visibility');
            recomendaciones.push(idioma === 'es' ? '🦺 Usa chaleco o bandas reflectivas' : '🦺 Use reflective vest or bands');
        }
        
        // 3. FACTORES DE VÍA
        if (tipoVia === 'carretera') {
            puntaje += 25;
            factores.push(idioma === 'es' ? '⚠️ CARRETERA: Vehículos a alta velocidad' : '⚠️ HIGHWAY: High speed vehicles');
            recomendaciones.push(idioma === 'es' ? '🚨 Extremar precauciones, mantener distancia' : '🚨 Take extreme precautions, keep distance');
        } else if (tipoVia === 'rural') {
            puntaje += 10;
            factores.push(idioma === 'es' ? '⚠️ Vía rural: Menor iluminación y posible mal estado' : '⚠️ Rural road: Less lighting and possible poor condition');
            recomendaciones.push(idioma === 'es' ? '🔦 Lleva luces potentes y herramientas adicionales' : '🔦 Bring powerful lights and additional tools');
        }
        
        // 4. FACTORES CLIMÁTICOS
        if (clima === 'lluvia') {
            puntaje += 25;
            factores.push(idioma === 'es' ? '⚠️ Lluvia: Pavimento mojado reduce adherencia' : '⚠️ Rain: Wet pavement reduces grip');
            recomendaciones.push(idioma === 'es' ? '☔ Reduce velocidad y aumenta distancia de frenado' : '☔ Reduce speed and increase braking distance');
        } else if (clima === 'niebla') {
            puntaje += 30;
            factores.push(idioma === 'es' ? '⚠️ Niebla: Visibilidad severamente reducida' : '⚠️ Fog: Severely reduced visibility');
            recomendaciones.push(idioma === 'es' ? '🌫️ Considera posponer el viaje hasta que mejore la visibilidad' : '🌫️ Consider postponing the trip until visibility improves');
        } else if (clima === 'noche') {
            puntaje += 10;
            factores.push(idioma === 'es' ? '🌙 Noche: Visibilidad reducida' : '🌙 Night: Reduced visibility');
            recomendaciones.push(idioma === 'es' ? '💡 Usa luces y chaleco reflectivo' : '💡 Use lights and reflective vest');
        }
        
        // 5. FACTOR DISTANCIA (Fatiga)
        if (distancia > 300) {
            puntaje += 20;
            factores.push(idioma === 'es' ? `📏 Distancia EXTREMA: ${distancia} km (alto riesgo de fatiga)` : `📏 EXTREME distance: ${distancia} km (high risk of fatigue)`);
            recomendaciones.push(idioma === 'es' ? '🛑 Planifica descansos cada 2 horas' : '🛑 Plan breaks every 2 hours');
        } else if (distancia > 150) {
            puntaje += 12;
            factores.push(idioma === 'es' ? `📏 Distancia larga: ${distancia} km` : `📏 Long distance: ${distancia} km`);
            recomendaciones.push(idioma === 'es' ? '🧴 Lleva agua, alimentos y revisa combustible' : '🧴 Bring water, food and check fuel');
        } else if (distancia > 50) {
            puntaje += 5;
            factores.push(idioma === 'es' ? `📏 Distancia moderada: ${distancia} km` : `📏 Moderate distance: ${distancia} km`);
        }
        
        // 6. VELOCIDAD (máx 60 urbana, 80 rural, 100 carretera)
        let limiteVelocidad = 60;
        if (tipoVia === 'rural') limiteVelocidad = 80;
        if (tipoVia === 'carretera') limiteVelocidad = 100;
        
        if (velocidad > limiteVelocidad) {
            const exceso = velocidad - limiteVelocidad;
            puntaje += Math.min(40, exceso * 2);
            factores.push(idioma === 'es' ? `⚠️ Velocidad: ${velocidad} km/h (excede el límite de ${limiteVelocidad} km/h para ${tipoVia})` : `⚠️ Speed: ${velocidad} km/h (exceeds ${limiteVelocidad} km/h limit for ${tipoVia})`);
            recomendaciones.push(idioma === 'es' ? `🐌 Reduce tu velocidad máxima a ${limiteVelocidad} km/h` : `🐌 Reduce your maximum speed to ${limiteVelocidad} km/h`);
        }
        
        // Determinar nivel
        let nivel, mensaje;
        
        if (puntaje >= 70) {
            nivel = 'critico';
            mensaje = idioma === 'es' ? '🚨 ¡ALTO RIESGO! NO realices este viaje hasta corregir los riesgos.' : '🚨 HIGH RISK! DO NOT take this trip until risks are corrected.';
        } else if (puntaje >= 40) {
            nivel = 'moderado';
            mensaje = idioma === 'es' ? '⚠️ Riesgo moderado. Toma las precauciones recomendadas.' : '⚠️ Moderate risk. Take recommended precautions.';
        } else if (puntaje >= 20) {
            nivel = 'leve';
            mensaje = idioma === 'es' ? 'ℹ️ Riesgo leve. Pequeñas mejoras aumentan tu seguridad.' : 'ℹ️ Low risk. Small improvements increase your safety.';
        } else {
            nivel = 'seguro';
            mensaje = idioma === 'es' ? '✅ ¡Viaje seguro! Recuerda siempre priorizar tu seguridad.' : '✅ Safe trip! Always prioritize your safety.';
        }
        
        res.json({
            success: true,
            nivel: nivel,
            puntaje: puntaje,
            mensaje: mensaje,
            factores: factores,
            recomendaciones: recomendaciones
        });
        
    } catch (error) {
        console.error('Error en /api/riesgo/calcular:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;