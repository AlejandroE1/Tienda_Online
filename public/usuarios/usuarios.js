document.getElementById('loginForm').addEventListener('submit',function(e){
    e.preventDefault();

    let email = document.getElementById('log-email').value;
    let password = document.getElementById('log-password').value;

    let users = localStorage.getItem("users") ? JSON.parse(localStorage.getItem("users")) : [];

    let user = users.find(user => user.email === email && user.password === password);

    if (user) {
        document.getElementById('message').innerText = 'Inicio de sesion Exitosa'
    } else {
        document.getElementById('message').innerText = 'Correo o contraseña invalidos'
    }

    document.getElementById('loginForm').reset();

});