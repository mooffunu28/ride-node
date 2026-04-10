// ==================== VERSIÓN CON TRADUCCIÓN COMPLETA DE CATEGORÍAS ====================
console.log('✅ bicicleta.js cargado');

const textos = {
    es: {
        titulo: "🚲 Seguridad en Bicicleta",
        subtitulo: "Revisa tu estado, conoce las normas y calcula tu nivel de riesgo",
        normas: "📋 Normas de Tránsito",
        chequeo: "✅ Chequeo Preventivo (Antes de salir)",
        riesgo: "⚠️ Evaluación de Riesgo del Viaje",
        velocidad: "Velocidad máxima planeada (km/h)",
        distancia: "Distancia del recorrido (km)",
        clima: "Condiciones climáticas",
        clima_dia: "☀️ Día soleado",
        clima_lluvia: "🌧️ Lluvia",
        clima_noche: "🌙 Noche",
        clima_niebla: "🌫️ Niebla",
        tipo_via: "Tipo de vía",
        via_urbana: "🏙️ Urbana (máx 25 km/h)",
        via_rural: "🌄 Rural (máx 30 km/h)",
        via_carretera: "🛣️ Carretera (NO RECOMENDADO)",
        evaluar: "Evaluar Riesgo del Viaje",
        prioridad: "Prioridad",
        buen_estado: "en buen estado",
        cargando: "Cargando...",
        multa: "Multa tipo",
        articulo: "Artículo",
        seguridad_mecanica: "🔧 Seguridad Mecánica",
        seguridad_equipo: "🛡️ Equipo de Protección",
        documentacion: "📄 Documentación"
    },
    en: {
        titulo: "🚲 Bicycle Safety",
        subtitulo: "Check your status, know the rules and calculate your risk level",
        normas: "📋 Traffic Rules",
        chequeo: "✅ Preventive Check (Before riding)",
        riesgo: "⚠️ Trip Risk Assessment",
        velocidad: "Maximum planned speed (km/h)",
        distancia: "Trip distance (km)",
        clima: "Weather conditions",
        clima_dia: "☀️ Sunny day",
        clima_lluvia: "🌧️ Rain",
        clima_noche: "🌙 Night",
        clima_niebla: "🌫️ Fog",
        tipo_via: "Road type",
        via_urbana: "🏙️ Urban (max 25 km/h)",
        via_rural: "🌄 Rural (max 30 km/h)",
        via_carretera: "🛣️ Highway (NOT RECOMMENDED)",
        evaluar: "Assess Trip Risk",
        prioridad: "Priority",
        buen_estado: "in good condition",
        cargando: "Loading...",
        multa: "Fine type",
        articulo: "Article",
        seguridad_mecanica: "🔧 Mechanical Safety",
        seguridad_equipo: "🛡️ Protective Gear",
        documentacion: "📄 Documentation"
    }
};

let idiomaActual = localStorage.getItem('ride_idioma') || 'es';

function aplicarTextos() {
    const t = textos[idiomaActual];
    
    document.getElementById('titulo').innerHTML = t.titulo;
    document.getElementById('subtitulo').innerHTML = t.subtitulo;
    document.getElementById('tituloNormas').innerHTML = t.normas;
    document.getElementById('tituloChequeo').innerHTML = t.chequeo;
    document.getElementById('tituloRiesgo').innerHTML = t.riesgo;
    document.getElementById('btnCalcularTexto').innerHTML = t.evaluar;
    document.getElementById('btnIdioma').innerHTML = idiomaActual === 'es' ? '🌐 English' : '🌐 Español';
    
    const labelVelocidad = document.getElementById('labelVelocidad');
    if (labelVelocidad) labelVelocidad.innerHTML = t.velocidad;
    const labelDistancia = document.getElementById('labelDistancia');
    if (labelDistancia) labelDistancia.innerHTML = t.distancia;
    const labelClima = document.getElementById('labelClima');
    if (labelClima) labelClima.innerHTML = t.clima;
    const labelTipoVia = document.getElementById('labelTipoVia');
    if (labelTipoVia) labelTipoVia.innerHTML = t.tipo_via;
    
    const velocidadInput = document.getElementById('velocidad');
    if (velocidadInput) velocidadInput.placeholder = t.velocidad;
    const distanciaInput = document.getElementById('distancia');
    if (distanciaInput) distanciaInput.placeholder = t.distancia;
    
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
            const t = textos[idiomaActual];
            container.innerHTML = data.data.map(n => `
                <div class="norma-card">
                    <div class="norma-check"><i class="fas fa-check"></i></div>
                    <div class="norma-contenido">
                        <div class="norma-header">
                            <span class="norma-articulo">${t.articulo} ${n.art_num}</span>
                            ${n.tipo_multa ? `<span class="norma-multa multa-${n.tipo_multa}">💰 ${t.multa} ${n.tipo_multa}</span>` : ''}
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
    if (!container) return;
    container.innerHTML = '<div class="loading">Cargando checklist...</div>';
    try {
        const res = await fetch(`/api/chequeo?tipo=Cicla&idioma=${idiomaActual}`);
        const data = await res.json();
        if (data.data && data.data.length > 0) {
            const t = textos[idiomaActual];
            
            // Agrupar componentes por categoría
            const grupos = {
                seguridad_mecanica: data.data.filter(c => 
                    c.nom_comp === 'Frenos' || c.nom_comp === 'Frenos Delanteros' || c.nom_comp === 'Frenos Traseros' ||
                    c.nom_comp === 'Luces' || c.nom_comp === 'Luces Delantera' || c.nom_comp === 'Luces Trasera' ||
                    c.nom_comp === 'Neumáticos' || c.nom_comp === 'Cámaras' || c.nom_comp === 'Cadena' ||
                    c.nom_comp === 'Dirección' || c.nom_comp === 'Sillín' || c.nom_comp === 'Pedales' ||
                    c.nom_comp === 'Cambios' || c.nom_comp === 'Manillar' || c.nom_comp === 'Piñones' || c.nom_comp === 'Plato' ||
                    c.nom_comp === 'Direccionales'),
                seguridad_equipo: data.data.filter(c => 
                    c.nom_comp === 'Casco' || c.nom_comp === 'Guantes' || c.nom_comp === 'Gafas' || 
                    c.nom_comp === 'Chaleco Reflectivo' || c.nom_comp === 'Timbre'),
                documentacion: data.data.filter(c => 
                    c.nom_comp === 'Kit de Herramientas' || c.nom_comp === 'Botiquín' || 
                    c.nom_comp === 'Documentación' || c.nom_comp === 'Teléfono de Emergencias' || 
                    c.nom_comp === 'Agua y Alimentos' || c.nom_comp === 'Kit de Primeros Auxilios')
            };
            
            container.innerHTML = `
                <div class="checklist-group">
                    <h3 class="group-title">${t.seguridad_mecanica}</h3>
                    ${grupos.seguridad_mecanica.map(c => `
                        <div class="checklist-item">
                            <input type="checkbox" class="check-riesgo" data-nombre="${c.nom_comp}" checked>
                            <div style="flex:1">
                                <strong>${c.nom_comp}</strong><br>
                                <small>${c.estado_opt}</small><br>
                                <span class="${c.prioridad === 'Alta' ? 'priority-high' : 'priority-medium'}">${t.prioridad}: ${c.prioridad}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="checklist-group">
                    <h3 class="group-title">${t.seguridad_equipo}</h3>
                    ${grupos.seguridad_equipo.map(c => `
                        <div class="checklist-item">
                            <input type="checkbox" class="check-riesgo" data-nombre="${c.nom_comp}" checked>
                            <div style="flex:1">
                                <strong>${c.nom_comp}</strong><br>
                                <small>${c.estado_opt}</small><br>
                                <span class="${c.prioridad === 'Alta' ? 'priority-high' : 'priority-medium'}">${t.prioridad}: ${c.prioridad}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="checklist-group">
                    <h3 class="group-title">${t.documentacion}</h3>
                    ${grupos.documentacion.map(c => `
                        <div class="checklist-item">
                            <input type="checkbox" class="check-riesgo" data-nombre="${c.nom_comp}" checked>
                            <div style="flex:1">
                                <strong>${c.nom_comp}</strong><br>
                                <small>${c.estado_opt}</small><br>
                                <span class="${c.prioridad === 'Alta' ? 'priority-high' : 'priority-medium'}">${t.prioridad}: ${c.prioridad}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            document.querySelectorAll('.check-riesgo').forEach(cb => {
                cb.removeEventListener('change', actualizarRiesgo);
                cb.addEventListener('change', actualizarRiesgo);
            });
            
            const velocidadInput = document.getElementById('velocidad');
            const distanciaInput = document.getElementById('distancia');
            const climaSelect = document.getElementById('clima');
            const viaSelect = document.getElementById('tipo_via');
            const btnCalcular = document.getElementById('calcularRiesgo');
            
            if (velocidadInput) velocidadInput.addEventListener('input', actualizarRiesgo);
            if (distanciaInput) distanciaInput.addEventListener('input', actualizarRiesgo);
            if (climaSelect) climaSelect.addEventListener('change', actualizarRiesgo);
            if (viaSelect) viaSelect.addEventListener('change', actualizarRiesgo);
            if (btnCalcular) btnCalcular.addEventListener('click', actualizarRiesgo);
            
            setTimeout(() => actualizarRiesgo(), 500);
        }
    } catch(e) { container.innerHTML = '<div class="error-message">Error</div>'; }
}

async function actualizarRiesgo() {
    const velocidad = parseInt(document.getElementById('velocidad')?.value) || 0;
    const distancia = parseInt(document.getElementById('distancia')?.value) || 0;
    const clima = document.getElementById('clima')?.value || 'dia';
    const tipoVia = document.getElementById('tipo_via')?.value || 'urbana';
    
    const chequeo = {};
    document.querySelectorAll('.check-riesgo').forEach(cb => {
        const nombre = cb.getAttribute('data-nombre');
        if (nombre) chequeo[nombre] = cb.checked;
    });
    
    const divResultado = document.getElementById('resultado-riesgo');
    if (!divResultado) return;
    divResultado.innerHTML = `<div class="loading">${textos[idiomaActual].cargando}</div>`;
    
    try {
        const response = await fetch('/api/riesgo/calcular', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                velocidad, distancia, clima, tipoVia, chequeo, 
                tipo_vehiculo: 'Cicla', idioma: idiomaActual 
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
                <p>${resultado.mensaje || ''}</p>
                <p><strong>📊 ${idiomaActual === 'es' ? 'Puntaje' : 'Score'}:</strong> ${resultado.puntaje}/100</p>
                ${resultado.factores?.length ? `<strong>📋 ${idiomaActual === 'es' ? 'Factores:' : 'Factors:'}</strong><ul>${resultado.factores.map(f => `<li>${f}</li>`).join('')}</ul>` : ''}
                ${resultado.recomendaciones?.length ? `<strong>✅ ${idiomaActual === 'es' ? 'Recomendaciones:' : 'Recommendations:'}</strong><ul>${resultado.recomendaciones.map(r => `<li>${r}</li>`).join('')}</ul>` : ''}
            </div>
        `;
    } catch (error) {
        divResultado.innerHTML = `<div class="riesgo-critico">❌ Error: ${error.message}</div>`;
    }
}

document.getElementById('btnIdioma')?.addEventListener('click', cambiarIdioma);

const token = localStorage.getItem('ride_token');
const usuario = localStorage.getItem('ride_usuario');
if (!token || !usuario) window.location.href = '/';

aplicarTextos();
cargarNormas();
cargarChequeo();