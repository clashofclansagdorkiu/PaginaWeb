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

function getEstadoEvento(evento) {
    const ahora = new Date();
    const inicio = new Date(evento.inicio);
    const fin = new Date(evento.fin);
    if (inicio > ahora) {
        return { texto: "Próximos Eventos", color: "text-yellow-400", borde: "border-yellow-400", bg: "bg-yellow-900/30" };
    } else if (inicio <= ahora && fin >= ahora) {
        return { texto: "Evento Activo", color: "text-green-400", borde: "border-green-400", bg: "bg-green-900/30" };
    } else {
        return { texto: "Pasados Eventos", color: "text-red-400", borde: "border-red-400", bg: "bg-red-900/30" };
    }
}

function renderEventoCard(evento) {
    const estado = getEstadoEvento(evento);
    return `
        <div class="relative bg-gray-800/80 ${estado.bg} border ${estado.borde} shadow-xl rounded-xl p-5 hover:scale-105 transition transform duration-300 backdrop-blur-sm flex flex-col">
            <span class="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold ${estado.color} border ${estado.borde} bg-black/60 z-10">
                ${estado.texto}
            </span>
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
    // Intenta primero con "Eventos" (con mayúscula)
    let { data: eventos, error } = await client
        .from("Eventos")
        .select("*")
        .order("inicio", { ascending: true });

    // Si falla, intenta con "eventos" (minúsculas)
    if (error || !eventos) {
        console.log("❌ Fallido con 'Eventos', intentando con 'eventos' minúscula...");
        const result = await client
            .from("eventos")
            .select("*")
            .order("inicio", { ascending: true });
        eventos = result.data;
        error = result.error;
    }

    // Log detallado
    console.log("🔍 Consulta a tabla:", { eventos, error });
    
    if (error) {
        console.error("❌ Error en consulta:", error.message);
        const contenedor = document.getElementById("eventosContainer");
        contenedor.innerHTML = `<p class="text-red-500 text-center">Error: ${error.message}</p>`;
        return;
    }

    const contenedor = document.getElementById("eventosContainer");
    
    console.log("✅ Resultado:", eventos);
    console.log("📊 Número de eventos:", eventos?.length || 0);

    if (!eventos || eventos.length === 0) {
        console.warn("⚠️ No hay eventos. Verifica:\n1. Que haya datos en la tabla\n2. Las políticas RLS permitan lectura pública\n3. El nombre de la tabla sea exacto");
        contenedor.innerHTML = `<p class="text-yellow-400 text-center">No hay eventos en la base de datos. Inserta datos de prueba en Supabase.</p>`;
        return;
    }

    // Renderiza todos los eventos en una sola grid
    contenedor.innerHTML = `
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            ${eventos.map(renderEventoCard).join('')}
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", cargarEventos);
