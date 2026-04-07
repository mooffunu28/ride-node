let idiomaActual = localStorage.getItem('ride_idioma') || 'es';


document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 R.I.D.E. Frontend cargado correctamente');
    
    
    aplicarIdioma();
    
   
    inicializarEventos();
    

    const usuarioId = localStorage.getItem('ride_usuario_id');
    if (usuarioId) {
        cargarUsuario(usuarioId);
    }
});


const textos = {
 
    nav_inicio: { es: 'Inicio', en: 'Home' },
    nav_registrarse: { es: 'Registrarse', en: 'Sign Up' },
    

    badge: { es: '🚦 Conducción consciente', en: '🚦 Conscious Driving' },
    titulo: { es: 'Tu seguridad, nuestra prioridad', en: 'Your safety, our priority' },
    subtitulo: { es: 'Información clara, chequeos técnicos y normas adaptadas para cada tipo de vehículo.', en: 'Clear information, technical checks and rules adapted for each type of vehicle.' },
    

    bicicleta_titulo: { es: 'Bicicleta', en: 'Bicycle' },
    bicicleta_desc: { es: 'Consejos de movilidad segura, normas para ciclistas, checklist de luces, frenos y más.', en: 'Safe mobility tips, cyclist rules, lights checklist, brakes and more.' },
    moto_titulo: { es: 'Moto', en: 'Motorcycle' },
    moto_desc: { es: 'Normas de tránsito específicas, multas, mantenimiento preventivo y equipo obligatorio.', en: 'Specific traffic rules, fines, preventive maintenance and mandatory equipment.' },
    explorar: { es: 'Explorar', en: 'Explore' },
    
    
    chequeo_titulo: { es: 'Chequeo Rápido', en: 'Quick Check' },
    chequeo_desc: { es: 'Frenos, luces, casco: diagnóstico en segundos', en: 'Brakes, lights, helmet: diagnosis in seconds' },
    multas_titulo: { es: 'Evita Multas', en: 'Avoid Fines' },
    multas_desc: { es: 'Infórmate sobre el código de tránsito actualizado', en: 'Learn about updated traffic code' },
    cultura_titulo: { es: 'Cultura Vial', en: 'Road Culture' },
    cultura_desc: { es: 'Comparte la vía con respeto y reduce accidentes', en: 'Share the road with respect and reduce accidents' },
    riesgo_titulo: { es: 'Calculadora de Riesgo', en: 'Risk Calculator' },
    riesgo_desc: { es: 'Evalúa tu nivel de riesgo antes de salir', en: 'Assess your risk level before leaving' },
    
    
    registro_titulo: { es: 'Regístrate en R.I.D.E.', en: 'Sign up for R.I.D.E.' },
    nombre_label: { es: 'Nombre completo *', en: 'Full name *' },
    email_label: { es: 'Correo electrónico *', en: 'Email *' },
    edad_label: { es: 'Edad *', en: 'Age *' },
    vehiculo_label: { es: 'Tipo de vehículo *', en: 'Vehicle type *' },
    cilindraje_label: { es: 'Cilindraje (solo para moto)', en: 'Displacement (only for motorcycle)' },
    mensaje_label: { es: 'Mensaje motivador personalizado', en: 'Personalized motivational message' },
    btn_registrar: { es: 'Registrarse', en: 'Sign Up' },
    
   
    footer: { es: 'R.I.D.E — Road Information & Digital Enforcement · Seguridad vial para todos · SENA CBA 2026', en: 'R.I.D.E — Road Information & Digital Enforcement · Road safety for everyone · SENA CBA 2026' },
    
  
    bici_titulo: { es: '🚲 Seguridad en Bicicleta', en: '🚲 Bicycle Safety' },
    bici_subtitulo: { es: 'Revisa tu estado, conoce las normas y calcula tu nivel de riesgo', en: 'Check your status, know the rules and calculate your risk level' },
    normas_titulo: { es: '📋 Normas de Tránsito', en: '📋 Traffic Rules' },
    chequeo_titulo_pag: { es: '✅ Chequeo Preventivo', en: '✅ Preventive Check' },
    riesgo_titulo_pag: { es: '⚠️ Calculadora de Riesgo', en: '⚠️ Risk Calculator' },
    velocidad_label: { es: 'Velocidad (km/h)', en: 'Speed (km/h)' },
    btn_calcular: { es: 'Calcular Riesgo', en: 'Calculate Risk' },
    volver: { es: '← Volver al inicio', en: '← Back to home' },
    
    
    moto_titulo: { es: '🏍️ Seguridad en Moto', en: '🏍️ Motorcycle Safety' },
    moto_subtitulo: { es: 'Revisa tu estado, conoce las normas y calcula tu nivel de riesgo', en: 'Check your status, know the rules and calculate your risk level' },
    

    nivel_critico: { es: '🚨 NIVEL CRÍTICO', en: '🚨 CRITICAL LEVEL' },
    nivel_moderado: { es: '⚠️ NIVEL MODERADO', en: '⚠️ MODERATE LEVEL' },
    nivel_seguro: { es: '✅ NIVEL SEGURO', en: '✅ SAFE LEVEL' },
    puntaje: { es: 'Puntaje', en: 'Score' },
    factores: { es: 'Factores de riesgo', en: 'Risk factors' },
    recomendaciones: { es: 'Recomendaciones', en: 'Recommendations' }
};


function t(key) {
    return textos[key] ? textos[key][idiomaActual] : key;
}


function aplicarIdioma() {

    const btnIdioma = document.getElementById('btnIdioma');
    if (btnIdioma) {
        btnIdioma.innerHTML = idiomaActual === 'es' ? '<i class="fas fa-globe"></i> EN' : '<i class="fas fa-globe"></i> ES';
    }
    

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (textos[key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = textos[key][idiomaActual];
            } else {
                el.innerHTML = textos[key][idiomaActual];
            }
        }
    });
    

    const inputVelocidad = document.getElementById('velocidad');
    if (inputVelocidad) {
        inputVelocidad.placeholder = t('velocidad_label');
    }
}

function inicializarEventos() {
    // Botón de registro
    const btnRegistro = document.getElementById('btnRegistro');
    if (btnRegistro) {
        btnRegistro.addEventListener('click', abrirModal);
    }
    

    const btnIdioma = document.getElementById('btnIdioma');
    if (btnIdioma) {
        btnIdioma.addEventListener('click', () => {
            idiomaActual = idiomaActual === 'es' ? 'en' : 'es';
            localStorage.setItem('ride_idioma', idiomaActual);
            aplicarIdioma();
            mostrarToast(`🌐 ${idiomaActual === 'es' ? 'Idioma cambiado a Español' : 'Language changed to English'}`);
            

            if (window.location.pathname === '/bicicleta' || window.location.pathname === '/moto') {
                location.reload();
            }
        });
    }
    

    const closeModal = document.querySelector('.close');
    if (closeModal) {
        closeModal.addEventListener('click', cerrarModal);
    }
    

    const formRegistro = document.getElementById('formRegistro');
    if (formRegistro) {
        formRegistro.addEventListener('submit', registrarUsuario);
    }
    

    const tarjetas = document.querySelectorAll('.option-card');
    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener('click', (e) => {
            if (e.target.classList.contains('start-button') || e.target.closest('.start-button')) {
                return;
            }
            const vehiculo = tarjeta.getAttribute('data-vehiculo');
            irAVehiculo(vehiculo);
        });
        
        const boton = tarjeta.querySelector('.start-button');
        if (boton) {
            boton.addEventListener('click', (e) => {
                e.stopPropagation();
                const vehiculo = tarjeta.getAttribute('data-vehiculo');
                irAVehiculo(vehiculo);
            });
        }
    });
    

    const selectTipo = document.getElementById('regTipoVehiculo');
    if (selectTipo) {
        selectTipo.addEventListener('change', function() {
            const cilindrajeField = document.getElementById('regCilindraje')?.closest('.form-group');
            if (this.value === 'Moto') {
                if (cilindrajeField) cilindrajeField.style.display = 'block';
            } else {
                if (cilindrajeField) cilindrajeField.style.display = 'none';
            }
        });
        
        if (selectTipo.value === 'Cicla') {
            const cilindrajeField = document.getElementById('regCilindraje')?.closest('.form-group');
            if (cilindrajeField) cilindrajeField.style.display = 'none';
        }
    }
    

    window.onclick = function(event) {
        const modal = document.getElementById('modalRegistro');
        if (event.target === modal) {
            cerrarModal();
        }
    };
}


function irAVehiculo(vehiculo) {
    if (vehiculo === 'bicicleta') {
        window.location.href = '/bicicleta';
    } else if (vehiculo === 'moto') {
        window.location.href = '/moto';
    }
}

function abrirModal() {
    const modal = document.getElementById('modalRegistro');
    if (modal) {
        modal.style.display = 'block';
    }
}

function cerrarModal() {
    const modal = document.getElementById('modalRegistro');
    if (modal) {
        modal.style.display = 'none';
    }
}


async function registrarUsuario(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('regNombre')?.value;
    const correo = document.getElementById('regCorreo')?.value;
    const edad = document.getElementById('regEdad')?.value;
    const tipo_vehiculo = document.getElementById('regTipoVehiculo')?.value;
    const cil_val = document.getElementById('regCilindraje')?.value || null;
    const mensaje_mot = document.getElementById('regMensaje')?.value || null;
    
    if (!nombre || !correo || !edad || !tipo_vehiculo) {
        mostrarToast('❌ ' + (idiomaActual === 'es' ? 'Todos los campos obligatorios deben estar llenos' : 'All required fields must be filled'));
        return;
    }
    
    if (parseInt(edad) < 16) {
        mostrarToast('❌ ' + (idiomaActual === 'es' ? 'Debes tener al menos 16 años' : 'You must be at least 16 years old'));
        return;
    }
    
    const datos = { nombre, correo, edad: parseInt(edad), tipo_vehiculo, cil_val, mensaje_mot };
    
    try {
        mostrarToast(idiomaActual === 'es' ? '⏳ Registrando usuario...' : '⏳ Registering user...');
        
        const response = await fetch('/api/usuarios/registrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        
        const resultado = await response.json();
        
        if (resultado.success) {
            mostrarToast('✅ ' + resultado.message);
            mostrarToast('🎉 ' + resultado.mensaje_bienvenida);
            
            localStorage.setItem('ride_usuario_id', resultado.usuario_id);
            localStorage.setItem('ride_usuario_nombre', nombre);
            
            cerrarModal();
            document.getElementById('formRegistro')?.reset();
        } else {
            mostrarToast('❌ Error: ' + resultado.error);
        }
    } catch (error) {
        mostrarToast('❌ ' + (idiomaActual === 'es' ? 'Error de conexión' : 'Connection error') + ': ' + error.message);
    }
}


async function cargarUsuario(usuarioId) {
    try {
        const response = await fetch(`/api/usuarios/${usuarioId}`);
        const resultado = await response.json();
        
        if (resultado.success && resultado.data) {
            console.log('👤 Usuario cargado:', resultado.data.nombre);
        }
    } catch (error) {
        console.error('Error al cargar usuario:', error);
    }
}


function mostrarToast(mensaje) {
    const toastsAnteriores = document.querySelectorAll('.toast-message');
    toastsAnteriores.forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML = mensaje;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}