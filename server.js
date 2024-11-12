const express = require('express');
const app = express();
const path = require("path");

// Configurar el motor de plantillas EJS
app.set('view engine', 'ejs');
// Middlewares para parsear el cuerpo de las solicitudes
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
// Usar el router principal
app.use('/', require('./routes/router'));

// Iniciar el servidor
app.listen(5000, () => {
  console.log('Server corriendo en http://localhost:5000');
});