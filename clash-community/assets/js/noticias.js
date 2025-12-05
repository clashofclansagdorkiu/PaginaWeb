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
        
        // Determinar si es una noticia destacada
        const esDestacada = noticia.destacada === true;

        // --- Lógica de Clases y Estilos Condicionales ---

        // 1. Clase base de la tarjeta
        let cardClasses = `
            bg-gray-800/80 border shadow-2xl rounded-xl p-6 
            flex flex-col md:flex-row gap-6 transition-all duration-300
        `;
        
        // 2. Aplicar estilo de destacado si corresponde
        if (esDestacada) {
            // Si es destacada, cambia el borde y aplica un hover especial
            cardClasses += ' border-red-600 hover:shadow-red-900/50 hover:scale-[1.01]';
        } else {
            // Si no es destacada, usa el borde por defecto de la tarjeta
            cardClasses += ' border-gray-700';
        }

        // 3. Etiqueta HTML para Noticia Destacada (SIEMPRE AL INICIO)
        const destacadoHTML = esDestacada ? `
            <span class="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 shadow-lg w-fit">
                Noticia Destacada
            </span>
        ` : '';

        // Determinar la estructura y el orden en base a si hay imagen
        const hasImage = !!noticia.imagen_url;

        // Estructura adaptativa para el contenido
        let contentHTML = '';

        if (hasImage) {
            // Diseño para noticias CON IMAGEN: 30% Imagen, 70% Contenido
            cardClasses += ' items-start'; // Alinear elementos arriba
            contentHTML = `
                <!-- Etiqueta Destacada (FUERA de los bloques) -->
                <div class="w-full">
                    ${destacadoHTML}
                </div>
                <!-- Bloque de Imagen (30% en escritorio, 100% en móvil) -->
                <div class="w-full md:w-1/3 flex-shrink-0">
                    <img src="${noticia.imagen_url}" 
                         alt="${noticia.titulo}" 
                         class="w-full h-auto object-cover rounded-lg shadow-md border border-gray-600 aspect-[16/9]"
                         onerror="this.src='./images/Logo_BdL.png'; this.classList.remove('object-cover', 'aspect-[16/9]'); this.classList.add('p-8', 'bg-gray-900', 'object-contain')">
                </div>
                <!-- Bloque de Texto y Botón (70% en escritorio, 100% en móvil) -->
                <div class="w-full md:w-2/3 flex flex-col justify-between max-h-64 overflow-y-auto">
                    <div>
                        <h2 class="text-3xl font-hispanic font-bold text-yellow-400 mb-2">${noticia.titulo}</h2>
                        <p class="text-sm text-gray-400 mb-4 border-b border-gray-700 pb-2">
                           Publicado el ${fechaFormateada}
                        </p>
                        <p class="text-gray-300 whitespace-pre-wrap line-clamp-3">${noticia.cuerpo}</p>
                    </div>
                    <!-- Botón de Acción Condicional -->
                    ${noticia.boton_texto && noticia.boton_enlace ? `
                        <a href="${noticia.boton_enlace}" target="_blank" class="mt-4 inline-block bg-yellow-600 hover:bg-yellow-700 text-gray-900 font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 text-center">
                            ${noticia.boton_texto}
                        </a>
                    ` : ''}
                </div>
            `;
        } else {
            // Diseño para noticias SIN IMAGEN: 100% Contenido
            cardClasses += ' flex-col'; // Vuelve a ser una columna simple
            contentHTML = `
                <!-- Etiqueta Destacada (AL INICIO) -->
                ${destacadoHTML}
                <h2 class="text-3xl font-hispanic font-bold text-yellow-400 mb-2">${noticia.titulo}</h2>
                <p class="text-sm text-gray-400 mb-4 border-b border-gray-700 pb-2">
                   Publicado el ${fechaFormateada}
                </p>
                <p class="text-gray-300 whitespace-pre-wrap line-clamp-4">${noticia.cuerpo}</p>
                
                <!-- Botón de Acción Condicional -->
                ${noticia.boton_texto && noticia.boton_enlace ? `
                    <div class="mt-4">
                        <a href="${noticia.boton_enlace}" target="_blank" class="inline-block bg-yellow-600 hover:bg-yellow-700 text-gray-900 font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 text-center">
                            ${noticia.boton_texto}
                        </a>
                    </div>
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