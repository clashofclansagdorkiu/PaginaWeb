// EmailJS CONFIG (YA CONFIGURADO)
const EMAIL_PUBLIC_KEY = "hmVxDE6eabaXlGxqT";
const EMAIL_SERVICE_ID = "service_qakldas";
const EMAIL_TEMPLATE_ID = "template_zf2ej9s";

// Inicializar EmailJS
emailjs.init(EMAIL_PUBLIC_KEY);

// Lógica de anónimo
const nombreInput = document.getElementById('nombre');
const anonimCheckbox = document.getElementById('anonimo');

anonimCheckbox.addEventListener('change', function() {
    if (this.checked) {
        nombreInput.value = 'Anónimo';
        nombreInput.readOnly = true;
        nombreInput.classList.add('opacity-50', 'cursor-not-allowed', 'bg-gray-800/50');
    } else {
        nombreInput.value = '';
        nombreInput.readOnly = false;
        nombreInput.classList.remove('opacity-50', 'cursor-not-allowed', 'bg-gray-800/50');
    }
});

document.getElementById("sugerenciaForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value || "Anónimo";
    const categoria = document.getElementById("categoria").value;
    const mensaje = document.getElementById("mensaje").value.trim();

    const estado = document.getElementById("estadoEnvio");

    if (mensaje.length < 3) {
        estado.innerText = "Debes escribir una sugerencia.";
        estado.className = "text-center text-red-400 font-bold";
        return;
    }

    estado.innerText = "Enviando...";
    estado.className = "text-center text-yellow-400";

    try {
        await emailjs.send(EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, {
            nombre: nombre,
            categoria: categoria,
            mensaje: mensaje
        });

        estado.innerText = "¡Sugerencia enviada correctamente!";
        estado.className = "text-center text-green-400 font-bold";

        document.getElementById("sugerenciaForm").reset();
        nombreInput.readOnly = false;
        nombreInput.classList.remove('opacity-50', 'cursor-not-allowed', 'bg-gray-800/50');
        anonimCheckbox.checked = false;

    } catch (error) {
        console.error("Error al enviar:", error);
        estado.innerText = "Error al enviar. Inténtalo más tarde.";
        estado.className = "text-center text-red-400 font-bold";
    }
});
