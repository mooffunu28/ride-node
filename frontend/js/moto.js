// ==================== TEXTO TRADUCIDO ====================
const textos = {
    es: {
        prioridad: "Prioridad",
        buen_estado: "en buen estado",
        cargando: "Cargando...",
        evaluando: "Evaluando riesgos...",
        velocidad: "Velocidad máxima (km/h)",
        distancia: "Distancia (km)",
        clima: "Clima",
        tipo_via: "Tipo de vía"
    },
    en: {
        prioridad: "Priority",
        buen_estado: "in good condition",
        cargando: "Loading...",
        evaluando: "Assessing risks...",
        velocidad: "Max speed (km/h)",
        distancia: "Distance (km)",
        clima: "Weather",
        tipo_via: "Road type"
    }
};

let idiomaActual = localStorage.getItem('ride_idioma') || 'es';
let timeoutAutoUpdate = null;

function aplicarTextos() {
    document.getElementById('btnIdioma').innerHTML = idiomaActual === 'es' ? '🌐 English' : '🌐 Español';
    document.getElementById('btnCalcularTexto').innerHTML = idiomaActual === 'es' ? 'Evaluar Riesgo' : 'Assess Risk';
    document.getElementById('labelVelocidad').innerHTML = textos[idiomaActual].velocidad;
    document.getElementById('labelDistancia').innerHTML = textos[idiomaActual].distancia;
    document.getElementById('labelClima').innerHTML = textos[idiomaActual].clima;
    document.getElementById('labelTipoVia').innerHTML = textos[idiomaActual].tipo_via;
    
    const climaSelect = document.getElementById('clima');
    if (climaSelect) {
        climaSelect.options[0].text = idiomaActual === 'es' ? '☀️ Día soleado' : '☀️ Sunny day';
        climaSelect.options[1].text = idiomaActual === 'es' ? '🌧️ Lluvia' : '🌧️ Rain';
        climaSelect.options[2].text = idiomaActual === 'es' ? '🌙 Noche' : '🌙 Night';
        climaSelect.options[3].text = idiomaActual === 'es' ? '🌫️ Niebla' : '🌫️ Fog';
    }
    
    const viaSelect = document.getElementById('tipo_via');
    if (viaSelect) {
        viaSelect.options[0].text = idiomaActual === 'es' ? '🏙️ Urbana (máx 60 km/h)' : '🏙️ Urban (max 60 km/h)';
        viaSelect.options[1].text = idiomaActual === 'es' ? '🌄 Rural (máx 80 km/h)' : '🌄 Rural (max 80 km/h)';
        viaSelect.options[2].text = idiomaActual === 'es' ? '🛣️ Carretera (máx 100 km/h)' : '🛣️ Highway (max 100 km/h)';
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
    container.innerHTML = '<div class="loading">Cargando normas...</div>';
    try {
        const res = await fetch(`/api/normas?tipo=moto&idioma=${idiomaActual}`);
        const data = await res.json();
        if (data.data && data.data.length > 0) {
            container.innerHTML = data.data.map(n => `
                <div class="norma-card">
                    <div class="norma-check"><i class="fas fa-check"></i></div>
                    <div class="norma-contenido">
                        <div class="norma-header">
                            <span class="norma-articulo">${idiomaActual === 'es' ? 'Artículo' : 'Article'} ${n.art_num}</span>
                            ${n.tipo_multa ? `<span class="norma-multa">💰 ${idiomaActual === 'es' ? 'Multa tipo' : 'Fine type'} ${n.tipo_multa}</span>` : ''}
                        </div>
                        <div class="norma-descripcion">${n.descripcion}</div>
                    </div>
                </div>
            `).join('');
        }
    } catch(e) { container.innerHTML = '<div class="error">Error cargando normas</div>'; }
}

async function cargarChequeo() {
    const container = document.getElementById('chequeo-container');
    const checkContainer = document.getElementById('componentes-check');
    container.innerHTML = '<div class="loading">Cargando checklist...</div>';
    try {
        const res = await fetch(`/api/chequeo?tipo=Moto&idioma=${idiomaActual}`);
        const data = await res.json();
        if (data.data && data.data.length > 0) {
            container.innerHTML = data.data.map(c => `
                <div class="checklist-item">
                    <input type="checkbox" class="check-componente" data-nombre="${c.nom_comp}">
                    <div style="flex:1">
                        <strong>${c.nom_comp}</strong><br>
                        <small>${c.estado_opt}</small><br>
                        <span class="${c.prioridad === 'Alta' ? 'priority-high' : 'priority-medium'}">
                            ${textos[idiomaActual].prioridad}: ${c.prioridad}
                        </span>
                    </div>
                </div>
            `).join('');
            
            checkContainer.innerHTML = data.data.map(c => `
                <label class="checkbox-label">
                    <input type="checkbox" class="check-riesgo" data-nombre="${c.nom_comp}">
                    ${c.nom_comp} ${textos[idiomaActual].buen_estado}
                </label>
            `).join('');
            
            // Configurar auto-refresco después de cargar los checkboxes
            configurarAutoUpdate();
        }
    } catch(e) { container.innerHTML = '<div class="error">Error cargando checklist</div>'; }
}

// ==================== EVALUAR RIESGO ====================
async function evaluarRiesgoViaje() {
    const velocidad = parseInt(document.getElementById('velocidad').value) || 0;
    const distancia = parseInt(document.getElementById('distancia').value) || 0;
    const clima = document.getElementById('clima')?.value || 'dia';
    const tipoVia = document.getElementById('tipo_via')?.value || 'urbana';
    
    const checkboxes = document.querySelectorAll('.check-riesgo');
    const chequeo = {};
    checkboxes.forEach(cb => {
        chequeo[cb.getAttribute('data-nombre')] = cb.checked;
    });
    
    const divResultado = document.getElementById('resultado-riesgo');
    divResultado.innerHTML = `<div class="loading">${textos[idiomaActual].evaluando}</div>`;
    
    try {
        const response = await fetch('/api/riesgo/calcular', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                velocidad, 
                distancia, 
                clima, 
                tipoVia, 
                chequeo, 
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
                <p><strong>${resultado.mensaje || ''}</strong></p>
                <p><strong>📊 Puntaje:</strong> ${resultado.puntaje}/100</p>
                ${resultado.factores?.length ? `<strong>📋 Factores:</strong><ul>${resultado.factores.map(f => `<li>${f}</li>`).join('')}</ul>` : ''}
                ${resultado.recomendaciones?.length ? `<strong>✅ Recomendaciones:</strong><ul>${resultado.recomendaciones.map(r => `<li>${r}</li>`).join('')}</ul>` : ''}
            </div>
        `;
    } catch (error) {
        divResultado.innerHTML = `<div class="riesgo-critico">❌ Error: ${error.message}</div>`;
    }
}

// ==================== AUTO-REFRESCO ====================
function configurarAutoUpdate() {
    function triggerAutoUpdate() {
        if (timeoutAutoUpdate) clearTimeout(timeoutAutoUpdate);
        timeoutAutoUpdate = setTimeout(() => evaluarRiesgoViaje(), 400);
    }
    
    const elementos = ['velocidad', 'distancia', 'clima', 'tipo_via'];
    elementos.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.removeEventListener('input', triggerAutoUpdate);
            el.removeEventListener('change', triggerAutoUpdate);
            el.addEventListener('input', triggerAutoUpdate);
            el.addEventListener('change', triggerAutoUpdate);
        }
    });
    
    const observer = new MutationObserver(() => {
        document.querySelectorAll('.check-riesgo').forEach(cb => {
            cb.removeEventListener('change', triggerAutoUpdate);
            cb.addEventListener('change', triggerAutoUpdate);
        });
    });
    const checkContainer = document.getElementById('componentes-check');
    if (checkContainer) observer.observe(checkContainer, { childList: true, subtree: true });
    
    // Llamar a evaluarRiesgoViaje una vez al inicio
    setTimeout(() => evaluarRiesgoViaje(), 500);
}

// ==================== EVENTOS ====================
document.getElementById('btnIdioma')?.addEventListener('click', cambiarIdioma);
document.getElementById('calcularRiesgo')?.addEventListener('click', evaluarRiesgoViaje);

// ==================== INICIALIZAR ====================
aplicarTextos();
cargarNormas();
cargarChequeo();