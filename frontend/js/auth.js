// ==================== UTILIDADES ====================
function mostrarToast(mensaje, esError = false) {
    const toast = document.createElement('div');
    toast.className = 'toast-message' + (esError ? ' toast-error' : '');
    toast.innerText = mensaje;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ==================== TABS ====================
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

// ==================== REGISTRO ====================
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

// ==================== LOGIN ====================
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
            
            // Ocultar sección de auth y mostrar dashboard
            document.getElementById('authSection').style.display = 'none';
            document.getElementById('dashboardSection').classList.remove('hidden');
            
            // Actualizar información del dashboard
            const userData = resultado.user;
            document.getElementById('welcomeTitle').innerHTML = `🚦 ¡Bienvenido, ${userData.nombre}!`;
            document.getElementById('userEmail').innerHTML = userData.correo;
            
            // Mostrar solo el vehículo que eligió
            const bikeCard = document.getElementById('bikeCard');
            const motoCard = document.getElementById('motoCard');
            const vehiculoMensaje = document.getElementById('vehiculoMensaje');
            
            if (userData.tipo_vehiculo === 'Cicla') {
                bikeCard.style.display = 'flex';
                motoCard.style.display = 'none';
                vehiculoMensaje.innerHTML = '🚲 Tu vehículo registrado es una Bicicleta';
            } else {
                bikeCard.style.display = 'none';
                motoCard.style.display = 'flex';
                vehiculoMensaje.innerHTML = '🏍️ Tu vehículo registrado es una Moto';
            }
            
            // Limpiar campos
            document.getElementById('login_correo').value = '';
            document.getElementById('login_password').value = '';
        } else {
            mostrarToast(resultado.error, true);
        }
    } catch (error) {
        mostrarToast('Error de conexión', true);
    }
}

// ==================== DASHBOARD ====================
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
}

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('ride_token');
    const usuario = localStorage.getItem('ride_usuario');
    
    if (token && usuario) {
        const userData = JSON.parse(usuario);
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('dashboardSection').classList.remove('hidden');
        
        document.getElementById('welcomeTitle').innerHTML = `🚦 ¡Bienvenido de nuevo, ${userData.nombre}!`;
        document.getElementById('userEmail').innerHTML = userData.correo;
        
        const bikeCard = document.getElementById('bikeCard');
        const motoCard = document.getElementById('motoCard');
        const vehiculoMensaje = document.getElementById('vehiculoMensaje');
        
        if (userData.tipo_vehiculo === 'Cicla') {
            bikeCard.style.display = 'flex';
            motoCard.style.display = 'none';
            vehiculoMensaje.innerHTML = '🚲 Tu vehículo registrado es una Bicicleta';
        } else {
            bikeCard.style.display = 'none';
            motoCard.style.display = 'flex';
            vehiculoMensaje.innerHTML = '🏍️ Tu vehículo registrado es una Moto';
        }
    } else {
        document.getElementById('authSection').style.display = 'block';
        document.getElementById('dashboardSection').classList.add('hidden');
        mostrarLogin();
    }
});