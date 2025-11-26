// Importamos la conexión con Supabase
import { supabase } from './supabaseClient.js';

// --- ELEMENTOS DEL DOM ---
const loginForm = document.getElementById('loginForm');
const errorMsg = document.getElementById('errorMessage');

async function checkUserSession() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        window.location.href = "dashboard.html";
    }
}

// --- LÓGICA DE LOGIN (SOLO ACCESO) ---
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.classList.add('hidden'); 

    // Ojo: Por ahora usamos el campo "email" para el login.
    // Aunque tú uses un "usuario" en el formulario, Supabase internamente necesita un formato de email.
    // La solución para un LOGIN por nombre de usuario PURO la haremos después 
    // con una función personalizada (Edge Function) que busque en la tabla 'profiles'.
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Solo intentamos INICIAR SESIÓN (ya no hay registro automático)
    let { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        errorMsg.textContent = "Error de acceso: Credenciales no válidas. Contacta al Administrador para la creación de tu cuenta.";
        errorMsg.classList.remove('hidden');
    } else {
        // Éxito
        window.location.href = "dashboard.html"; 
    }
});

checkUserSession(); // Ejecutar al cargar