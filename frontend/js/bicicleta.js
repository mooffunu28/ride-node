// ==================== TEXTO TRADUCIDO ====================
const textos = {
    es: {
        titulo: "🚲 Seguridad en Bicicleta",
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
        documentacion: "📄 Documentación",
        evaluando: "Evaluando riesgos..."
    },
    en: {
        titulo: "🚲 Bicycle Safety",
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
        documentacion: "📄 Documentation",
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
        const response = await fetch(`/api/normas?tipo=bicicleta&idioma=${idiomaActual}`);
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
    // Obtener valores de los campos
    const velocidadMaxima = parseInt(document.getElementById('velocidad').value) || 0;
    const distancia = parseInt(document.getElementById('distancia').value) || 0;
    const clima = document.getElementById('clima')?.value || 'dia';
    const tipoVia = document.getElementById('tipo_via')?.value || 'urbana';
    
    // OBTENER ESTADO DEL CHEQUEO PREVENTIVO (¡CRÍTICO!)
    const checkboxes = document.querySelectorAll('.check-riesgo');
    const chequeo = {
        casco: false,
        frenos: false,
        luces: false,
        reflectivos: false,
        neumaticos: false
    };
    
    checkboxes.forEach(cb => {
        const nombre = cb.getAttribute('data-nombre') || '';
        const estado = cb.checked;
        if (nombre === 'Casco') chequeo.casco = estado;
        else if (nombre === 'Frenos') chequeo.frenos = estado;
        else if (nombre === 'Luces') chequeo.luces = estado;
        else if (nombre === 'Reflectivos') chequeo.reflectivos = estado;
        else if (nombre === 'Neumáticos') chequeo.neumaticos = estado;
    });
    
    const divResultado = document.getElementById('resultado-riesgo');
    divResultado.innerHTML = `<div class="loading">${textos[idiomaActual].evaluando}</div>`;
    
    let puntajeRiesgo = 0;
    let factores = [];
    let advertencias = [];
    let puntoSinRetorno = false;
    const limitesVelocidad = { urbana: 25, rural: 30, carretera: 20 };
    const limiteSeguro = limitesVelocidad[tipoVia];
    
    // ==================== 1. FACTORES DEL CHEQUEO PREVENTIVO (PESO ALTO) ====================
    if (!chequeo.casco) {
        puntajeRiesgo += 40;
        factores.push(idiomaActual === 'es' ? '❌ CASCO: No verificado o en mal estado' : '❌ HELMET: Not verified or in bad condition');
        advertencias.push(idiomaActual === 'es' ? '🚨 Usar casco certificado puede salvar tu vida' : '🚨 Wearing a certified helmet can save your life');
    } else {
        factores.push(idiomaActual === 'es' ? '✅ CASCO: Verificado y en buen estado' : '✅ HELMET: Verified and in good condition');
    }
    
    if (!chequeo.frenos) {
        puntajeRiesgo += 35;
        factores.push(idiomaActual === 'es' ? '❌ FRENOS: No verificados' : '❌ BRAKES: Not verified');
        advertencias.push(idiomaActual === 'es' ? '🔧 Revisa tus frenos antes de cualquier salida' : '🔧 Check your brakes before any ride');
    } else {
        factores.push(idiomaActual === 'es' ? '✅ FRENOS: Verificados' : '✅ BRAKES: Verified');
    }
    
    if (!chequeo.neumaticos && distancia > 10) {
        puntajeRiesgo += 20;
        factores.push(idiomaActual === 'es' ? '❌ NEUMÁTICOS: Estado no verificado para viaje largo' : '❌ TYRES: Condition not verified for long trip');
        advertencias.push(idiomaActual === 'es' ? '🛞 Verifica presión y dibujo de los neumáticos' : '🛞 Check tyre pressure and tread');
    } else if (!chequeo.neumaticos) {
        puntajeRiesgo += 10;
        factores.push(idiomaActual === 'es' ? '⚠️ NEUMÁTICOS: Verificar antes de salir' : '⚠️ TYRES: Check before riding');
    } else {
        factores.push(idiomaActual === 'es' ? '✅ NEUMÁTICOS: En buen estado' : '✅ TYRES: In good condition');
    }
    
    // ==================== 2. FACTORES DE VISIBILIDAD ====================
    if ((clima === 'noche' || clima === 'niebla') && !chequeo.luces) {
        puntajeRiesgo += 30;
        factores.push(idiomaActual === 'es' ? '❌ LUCES: No funcionan para circular de noche/niebla' : '❌ LIGHTS: Not working for night/fog riding');
        advertencias.push(idiomaActual === 'es' ? '💡 Instala y verifica tus luces antes de salir' : '💡 Install and check your lights before riding');
        puntoSinRetorno = true;
    } else if ((clima === 'noche' || clima === 'niebla') && chequeo.luces) {
        factores.push(idiomaActual === 'es' ? '✅ LUCES: Funcionan correctamente para noche/niebla' : '✅ LIGHTS: Working properly for night/fog');
    }
    
    if ((clima === 'noche' || clima === 'niebla') && !chequeo.reflectivos) {
        puntajeRiesgo += 15;
        factores.push(idiomaActual === 'es' ? '⚠️ REFLECTIVOS: No tienes elementos reflectivos para poca visibilidad' : '⚠️ REFLECTIVE: No reflective elements for low visibility');
        advertencias.push(idiomaActual === 'es' ? '🦺 Usa chaleco o bandas reflectivas' : '🦺 Use reflective vest or bands');
    } else if ((clima === 'noche' || clima === 'niebla') && chequeo.reflectivos) {
        factores.push(idiomaActual === 'es' ? '✅ REFLECTIVOS: Elementos reflectivos presentes' : '✅ REFLECTIVE: Reflective elements present');
    }
    
    // ==================== 3. FACTORES DE VÍA ====================
    if (tipoVia === 'carretera') {
        puntajeRiesgo += 30;
        factores.push(idiomaActual === 'es' ? '⚠️ VÍA NO RECOMENDADA: Carretera con vehículos de alta velocidad' : '⚠️ NOT RECOMMENDED: Highway with high speed vehicles');
        advertencias.push(idiomaActual === 'es' ? '🚨 Considera rutas alternas más seguras para bicicleta' : '🚨 Consider safer alternative routes for bicycle');
        puntoSinRetorno = true;
    } else if (tipoVia === 'rural') {
        puntajeRiesgo += 10;
        factores.push(idiomaActual === 'es' ? '⚠️ Vía rural: Menor iluminación y posible mal estado' : '⚠️ Rural road: Less lighting and possible poor condition');
        advertencias.push(idiomaActual === 'es' ? '🔦 Lleva luces potentes y herramientas adicionales' : '🔦 Bring powerful lights and additional tools');
    } else {
        factores.push(idiomaActual === 'es' ? '✅ Vía urbana: Adecuada para bicicleta' : '✅ Urban road: Suitable for bicycle');
    }
    
    // ==================== 4. FACTORES CLIMÁTICOS ====================
    if (clima === 'lluvia') {
        puntajeRiesgo += 25;
        factores.push(idiomaActual === 'es' ? '⚠️ Lluvia: Pavimento mojado reduce adherencia' : '⚠️ Rain: Wet pavement reduces grip');
        advertencias.push(idiomaActual === 'es' ? '☔ Reduce velocidad planificada y aumenta distancia de frenado' : '☔ Reduce planned speed and increase braking distance');
        puntoSinRetorno = true;
    } else if (clima === 'niebla') {
        puntajeRiesgo += 30;
        factores.push(idiomaActual === 'es' ? '⚠️ Niebla: Visibilidad severamente reducida' : '⚠️ Fog: Severely reduced visibility');
        advertencias.push(idiomaActual === 'es' ? '🌫️ Considera posponer el viaje hasta que mejore la visibilidad' : '🌫️ Consider postponing the trip until visibility improves');
        puntoSinRetorno = true;
    } else if (clima === 'noche') {
        factores.push(idiomaActual === 'es' ? '🌙 Noche: Visibilidad reducida, usar luces' : '🌙 Night: Reduced visibility, use lights');
    } else {
        factores.push(idiomaActual === 'es' ? '☀️ Día soleado: Buena visibilidad' : '☀️ Sunny day: Good visibility');
    }
    
    // ==================== 5. FACTOR DISTANCIA (Fatiga) ====================
    if (distancia > 50) {
        puntajeRiesgo += 20;
        factores.push(idiomaActual === 'es' ? `📏 Distancia EXTREMA: ${distancia} km (alto riesgo de fatiga)` : `📏 EXTREME distance: ${distancia} km (high risk of fatigue)`);
        advertencias.push(idiomaActual === 'es' ? '🛑 Considera dividir el viaje en etapas con descansos' : '🛑 Consider splitting the trip into stages with breaks');
        puntoSinRetorno = true;
    } else if (distancia > 30) {
        puntajeRiesgo += 12;
        factores.push(idiomaActual === 'es' ? `📏 Distancia larga: ${distancia} km` : `📏 Long distance: ${distancia} km`);
        advertencias.push(idiomaActual === 'es' ? '🧴 Lleva agua, alimentos y herramientas' : '🧴 Bring water, food and tools');
    } else if (distancia > 15) {
        puntajeRiesgo += 5;
        factores.push(idiomaActual === 'es' ? `📏 Distancia moderada: ${distancia} km` : `📏 Moderate distance: ${distancia} km`);
    } else if (distancia > 0) {
        factores.push(idiomaActual === 'es' ? `📏 Distancia corta: ${distancia} km` : `📏 Short distance: ${distancia} km`);
    }
    
    // ==================== 6. VELOCIDAD COMO "PUNTO SIN RETORNO" ====================
    let mensajeVelocidad = '';
    
    if (velocidadMaxima > limiteSeguro) {
        const exceso = velocidadMaxima - limiteSeguro;
        puntoSinRetorno = true;
        
        if (exceso > 10) {
            mensajeVelocidad = idiomaActual === 'es' 
                ? `🚨 ¡PUNTO SIN RETORNO! Planeas ir a ${velocidadMaxima} km/h, ${exceso} km/h por encima del límite seguro (${limiteSeguro} km/h). En caso de imprevisto, NO podrás reaccionar a tiempo.`
                : `🚨 NO RETURN POINT! You plan to go at ${velocidadMaxima} km/h, ${exceso} km/h above the safe limit (${limiteSeguro} km/h). In case of unexpected events, you WILL NOT be able to react in time.`;
        } else {
            mensajeVelocidad = idiomaActual === 'es'
                ? `⚠️ ADVERTENCIA: ${velocidadMaxima} km/h supera el límite seguro (${limiteSeguro} km/h). Tu capacidad de reacción se reduce significativamente.`
                : `⚠️ WARNING: ${velocidadMaxima} km/h exceeds the safe limit (${limiteSeguro} km/h). Your reaction capacity is significantly reduced.`;
        }
        
        factores.push(mensajeVelocidad);
        advertencias.push(idiomaActual === 'es' 
            ? `🐌 Reduce tu velocidad máxima a ${limiteSeguro} km/h para tener margen de reacción`
            : `🐌 Reduce your maximum speed to ${limiteSeguro} km/h to have reaction margin`);
    } else if (velocidadMaxima > 0) {
        mensajeVelocidad = idiomaActual === 'es'
            ? `✅ Velocidad planificada (${velocidadMaxima} km/h) dentro del límite seguro (${limiteSeguro} km/h)`
            : `✅ Planned speed (${velocidadMaxima} km/h) within safe limit (${limiteSeguro} km/h)`;
        factores.push(mensajeVelocidad);
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
            ? '🚨 ALTO RIESGO: Te recomendamos NO realizar este viaje hasta corregir los factores de riesgo identificados.'
            : '🚨 HIGH RISK: We recommend NOT taking this trip until the identified risk factors are corrected.';
    } else if (nivel === 'moderado') {
        mensajeFinal = idiomaActual === 'es'
            ? '⚠️ Precaución: El viaje presenta riesgos. Toma las precauciones recomendadas antes de salir.'
            : '⚠️ Caution: The trip presents risks. Take the recommended precautions before leaving.';
    } else {
        mensajeFinal = idiomaActual === 'es'
            ? '✅ Viaje seguro. Recuerda siempre priorizar tu seguridad y hacer chequeos periódicos.'
            : '✅ Safe trip. Always remember to prioritize your safety and perform periodic checks.';
    }
    
    divResultado.innerHTML = `
        <div class="${clase}" style="padding:0.8rem;">
            <strong style="font-size:0.9rem;">${nivelTexto}</strong>
            <p style="margin-top: 0.5rem;"><strong>${mensajeFinal}</strong></p>
            <p><strong>${idiomaActual === 'es' ? '📊 Puntaje de riesgo:' : '📊 Risk score:'}</strong> ${puntajeRiesgo}/100</p>
            ${factores.length ? `<strong>${idiomaActual === 'es' ? '📋 Factores evaluados:' : '📋 Factors evaluated:'}</strong><ul style="margin-left: 1rem; margin-top: 0.2rem; margin-bottom:0.5rem;">${factores.map(f => `<li style="font-size:0.7rem;">${f}</li>`).join('')}</ul>` : ''}
            ${advertencias.length ? `<strong>${idiomaActual === 'es' ? '✅ Recomendaciones:' : '✅ Recommendations:'}</strong><ul style="margin-left: 1rem; margin-top: 0.2rem;">${advertencias.map(a => `<li style="font-size:0.7rem;">${a}</li>`).join('')}</ul>` : ''}
            <hr style="margin: 0.5rem 0;">
            <p style="font-size:0.7rem;"><strong>${idiomaActual === 'es' ? '📌 Recuerda:' : '📌 Remember:'}</strong> ${idiomaActual === 'es' ? 'La velocidad no es el problema, es la consecuencia. Una bicicleta en mal estado + alta velocidad = PUNTO SIN RETORNO.' : 'Speed is not the problem, it is the consequence. A bicycle in bad condition + high speed = NO RETURN POINT.'}</p>
        </div>
    `;
}

// ==================== CONFIGURAR ACTUALIZACIÓN AUTOMÁTICA (TODOS LOS CAMPOS) ====================
function configurarAutoUpdate() {
    // Función que dispara la actualización con debounce
    function triggerAutoUpdate() {
        if (timeoutAutoUpdate) clearTimeout(timeoutAutoUpdate);
        timeoutAutoUpdate = setTimeout(() => {
            evaluarRiesgoViaje();
        }, 300);
    }
    
    // 1. Inputs numéricos
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
    
    // 2. Selects (clima y tipo de vía)
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
    
    // 3. Checkboxes del chequeo preventivo (los que afectan el riesgo)
    const checkboxesContainer = document.getElementById('componentes-check');
    
    function agregarEventosACheckboxes() {
        const checkboxes = document.querySelectorAll('.check-riesgo');
        checkboxes.forEach(cb => {
            cb.removeEventListener('change', triggerAutoUpdate);
            cb.addEventListener('change', triggerAutoUpdate);
        });
    }
    
    if (checkboxesContainer) {
        // Observar cambios en el DOM para detectar nuevos checkboxes
        const observer = new MutationObserver(() => {
            agregarEventosACheckboxes();
        });
        observer.observe(checkboxesContainer, { childList: true, subtree: true });
        
        // Agregar eventos a los checkboxes existentes
        agregarEventosACheckboxes();
    }
    
    console.log('✅ Auto-refresco configurado correctamente');
}

// ==================== CARGAR CHEQUEO PREVENTIVO ====================
async function cargarChequeo() {
    const container = document.getElementById('chequeo-container');
    const checkContainer = document.getElementById('componentes-check');
    const t = textos[idiomaActual];
    container.innerHTML = `<div class="loading">${t.cargando}</div>`;
    
    const componentesBici = [
        { categoria: "seguridad_mecanica", nombre: "Frenos", 
          desc_es: "Pastillas con desgaste mínimo, respuesta inmediata", 
          desc_en: "Minimum pad wear, immediate response",
          prioridad: "Alta", paraCalculadora: true },
        { categoria: "seguridad_mecanica", nombre: "Neumáticos", 
          desc_es: "Presión adecuada, dibujo visible, sin cortes", 
          desc_en: "Proper pressure, visible tread, no cuts",
          prioridad: "Alta", paraCalculadora: true },
        { categoria: "seguridad_mecanica", nombre: "Luces", 
          desc_es: "Funcionan correctamente, visibles a 50 metros", 
          desc_en: "Work properly, visible at 50 meters",
          prioridad: "Alta", paraCalculadora: true },
        { categoria: "seguridad_equipo", nombre: "Casco", 
          desc_es: "Certificado, sin golpes, talla correcta", 
          desc_en: "Certified, no impacts, correct size",
          prioridad: "Alta", paraCalculadora: true },
        { categoria: "seguridad_equipo", nombre: "Reflectivos", 
          desc_es: "Chaleco o bandas reflectivas", 
          desc_en: "Reflective vest or bands",
          prioridad: "Alta", paraCalculadora: true },
        { categoria: "seguridad_mecanica", nombre: "Cadena", 
          desc_es: "Lubricada, tensión correcta", 
          desc_en: "Lubricated, correct tension",
          prioridad: "Media", paraCalculadora: false },
        { categoria: "seguridad_equipo", nombre: "Guantes", 
          desc_es: "Protección en palma", 
          desc_en: "Palm protection",
          prioridad: "Media", paraCalculadora: false },
        { categoria: "documentacion", nombre: "Kit herramientas", 
          desc_es: "Parches, bomba de aire", 
          desc_en: "Patches, air pump",
          prioridad: "Media", paraCalculadora: false }
    ];
    
    try {
        const grupos = {
            seguridad_mecanica: componentesBici.filter(c => c.categoria === 'seguridad_mecanica'),
            seguridad_equipo: componentesBici.filter(c => c.categoria === 'seguridad_equipo'),
            documentacion: componentesBici.filter(c => c.categoria === 'documentacion')
        };
        
        const getDesc = (c) => idiomaActual === 'es' ? c.desc_es : c.desc_en;
        
        container.innerHTML = `
            <div class="checklist-group">
                <h3 class="group-title">${textos[idiomaActual].seguridad_mecanica}</h3>
                ${grupos.seguridad_mecanica.map(c => `
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
            <div class="checklist-group">
                <h3 class="group-title">${textos[idiomaActual].seguridad_equipo}</h3>
                ${grupos.seguridad_equipo.map(c => `
                    <div class="checklist-item">
                        <input type="checkbox" class="check-componente" data-nombre="${c.nombre}">
                        <div style="flex:1">
                            <strong>${c.nombre}</strong><br>
                            <small>${getDesc(c)}</small><br>
                            <span class="priority-${c.prioridad === 'Alta' ? 'high' : 'medium'}">${textos[idiomaActual].prioridad}: ${c.prioridad}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="checklist-group">
                <h3 class="group-title">${textos[idiomaActual].documentacion}</h3>
                ${grupos.documentacion.map(c => `
                    <div class="checklist-item">
                        <input type="checkbox" class="check-componente" data-nombre="${c.nombre}">
                        <div style="flex:1">
                            <strong>${c.nombre}</strong><br>
                            <small>${getDesc(c)}</small><br>
                            <span class="priority-medium">${textos[idiomaActual].prioridad}: ${c.prioridad}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        const componentesParaCalculadora = componentesBici.filter(c => c.paraCalculadora === true);
        
        checkContainer.innerHTML = componentesParaCalculadora.map(c => `
            <label class="checkbox-label">
                <input type="checkbox" class="check-riesgo" data-nombre="${c.nombre}">
                ${c.nombre} ${textos[idiomaActual].buen_estado}
            </label>
        `).join('');
        
        // Configurar auto-refresco después de cargar los checkboxes
        configurarAutoUpdate();
        
        // Ejecutar evaluación inicial
        setTimeout(() => evaluarRiesgoViaje(), 100);
        
    } catch (error) {
        console.error('Error cargando chequeo:', error);
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