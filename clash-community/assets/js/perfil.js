// ====== CARGAR DATOS DEL PERFIL ======
document.addEventListener("DOMContentLoaded", () => {
    const usernameDisplay = document.getElementById("usernameDisplay");
    const emailDisplay = document.getElementById("emailDisplay");

    const usernameInput = document.getElementById("usernameInput");
    const emailInput = document.getElementById("emailInput");

    // Cargar desde localStorage
    const savedUsername = localStorage.getItem("username") || "Jugador";
    const savedEmail = localStorage.getItem("email") || "example@mail.com";

    usernameDisplay.textContent = savedUsername;
    emailDisplay.textContent = savedEmail;

    usernameInput.value = savedUsername;
    emailInput.value = savedEmail;

    // Guardar datos
    document.getElementById("saveProfile").addEventListener("click", () => {
        const newUsername = usernameInput.value;
        const newEmail = emailInput.value;

        localStorage.setItem("username", newUsername);
        localStorage.setItem("email", newEmail);

        usernameDisplay.textContent = newUsername;
        emailDisplay.textContent = newEmail;

        alert("Perfil actualizado correctamente.");
    });
});
