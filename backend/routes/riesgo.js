const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.post('/calcular', async (req, res) => {
    try {
        const { velocidad, distancia, clima, tipoVia, chequeo, tipo_vehiculo, id_usuario, idioma = 'es' } = req.body;
        
        let puntaje = 0;
        let factores = [];
        let recomendaciones = [];
        
        // ==================== MAPEO DE COMPONENTES ====================
        // Componentes de seguridad (todos los que aparecen en tu checklist)
        const tieneCasco = chequeo['Casco'] === true;
        const tieneFrenos = chequeo['Frenos'] === true || chequeo['Frenos Delanteros'] === true || chequeo['Frenos Traseros'] === true;
        const tieneFrenosDelanteros = chequeo['Frenos Delanteros'] === true;
        const tieneFrenosTraseros = chequeo['Frenos Traseros'] === true;
        const tieneLuces = chequeo['Luces'] === true || chequeo['Luces Delanteras'] === true || chequeo['Luces Traseras'] === true;
        const tieneLucesDelanteras = chequeo['Luces Delanteras'] === true;
        const tieneLucesTraseras = chequeo['Luces Traseras'] === true;
        const tieneNeumaticos = chequeo['Neumáticos'] === true;
        const tieneChaleco = chequeo['Chaleco Reflectivo'] === true;
        const tieneCadena = chequeo['Cadena'] === true;
        const tieneAceite = chequeo['Aceite'] === true;
        const tieneEspejos = chequeo['Espejos Retrovisores'] === true;
        
        // ==================== 1. FACTORES CRÍTICOS (PESO ALTO) ====================
        
        // CASCO (40 pts) - EL MÁS IMPORTANTE
        if (!tieneCasco) {
            puntaje += 40;
            factores.push(idioma === 'es' ? '❌ CASCO: No verificado o en mal estado' : '❌ HELMET: Not verified or in bad condition');
            recomendaciones.push(idioma === 'es' ? '🚨 Usar casco certificado puede salvar tu vida' : '🚨 Wearing a certified helmet can save your life');
        }
        
        // FRENOS (35 pts) - CRÍTICO
        if (!tieneFrenos) {
            puntaje += 35;
            factores.push(idioma === 'es' ? '❌ FRENOS: No verificados correctamente' : '❌ BRAKES: Not properly verified');
            recomendaciones.push(idioma === 'es' ? '🔧 Revisa frenos delanteros y traseros' : '🔧 Check front and rear brakes');
        } else {
            // Verificar frenos individuales si están presentes
            if (!tieneFrenosDelanteros && chequeo['Frenos Delanteros'] !== undefined) {
                puntaje += 15;
                factores.push(idioma === 'es' ? '⚠️ FRENOS DELANTEROS: No verificados' : '⚠️ FRONT BRAKES: Not verified');
            }
            if (!tieneFrenosTraseros && chequeo['Frenos Traseros'] !== undefined) {
                puntaje += 15;
                factores.push(idioma === 'es' ? '⚠️ FRENOS TRASEROS: No verificados' : '⚠️ REAR BRAKES: Not verified');
            }
        }
        
        // NEUMÁTICOS (25 pts)
        if (!tieneNeumaticos) {
            puntaje += 25;
            factores.push(idioma === 'es' ? '❌ NEUMÁTICOS: Estado no verificado' : '❌ TYRES: Condition not verified');
            recomendaciones.push(idioma === 'es' ? '🛞 Verifica presión y dibujo de los neumáticos' : '🛞 Check tyre pressure and tread');
        }
        
        // LUCES (depende del clima)
        if ((clima === 'noche' || clima === 'niebla') && !tieneLuces) {
            puntaje += 30;
            factores.push(idioma === 'es' ? '❌ LUCES: No funcionan para circular de noche/niebla' : '❌ LIGHTS: Not working for night/fog riding');
            recomendaciones.push(idioma === 'es' ? '💡 Verifica luces delantera y trasera' : '💡 Check front and rear lights');
        } else if ((clima === 'noche' || clima === 'niebla')) {
            // Verificar luces individuales
            if (!tieneLucesDelanteras && chequeo['Luces Delanteras'] !== undefined) {
                puntaje += 10;
                factores.push(idioma === 'es' ? '⚠️ LUCES DELANTERAS: No verificadas para noche/niebla' : '⚠️ FRONT LIGHTS: Not verified for night/fog');
            }
            if (!tieneLucesTraseras && chequeo['Luces Traseras'] !== undefined) {
                puntaje += 10;
                factores.push(idioma === 'es' ? '⚠️ LUCES TRASERAS: No verificadas para noche/niebla' : '⚠️ REAR LIGHTS: Not verified for night/fog');
            }
        }
        
        // CHALECO REFLECTIVO (15 pts en carretera o noche)
        if ((tipoVia === 'carretera' || clima === 'noche' || clima === 'niebla') && !tieneChaleco) {
            puntaje += 15;
            factores.push(idioma === 'es' ? '⚠️ CHALECO REFLECTIVO: Obligatorio en carretera y condiciones de poca luz' : '⚠️ REFLECTIVE VEST: Mandatory on highways and low light conditions');
            recomendaciones.push(idioma === 'es' ? '🦺 Usa chaleco reflectivo para ser visible' : '🦺 Use reflective vest to be visible');
        }
        
        // ESPEJOS (10 pts)
        if (!tieneEspejos) {
            puntaje += 10;
            factores.push(idioma === 'es' ? '⚠️ ESPEJOS: No verificados o mal ajustados' : '⚠️ MIRRORS: Not verified or poorly adjusted');
            recomendaciones.push(idioma === 'es' ? '🔍 Ajusta tus espejos correctamente' : '🔍 Adjust your mirrors correctly');
        }
        
        // CADENA (5 pts)
        if (!tieneCadena) {
            puntaje += 5;
            factores.push(idioma === 'es' ? '⚠️ CADENA: Estado no verificado' : '⚠️ CHAIN: Condition not verified');
            recomendaciones.push(idioma === 'es' ? '🔧 Revisa tensión y lubricación de la cadena' : '🔧 Check chain tension and lubrication');
        }
        
        // ACEITE (5 pts)
        if (!tieneAceite) {
            puntaje += 5;
            factores.push(idioma === 'es' ? '⚠️ ACEITE: Nivel no verificado' : '⚠️ OIL: Level not verified');
            recomendaciones.push(idioma === 'es' ? '🛢️ Revisa nivel de aceite antes de viajes largos' : '🛢️ Check oil level before long trips');
        }
        
        // ==================== 2. FACTORES DE VÍA ====================
        if (tipoVia === 'carretera') {
            puntaje += 20;
            factores.push(idioma === 'es' ? '🛣️ Carretera: Vehículos a alta velocidad' : '🛣️ Highway: High speed vehicles');
            recomendaciones.push(idioma === 'es' ? '🚨 Mantén distancia y usa chaleco reflectivo' : '🚨 Keep distance and use reflective vest');
        } else if (tipoVia === 'rural') {
            puntaje += 10;
            factores.push(idioma === 'es' ? '🌄 Vía rural: Atención a curvas y animales' : '🌄 Rural road: Watch for curves and animals');
        }
        
        // ==================== 3. FACTORES CLIMÁTICOS ====================
        if (clima === 'lluvia') {
            puntaje += 25;
            factores.push(idioma === 'es' ? '⚠️ Lluvia: Pavimento mojado, reducir velocidad' : '⚠️ Rain: Wet pavement, reduce speed');
            recomendaciones.push(idioma === 'es' ? '☔ Reduce velocidad y aumenta distancia de frenado' : '☔ Reduce speed and increase braking distance');
        } else if (clima === 'niebla') {
            puntaje += 30;
            factores.push(idioma === 'es' ? '⚠️ Niebla: Visibilidad severamente reducida' : '⚠️ Fog: Severely reduced visibility');
            recomendaciones.push(idioma === 'es' ? '🌫️ Considera posponer el viaje' : '🌫️ Consider postponing the trip');
        } else if (clima === 'noche') {
            puntaje += 10;
            factores.push(idioma === 'es' ? '🌙 Noche: Visibilidad reducida' : '🌙 Night: Reduced visibility');
        }
        
        // ==================== 4. FACTOR DISTANCIA ====================
        if (distancia > 500) {
            puntaje += 20;
            factores.push(idioma === 'es' ? `📏 Distancia EXTREMA: ${distancia} km` : `📏 EXTREME distance: ${distancia} km`);
            recomendaciones.push(idioma === 'es' ? '🛑 Planifica descansos cada 2 horas' : '🛑 Plan breaks every 2 hours');
        } else if (distancia > 300) {
            puntaje += 15;
            factores.push(idioma === 'es' ? `📏 Distancia muy larga: ${distancia} km` : `📏 Very long distance: ${distancia} km`);
            recomendaciones.push(idioma === 'es' ? '🧴 Descansa cada 2 horas y revisa combustible' : '🧴 Rest every 2 hours and check fuel');
        } else if (distancia > 150) {
            puntaje += 10;
            factores.push(idioma === 'es' ? `📏 Distancia larga: ${distancia} km` : `📏 Long distance: ${distancia} km`);
            recomendaciones.push(idioma === 'es' ? '⛽ Verifica combustible antes de salir' : '⛽ Check fuel before leaving');
        } else if (distancia > 50) {
            puntaje += 5;
            factores.push(idioma === 'es' ? `📏 Distancia moderada: ${distancia} km` : `📏 Moderate distance: ${distancia} km`);
        }
        
        // ==================== 5. VELOCIDAD ====================
        let limiteVelocidad = 60;
        if (tipoVia === 'rural') limiteVelocidad = 80;
        if (tipoVia === 'carretera') limiteVelocidad = 100;
        
        if (velocidad > limiteVelocidad) {
            const exceso = velocidad - limiteVelocidad;
            puntaje += Math.min(40, exceso * 2);
            factores.push(idioma === 'es' ? `⚠️ Velocidad: ${velocidad} km/h (excede el límite de ${limiteVelocidad} km/h)` : `⚠️ Speed: ${velocidad} km/h (exceeds ${limiteVelocidad} km/h limit)`);
            recomendaciones.push(idioma === 'es' ? `🐌 Reduce tu velocidad máxima a ${limiteVelocidad} km/h` : `🐌 Reduce your maximum speed to ${limiteVelocidad} km/h`);
        }
        
        // ==================== DETERMINAR NIVEL DE RIESGO ====================
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
        
        // Agregar mensaje final sobre el punto sin retorno si aplica
        if (velocidad > limiteVelocidad && (!tieneFrenos || !tieneNeumaticos)) {
            mensaje += ' ' + (idioma === 'es' 
                ? '🚨 PUNTO SIN RETORNO: Velocidad alta + vehículo en mal estado = NO podrás reaccionar a tiempo.'
                : '🚨 NO RETURN POINT: High speed + bad vehicle condition = You will NOT react in time.');
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