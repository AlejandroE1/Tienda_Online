// Obtener los elementos
const loginBtn = document.getElementById('loginBtn');
const overlay = document.getElementById('overlay');
const loginForm = document.getElementById('loginForm');
const googleLoginBtn = document.querySelector('.google');  // Botón de Google

// Función para mostrar el formulario de inicio de sesión y el fondo oscuro
loginBtn.addEventListener('click', () => {
  overlay.style.display = 'block';  // Mostrar el fondo oscuro
  loginForm.style.display = 'block';  // Mostrar el formulario
  setTimeout(() => {
    loginForm.classList.add('show');  // Agregar animación de expansión
  }, 10);  // Agrega un pequeño retraso para activar la transición
});

// Función para cerrar el formulario de inicio de sesión
overlay.addEventListener('click', () => {
  overlay.style.display = 'none';  // Ocultar el fondo oscuro
  loginForm.classList.remove('show');  // Remover animación de expansión
  setTimeout(() => {
    loginForm.style.display = 'none';  // Ocultar el formulario
  }, 300);  // Espera a que termine la animación antes de ocultar
});

// Redirección al sitio de autenticación de Google al hacer clic en el botón
googleLoginBtn.addEventListener('click', () => {
  window.location.href = 'https://accounts.google.com/signin';
});

