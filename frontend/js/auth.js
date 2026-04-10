const textosIndex = {
    es: {
        login_titulo: "🔐 Iniciar Sesión",
        login_correo: "Correo electrónico",
        login_password: "Contraseña",
        login_btn: "Iniciar Sesión",
        register_titulo: "📝 Registrarse",
        register_nombre: "Nombre completo",
        register_correo: "Correo electrónico",
        register_password: "Contraseña",
        register_edad: "Edad",
        register_moto: "Moto",
        register_cicla: "Bicicleta",
        register_btn: "Crear cuenta",
        switch_login: "¿Ya tienes cuenta?",
        switch_register: "¿No tienes cuenta?",
        switch_login_link: "Inicia sesión aquí",
        switch_register_link: "Regístrate aquí",
        footer: "Tus datos están seguros con nosotros",
        tab_login: "Iniciar Sesión",
        tab_register: "Registrarse",
        dashboard_bienvenido: "🚦 ¡Bienvenido",
        dashboard_bienvenido_de_nuevo: "🚦 ¡Bienvenido de nuevo",
        dashboard_selecciona: "Accede a tu chequeo de seguridad personalizado",
        dashboard_bici_titulo: "🚲 Bicicleta",
        dashboard_bici_desc: "Chequeo preventivo, normas de tránsito y calculadora de riesgo",
        dashboard_bici_btn: "Acceder",
        dashboard_moto_titulo: "🏍️ Moto",
        dashboard_moto_desc: "Chequeo preventivo, normas de tránsito y calculadora de riesgo",
        dashboard_moto_btn: "Acceder",
        dashboard_cerrar: "Cerrar sesión",
        vehiculo_mensaje_bici: "🚲 Tu vehículo registrado es una Bicicleta",
        vehiculo_mensaje_moto: "🏍️ Tu vehículo registrado es una Moto"
    },
    en: {
        login_titulo: "🔐 Login",
        login_correo: "Email",
        login_password: "Password",
        login_btn: "Login",
        register_titulo: "📝 Register",
        register_nombre: "Full name",
        register_correo: "Email",
        register_password: "Password",
        register_edad: "Age",
        register_moto: "Motorcycle",
        register_cicla: "Bicycle",
        register_btn: "Create account",
        switch_login: "Already have an account?",
        switch_register: "Don't have an account?",
        switch_login_link: "Login here",
        switch_register_link: "Register here",
        footer: "Your data is safe with us",
        tab_login: "Login",
        tab_register: "Register",
        dashboard_bienvenido: "🚦 Welcome",
        dashboard_bienvenido_de_nuevo: "🚦 Welcome back",
        dashboard_selecciona: "Access your personalized safety check",
        dashboard_bici_titulo: "🚲 Bicycle",
        dashboard_bici_desc: "Preventive check, traffic rules and risk calculator",
        dashboard_bici_btn: "Access",
        dashboard_moto_titulo: "🏍️ Motorcycle",
        dashboard_moto_desc: "Preventive check, traffic rules and risk calculator",
        dashboard_moto_btn: "Access",
        dashboard_cerrar: "Logout",
        vehiculo_mensaje_bici: "🚲 Your registered vehicle is a Bicycle",
        vehiculo_mensaje_moto: "🏍️ Your registered vehicle is a Motorcycle"
    }
};

let idiomaIndex = localStorage.getItem('ride_idioma') || 'es';


function aplicarTextosIndex() {
    const t = textosIndex[idiomaIndex];
    
    
    const tabLogin = document.getElementById('tabLoginBtn');
    const tabRegister = document.getElementById('tabRegisterBtn');
    if (tabLogin) tabLogin.innerHTML = `<i class="fas fa-sign-in-alt"></i> ${t.tab_login}`;
    if (tabRegister) tabRegister.innerHTML = `<i class="fas fa-user-plus"></i> ${t.tab_register}`;
    
    
    const loginTitulo = document.querySelector('#loginForm h2');
    if (loginTitulo) loginTitulo.innerHTML = t.login_titulo;
    
    const loginCorreoLabel = document.querySelector('#loginForm .form-group:first-child label');
    if (loginCorreoLabel) loginCorreoLabel.innerHTML = `<i class="fas fa-envelope"></i> ${t.login_correo}`;
    
    const loginPasswordLabel = document.querySelector('#loginForm .form-group:last-child label');
    if (loginPasswordLabel) loginPasswordLabel.innerHTML = `<i class="fas fa-lock"></i> ${t.login_password}`;
    
    const loginBtn = document.querySelector('#loginForm .btn-submit');
    if (loginBtn) loginBtn.innerHTML = `<span>${t.login_btn}</span><i class="fas fa-arrow-right"></i>`;
    
    const switchRegister = document.querySelector('#loginForm .switch-modal');
    if (switchRegister) switchRegister.innerHTML = `${t.switch_register} <a onclick="mostrarRegistro()">${t.switch_register_link}</a>`;
    
    
    const registerTitulo = document.querySelector('#registerForm h2');
    if (registerTitulo) registerTitulo.innerHTML = t.register_titulo;
    
    const nombreLabel = document.querySelector('#registerForm .form-row:first-child .form-group:first-child label');
    if (nombreLabel) nombreLabel.innerHTML = `<i class="fas fa-user"></i> ${t.register_nombre}`;
    
    const correoLabel = document.querySelector('#registerForm .form-row:first-child .form-group:last-child label');
    if (correoLabel) correoLabel.innerHTML = `<i class="fas fa-envelope"></i> ${t.register_correo}`;
    
    const passwordLabel = document.querySelector('#registerForm .form-row:nth-child(2) .form-group:first-child label');
    if (passwordLabel) passwordLabel.innerHTML = `<i class="fas fa-lock"></i> ${t.register_password}`;
    
    const edadLabel = document.querySelector('#registerForm .form-row:nth-child(2) .form-group:last-child label');
    if (edadLabel) edadLabel.innerHTML = `<i class="fas fa-calendar-alt"></i> ${t.register_edad}`;
    
    const motoOption = document.querySelector('.vehicle-option:first-child span');
    if (motoOption) motoOption.innerHTML = t.register_moto;
    
    const biciOption = document.querySelector('.vehicle-option:last-child span');
    if (biciOption) biciOption.innerHTML = t.register_cicla;
    
    const registerBtn = document.querySelector('#registerForm .btn-submit');
    if (registerBtn) registerBtn.innerHTML = `<span>${t.register_btn}</span><i class="fas fa-user-plus"></i>`;
    
    const switchLogin = document.querySelector('#registerForm .switch-modal');
    if (switchLogin) switchLogin.innerHTML = `${t.switch_login} <a onclick="mostrarLogin()">${t.switch_login_link}</a>`;
    

    const footer = document.querySelector('.auth-footer p');
    if (footer) footer.innerHTML = `<i class="fas fa-shield-alt"></i> ${t.footer}`;
    

    const bikeCard = document.getElementById('bikeCard');
    if (bikeCard) {
        const biciTitulo = bikeCard.querySelector('h3');
        const biciDesc = bikeCard.querySelector('p');
        const biciBtn = bikeCard.querySelector('.select-btn');
        if (biciTitulo) biciTitulo.innerHTML = t.dashboard_bici_titulo;
        if (biciDesc) biciDesc.innerHTML = t.dashboard_bici_desc;
        if (biciBtn) biciBtn.innerHTML = `${t.dashboard_bici_btn} <i class="fas fa-arrow-right"></i>`;
    }
    
    const motoCard = document.getElementById('motoCard');
    if (motoCard) {
        const motoTitulo = motoCard.querySelector('h3');
        const motoDesc = motoCard.querySelector('p');
        const motoBtn = motoCard.querySelector('.select-btn');
        if (motoTitulo) motoTitulo.innerHTML = t.dashboard_moto_titulo;
        if (motoDesc) motoDesc.innerHTML = t.dashboard_moto_desc;
        if (motoBtn) motoBtn.innerHTML = `${t.dashboard_moto_btn} <i class="fas fa-arrow-right"></i>`;
    }
    
    const cerrarBtn = document.querySelector('.logout-btn');
    if (cerrarBtn) cerrarBtn.innerHTML = `<i class="fas fa-sign-out-alt"></i> ${t.dashboard_cerrar}`;
    
    const welcomeText = document.querySelector('.welcome-card p:last-child');
    if (welcomeText && welcomeText !== document.getElementById('vehiculoMensaje')) {
        welcomeText.innerHTML = t.dashboard_selecciona;
    }
    

    const emailInput = document.getElementById('login_correo');
    if (emailInput) emailInput.placeholder = t.login_correo === 'Email' ? 'user@example.com' : 'usuario@ejemplo.com';
}


function mostrarToast(mensaje, esError = false) {
    const toast = document.createElement('div');
    toast.className = 'toast-message' + (esError ? ' toast-error' : '');
    toast.innerText = mensaje;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}


function actualizarTabs(mostrarLogin) {
    const loginBtn = document.getElementById('tabLoginBtn');
    const registerBtn = document.getElementById('tabRegisterBtn');
    
    if (mostrarLogin) {
        if (loginBtn) loginBtn.classList.add('active');
        if (registerBtn) registerBtn.classList.remove('active');
    } else {
        if (loginBtn) loginBtn.classList.remove('active');
        if (registerBtn) registerBtn.classList.add('active');
    }
}

function mostrarLogin() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('registerForm').classList.add('hidden');
    actualizarTabs(true);
}

function mostrarRegistro() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
    actualizarTabs(false);
}


async function registrar() {
    const nombre = document.getElementById('reg_nombre').value;
    const correo = document.getElementById('reg_correo').value;
    const password = document.getElementById('reg_password').value;
    const edad = document.getElementById('reg_edad').value;
    
    const tipoRadios = document.getElementsByName('tipo_vehiculo');
    let tipo_vehiculo = 'Moto';
    for (let radio of tipoRadios) {
        if (radio.checked) {
            tipo_vehiculo = radio.value;
            break;
        }
    }
    
    if (!nombre || !correo || !password || !edad) {
        mostrarToast('Todos los campos son obligatorios', true);
        return;
    }
    
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, correo, password, edad: parseInt(edad), tipo_vehiculo })
        });
        
        const resultado = await response.json();
        
        if (resultado.success) {
            mostrarToast('✅ Registro exitoso. ¡Ahora inicia sesión!');
            mostrarLogin();
            document.getElementById('reg_nombre').value = '';
            document.getElementById('reg_correo').value = '';
            document.getElementById('reg_password').value = '';
            document.getElementById('reg_edad').value = '';
        } else {
            mostrarToast(resultado.error, true);
        }
    } catch (error) {
        mostrarToast('Error de conexión', true);
    }
}


async function login() {
    const correo = document.getElementById('login_correo').value;
    const password = document.getElementById('login_password').value;
    
    if (!correo || !password) {
        mostrarToast('Correo y contraseña son obligatorios', true);
        return;
    }
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, password })
        });
        
        const resultado = await response.json();
        
        if (resultado.success) {
            localStorage.setItem('ride_token', resultado.token);
            localStorage.setItem('ride_usuario', JSON.stringify(resultado.user));
            mostrarToast(`✅ ¡Bienvenido ${resultado.user.nombre}!`);
            
            document.getElementById('authSection').style.display = 'none';
            document.getElementById('dashboardSection').classList.remove('hidden');
            
            const userData = resultado.user;
            const t = textosIndex[idiomaIndex];
            document.getElementById('welcomeTitle').innerHTML = `${t.dashboard_bienvenido}, ${userData.nombre}!`;
            document.getElementById('userEmail').innerHTML = userData.correo;
            
            const bikeCard = document.getElementById('bikeCard');
            const motoCard = document.getElementById('motoCard');
            const vehiculoMensaje = document.getElementById('vehiculoMensaje');
            
            if (userData.tipo_vehiculo === 'Cicla') {
                bikeCard.style.display = 'flex';
                motoCard.style.display = 'none';
                vehiculoMensaje.innerHTML = t.vehiculo_mensaje_bici;
            } else {
                bikeCard.style.display = 'none';
                motoCard.style.display = 'flex';
                vehiculoMensaje.innerHTML = t.vehiculo_mensaje_moto;
            }
            
            const welcomeText = document.querySelector('.welcome-card p:last-child');
            if (welcomeText && welcomeText !== vehiculoMensaje) {
                welcomeText.innerHTML = t.dashboard_selecciona;
            }
            
            document.getElementById('login_correo').value = '';
            document.getElementById('login_password').value = '';
        } else {
            mostrarToast(resultado.error, true);
        }
    } catch (error) {
        mostrarToast('Error de conexión', true);
    }
}


function seleccionarVehiculo(tipo) {
    if (tipo === 'bicicleta') {
        window.location.href = '/bicicleta';
    } else if (tipo === 'moto') {
        window.location.href = '/moto';
    }
}

function cerrarSesion() {
    localStorage.removeItem('ride_token');
    localStorage.removeItem('ride_usuario');
    document.getElementById('authSection').style.display = 'block';
    document.getElementById('dashboardSection').classList.add('hidden');
    mostrarLogin();
    aplicarTextosIndex();
}


function configurarBotonIdioma() {
    const btnIdioma = document.getElementById('btnIdiomaIndex');
    if (btnIdioma) {
        btnIdioma.innerHTML = idiomaIndex === 'es' ? '🌐 English' : '🌐 Español';
        btnIdioma.onclick = () => {
            idiomaIndex = idiomaIndex === 'es' ? 'en' : 'es';
            localStorage.setItem('ride_idioma', idiomaIndex);
            btnIdioma.innerHTML = idiomaIndex === 'es' ? '🌐 English' : '🌐 Español';
            aplicarTextosIndex();
            
            
            if (document.getElementById('dashboardSection') && !document.getElementById('dashboardSection').classList.contains('hidden')) {
                const userData = JSON.parse(localStorage.getItem('ride_usuario'));
                const t = textosIndex[idiomaIndex];
                const welcomeTitle = document.getElementById('welcomeTitle');
                if (welcomeTitle && userData) {
                    welcomeTitle.innerHTML = `${t.dashboard_bienvenido}, ${userData.nombre}!`;
                }
                const vehiculoMensaje = document.getElementById('vehiculoMensaje');
                if (vehiculoMensaje && userData) {
                    if (userData.tipo_vehiculo === 'Cicla') {
                        vehiculoMensaje.innerHTML = t.vehiculo_mensaje_bici;
                    } else {
                        vehiculoMensaje.innerHTML = t.vehiculo_mensaje_moto;
                    }
                }
                const welcomeText = document.querySelector('.welcome-card p:last-child');
                if (welcomeText && welcomeText !== vehiculoMensaje) {
                    welcomeText.innerHTML = t.dashboard_selecciona;
                }
            }
        };
    }
}


document.addEventListener('DOMContentLoaded', () => {
    // Primero aplicar traducción
    aplicarTextosIndex();
    configurarBotonIdioma();
    
    const token = localStorage.getItem('ride_token');
    const usuario = localStorage.getItem('ride_usuario');
    
    if (token && usuario) {
        const userData = JSON.parse(usuario);
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('dashboardSection').classList.remove('hidden');
        
        const t = textosIndex[idiomaIndex];
        document.getElementById('welcomeTitle').innerHTML = `${t.dashboard_bienvenido_de_nuevo}, ${userData.nombre}!`;
        document.getElementById('userEmail').innerHTML = userData.correo;
        
        const bikeCard = document.getElementById('bikeCard');
        const motoCard = document.getElementById('motoCard');
        const vehiculoMensaje = document.getElementById('vehiculoMensaje');
        
        if (userData.tipo_vehiculo === 'Cicla') {
            bikeCard.style.display = 'flex';
            motoCard.style.display = 'none';
            vehiculoMensaje.innerHTML = t.vehiculo_mensaje_bici;
        } else {
            bikeCard.style.display = 'none';
            motoCard.style.display = 'flex';
            vehiculoMensaje.innerHTML = t.vehiculo_mensaje_moto;
        }
        
        const welcomeText = document.querySelector('.welcome-card p:last-child');
        if (welcomeText && welcomeText !== vehiculoMensaje) {
            welcomeText.innerHTML = t.dashboard_selecciona;
        }
    } else {
        document.getElementById('authSection').style.display = 'block';
        document.getElementById('dashboardSection').classList.add('hidden');
        mostrarLogin();
        
        setTimeout(() => aplicarTextosIndex(), 10);
    }
});


const originalLogin = login;
window.login = async function() {
    await originalLogin();
    setTimeout(() => aplicarTextosIndex(), 50);
};

const originalCerrarSesion = cerrarSesion;
window.cerrarSesion = function() {
    originalCerrarSesion();
    setTimeout(() => aplicarTextosIndex(), 50);
};