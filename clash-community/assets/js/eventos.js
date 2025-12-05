const SUPA_URL = "https://lhuswstsypbgpnhuqpxn.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxodXN3c3RzeXBiZ3BuaHVxcHhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2Njc2MDksImV4cCI6MjA4MDI0MzYwOX0.ABksaYWqY9QCOm3gRvl3cKE3eh-daQA5BcWQsO4oLxY";
const client = supabase.createClient(SUPA_URL, SUPA_KEY);

function formateaFecha(fechaStr) {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleString('es-ES', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

function renderEventoCard(evento) {
    return `
        <div class="bg-gray-800/80 border border-gray-700 shadow-xl rounded-xl p-5 hover:scale-105 transition transform duration-300 backdrop-blur-sm flex flex-col">
            <img src="${evento.imagen || './images/Logo_BdL.png'}"
                class="w-full h-40 object-cover rounded-lg mb-3 border border-gray-600 bg-black/50"
                alt="Imagen del evento"
                onerror="this.src='./images/Logo_BdL.png'">
            <h3 class="text-xl font-hispanic text-yellow-400 mb-2 text-center">${evento.titulo}</h3>
            <p class="text-gray-200 mb-3 text-center">${evento.descripcion}</p>
            <div class="text-sm text-gray-300 mb-2 text-center">
                <span class="font-bold text-yellow-400">Inicio:</span> ${formateaFecha(evento.inicio)}<br>
                <span class="font-bold text-yellow-400">Fin:</span> ${formateaFecha(evento.fin)}
            </div>
            ${evento.boton_url && evento.boton_texto ? `
                <a href="${evento.boton_url}" target="_blank"
                   class="mt-auto px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-black font-hispanic font-bold block text-center transition">
                    ${evento.boton_texto}
                </a>
            ` : ''}
        </div>
    `;
}

async function cargarEventos() {
    const { data: eventos, error } = await client
        .from("Eventos")
        .select("*")
        .order("inicio", { ascending: true });

    if (error) {
        document.getElementById("eventosContainer").innerHTML =
            `<p class="text-red-500 text-center">Error cargando eventos: ${error.message}</p>`;
        console.error("Error Supabase Eventos:", error);
        return;
    }

    const ahora = new Date();
    const proximos = [];
    const activos = [];
    const pasados = [];

    eventos.forEach(ev => {
        const inicio = new Date(ev.inicio);
        const fin = new Date(ev.fin);
        if (inicio > ahora) {
            proximos.push(ev);
        } else if (inicio <= ahora && fin >= ahora) {
            activos.push(ev);
        } else {
            pasados.push(ev);
        }
    });

    // Renderiza cada sección
    document.getElementById("proximosEventosGrid").innerHTML =
        proximos.length
            ? proximos.map(renderEventoCard).join('')
            : `<p class="col-span-3 text-center text-gray-400">No hay próximos eventos.</p>`;

    document.getElementById("activosEventosGrid").innerHTML =
        activos.length
            ? activos.map(renderEventoCard).join('')
            : `<p class="col-span-3 text-center text-gray-400">No hay eventos activos.</p>`;

    document.getElementById("pasadosEventosGrid").innerHTML =
        pasados.length
            ? pasados.map(renderEventoCard).join('')
            : `<p class="col-span-3 text-center text-gray-400">No hay eventos pasados.</p>`;
}

document.addEventListener("DOMContentLoaded", cargarEventos);
