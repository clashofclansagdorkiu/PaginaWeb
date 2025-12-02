const SUPA_URL = "https://lhuswstsypbgpnhuqpxn.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxodXN3c3RzeXBiZ3BuaHVxcHhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2Njc2MDksImV4cCI6MjA4MDI0MzYwOX0.ABksaYWqY9QCOm3gRvl3cKE3eh-daQA5BcWQsO4oLxY";

// SOLUCIÓN: Usamos un nombre distinto para la instancia (ej: 'client')
// para no tapar la variable global 'supabase' que viene del CDN.
const client = supabase.createClient(SUPA_URL, SUPA_KEY);

async function cargarClanes() {
    const contenedor = document.getElementById("clanContainer");

    // Usamos 'client' en lugar de 'supabase'
    const { data: clanes, error } = await client
        .from("Clan") // Asegúrate que la tabla se llame exactamente así (respetando mayúsculas)
        .select("*")
        .order("nivel", { ascending: false });

    if (error) {
        contenedor.innerHTML = `<p class="text-red-500 text-center">Error cargando clanes: ${error.message}</p>`;
        console.error("Error Supabase:", error);
        return;
    }

    // Si no hay clanes o el array está vacío
    if (!clanes || clanes.length === 0) {
        contenedor.innerHTML = `<p class="text-yellow-400 text-center col-span-3">No se encontraron clanes en la base de datos.</p>`;
        return;
    }

    // Renderizado de cada clan
    clanes.forEach(clan => {
        const card = document.createElement("div");
        card.className = `
            bg-gray-800/80 border border-gray-700 shadow-xl rounded-xl p-5 
            hover:scale-105 transition transform duration-300 backdrop-blur-sm
        `;

        // Validación extra por si el tag viene sin # o es nulo
        const tagLimpio = clan.tag ? clan.tag.replace('#','') : ''; 
        const imagenClan = `https://api-assets.clashofclans.com/badges/200/${tagLimpio}.png`;

        card.innerHTML = `
            <div class="flex flex-col items-center">
                <img src="${imagenClan}" 
                     class="w-24 h-24 mb-3 rounded-lg shadow-md border border-gray-600 bg-black/50"
                     onerror="this.src='./images/Logo_BdL.png'">

                <h2 class="text-2xl font-hispanic text-yellow-400 text-center drop-shadow-md">${clan.nombre || 'Sin Nombre'}</h2>
                <p class="text-gray-300 text-sm">TAG: ${clan.tag}</p>

                <p class="mt-3 text-gray-200 text-center italic">"${clan.desc ?? "Sin descripción"}"</p>

                <div class="mt-4 w-full text-sm text-gray-300 space-y-1">
                    <p class="flex justify-between px-4"><span class="text-yellow-400 font-bold">Nivel:</span> <span>${clan.nivel}</span></p>
                    <p class="flex justify-between px-4"><span class="text-yellow-400 font-bold">Tipo:</span> <span>${clan.tipo}</span></p>
                </div>
            </div>
        `;

        contenedor.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", cargarClanes);