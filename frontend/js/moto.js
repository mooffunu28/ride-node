// ==================== VERSIÓN MÍNIMA Y SEGURA ====================
console.log('moto.js cargado');

// Textos básicos
const textos = {
    es: { prioridad: "Prioridad", buen_estado: "en buen estado", cargando: "Cargando..." },
    en: { prioridad: "Priority", buen_estado: "in good condition", cargando: "Loading..." }
};

let idiomaActual = localStorage.getItem('ride_idioma') || 'es';

function aplicarTextos() {
    const btnIdioma = document.getElementById('btnIdioma');
    if (btnIdioma) btnIdioma.innerHTML = idiomaActual === 'es' ? '🌐 English' : '🌐 Español';
    
    const btnCalcular = document.getElementById('btnCalcularTexto');
    if (btnCalcular) btnCalcular.innerHTML = idiomaActual === 'es' ? 'Evaluar Riesgo' : 'Assess Risk';
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
    } catch(e) { container.innerHTML = '<div class="error">Error</div>'; }
}

async function cargarChequeo() {
    const container = document.getElementById('chequeo-container');
    const checkContainer = document.getElementById('componentes-check');
    if (!container) return;
    container.innerHTML = '<div class="loading">Cargando checklist...</div>';
    try {
        const res = await fetch(`/api/chequeo?tipo=Moto&idioma=${idiomaActual}`);
        const data = await res.json();
        console.log('Chequeo data:', data);
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
            
            if (checkContainer) {
                checkContainer.innerHTML = data.data.map(c => `
                    <label class="checkbox-label">
                        <input type="checkbox" class="check-riesgo" data-nombre="${c.nom_comp}">
                        ${c.nom_comp} ${textos[idiomaActual].buen_estado}
                    </label>
                `).join('');
            }
        } else {
            container.innerHTML = '<div class="error">No hay componentes</div>';
        }
    } catch(e) { 
        console.error('Error:', e);
        container.innerHTML = '<div class="error">Error cargando checklist</div>'; 
    }
}

// Inicializar
const btnIdioma = document.getElementById('btnIdioma');
if (btnIdioma) btnIdioma.addEventListener('click', cambiarIdioma);

aplicarTextos();
cargarNormas();
cargarChequeo();