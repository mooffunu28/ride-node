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
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
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
        } else {
            container.innerHTML = '<div class="error-message">⚠️ ' + (idiomaActual === 'es' ? 'No hay normas cargadas' : 'No rules loaded') + '</div>';
        }
    } catch (error) {
        container.innerHTML = `<div class="error-message">❌ Error: ${error.message}</div>`;
    }
}

// ==================== EVALUAR RIESGO DEL VIAJE ====================
async function evaluarRiesgoViaje() {
    const velocidadMaxima = parseInt(document.getElementById('velocidad').value) || 0;
    const distancia = parseInt(document.getElementById('distancia').value) || 0;
    const clima = document.getElementById('clima')?.value || 'dia';
    const tipoVia = document.getElementById('tipo_via')?.value || 'urbana';
    
    // OBTENER ESTADO DEL CHEQUEO PREVENTIVO
    const checkboxes = document.querySelectorAll('.check-riesgo');
    const chequeo = {
        casco: false,
        frenosDelanteros: false,
        frenosTraseros: false,
        lucesDelanteras: false,
        lucesTraseras: false,
        neumaticos: false,
        chalecoReflectivo: false,
        espejos: false
    };
    
    checkboxes.forEach(cb => {
        const nombre = cb.getAttribute('data-nombre') || '';
        const estado = cb.checked;
        if (nombre === 'Casco') chequeo.casco = estado;
        else if (nombre === 'Frenos Delanteros') chequeo.frenosDelanteros = estado;
        else if (nombre === 'Frenos Traseros') chequeo.frenosTraseros = estado;
        else if (nombre === 'Luces Delanteras') chequeo.lucesDelanteras = estado;
        else if (nombre === 'Luces Traseras') chequeo.lucesTraseras = estado;
        else if (nombre === 'Neumáticos') chequeo.neumaticos = estado;
        else if (nombre === 'Chaleco Reflectivo') chequeo.chalecoReflectivo = estado;
        else if (nombre === 'Espejos Retrovisores') chequeo.espejos = estado;
    });
    
    const divResultado = document.getElementById('resultado-riesgo');
    divResultado.innerHTML = `<div class="loading">${textos[idiomaActual].evaluando}</div>`;
    
    let puntajeRiesgo = 0;
    let factores = [];
    let advertencias = [];
    let puntoSinRetorno = false;
    const limitesVelocidad = { urbana: 60, rural: 80, carretera: 100 };
    const limiteSeguro = limitesVelocidad[tipoVia];
    
    // ==================== 1. FACTORES DEL CHEQUEO PREVENTIVO ====================
    if (!chequeo.casco) {
        puntajeRiesgo += 40;
        factores.push(idiomaActual === 'es' ? '❌ CASCO: No verificado o en mal estado' : '❌ HELMET: Not verified or in bad condition');
        advertencias.push(idiomaActual === 'es' ? '🚨 Usar casco certificado puede salvar tu vida' : '🚨 Wearing a certified helmet can save your life');
    } else {
        factores.push(idiomaActual === 'es' ? '✅ CASCO: Verificado' : '✅ HELMET: Verified');
    }
    
    if (!chequeo.frenosDelanteros || !chequeo.frenosTraseros) {
        puntajeRiesgo += 35;
        factores.push(idiomaActual === 'es' ? '❌ FRENOS: No verificados correctamente' : '❌ BRAKES: Not properly verified');
        advertencias.push(idiomaActual === 'es' ? '🔧 Revisa frenos delanteros y traseros' : '🔧 Check front and rear brakes');
    } else {
        factores.push(idiomaActual === 'es' ? '✅ FRENOS: Verificados' : '✅ BRAKES: Verified');
    }
    
    if (!chequeo.neumaticos) {
        puntajeRiesgo += 25;
        factores.push(idiomaActual === 'es' ? '❌ NEUMÁTICOS: Estado no verificado' : '❌ TYRES: Condition not verified');
        advertencias.push(idiomaActual === 'es' ? '🛞 Verifica presión y dibujo de los neumáticos' : '🛞 Check tyre pressure and tread');
    } else {
        factores.push(idiomaActual === 'es' ? '✅ NEUMÁTICOS: En buen estado' : '✅ TYRES: In good condition');
    }
    
    if (!chequeo.espejos) {
        puntajeRiesgo += 15;
        factores.push(idiomaActual === 'es' ? '⚠️ ESPEJOS: No verificados o mal ajustados' : '⚠️ MIRRORS: Not verified or poorly adjusted');
        advertencias.push(idiomaActual === 'es' ? '🔍 Ajusta tus espejos correctamente' : '🔍 Adjust your mirrors correctly');
    } else {
        factores.push(idiomaActual === 'es' ? '✅ ESPEJOS: Correctamente ajustados' : '✅ MIRRORS: Properly adjusted');
    }
    
    // ==================== 2. FACTORES DE VISIBILIDAD ====================
    const sinLuces = !chequeo.lucesDelanteras || !chequeo.lucesTraseras;
    if ((clima === 'noche' || clima === 'niebla') && sinLuces) {
        puntajeRiesgo += 30;
        factores.push(idiomaActual === 'es' ? '❌ LUCES: No funcionan para circular de noche/niebla' : '❌ LIGHTS: Not working for night/fog riding');
        advertencias.push(idiomaActual === 'es' ? '💡 Verifica luces delantera y trasera' : '💡 Check front and rear lights');
        puntoSinRetorno = true;
    } else if ((clima === 'noche' || clima === 'niebla')) {
        factores.push(idiomaActual === 'es' ? '✅ LUCES: Funcionan correctamente' : '✅ LIGHTS: Working properly');
    }
    
    if ((clima === 'noche' || clima === 'niebla' || tipoVia === 'carretera') && !chequeo.chalecoReflectivo) {
        puntajeRiesgo += 15;
        factores.push(idiomaActual === 'es' ? '⚠️ CHALECO REFLECTIVO: Obligatorio en estas condiciones' : '⚠️ REFLECTIVE VEST: Mandatory in these conditions');
        advertencias.push(idiomaActual === 'es' ? '🦺 Usa chaleco reflectivo para ser visible' : '🦺 Use reflective vest to be visible');
    } else if (chequeo.chalecoReflectivo) {
        factores.push(idiomaActual === 'es' ? '✅ CHALECO REFLECTIVO: Presente' : '✅ REFLECTIVE VEST: Present');
    }
    
    // ==================== 3. FACTORES DE VÍA ====================
    if (tipoVia === 'carretera') {
        if (!chequeo.chalecoReflectivo) {
            puntajeRiesgo += 20;
        }
        factores.push(idiomaActual === 'es' ? '🛣️ Carretera: Precaución con vehículos de alta velocidad' : '🛣️ Highway: Caution with high speed vehicles');
        advertencias.push(idiomaActual === 'es' ? '🚨 Mantén distancia y usa chaleco reflectivo' : '🚨 Keep distance and use reflective vest');
    } else if (tipoVia === 'rural') {
        puntajeRiesgo += 5;
        factores.push(idiomaActual === 'es' ? '🌄 Vía rural: Atención a curvas y animales' : '🌄 Rural road: Watch for curves and animals');
    } else {
        factores.push(idiomaActual === 'es' ? '🏙️ Vía urbana: Respetar límites de velocidad' : '🏙️ Urban road: Respect speed limits');
    }
    
    // ==================== 4. FACTORES CLIMÁTICOS ====================
    if (clima === 'lluvia') {
        puntajeRiesgo += 25;
        factores.push(idiomaActual === 'es' ? '⚠️ Lluvia: Pavimento mojado, reducir velocidad' : '⚠️ Rain: Wet pavement, reduce speed');
        advertencias.push(idiomaActual === 'es' ? '☔ Reduce velocidad y aumenta distancia de frenado' : '☔ Reduce speed and increase braking distance');
        puntoSinRetorno = true;
    } else if (clima === 'niebla') {
        puntajeRiesgo += 30;
        factores.push(idiomaActual === 'es' ? '⚠️ Niebla: Visibilidad severamente reducida' : '⚠️ Fog: Severely reduced visibility');
        advertencias.push(idiomaActual === 'es' ? '🌫️ Considera posponer el viaje' : '🌫️ Consider postponing the trip');
        puntoSinRetorno = true;
    } else if (clima === 'noche') {
        factores.push(idiomaActual === 'es' ? '🌙 Noche: Usa luces y chaleco reflectivo' : '🌙 Night: Use lights and reflective vest');
    } else {
        factores.push(idiomaActual === 'es' ? '☀️ Día soleado: Buena visibilidad' : '☀️ Sunny day: Good visibility');
    }
    
    // ==================== 5. FACTOR DISTANCIA ====================
    if (distancia > 500) {
        puntajeRiesgo += 25;
        factores.push(idiomaActual === 'es' ? `📏 Distancia EXTREMA: ${distancia} km` : `📏 EXTREME distance: ${distancia} km`);
        advertencias.push(idiomaActual === 'es' ? '🛑 Planifica descansos cada 2 horas' : '🛑 Plan breaks every 2 hours');
        puntoSinRetorno = true;
    } else if (distancia > 300) {
        puntajeRiesgo += 18;
        factores.push(idiomaActual === 'es' ? `📏 Distancia muy larga: ${distancia} km` : `📏 Very long distance: ${distancia} km`);
        advertencias.push(idiomaActual === 'es' ? '🧴 Descansa cada 2 horas y revisa combustible' : '🧴 Rest every 2 hours and check fuel');
    } else if (distancia > 150) {
        puntajeRiesgo += 10;
        factores.push(idiomaActual === 'es' ? `📏 Distancia larga: ${distancia} km` : `📏 Long distance: ${distancia} km`);
        advertencias.push(idiomaActual === 'es' ? '⛽ Verifica combustible antes de salir' : '⛽ Check fuel before leaving');
    } else if (distancia > 50) {
        puntajeRiesgo += 3;
        factores.push(idiomaActual === 'es' ? `📏 Distancia moderada: ${distancia} km` : `📏 Moderate distance: ${distancia} km`);
    } else if (distancia > 0) {
        factores.push(idiomaActual === 'es' ? `📏 Distancia corta: ${distancia} km` : `📏 Short distance: ${distancia} km`);
    }
    
    // ==================== 6. VELOCIDAD COMO "PUNTO SIN RETORNO" ====================
    if (velocidadMaxima > limiteSeguro) {
        const exceso = velocidadMaxima - limiteSeguro;
        puntoSinRetorno = true;
        
        if (exceso > 30) {
            const msg = idiomaActual === 'es' 
                ? `🚨 ¡PUNTO SIN RETORNO! ${velocidadMaxima} km/h, ${exceso} km/h sobre el límite (${limiteSeguro} km/h). NO podrás reaccionar a tiempo.`
                : `🚨 NO RETURN POINT! ${velocidadMaxima} km/h, ${exceso} km/h over limit (${limiteSeguro} km/h). You WILL NOT react in time.`;
            factores.push(msg);
        } else {
            const msg = idiomaActual === 'es'
                ? `⚠️ ADVERTENCIA: ${velocidadMaxima} km/h supera el límite seguro (${limiteSeguro} km/h).`
                : `⚠️ WARNING: ${velocidadMaxima} km/h exceeds safe limit (${limiteSeguro} km/h).`;
            factores.push(msg);
        }
        advertencias.push(idiomaActual === 'es' 
            ? `🐌 Reduce a ${limiteSeguro} km/h para tener margen de reacción`
            : `🐌 Reduce to ${limiteSeguro} km/h for reaction margin`);
    } else if (velocidadMaxima > 0) {
        factores.push(idiomaActual === 'es' 
            ? `✅ Velocidad: ${velocidadMaxima} km/h (dentro del límite ${limiteSeguro} km/h)`
            : `✅ Speed: ${velocidadMaxima} km/h (within limit ${limiteSeguro} km/h)`);
    } else {
        factores.push(idiomaActual === 'es' ? `⚡ Velocidad no especificada` : `⚡ Speed not specified`);
    }
    
    // ==================== DETERMINAR NIVEL DE RIESGO ====================
    let nivel, clase, nivelTexto;
    
    if (puntajeRiesgo >= 70 || puntoSinRetorno) {
        nivel = 'critico';
        clase = 'riesgo-critico';
        nivelTexto = idiomaActual === 'es' ? '🚨 RIESGO CRÍTICO - PUNTO SIN RETORNO' : '🚨 CRITICAL RISK - NO RETURN POINT';
    } else if (puntajeRiesgo >= 40) {
        nivel = 'moderado';
        clase = 'riesgo-moderado';
        nivelTexto = idiomaActual === 'es' ? '⚠️ RIESGO MODERADO' : '⚠️ MODERATE RISK';
    } else {
        nivel = 'bajo';
        clase = 'riesgo-seguro';
        nivelTexto = idiomaActual === 'es' ? '✅ RIESGO BAJO' : '✅ LOW RISK';
    }
    
    let mensajeFinal = '';
    if (nivel === 'critico') {
        mensajeFinal = idiomaActual === 'es'
            ? '🚨 ALTO RIESGO: Te recomendamos NO realizar este viaje hasta corregir los factores de riesgo.'
            : '🚨 HIGH RISK: We recommend NOT taking this trip until risks are corrected.';
    } else if (nivel === 'moderado') {
        mensajeFinal = idiomaActual === 'es'
            ? '⚠️ Precaución: Toma las precauciones recomendadas antes de salir.'
            : '⚠️ Caution: Take recommended precautions before leaving.';
    } else {
        mensajeFinal = idiomaActual === 'es'
            ? '✅ Viaje seguro. Recuerda siempre priorizar tu seguridad.'
            : '✅ Safe trip. Always prioritize your safety.';
    }
    
    divResultado.innerHTML = `
        <div class="${clase}" style="padding:0.8rem;">
            <strong style="font-size:0.9rem;">${nivelTexto}</strong>
            <p style="margin-top: 0.5rem;"><strong>${mensajeFinal}</strong></p>
            <p><strong>📊 Puntaje:</strong> ${puntajeRiesgo}/100</p>
            ${factores.length ? `<strong>📋 Factores evaluados:</strong><ul style="margin-left:1rem; margin-top:0.2rem; margin-bottom:0.5rem;">${factores.map(f => `<li style="font-size:0.7rem;">${f}</li>`).join('')}</ul>` : ''}
            ${advertencias.length ? `<strong>✅ Recomendaciones:</strong><ul style="margin-left:1rem; margin-top:0.2rem;">${advertencias.map(a => `<li style="font-size:0.7rem;">${a}</li>`).join('')}</ul>` : ''}
            <hr style="margin:0.5rem 0;">
            <p style="font-size:0.7rem;"><strong>📌 Recuerda:</strong> La velocidad no es el problema, es la consecuencia. Una moto en mal estado + alta velocidad = PUNTO SIN RETORNO.</p>
        </div>
    `;
}

// ==================== CONFIGURAR ACTUALIZACIÓN AUTOMÁTICA ====================
function configurarAutoUpdate() {
    function triggerAutoUpdate() {
        if (timeoutAutoUpdate) clearTimeout(timeoutAutoUpdate);
        timeoutAutoUpdate = setTimeout(() => evaluarRiesgoViaje(), 300);
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
    
    // Checkboxes del chequeo preventivo
    const checkboxesContainer = document.getElementById('componentes-check');
    
    function agregarEventosACheckboxes() {
        const checkboxes = document.querySelectorAll('.check-riesgo');
        checkboxes.forEach(cb => {
            cb.removeEventListener('change', triggerAutoUpdate);
            cb.addEventListener('change', triggerAutoUpdate);
        });
    }
    
    if (checkboxesContainer) {
        const observer = new MutationObserver(() => agregarEventosACheckboxes());
        observer.observe(checkboxesContainer, { childList: true, subtree: true });
        agregarEventosACheckboxes();
    }
}

// ==================== CARGAR CHEQUEO PREVENTIVO ====================
async function cargarChequeo() {
    const container = document.getElementById('chequeo-container');
    const checkContainer = document.getElementById('componentes-check');
    const t = textos[idiomaActual];
    container.innerHTML = `<div class="loading">${t.cargando}</div>`;
    
    const componentesMoto = [
        { categoria: "seguridad_activa", nombre: "Frenos Delanteros", desc_es: "Pastillas con grosor mínimo, discos sin rayas", desc_en: "Minimum pad thickness, smooth discs", prioridad: "Alta", paraCalculadora: true },
        { categoria: "seguridad_activa", nombre: "Frenos Traseros", desc_es: "Pastillas en buen estado, pedal sin juego", desc_en: "Good pads, no pedal play", prioridad: "Alta", paraCalculadora: true },
        { categoria: "seguridad_activa", nombre: "Luces Delanteras", desc_es: "Alta y baja funcionando, faro enfocado", desc_en: "High/low beam working, focused", prioridad: "Alta", paraCalculadora: true },
        { categoria: "seguridad_activa", nombre: "Luces Traseras", desc_es: "Luz roja y stop al frenar", desc_en: "Red light and stop light", prioridad: "Alta", paraCalculadora: true },
        { categoria: "seguridad_pasiva", nombre: "Casco", desc_es: "Certificado, sin golpes, correa buena", desc_en: "Certified, no impacts, good strap", prioridad: "Alta", paraCalculadora: true },
        { categoria: "seguridad_pasiva", nombre: "Chaleco Reflectivo", desc_es: "Bandas reflectivas visibles", desc_en: "Visible reflective bands", prioridad: "Alta", paraCalculadora: true },
        { categoria: "seguridad_pasiva", nombre: "Guantes", desc_es: "Protección en nudillos", desc_en: "Knuckle protection", prioridad: "Media", paraCalculadora: false },
        { categoria: "suspension_neumaticos", nombre: "Neumáticos", desc_es: "Presión correcta, dibujo >1.6mm", desc_en: "Correct pressure, tread >1.6mm", prioridad: "Alta", paraCalculadora: true },
        { categoria: "sistema_electrico", nombre: "Espejos Retrovisores", desc_es: "Ajustados, sin roturas", desc_en: "Adjusted, no cracks", prioridad: "Media", paraCalculadora: true },
        { categoria: "motor_transmision", nombre: "Aceite", desc_es: "Nivel correcto, sin fugas", desc_en: "Correct level, no leaks", prioridad: "Alta", paraCalculadora: false },
        { categoria: "motor_transmision", nombre: "Cadena", desc_es: "Tensión correcta, lubricada", desc_en: "Correct tension, lubricated", prioridad: "Alta", paraCalculadora: false }
    ];
    
    try {
        const grupos = {
            seguridad_activa: componentesMoto.filter(c => c.categoria === 'seguridad_activa'),
            seguridad_pasiva: componentesMoto.filter(c => c.categoria === 'seguridad_pasiva'),
            motor_transmision: componentesMoto.filter(c => c.categoria === 'motor_transmision'),
            suspension_neumaticos: componentesMoto.filter(c => c.categoria === 'suspension_neumaticos'),
            sistema_electrico: componentesMoto.filter(c => c.categoria === 'sistema_electrico')
        };
        
        const getDesc = (c) => idiomaActual === 'es' ? c.desc_es : c.desc_en;
        
        container.innerHTML = Object.entries(grupos).map(([key, items]) => `
            <div class="checklist-group">
                <h3 class="group-title">${textos[idiomaActual][key]}</h3>
                ${items.map(c => `
                    <div class="checklist-item">
                        <input type="checkbox" class="check-componente" data-nombre="${c.nombre}">
                        <div style="flex:1">
                            <strong>${c.nombre}</strong><br>
                            <small style="color:#6b8a8a;">${getDesc(c)}</small><br>
                            <span class="priority-${c.prioridad === 'Alta' ? 'high' : 'medium'}">${textos[idiomaActual].prioridad}: ${c.prioridad}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `).join('');
        
        const componentesParaCalculadora = componentesMoto.filter(c => c.paraCalculadora === true);
        checkContainer.innerHTML = componentesParaCalculadora.map(c => `
            <label class="checkbox-label">
                <input type="checkbox" class="check-riesgo" data-nombre="${c.nombre}">
                ${c.nombre} ${textos[idiomaActual].buen_estado}
            </label>
        `).join('');
        
        configurarAutoUpdate();
        setTimeout(() => evaluarRiesgoViaje(), 100);
        
    } catch (error) {
        container.innerHTML = `<div class="error-message">❌ Error: ${error.message}</div>`;
    }
}

// ==================== EVENTOS ====================
document.getElementById('btnIdioma')?.addEventListener('click', cambiarIdioma);
document.getElementById('calcularRiesgo')?.addEventListener('click', evaluarRiesgoViaje);

// ==================== VERIFICAR AUTENTICACIÓN ====================
const token = localStorage.getItem('ride_token');
const usuario = localStorage.getItem('ride_usuario');
if (!token || !usuario) window.location.href = '/';

// ==================== INICIALIZAR ====================
aplicarTextos();
cargarNormas();
cargarChequeo();