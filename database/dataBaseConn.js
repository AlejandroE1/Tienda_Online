const mysql = require('mysql');

const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tienda'
});

conexion.connect((error) => {
    if (error) {
        console.error('El error de conexion es : ' + error);
        return;
    }
    console.log('¡Conectado a la BD MySQL!');
});

conexion.query(
    `CREATE TABLE IF NOT EXISTS usuarios (
    id int(11) AUTO_INCREMENT PRIMARY KEY,
    nombres varchar(255) NOT NULL,
    apellidos varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    telefono int(10) NOT NULL,
    nickname varchar(255) NOT NULL,
    password varchar(500) NOT NULL,
    fecha_creacion datetime NOT NULL DEFAULT current_timestamp()
    );`,
    (err) => {
        if (err) throw err;
        console.log("Tabla 'usuarios' creada o verificada");
    }
);

conexion.query(
    `CREATE TABLE IF NOT EXISTS productos (
    id int(11) AUTO_INCREMENT PRIMARY KEY,
    nombre_producto varchar(255) NOT NULL,
    descrip_producto varchar(255) NOT NULL,
    valor int(100) NOT NULL,
    marca varchar(255) NOT NULL,
    imagen blob NOT NULL,
    id_usuario int(11) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE       
  );`,
    (err) => {
        if (err) throw err;
        console.log("Tabla 'productos' creada o verificada");
    }
);

conexion.query(
    `CREATE TABLE IF NOT EXISTS calificacion (
    id int AUTO_INCREMENT PRIMARY KEY,
    calificacion int NOT NULL,
    detalles varchar(500) NOT NULL,
    id_producto int(11) NOT NULL, 
    id_usuario int(11) NOT NULL,
    fecha datetime NOT NULL DEFAULT current_timestamp(),
    FOREIGN KEY (id_producto) REFERENCES productos(id) ON DELETE CASCADE,      
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE       
    );`, (error) => {
    if (error) throw error;
    console.log("Tabla 'calificacion' creada o verificada");
}
);

module.exports = conexion;