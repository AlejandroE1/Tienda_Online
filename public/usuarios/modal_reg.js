
function openPopup() {
    document.getElementById("popup-overlay").style.display = "flex";
}

function register() {
    const fullName = document.getElementById("full-name");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const phone = document.getElementById("phone");
    
    if (fullName.checkValidity() && email.checkValidity() && password.checkValidity() && phone.checkValidity()) {
        alert("Registrando usuario...");
        closePopup();
    } else {
        alert("Por favor, completa todos los campos correctamente.");
    }
}

function login() {
    alert("Redirigiendo a la página de principal...");
    closePopup();
}

function closePopup() {
    document.getElementById("popup-overlay").style.display = "none";
}
