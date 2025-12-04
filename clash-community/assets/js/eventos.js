// =========================================================
//            CONFIGURACIÓN DE SUPABASE
// =========================================================
// ⚠️ Sustituye estos valores por tus claves reales de Supabase
//    (Project URL y anon public key)

const SUPA_URL = "https://lhuswstsypbgpnhuqpxn.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxodXN3c3RzeXBiZ3BuaHVxcHhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2Njc2MDksImV4cCI6MjA4MDI0MzYwOX0.ABksaYWqY9QCOm3gRvl3cKE3eh-daQA5BcWQsO4oLxY";


const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


// =========================================================
//            OBTENER EVENTOS DESDE SUPABASE
// =========================================================

async function obtenerEventosDesdeBD() {

    const { data, error } = await supabase
        .from("Eventos")
        .select("*")
        .order("inicio", { ascending: true });

    if (error) {
        console.error("Error cargando eventos:", error);
        return [];
    }

    return data;
}


// =========================================================
//            CLASIFICAR EVENTOS AUTOMÁTICAMENTE
// =========================================================

function clasificarEventos(eventos) {

    const ahora = new Date();

    let proximos = [];
    let activos = [];
    let pasados = [];

    eventos.forEach(e => {
        const inicio = new Date(e.inicio);
        const fin    = new Date(e.fin);

        if (ahora < inicio) proximos.push(e);
        else if (ahora >= inicio && ahora <= fin) activos.push(e);
        else pasados.push(e);
    });

    // Orden de cercanía o relevancia
    proximos.sort((a,b) => new Date(a.inicio) - new Date(b.inicio));
    activos.sort((a,b)  => new Date(a.inicio) - new Date(b.inicio));
    pasados.sort((a,b)  => new Date(b.fin)    - new Date(a.fin));

    return {
        proximos: proximos.slice(0, 2), // 2 próximos
        activos: activos.slice(0, 4),   // 4 activos
        pasados: pasados.slice(0, 2)    // 2 pasados
    };
}


// =========================================================
//                      CREAR TARJETA
// =========================================================

function crearTarjeta(evento, tipo) {

    let borde =
        tipo === "proximo" ? "border-yellow-400" :
        tipo === "activo"  ? "border-green-400" :
                             "border-red-400";

    return `
    <div class="event-card border ${borde}">

        ${evento.imagen ? `
        <img src="${evento.imagen}" class="w-full h-40 object-cover rounded-lg mb-3">
        ` : ""}

        <h3 class="text-2xl font-hispanic mb-2">${evento.titulo}</h3>

        <p class="text-gray-300 mb-3">${evento.descripcion}</p>

        <p class="text-gray-400 text-sm mb-1">
            Inicio: <span class="text-white">${evento.inicio.replace("T", " • ")}</span>
        </p>

        <p class="text-gray-400 text-sm mb-3">
            Fin: <span class="text-white">${evento.fin.replace("T", " • ")}</span>
        </p>

        ${evento.boton_texto ? `
        <a href="${evento.boton_url}" class="inline-block mt-2 bg-yellow-400 text-black py-1 px-3 rounded-md font-bold hover:bg-yellow-300 transition">
            ${evento.boton_texto}
        </a>
        ` : ""}
    </div>
    `;
}


// =========================================================
//                      RENDERIZAR TODO
// =========================================================

async function renderEventos() {

    // 1. Obtener datos de Supabase
    const eventos = await obtenerEventosDesdeBD();

    // 2. Clasificar según fechas
    const { proximos, activos, pasados } = clasificarEventos(eventos);

    // 3. Insertar en el HTML
    document.getElementById("proximosEventos").innerHTML =
        proximos.map(e => crearTarjeta(e, "proximo")).join("");

    document.getElementById("eventosActivos").innerHTML =
        activos.map(e => crearTarjeta(e, "activo")).join("");

    document.getElementById("eventosPasados").innerHTML =
        pasados.map(e => crearTarjeta(e, "pasado")).join("");
}


// =========================================================
//                      INICIAR SISTEMA
// =========================================================

document.addEventListener("DOMContentLoaded", renderEventos);
