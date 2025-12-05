// ----------------------------------------------------
// ARCHIVO: assets/js/noticias.js
// ----------------------------------------------------

// 🔥 Configura tu información de Supabase (las mismas que usas en clanes.js)
const SUPA_URL = "https://lhuswstsypbgpnhuqpxn.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxodXN3c3RzeXBiZ3BuaHVxcHhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2Njc2MDksImV4cCI6MjA4MDI0MzYwOX0.ABksaYWqY9QCOm3gRvl3cKE3eh-daQA5BcWQsO4oLxY";

// Inicializar el cliente Supabase (usando 'client' para evitar conflictos)
const client = supabase.createClient(SUPA_URL, SUPA_KEY);

/**
 * Función para formatear la fecha a un formato legible en español.
 * @param {string} dateString - Cadena de fecha ISO 8601 de la base de datos.
 * @returns {string} Fecha formateada (ej. "2 Dic 2025").
 */
function formatarFecha(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

async function cargarNoticias() {
    const contenedor = document.getElementById("noticiasContainer");
    contenedor.innerHTML = '<p class="text-center text-gray-400">Cargando noticias...</p>';

    // 1. Consulta los datos de la tabla "Noticia"
    const { data: noticias, error } = await client
        .from("Noticia")
        .select("*")
        .order("fecha_publicacion", { ascending: false }); // Las más nuevas primero

    if (error) {
        contenedor.innerHTML = `<p class="text-red-500 text-center">Error cargando noticias: ${error.message}</p>`;
        console.error("Error Supabase Noticias:", error);
        return;
    }

    if (!noticias || noticias.length === 0) {
        contenedor.innerHTML = `<p class="text-gray-400 text-center py-10">Aún no hay noticias publicadas.</p>`;
        return;
    }

    // Limpiar el mensaje de carga
    contenedor.innerHTML = "";

    // 2. Renderizado de cada noticia
    noticias.forEach(noticia => {
        const fechaFormateada = formatarFecha(noticia.fecha_publicacion);
        const esDestacada = noticia.destacada === true;
        const hasImage = !!noticia.imagen_url;

        // Etiqueta destacada
        const destacadoHTML = esDestacada ? `
            <span class="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg w-fit mb-3">
                Noticia Destacada
            </span>
        ` : '';

        // Clases base
        let cardClasses = `bg-gray-800/80 border shadow-2xl rounded-xl p-6 transition-all duration-300`;
        
        if (esDestacada) {
            cardClasses += ' border-red-600 hover:shadow-red-900/50';
        } else {
            cardClasses += ' border-gray-700';
        }

        let contentHTML = '';

        if (hasImage) {
            // CON IMAGEN: flex row en desktop, flex col en mobile
            cardClasses += ' flex flex-col md:flex-row gap-6';
            contentHTML = `
                <div class="w-full md:w-1/3 flex-shrink-0">
                    <img src="${noticia.imagen_url}" 
                         alt="${noticia.titulo}" 
                         class="w-full h-auto object-cover rounded-lg shadow-md border border-gray-600 aspect-[16/9]"
                         onerror="this.src='./images/Logo_BdL.png'">
                </div>
                <div class="w-full md:w-2/3 flex flex-col">
                    ${destacadoHTML}
                    <h2 class="text-3xl font-hispanic font-bold text-yellow-400 mb-2">${noticia.titulo}</h2>
                    <p class="text-sm text-gray-400 mb-4 border-b border-gray-700 pb-2">Publicado el ${fechaFormateada}</p>
                    <p class="text-gray-300 whitespace-pre-wrap line-clamp-3 flex-1">${noticia.cuerpo}</p>
                    ${noticia.boton_texto && noticia.boton_enlace ? `
                        <a href="${noticia.boton_enlace}" target="_blank" class="mt-4 inline-block bg-yellow-600 hover:bg-yellow-700 text-gray-900 font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 w-fit">
                            ${noticia.boton_texto}
                        </a>
                    ` : ''}
                </div>
            `;
        } else {
            // SIN IMAGEN: solo columna
            cardClasses += ' flex flex-col';
            contentHTML = `
                ${destacadoHTML}
                <h2 class="text-3xl font-hispanic font-bold text-yellow-400 mb-2">${noticia.titulo}</h2>
                <p class="text-sm text-gray-400 mb-4 border-b border-gray-700 pb-2">Publicado el ${fechaFormateada}</p>
                <p class="text-gray-300 whitespace-pre-wrap line-clamp-4 flex-1">${noticia.cuerpo}</p>
                ${noticia.boton_texto && noticia.boton_enlace ? `
                    <a href="${noticia.boton_enlace}" target="_blank" class="mt-4 inline-block bg-yellow-600 hover:bg-yellow-700 text-gray-900 font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 w-fit">
                        ${noticia.boton_texto}
                    </a>
                ` : ''}
            `;
        }

        const article = document.createElement("article");
        article.className = cardClasses;
        article.innerHTML = contentHTML;
        contenedor.appendChild(article);
    });
}

document.addEventListener("DOMContentLoaded", cargarNoticias);

// Menú móvil funcionalidad (igual en todos los archivos)
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}