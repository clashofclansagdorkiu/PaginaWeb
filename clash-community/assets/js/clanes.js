// 🔥 Configura tu información de Supabase
const SUPA_URL = "https://lhuswstsypbgpnhuqpxn.supabase.co";
const SUPA_KEY = "sb_publishable_HprKhNP-0t1dX3A2yMoHsQ_aLYLR_8a";

const supabase = supabase.createClient(SUPA_URL, SUPA_KEY);

async function cargarClanes() {
    const contenedor = document.getElementById("clanContainer");

    const { data: clanes, error } = await supabase
        .from("Clan")
        .select("*")
        .order("nivel", { ascending: false });

    if (error) {
        contenedor.innerHTML = `<p class="text-red-500">Error cargando clanes</p>`;
        console.error(error);
        return;
    }

    // Renderizado de cada clan
    clanes.forEach(clan => {
        const card = document.createElement("div");
        card.className = `
            bg-gray-800/80 border border-gray-700 shadow-xl rounded-xl p-5 
            hover:scale-105 transition transform duration-300 backdrop-blur-sm
        `;

        const imagenClan = `https://api-assets.clashofclans.com/badges/200/${clan.tag.replace('#','')}.png`;

        card.innerHTML = `
            <div class="flex flex-col items-center">
                <img src="${imagenClan}" 
                     class="w-24 h-24 mb-3 rounded-lg shadow-md border border-gray-600 bg-black/50"
                     onerror="this.src='./images/Logo_BdL.png'">

                <h2 class="text-2xl font-hispanic text-yellow-400 text-center drop-shadow-md">${clan.nombre}</h2>
                <p class="text-gray-300 text-sm">TAG: ${clan.tag}</p>

                <p class="mt-3 text-gray-200 text-center">${clan.desc ?? "Sin descripción"}</p>

                <div class="mt-4 w-full text-sm text-gray-300 space-y-1">
                    <p><span class="text-yellow-400 font-bold">Nivel:</span> ${clan.nivel}</p>
                    <p><span class="text-yellow-400 font-bold">Tipo:</span> ${clan.tipo}</p>
                </div>
            </div>
        `;

        contenedor.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", cargarClanes);
