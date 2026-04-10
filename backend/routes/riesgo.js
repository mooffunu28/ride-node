const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.post('/calcular', async (req, res) => {
    try {
        const { velocidad, distancia, clima, tipoVia, chequeo, tipo_vehiculo, idioma = 'es' } = req.body;
        
        // Iniciar puntaje en CERO
        let puntaje = 0;
        let factores = [];
        let recomendaciones = [];
        
        // ==================== COMPONENTES EN MAL ESTADO ====================
        let tieneCasco = false;
        let tieneFrenos = false;
        let tieneLuces = false;
        let tieneNeumaticos = false;
        let tieneChaleco = false;
        let tieneDireccion = false;
        let tieneCadena = false;
        let otrosMalos = 0;
        
        for (const [nombre, estado] of Object.entries(chequeo || {})) {
            if (estado === false) {
                if (nombre === 'Casco') tieneCasco = true;
                else if (nombre.includes('Frenos')) tieneFrenos = true;
                else if (nombre.includes('Luces')) tieneLuces = true;
                else if (nombre === 'Neumáticos') tieneNeumaticos = true;
                else if (nombre === 'Chaleco Reflectivo') tieneChaleco = true;
                else if (nombre === 'Dirección') tieneDireccion = true;
                else if (nombre === 'Cadena') tieneCadena = true;
                else otrosMalos++;
            }
        }
        
        // ==================== SUMAR PUNTOS (DESDE CERO) ====================
        
        // Componentes críticos (más peso)
        if (tieneCasco) {
            puntaje += 15;
            factores.push(idioma === 'es' ? '❌ CASCO: No verificado (+15)' : '❌ HELMET: Not verified (+15)');
            recomendaciones.push(idioma === 'es' ? '🔧 Usa casco certificado' : '🔧 Use certified helmet');
        }
        
        if (tieneFrenos) {
            puntaje += 15;
            factores.push(idioma === 'es' ? '❌ FRENOS: No verificados (+15)' : '❌ BRAKES: Not verified (+15)');
            recomendaciones.push(idioma === 'es' ? '🔧 Revisa frenos' : '🔧 Check brakes');
        }
        
        if (tieneNeumaticos) {
            puntaje += 10;
            factores.push(idioma === 'es' ? '❌ NEUMÁTICOS: Mal estado (+10)' : '❌ TYRES: Bad condition (+10)');
            recomendaciones.push(idioma === 'es' ? '🔧 Verifica presión' : '🔧 Check pressure');
        }
        
        if (tieneLuces) {
            puntaje += 10;
            factores.push(idioma === 'es' ? '❌ LUCES: No funcionan (+10)' : '❌ LIGHTS: Not working (+10)');
            recomendaciones.push(idioma === 'es' ? '🔧 Verifica luces' : '🔧 Check lights');
        }
        
        if (tieneChaleco) {
            puntaje += 8;
            factores.push(idioma === 'es' ? '❌ CHALECO: No verificado (+8)' : '❌ VEST: Not verified (+8)');
            recomendaciones.push(idioma === 'es' ? '🔧 Usa chaleco reflectivo' : '🔧 Use reflective vest');
        }
        
        if (tieneDireccion) {
            puntaje += 5;
            factores.push(idioma === 'es' ? '❌ DIRECCIÓN: No verificada (+5)' : '❌ STEERING: Not verified (+5)');
        }
        
        if (tieneCadena) {
            puntaje += 5;
            factores.push(idioma === 'es' ? '❌ CADENA: No verificada (+5)' : '❌ CHAIN: Not verified (+5)');
        }
        
        // Otros componentes (2 puntos cada uno, máximo 10)
        if (otrosMalos > 0) {
            const puntosOtros = Math.min(10, otrosMalos * 2);
            puntaje += puntosOtros;
            factores.push(idioma === 'es' ? `⚠️ Otros componentes (${otrosMalos}) mal estado (+${puntosOtros})` : `⚠️ Other components (${otrosMalos}) bad condition (+${puntosOtros})`);
        }
        
        // ==================== FACTORES EXTERNOS ====================
        
        // VÍA
        if (tipoVia === 'carretera') {
            puntaje += 12;
            factores.push(idioma === 'es' ? '🛣️ Carretera: Alto riesgo (+12)' : '🛣️ Highway: High risk (+12)');
        } else if (tipoVia === 'rural') {
            puntaje += 5;
            factores.push(idioma === 'es' ? '🌄 Vía rural: Curvas (+5)' : '🌄 Rural road: Curves (+5)');
        }
        
        // CLIMA
        if (clima === 'lluvia') {
            puntaje += 10;
            factores.push(idioma === 'es' ? '🌧️ Lluvia: Pavimento mojado (+10)' : '🌧️ Rain: Wet pavement (+10)');
            recomendaciones.push(idioma === 'es' ? '☔ Reduce velocidad' : '☔ Reduce speed');
        } else if (clima === 'niebla') {
            puntaje += 12;
            factores.push(idioma === 'es' ? '🌫️ Niebla: Visibilidad reducida (+12)' : '🌫️ Fog: Reduced visibility (+12)');
            recomendaciones.push(idioma === 'es' ? '🌫️ Considera posponer' : '🌫️ Consider postponing');
        } else if (clima === 'noche') {
            puntaje += 8;
            factores.push(idioma === 'es' ? '🌙 Noche: Visibilidad reducida (+8)' : '🌙 Night: Reduced visibility (+8)');
            recomendaciones.push(idioma === 'es' ? '💡 Usa luces' : '💡 Use lights');
        }
        
        // DISTANCIA
        if (distancia > 50) {
            puntaje += 8;
            factores.push(idioma === 'es' ? `📏 Distancia larga: ${distancia} km (+8)` : `📏 Long distance: ${distancia} km (+8)`);
        } else if (distancia > 20) {
            puntaje += 3;
            factores.push(idioma === 'es' ? `📏 Distancia moderada: ${distancia} km (+3)` : `📏 Moderate distance: ${distancia} km (+3)`);
        }
        
        // VELOCIDAD
        let limiteVelocidad = 25;
        if (tipoVia === 'rural') limiteVelocidad = 30;
        if (tipoVia === 'carretera') limiteVelocidad = 20;
        
        if (velocidad > limiteVelocidad) {
            const exceso = velocidad - limiteVelocidad;
            const puntosVelocidad = Math.min(20, exceso);
            puntaje += puntosVelocidad;
            factores.push(idioma === 'es' ? `⚠️ Velocidad: ${velocidad} km/h (+${puntosVelocidad})` : `⚠️ Speed: ${velocidad} km/h (+${puntosVelocidad})`);
            recomendaciones.push(idioma === 'es' ? `🐌 Reduce a ${limiteVelocidad} km/h` : `🐌 Reduce to ${limiteVelocidad} km/h`);
        }
        
        // ==================== LIMITAR PUNTAJE A 100 ====================
        puntaje = Math.min(100, puntaje);
        
        // ==================== DETERMINAR NIVEL ====================
        let nivel, mensaje;
        if (puntaje >= 70) {
            nivel = 'critico';
            mensaje = idioma === 'es' ? '🚨 ¡ALTO RIESGO! NO realices este viaje.' : '🚨 HIGH RISK! DO NOT take this trip.';
        } else if (puntaje >= 40) {
            nivel = 'moderado';
            mensaje = idioma === 'es' ? '⚠️ Riesgo moderado. Toma precauciones.' : '⚠️ Moderate risk. Take precautions.';
        } else if (puntaje >= 20) {
            nivel = 'leve';
            mensaje = idioma === 'es' ? 'ℹ️ Riesgo leve. Mejora los aspectos pendientes.' : 'ℹ️ Low risk. Improve pending aspects.';
        } else {
            nivel = 'seguro';
            mensaje = idioma === 'es' ? '✅ Viaje seguro. ¡Buen camino!' : '✅ Safe trip. Have a good ride!';
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
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;