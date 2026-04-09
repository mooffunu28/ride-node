// ==================== VERSIÓN FUNCIONAL - SIN ERRORES ====================
console.log('✅ moto.js cargado correctamente');

// Textos para traducción
const textos = {
    es: {
        prioridad: "Prioridad",
        buen_estado: "en buen estado",
        cargando: "Cargando...",
        evaluando: "Evaluando riesgo...",
        velocidad: "Velocidad máxima (km/h)",
        distancia: "Distancia (km)",
        clima: "Condiciones climáticas",
        tipo_via: "Tipo de vía"
    },
    en: {
        prioridad: "Priority",
        buen_estado: "in good condition",
        cargando: "Loading...",
        evaluando: "Assessing risk...",
        velocidad: "Max speed (km/h)",
        distancia: "Distance (km)",
        clima: "Weather conditions",
        tipo_via: "Road type"
    }
};

let idiomaActual = localStorage.getItem('ride_idioma') || 'es';
let timeoutAutoUpdate = null;

// ==================== APLICAR TEXTOS ====================
function aplicarTextos() {
    const t = textos[idiomaActual];
    
    // Botón de idioma
    const btnIdioma = document.getElementById('btnIdioma');
    if (btnIdioma) btnIdioma.innerHTML = idiomaActual === 'es' ? '🌐 English' : '🌐 Español';
    
    // Botón de calcular
    const btnCalcular = document.getElementById('btnCalcularTexto');
    if (btnCalcular) btnCalcular.innerHTML = idiomaActual === 'es' ? 'Evaluar Riesgo' : 'Assess Risk';
    
    // Labels
    const labelVelocidad = document.getElementById('labelVelocidad');
    if (labelVelocidad) labelVelocidad.innerHTML = t.velocidad;
    
    const labelDistancia = document.getElementById('labelDistancia');
    if (labelDistancia) labelDistancia.innerHTML = t.distancia;
    
    const labelClima = document.getElementById('labelClima');
    if (labelClima) labelClima.innerHTML = t.clima;
    
    const labelTipoVia = document.getElementById('labelTipoVia');
    if (labelTipoVia) labelTipoVia.innerHTML = t.tipo_via;
    
    // Select de clima
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
    
    // Select de tipo de vía
    const viaSelect = document.getElementById('tipo_via');
    if (viaSelect) {
        if (idiomaActual === 'es') {
            viaSelect.options[0].text = '🏙️ Urbana (máx 60 km/h)';
            viaSelect.options[1].text = '🌄 Rural (máx 80 km/h)';
            viaSelect.options[2].text = '🛣️ Carretera (máx 100 km/h)';
        } else {
            viaSelect.options[0].text = '🏙️ Urban (max 60 km/h)';
            viaSelect.options[1].text = '🌄 Rural (max 80 km/h)';
            viaSelect.options[2].text = '🛣️ Highway (max 100 km/h)';
        }
    }
}

// ==================== CAMBIAR IDIOMA ====================
function cambiarIdioma() {
    idiomaActual = idiomaActual === 'es' ? 'en' : 'es';
    localStorage.setItem('ride_idioma', idiomaActual);
    aplicarTextos();
    cargarNormas();
    cargarChequeo();
    evaluarRiesgoViaje();
}

// ==================== CARGAR NORMAS ====================
async function cargarNormas() {
    const container = document.getElementById('normas-container');
    if (!container) return;
    
    container.innerHTML = '<div class="loading">Cargando normas...</div>';
    
    try {
        const response = await fetch(`/api/normas?tipo=moto&idioma=${idiomaActual}`);
        const result = await response.json();
        const data = result.data || [];
        
        if (data.length === 0) {
            container.innerHTML = '<div class="error-message">No hay normas disponibles</div>';
            return;
        }
        
        container.innerHTML = data.map(n => `
            <div class="norma-card">
                <div class="norma-check"><i class="fas fa-check"></i></div>
                <div class="norma-contenido">
                    <div class="norma-header">
                        <span class="norma-articulo">${idiomaActual === 'es' ? 'Artículo' : 'Article'} ${n.art_num || 'N/A'}</span>
                        ${n.tipo_multa ? `<span class="norma-multa multa-${n.tipo_multa}">💰 ${idiomaActual === 'es' ? 'Multa tipo' : 'Fine type'} ${n.tipo_multa}</span>` : ''}
                    </div>
                    <div class="norma-descripcion">${n.descripcion || 'Sin descripción'}</div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error cargando normas:', error);
        container.innerHTML = '<div class="error-message">Error al cargar normas</div>';
    }
}

// ==================== CARGAR CHEQUEO ====================
async function cargarChequeo() {
    const container = document.getElementById('chequeo-container');
    const checkContainer = document.getElementById('componentes-check');
    if (!container) return;
    
    container.innerHTML = '<div class="loading">Cargando checklist...</div>';
    
    try {
        const response = await fetch(`/api/chequeo?tipo=Moto&idioma=${idiomaActual}`);
        const result = await response.json();
        const data = result.data || [];
        
        if (data.length === 0) {
            container.innerHTML = '<div class="error-message">No hay componentes registrados</div>';
            return;
        }
        
        // Mostrar checklist
        container.innerHTML = data.map(c => `
            <div class="checklist-item">
                <input type="checkbox" class="check-componente" data-nombre="${c.nom_comp}">
                <div style="flex:1">
                    <strong>${c.nom_comp}</strong>
                    <br><small style="color:#6b8a8a;">${c.estado_opt || 'Sin descripción'}</small>
                    <br><span class="${c.prioridad === 'Alta' ? 'priority-high' : (c.prioridad === 'Media' ? 'priority-medium' : 'priority-low')}">
                        ${textos[idiomaActual].prioridad}: ${c.prioridad}
                    </span>
                </div>
            </div>
        `).join('');
        
        // Generar checkboxes para la calculadora
        if (checkContainer) {
            checkContainer.innerHTML = data.map(c => `
                <label class="checkbox-label">
                    <input type="checkbox" class="check-riesgo" data-nombre="${c.nom_comp}">
                    ${c.nom_comp} ${textos[idiomaActual].buen_estado}
                </label>
            `).join('');
            
            // Configurar auto-refresco después de cargar los checkboxes
            configurarAutoUpdate();
        }
    } catch (error) {
        console.error('Error cargando chequeo:', error);
        container.innerHTML = '<div class="error-message">Error al cargar checklist</div>';
    }
}

// ==================== EVALUAR RIESGO ====================
async function evaluarRiesgoViaje() {
    // Obtener valores
    const velocidadInput = document.getElementById('velocidad');
    const distanciaInput = document.getElementById('distancia');
    const climaSelect = document.getElementById('clima');
    const viaSelect = document.getElementById('tipo_via');
    
    const velocidad = parseInt(velocidadInput?.value) || 0;
    const distancia = parseInt(distanciaInput?.value) || 0;
    const clima = climaSelect?.value || 'dia';
    const tipoVia = viaSelect?.value || 'urbana';
    
    // Obtener estado de los checkboxes de riesgo
    const checkboxes = document.querySelectorAll('.check-riesgo');
    const chequeo = {};
    checkboxes.forEach(cb => {
        const nombre = cb.getAttribute('data-nombre');
        if (nombre) chequeo[nombre] = cb.checked;
    });
    
    const divResultado = document.getElementById('resultado-riesgo');
    if (!divResultado) return;
    
    divResultado.innerHTML = `<div class="loading">${textos[idiomaActual].evaluando}</div>`;
    
    try {
        const response = await fetch('/api/riesgo/calcular', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                velocidad: velocidad,
                distancia: distancia,
                clima: clima,
                tipoVia: tipoVia,
                chequeo: chequeo,
                tipo_vehiculo: 'Moto',
                idioma: idiomaActual
            })
        });
        
        const resultado = await response.json();
        
        let clase = '';
        let nivelTexto = '';
        
        if (resultado.nivel === 'critico') {
            clase = 'riesgo-critico';
            nivelTexto = idiomaActual === 'es' ? '🚨 RIESGO CRÍTICO' : '🚨 CRITICAL RISK';
        } else if (resultado.nivel === 'moderado') {
            clase = 'riesgo-moderado';
            nivelTexto = idiomaActual === 'es' ? '⚠️ RIESGO MODERADO' : '⚠️ MODERATE RISK';
        } else {
            clase = 'riesgo-seguro';
            nivelTexto = idiomaActual === 'es' ? '✅ RIESGO BAJO' : '✅ LOW RISK';
        }
        
        divResultado.innerHTML = `
            <div class="${clase}" style="padding:0.8rem;">
                <strong>${nivelTexto}</strong>
                <p style="margin-top:0.5rem;">${resultado.mensaje || 'Sin mensaje'}</p>
                <p><strong>📊 Puntaje:</strong> ${resultado.puntaje || 0}/100</p>
                ${resultado.factores?.length ? `<strong>📋 Factores:</strong><ul style="margin-left:1rem; margin-top:0.2rem;">${resultado.factores.map(f => `<li>${f}</li>`).join('')}</ul>` : ''}
                ${resultado.recomendaciones?.length ? `<strong>✅ Recomendaciones:</strong><ul style="margin-left:1rem; margin-top:0.2rem;">${resultado.recomendaciones.map(r => `<li>${r}</li>`).join('')}</ul>` : ''}
                <hr style="margin:0.5rem 0;">
                <p style="font-size:0.7rem;"><strong>📌 Recuerda:</strong> La velocidad no es el problema, es la consecuencia. Una moto en mal estado + alta velocidad = PUNTO SIN RETORNO.</p>
            </div>
        `;
    } catch (error) {
        console.error('Error calculando riesgo:', error);
        divResultado.innerHTML = `<div class="riesgo-critico">❌ Error: ${error.message}</div>`;
    }
}

// ==================== AUTO-REFRESCO ====================
function configurarAutoUpdate() {
    function triggerAutoUpdate() {
        if (timeoutAutoUpdate) clearTimeout(timeoutAutoUpdate);
        timeoutAutoUpdate = setTimeout(() => evaluarRiesgoViaje(), 400);
    }
    
    // Inputs numéricos
    const velocidadInput = document.getElementById('velocidad');
    const distanciaInput = document.getElementById('distancia');
    if (velocidadInput) {
        velocidadInput.removeEventListener('input', triggerAutoUpdate);
        velocidadInput.addEventListener('input', triggerAutoUpdate);
    }
    if (distanciaInput) {
        distanciaInput.removeEventListener('input', triggerAutoUpdate);
        distanciaInput.addEventListener('input', triggerAutoUpdate);
    }
    
    // Selects
    const climaSelect = document.getElementById('clima');
    const viaSelect = document.getElementById('tipo_via');
    if (climaSelect) {
        climaSelect.removeEventListener('change', triggerAutoUpdate);
        climaSelect.addEventListener('change', triggerAutoUpdate);
    }
    if (viaSelect) {
        viaSelect.removeEventListener('change', triggerAutoUpdate);
        viaSelect.addEventListener('change', triggerAutoUpdate);
    }
    
    // Checkboxes de riesgo
    const checkboxes = document.querySelectorAll('.check-riesgo');
    checkboxes.forEach(cb => {
        cb.removeEventListener('change', triggerAutoUpdate);
        cb.addEventListener('change', triggerAutoUpdate);
    });
    
    // Observer para nuevos checkboxes
    const observer = new MutationObserver(() => {
        document.querySelectorAll('.check-riesgo').forEach(cb => {
            cb.removeEventListener('change', triggerAutoUpdate);
            cb.addEventListener('change', triggerAutoUpdate);
        });
    });
    
    const checkContainer = document.getElementById('componentes-check');
    if (checkContainer) observer.observe(checkContainer, { childList: true, subtree: true });
}

// ==================== EVENTOS ====================
const btnIdioma = document.getElementById('btnIdioma');
if (btnIdioma) btnIdioma.addEventListener('click', cambiarIdioma);

const btnCalcular = document.getElementById('calcularRiesgo');
if (btnCalcular) btnCalcular.addEventListener('click', evaluarRiesgoViaje);

// ==================== VERIFICAR AUTENTICACIÓN ====================
const token = localStorage.getItem('ride_token');
const usuario = localStorage.getItem('ride_usuario');
if (!token || !usuario) {
    window.location.href = '/';
}

// ==================== INICIALIZAR ====================
aplicarTextos();
cargarNormas();
cargarChequeo();