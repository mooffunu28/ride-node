// ==================== VERSIÓN CON SINCRONIZACIÓN PARA BICICLETA ====================
console.log('✅ bicicleta.js cargado');

const textos = {
    es: { prioridad: "Prioridad", buen_estado: "en buen estado", cargando: "Cargando...", evaluando: "Evaluando riesgo...", velocidad: "Velocidad máxima (km/h)", distancia: "Distancia (km)", clima: "Condiciones climáticas", tipo_via: "Tipo de vía" },
    en: { prioridad: "Priority", buen_estado: "in good condition", cargando: "Loading...", evaluando: "Assessing risk...", velocidad: "Max speed (km/h)", distancia: "Distance (km)", clima: "Weather conditions", tipo_via: "Road type" }
};

let idiomaActual = localStorage.getItem('ride_idioma') || 'es';
let timeoutAutoUpdate = null;

function aplicarTextos() {
    const t = textos[idiomaActual];
    const btnIdioma = document.getElementById('btnIdioma');
    if (btnIdioma) btnIdioma.innerHTML = idiomaActual === 'es' ? '🌐 English' : '🌐 Español';
    const btnCalcular = document.getElementById('btnCalcularTexto');
    if (btnCalcular) btnCalcular.innerHTML = idiomaActual === 'es' ? 'Evaluar Riesgo' : 'Assess Risk';
    
    const labelVelocidad = document.getElementById('labelVelocidad');
    if (labelVelocidad) labelVelocidad.innerHTML = t.velocidad;
    const labelDistancia = document.getElementById('labelDistancia');
    if (labelDistancia) labelDistancia.innerHTML = t.distancia;
    const labelClima = document.getElementById('labelClima');
    if (labelClima) labelClima.innerHTML = t.clima;
    const labelTipoVia = document.getElementById('labelTipoVia');
    if (labelTipoVia) labelTipoVia.innerHTML = t.tipo_via;
    
    const climaSelect = document.getElementById('clima');
    if (climaSelect) {
        if (idiomaActual === 'es') {
            climaSelect.options[0].text = '☀️ Día soleado';
            climaSelect.options[1].text = '🌧️ Lluvia';
            climaSelect.options[2].text = '🌙 Noche';
            climaSelect.options[3].text = '🌫️ Niebla';
        } else {
            climaSelect.options[0].text = '☀️ Sunny day';
            climaSelect.options[1].text = '🌧️ Rain';
            climaSelect.options[2].text = '🌙 Night';
            climaSelect.options[3].text = '🌫️ Fog';
        }
    }
    
    const viaSelect = document.getElementById('tipo_via');
    if (viaSelect) {
        if (idiomaActual === 'es') {
            viaSelect.options[0].text = '🏙️ Urbana (máx 25 km/h)';
            viaSelect.options[1].text = '🌄 Rural (máx 30 km/h)';
            viaSelect.options[2].text = '🛣️ Carretera (NO RECOMENDADO)';
        } else {
            viaSelect.options[0].text = '🏙️ Urban (max 25 km/h)';
            viaSelect.options[1].text = '🌄 Rural (max 30 km/h)';
            viaSelect.options[2].text = '🛣️ Highway (NOT RECOMMENDED)';
        }
    }
}

function cambiarIdioma() {
    idiomaActual = idiomaActual === 'es' ? 'en' : 'es';
    localStorage.setItem('ride_idioma', idiomaActual);
    aplicarTextos();
    cargarNormas();
    cargarChequeo();
}

async function cargarNormas() {
    const container = document.getElementById('normas-container');
    if (!container) return;
    container.innerHTML = '<div class="loading">Cargando normas...</div>';
    try {
        const res = await fetch(`/api/normas?tipo=bicicleta&idioma=${idiomaActual}`);
        const data = await res.json();
        if (data.data && data.data.length > 0) {
            container.innerHTML = data.data.map(n => `
                <div class="norma-card">
                    <div class="norma-check"><i class="fas fa-check"></i></div>
                    <div class="norma-contenido">
                        <div class="norma-header">
                            <span class="norma-articulo">${idiomaActual === 'es' ? 'Artículo' : 'Article'} ${n.art_num}</span>
                            ${n.tipo_multa ? `<span class="norma-multa multa-${n.tipo_multa}">💰 ${idiomaActual === 'es' ? 'Multa tipo' : 'Fine type'} ${n.tipo_multa}</span>` : ''}
                        </div>
                        <div class="norma-descripcion">${n.descripcion}</div>
                    </div>
                </div>
            `).join('');
        }
    } catch(e) { container.innerHTML = '<div class="error-message">Error</div>'; }
}

async function cargarChequeo() {
    const container = document.getElementById('chequeo-container');
    const checkContainer = document.getElementById('componentes-check');
    if (!container) return;
    container.innerHTML = '<div class="loading">Cargando checklist...</div>';
    try {
        const res = await fetch(`/api/chequeo?tipo=Cicla&idioma=${idiomaActual}`);
        const data = await res.json();
        if (data.data && data.data.length > 0) {
            // Mostrar checklist preventivo
            container.innerHTML = data.data.map(c => `
                <div class="checklist-item">
                    <input type="checkbox" class="check-componente" data-nombre="${c.nom_comp}">
                    <div style="flex:1">
                        <strong>${c.nom_comp}</strong><br>
                        <small>${c.estado_opt}</small><br>
                        <span class="${c.prioridad === 'Alta' ? 'priority-high' : 'priority-medium'}">${textos[idiomaActual].prioridad}: ${c.prioridad}</span>
                    </div>
                </div>
            `).join('');
            
            // Generar checkboxes para la calculadora de riesgo
            checkContainer.innerHTML = data.data.map(c => `
                <label class="checkbox-label">
                    <input type="checkbox" class="check-riesgo" data-nombre="${c.nom_comp}">
                    ${c.nom_comp} ${textos[idiomaActual].buen_estado}
                </label>
            `).join('');
            
            // ==================== SINCRONIZACIÓN: Chequeo Preventivo -> Calculadora ====================
            document.querySelectorAll('.check-componente').forEach(cb => {
                cb.addEventListener('change', function() {
                    const nombre = this.getAttribute('data-nombre');
                    const checkboxRiesgo = document.querySelector(`.check-riesgo[data-nombre="${nombre}"]`);
                    if (checkboxRiesgo) {
                        checkboxRiesgo.checked = this.checked;
                        checkboxRiesgo.dispatchEvent(new Event('change'));
                    }
                });
            });
            
            // ==================== SINCRONIZACIÓN: Calculadora -> Chequeo Preventivo ====================
            document.querySelectorAll('.check-riesgo').forEach(cb => {
                cb.addEventListener('change', function() {
                    const nombre = this.getAttribute('data-nombre');
                    const checkboxPreventivo = document.querySelector(`.check-componente[data-nombre="${nombre}"]`);
                    if (checkboxPreventivo) {
                        checkboxPreventivo.checked = this.checked;
                    }
                });
            });
            
            // Configurar auto-refresco
            setTimeout(() => configurarAutoUpdate(), 100);
            evaluarRiesgoViaje();
        }
    } catch(e) { container.innerHTML = '<div class="error-message">Error</div>'; }
}

async function evaluarRiesgoViaje() {
    const velocidad = parseInt(document.getElementById('velocidad')?.value) || 0;
    const distancia = parseInt(document.getElementById('distancia')?.value) || 0;
    const clima = document.getElementById('clima')?.value || 'dia';
    const tipoVia = document.getElementById('tipo_via')?.value || 'urbana';
    
    const checkboxes = document.querySelectorAll('.check-riesgo');
    const chequeo = {};
    checkboxes.forEach(cb => { chequeo[cb.getAttribute('data-nombre')] = cb.checked; });
    
    const divResultado = document.getElementById('resultado-riesgo');
    if (!divResultado) return;
    divResultado.innerHTML = `<div class="loading">${textos[idiomaActual].evaluando}</div>`;
    
    try {
        const response = await fetch('/api/riesgo/calcular', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ velocidad, distancia, clima, tipoVia, chequeo, tipo_vehiculo: 'Cicla', idioma: idiomaActual })
        });
        const resultado = await response.json();
        
        let clase = '';
        let nivelTexto = '';
        if (resultado.nivel === 'critico') { clase = 'riesgo-critico'; nivelTexto = idiomaActual === 'es' ? '🚨 RIESGO CRÍTICO' : '🚨 CRITICAL RISK'; }
        else if (resultado.nivel === 'moderado') { clase = 'riesgo-moderado'; nivelTexto = idiomaActual === 'es' ? '⚠️ RIESGO MODERADO' : '⚠️ MODERATE RISK'; }
        else { clase = 'riesgo-seguro'; nivelTexto = idiomaActual === 'es' ? '✅ RIESGO BAJO' : '✅ LOW RISK'; }
        
        divResultado.innerHTML = `
            <div class="${clase}" style="padding:0.8rem;">
                <strong>${nivelTexto}</strong>
                <p>${resultado.mensaje || ''}</p>
                <p><strong>📊 Puntaje:</strong> ${resultado.puntaje}/100</p>
                ${resultado.factores?.length ? `<strong>📋 Factores:</strong><ul>${resultado.factores.map(f => `<li>${f}</li>`).join('')}</ul>` : ''}
                ${resultado.recomendaciones?.length ? `<strong>✅ Recomendaciones:</strong><ul>${resultado.recomendaciones.map(r => `<li>${r}</li>`).join('')}</ul>` : ''}
            </div>
        `;
    } catch (error) {
        divResultado.innerHTML = `<div class="riesgo-critico">❌ Error: ${error.message}</div>`;
    }
}

function configurarAutoUpdate() {
    function triggerAutoUpdate() {
        if (timeoutAutoUpdate) clearTimeout(timeoutAutoUpdate);
        timeoutAutoUpdate = setTimeout(() => evaluarRiesgoViaje(), 400);
    }
    
    ['velocidad', 'distancia', 'clima', 'tipo_via'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.removeEventListener('input', triggerAutoUpdate);
            el.removeEventListener('change', triggerAutoUpdate);
            el.addEventListener('input', triggerAutoUpdate);
            el.addEventListener('change', triggerAutoUpdate);
        }
    });
    
    const checkboxes = document.querySelectorAll('.check-riesgo');
    checkboxes.forEach(cb => {
        cb.removeEventListener('change', triggerAutoUpdate);
        cb.addEventListener('change', triggerAutoUpdate);
    });
}

// Eventos
document.getElementById('btnIdioma')?.addEventListener('click', cambiarIdioma);
document.getElementById('calcularRiesgo')?.addEventListener('click', evaluarRiesgoViaje);

// Verificar autenticación
const token = localStorage.getItem('ride_token');
const usuario = localStorage.getItem('ride_usuario');
if (!token || !usuario) window.location.href = '/';

// Inicializar
aplicarTextos();
cargarNormas();
cargarChequeo();