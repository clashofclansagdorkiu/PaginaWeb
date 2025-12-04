// =========================================================
//            CONFIGURACIÓN DE SUPABASE
// =========================================================

const SUPA_URL = "https://lhuswstsypbgpnhuqpxn.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxodXN3c3RzeXBiZ3BuaHVxcHhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2Njc2MDksImV4cCI6MjA4MDI0MzYwOX0.ABksaYWqY9QCOm3gRvl3cKE3eh-daQA5BcWQsO4oLxY";

// CORRECCIÓN: Usamos window.supabase para acceder a la librería global
// y asignamos el cliente a una variable distinta para evitar conflictos.
const supabaseClient = window.supabase.createClient(SUPA_URL, SUPA_KEY);

// =========================================================
//     LEER EVENTOS DESDE SUPABASE
// =========================================================
async function obtenerEventos() {

    // CORRECCIÓN: Asegúrate de que el nombre de la tabla sea exacto ("Eventos" vs "eventos")
    const { data, error } = await supabaseClient
        .from("Eventos") 
        .select("*")
        .order("inicio", { ascending: true });

    if (error) {
        console.error("❌ Error obteniendo eventos:", error);
        return [];
    }

    console.log("📥 Eventos cargados:", data);
    return data;
}

// =========================================================
//     CLASIFICAR EVENTOS (CORREGIDO)
// =========================================================
function clasificar(eventos) {
    if (!eventos) return { proximos: [], activos: [], pasados: [] };

    const ahora = new Date();

    let proximos = [];
    let activos = [];
    let pasados = [];

    eventos.forEach(e => {
        // Asegurar que las fechas se interpretan correctamente
        const inicio = new Date(e.inicio);
        const fin = new Date(e.fin);

        if (isNaN(inicio) || isNaN(fin)) {
            console.warn("⚠ Evento con fecha inválida:", e);
            return;
        }

        if (ahora < inicio) proximos.push(e);
        else if (ahora >= inicio && ahora <= fin) activos.push(e);
        else pasados.push(e);
    });

    proximos.sort((a,b) => new Date(a.inicio) - new Date(b.inicio));
    activos.sort((a,b) => new Date(a.inicio) - new Date(b.inicio));
    pasados.sort((a,b) => new Date(b.fin) - new Date(a.fin));

    return {
        proximos: proximos.slice(0,2),
        activos: activos.slice(0,4),
        pasados: pasados.slice(0,2)
    };
}

// =========================================================
//     CREAR TARJETA HTML
// =========================================================
function tarjeta(e, tipo) {

    const borde = tipo === "proximo" ? "border-yellow-400" :
                  tipo === "activo"  ? "border-green-400" :
                                       "border-red-400";

    // Manejo seguro de strings de fecha
    const inicioStr = e.inicio ? e.inicio.replace("T", " • ").split("+")[0] : "Fecha pendiente";
    const finStr = e.fin ? e.fin.replace("T", " • ").split("+")[0] : "Fecha pendiente";

    return `
    <div class="event-card border ${borde} bg-gray-800 p-4 rounded-lg shadow-lg">

        ${e.imagen ? `<img src="${e.imagen}" class="w-full h-40 object-cover rounded-lg mb-3">` : ""}

        <h3 class="text-2xl font-hispanic mb-2 text-white">${e.titulo}</h3>

        <p class="text-gray-300 mb-3">${e.descripcion}</p>

        <p class="text-gray-400 text-sm mb-1">Inicio: <span class="text-white">${inicioStr}</span></p>
        <p class="text-gray-400 text-sm mb-3">Fin: <span class="text-white">${finStr}</span></p>

        ${e.boton_texto ? `
        <a href="${e.boton_url}" target="_blank" class="inline-block mt-2 bg-yellow-400 text-black py-1 px-3 rounded-md font-bold hover:bg-yellow-300 transition">
            ${e.boton_texto}
        </a>` : ""}
    </div>`;
}

// =========================================================
//     RENDERIZAR
// =========================================================
async function render() {

    const eventos = await obtenerEventos();
    const { proximos, activos, pasados } = clasificar(eventos);

    const containerProximos = document.getElementById("proximosEventos");
    const containerActivos = document.getElementById("eventosActivos");
    const containerPasados = document.getElementById("eventosPasados");

    if(containerProximos) containerProximos.innerHTML = proximos.map(e => tarjeta(e, "proximo")).join("");
    if(containerActivos) containerActivos.innerHTML = activos.map(e => tarjeta(e, "activo")).join("");
    if(containerPasados) containerPasados.innerHTML = pasados.map(e => tarjeta(e, "pasado")).join("");
    
    // Si no hay eventos en absoluto
    if (proximos.length === 0 && activos.length === 0 && pasados.length === 0) {
        console.log("No hay eventos para mostrar en ninguna categoría.");
    }
}

document.addEventListener("DOMContentLoaded", render);