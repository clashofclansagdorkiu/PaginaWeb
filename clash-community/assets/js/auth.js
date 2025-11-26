// Importamos la conexión con Supabase que creamos antes
import { supabase } from './supabaseClient.js';

// --- ELEMENTOS DEL DOM ---
const loginForm = document.getElementById('loginForm');
const errorMsg = document.getElementById('errorMessage');

// Función de redirección para usuarios ya logueados
async function checkUserSession() {
    const { data: { user } } = await supabase.auth.getUser();

    // Si el usuario existe, lo mandamos al dashboard inmediatamente
    if (user) {
        window.location.href = "dashboard.html";
    }
}

// --- LÓGICA DE FORMULARIO ---
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.classList.add('hidden'); // Ocultar errores anteriores

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // 1. Intentamos Iniciar Sesión con Contraseña
    let { error, data } = await supabase.auth.signInWithPassword({ email, password });

    if (error && error.message.includes('Invalid login credentials')) {
        // 2. Si las credenciales no son válidas (puede ser un usuario nuevo), intentamos REGISTRAR
        console.log("Usuario no encontrado, intentando registrar...");
        
        ({ error, data } = await supabase.auth.signUp({ 
            email: email, 
            password: password 
        }));
    }
    
    // 3. Manejo de Errores Finales
    if (error) {
        errorMsg.textContent = `Error de autenticación: ${error.message}`;
        errorMsg.classList.remove('hidden');
    } else {
        // 4. Éxito: Redirigir al dashboard (ya sea por login o registro nuevo)
        alert('Acceso exitoso. ¡Bienvenido al Clan!');
        window.location.href = "dashboard.html"; 
    }
});

// Inicializamos la comprobación de sesión al cargar la página
checkUserSession();