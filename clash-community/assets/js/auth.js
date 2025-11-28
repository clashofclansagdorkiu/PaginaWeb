// Importamos la conexión con Supabase
import { supabase } from './supabaseCliente.js';

// --- ELEMENTOS DEL DOM ---
const loginForm = document.getElementById('loginForm');
const errorMsg = document.getElementById('errorMessage');

// Comprueba si el usuario ya está logueado
async function checkUserSession() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        window.location.href = "dashboard.html";
    }
}

// --- LÓGICA DE LOGIN POR NOMBRE DE USUARIO (SOLO) ---
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.classList.add('hidden'); 

    // 1. Capturamos los datos del formulario
    const username = document.getElementById('username').value.toLowerCase().trim();
    const password = document.getElementById('password').value;

    // 2. CONSTRUIMOS EL EMAIL FICTICIO DE ACCESO
    // Usamos un dominio fijo para el clan
    const internalEmail = `${username}@comunidadlezo.com`;

    // 3. Intentamos iniciar sesión con el email ficticio y la contraseña
    let { data, error } = await supabase.auth.signInWithPassword({ 
        email: internalEmail, 
        password: password 
    });

    // 👇 AÑADE ESTA LÍNEA AQUÍ
    console.log("ERROR SUPABASE:", error);


    if (error) {
        // En este punto, solo puede ser un error de credenciales (usuario no existe o contraseña incorrecta)
        errorMsg.textContent = "Error de acceso: Nombre de usuario o contraseña incorrectos. Si no tiene cuenta, solicite una al administrador";
        errorMsg.classList.remove('hidden');
    } else {
        // 4. Éxito
        window.location.href = "dashboard.html"; 
    }
});

checkUserSession(); // Inicializar
