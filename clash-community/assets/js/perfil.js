// CONFIGURA TU API
const API_BASE = "https://tudominio.com/api"; // Cambia por tu endpoint real
const perfilId = 1; // Debe venir de la sesión/logueo

import emailjs from "https://cdn.jsdelivr.net/npm/emailjs-com@2.6.4/dist/email.min.js";

// Inicializar EmailJS
emailjs.init("TU_USER_ID_EMAILJS"); // Cambia por tu ID

document.addEventListener("DOMContentLoaded", async () => {

    // Obtener elementos
    const nombreInput = document.getElementById("perfilNombre");
    const descInput = document.getElementById("perfilDescripcion");
    const guardarBtn = document.getElementById("guardarPerfil");
    const cuentasContainer = document.getElementById("cuentasContainer");

    // 1️⃣ Cargar datos del perfil y cuentas
    const resp = await fetch(`${API_BASE}/perfil/${perfilId}`);
    const data = await resp.json();

    nombreInput.value = data.perfil.username || "";
    descInput.value = data.perfil.descripcion || "";

    // Renderizar cuentas
    function renderCuentas(cuentas) {
        cuentasContainer.innerHTML = "";
        cuentas.forEach(c => {
            const div = document.createElement("div");
            div.className = "bg-gray-800/70 p-4 rounded-xl shadow-md border border-gray-600";
            if(c.estado === "pendiente") {
                div.innerHTML = `<h3 class="text-xl font-bold">${c.tag}</h3><p class="text-gray-400 mt-2">Pendiente de validar</p>`;
            } else {
                div.innerHTML = `
                    <h3 class="text-xl font-bold">${c.nombre}</h3>
                    <p class="text-gray-300 text-sm">${c.tag}</p>
                    <div class="mt-2 text-sm">
                        <p><span class="font-semibold">Clan:</span> ${c.clan_nombre || "-"}</p>
                        <p><span class="font-semibold">Ayuntamiento:</span> ${c.ayuntamiento}</p>
                        <p><span class="font-semibold">XP:</span> ${c.nivel}</p>
                    </div>`;
            }
            cuentasContainer.appendChild(div);
        });

        // Slot añadir cuenta
        const slot = document.createElement("div");
        slot.className = "perfil-slot-add";
        slot.innerHTML = `<span class="text-5xl font-bold">+</span><p class="mt-2 opacity-80">Vincular nueva cuenta</p>`;
        slot.onclick = () => agregarCuenta();
        cuentasContainer.appendChild(slot);
    }

    renderCuentas(data.cuentas);

    // Guardar perfil
    guardarBtn.addEventListener("click", async () => {
        const resp = await fetch(`${API_BASE}/perfil/${perfilId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: nombreInput.value, descripcion: descInput.value })
        });
        if(resp.ok) alert("Perfil actualizado correctamente.");
    });

    // Agregar cuenta
    async function agregarCuenta() {
        const tag = prompt("Introduce el TAG de la cuenta a vincular:");
        if(!tag) return;

        // Mandar solicitud al backend
        const resp = await fetch(`${API_BASE}/cuentas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tag, perfil_id: perfilId })
        });

        if(resp.ok) {
            // Enviar email
            emailjs.send("TU_SERVICE_ID", "TU_TEMPLATE_ID", {
                perfil: nombreInput.value,
                tag: tag
            }).then(() => alert("Solicitud enviada y correo enviado."));
            // Recargar cuentas
            const nuevoResp = await fetch(`${API_BASE}/perfil/${perfilId}`);
            const nuevaData = await nuevoResp.json();
            renderCuentas(nuevaData.cuentas);
        }
    }
});
