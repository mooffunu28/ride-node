// ==================== TEXTO TRADUCIDO ====================
const textos = {
    es: {
        titulo: "🏍️ Seguridad en Moto",
        subtitulo: "Revisa tu estado, conoce las normas y calcula tu nivel de riesgo",
        normas: "📋 Normas de Tránsito",
        chequeo: "✅ Chequeo Preventivo (Antes de salir)",
        riesgo: "⚠️ Evaluación de Riesgo del Viaje",
        velocidad_maxima: "Velocidad máxima planeada (km/h)",
        distancia: "Distancia del recorrido (km)",
        clima: "Condiciones climáticas",
        clima_dia: "☀️ Día soleado",
        clima_lluvia: "🌧️ Lluvia",
        clima_noche: "🌙 Noche",
        clima_niebla: "🌫️ Niebla",
        tipo_via: "Tipo de vía",
        via_urbana: "🏙️ Urbana (máx 60 km/h)",
        via_rural: "🌄 Rural (máx 80 km/h)",
        via_carretera: "🛣️ Carretera (máx 100 km/h)",
        evaluar: "Evaluar Riesgo del Viaje",
        prioridad: "Prioridad",
        buen_estado: "en buen estado",
        cargando: "Cargando...",
        multa: "Multa tipo",
        articulo: "Artículo",
        seguridad_activa: "🛑 Seguridad Activa (Frenos y Luces)",
        seguridad_pasiva: "🧤 Seguridad Pasiva (Equipo)",
        motor_transmision: "⚙️ Motor y Transmisión",
        suspension_neumaticos: "🛞 Suspensión y Neumáticos",
        sistema_electrico: "🔋 Sistema Eléctrico",
        evaluando: "Evaluando riesgos..."
    },
    en: {
        titulo: "🏍️ Motorcycle Safety",
        subtitulo: "Check your status, know the rules and calculate your risk level",
        normas: "📋 Traffic Rules",
        chequeo: "✅ Preventive Check (Before riding)",
        riesgo: "⚠️ Trip Risk Assessment",
        velocidad_maxima: "Maximum planned speed (km/h)",
        distancia: "Trip distance (km)",
        clima: "Weather conditions",
        clima_dia: "☀️ Sunny day",
        clima_lluvia: "🌧️ Rain",
        clima_noche: "🌙 Night",
        clima_niebla: "🌫️ Fog",
        tipo_via: "Road type",
        via_urbana: "🏙️ Urban (max 60 km/h)",
        via_rural: "🌄 Rural (max 80 km/h)",
        via_carretera: "🛣️ Highway (max 100 km/h)",
        evaluar: "Assess Trip Risk",
        prioridad: "Priority",
        buen_estado: "in good condition",
        cargando: "Loading...",
        multa: "Fine type",
        articulo: "Article",
        seguridad_activa: "🛑 Active Safety (Brakes & Lights)",
        seguridad_pasiva: "🧤 Passive Safety (Gear)",
        motor_transmision: "⚙️ Engine & Transmission",
        suspension_neumaticos: "🛞 Suspension & Tyres",
        sistema_electrico: "🔋 Electrical System",
        evaluando: "Assessing risks..."
    }
};

let idiomaActual = localStorage.getItem('ride_idioma') || 'es';
let timeoutAutoUpdate = null;

// ==================== APLICAR TEXTOS ====================
function aplicarTextos() {
    const t = textos[idiomaActual];
    document.getElementById('titulo').innerHTML = t.titulo;
    document.getElementById('subtitulo').innerHTML = t.subtitulo;
    document.getElementById('tituloNormas').innerHTML = t.normas;
    document.getElementById('tituloChequeo').innerHTML = t.chequeo;
    document.getElementById('tituloRiesgo').innerHTML = t.riesgo;
    document.getElementById('velocidad').placeholder = t.velocidad_maxima;
    document.getElementById('distancia').placeholder = t.distancia;
    document.getElementById('btnCalcularTexto').innerHTML = t.evaluar;
    document.getElementById('btnIdioma').innerHTML = idiomaActual === 'es' ? '🌐 English' : '🌐 Español';
    
    const labelVelocidad = document.getElementById('labelVelocidad');
    const labelDistancia = document.getElementById('labelDistancia');
    const labelClima = document.getElementById('labelClima');
    const labelTipoVia = document.getElementById('labelTipoVia');
    if (labelVelocidad) labelVelocidad.innerHTML = t.velocidad_maxima;
    if (labelDistancia) labelDistancia.innerHTML = t.distancia;
    if (labelClima) labelClima.innerHTML = t.clima;
    if (labelTipoVia) labelTipoVia.innerHTML = t.tipo_via;
    
    const climaSelect = document.getElementById('clima');
    if (climaSelect) {
        climaSelect.options[0].text = t.clima_dia;
        climaSelect.options[1].text = t.clima_lluvia;
        climaSelect.options[2].text = t.clima_noche;
        climaSelect.options[3].text = t.clima_niebla;
    }
    
    const viaSelect = document.getElementById('tipo_via');
    if (viaSelect) {
        viaSelect.options[0].text = t.via_urbana;
        viaSelect.options[1].text = t.via_rural;
        viaSelect.options[2].text = t.via_carretera;
    }
}

// ==================== CAMBIAR IDIOMA ====================
function cambiarIdioma() {
    idiomaActual = idiomaActual === 'es' ? 'en' : 'es';
    localStorage.setItem('ride_idioma', idiomaActual);
    aplicarTextos();
    cargarNormas();
    cargarChequeo();
}

// ==================== CARGAR NORMAS ====================
async function cargarNormas() {
    const container = document.getElementById('normas-container');
    const t = textos[idiomaActual];
    container.innerHTML = `<div class="loading">${t.cargando}</div>`;
    
    try {
        const response = await fetch(`/api/normas?tipo=moto&idioma=${idiomaActual}`);
        const result = await response.json();
        const data = result.data || [];
        
        if (data.length > 0) {
            container.innerHTML = data.map(n => {
                const multaClass = n.tipo_multa ? `multa-${n.tipo_multa}` : '';
                return `
                    <div class="norma-card">
                        <div class="norma-check"><i class="fas fa-check"></i></div>
                        <div class="norma-contenido">
                            <div class="norma-header">
                                <span class="norma-articulo">${t.articulo} ${n.art_num || 'N/A'}</span>
                                ${n.tipo_multa ? `<span class="norma-multa ${multaClass}">💰 ${t.multa} ${n.tipo_multa}</span>` : ''}
                            </div>
                            <div class="norma-descripcion">${n.descripcion || 'Sin descripción'}</div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    } catch (error) {
        container.innerHTML = `<div class="error-message">❌ Error: ${error.message}</div>`;
    }
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
            body: JSON.stringify({ velocidad, distancia, clima, tipoVia, chequeo, idioma: idiomaActual })
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
        timeoutAutoUpdate = setTimeout(() => evaluarRiesgoViaje(), 300);
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
    observer.observe(document.getElementById('componentes-check'), { childList: true, subtree: true });
}

// ==================== CARGAR CHEQUEO ====================
async function cargarChequeo() {
    const container = document.getElementById('chequeo-container');
    const checkContainer = document.getElementById('componentes-check');
    const t = textos[idiomaActual];
    container.innerHTML = `<div class="loading">${t.cargando}</div>`;
    
    try {
        const response = await fetch(`/api/chequeo?tipo=Moto&idioma=${idiomaActual}`);
        const result = await response.json();
        const data = result.data || [];
        
        if (data.length > 0) {
            const grupos = {
                seguridad_activa: data.filter(c => c.categoria === 'seguridad_activa'),
                seguridad_pasiva: data.filter(c => c.categoria === 'seguridad_pasiva'),
                motor_transmision: data.filter(c => c.categoria === 'motor_transmision'),
                suspension_neumaticos: data.filter(c => c.categoria === 'suspension_neumaticos'),
                sistema_electrico: data.filter(c => c.categoria === 'sistema_electrico')
            };
            
            container.innerHTML = Object.entries(grupos).map(([key, items]) => `
                <div class="checklist-group">
                    <h3 class="group-title">${t[key] || key}</h3>
                    ${items.map(c => `
                        <div class="checklist-item">
                            <input type="checkbox" class="check-componente" data-nombre="${c.nom_comp}">
                            <div style="flex:1">
                                <strong>${c.nom_comp}</strong><br>
                                <small>${c.estado_opt}</small><br>
                                <span class="priority-${c.prioridad === 'Alta' ? 'high' : 'medium'}">${t.prioridad}: ${c.prioridad}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `).join('');
            
            const componentesParaCalculadora = data.filter(c => c.paraCalculadora !== false);
            checkContainer.innerHTML = componentesParaCalculadora.map(c => `
                <label class="checkbox-label">
                    <input type="checkbox" class="check-riesgo" data-nombre="${c.nom_comp}">
                    ${c.nom_comp} ${t.buen_estado}
                </label>
            `).join('');
            
            configurarAutoUpdate();
            evaluarRiesgoViaje();
        }
    } catch (error) {
        container.innerHTML = `<div class="error-message">❌ Error: ${error.message}</div>`;
    }
}

// ==================== INICIALIZAR ====================
document.getElementById('btnIdioma')?.addEventListener('click', cambiarIdioma);
aplicarTextos();
cargarNormas();
cargarChequeo();