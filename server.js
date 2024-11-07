const express = require("express");
const mysql = require("mysql2");

// Datos de conexión a la base de datos
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "tienda",
});

// Conexión a la base de datos
db.connect((err) => {
  if (err) {
    console.error("Error conectando a la base de datos:", err.stack);
    return;
  }
  console.log("Conectado a la base de datos MySQL");
});

// Crear la tabla 'usuarios' si no existe
db.query(
  `CREATE TABLE IF NOT EXISTS usuarios (
  id int(11) AUTO_INCREMENT PRIMARY KEY,
  nombres varchar(255) NOT NULL,
  apellidos varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  telefono int(10) NOT NULL,
  nickname varchar(255) NOT NULL,
  fecha_creacion datetime NOT NULL DEFAULT current_timestamp()
);`,
  (err) => {
    if (err) throw err;
    console.log("Tabla 'usuarios' creada o verificada");
  }
);

// Crear una instancia de Express
const app = express();
const PORT = 3000;
app.use(express.json());

// Ruta para crear un nuevo registro de USUARIO
app.post("/usuarios", (req, res) => {
  const { nombres, apellidos, email, telefono, nickname } = req.body;
  const sql =
    "INSERT INTO usuarios (nombres, apellidos, email, telefono, nickname) VALUES (?, ?, ?, ?, ?)";
  db.query(
    sql,
    [nombres, apellidos, email, telefono, nickname],
    (err, result) => {
      if (err) {
        res.status(500).send("Error al crear usuario");
        return;
      }
      res.status(201).json({id: result.insertId,nombres,apellidos,email,telefono,nickname,});
    }
  );
});

// Ruta para obtener todas los usuarios
app.get("/usuarios", (req, res) => {
  db.query("SELECT * FROM usuarios", (err, results) => {
    if (err) {
      res.status(500).send("Error al obtener usuario");
      return;
    }
    res.json(results);
  });
});

// Ruta para obtener usuario por ID
app.get("/usuarios/:id", (req, res) => {
  const sql = "SELECT * FROM usuarios WHERE id = ?";
  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      res.status(500).send("Error al obtener usuario");
      return;
    }
    if (results.length === 0) {
      res.status(404).send("usuarios no encontrado");
      return;
    }
    res.json(results[0]);
  });
});

// Ruta para modificar un usuario
app.put("/usuarios/:id", (req, res) => {
  const { nombres, apellidos, email, telefono, nickname } = req.body;
  const sql =
    "UPDATE usuarios SET nombres = ?, apellidos = ?, email = ?, telefono = ?, nickname = ? WHERE id = ?";
  db.query(
    sql,
    [nombres, apellidos, email, telefono, nickname, req.params.id],
    (err, result) => {
      if (err) {
        res.status(500).send("Error al actualizar usuario");
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).send("usuario no encontrado");
        return;
      }
      res.json({id: req.params.id,nombres,apellidos,email,telefono,nickname,});
    }
  );
});

// Ruta para eliminar un USUARIO
app.delete("/usuarios/:id", (req, res) => {
  const sql = "DELETE FROM usuarios WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      res.status(500).send("Error al eliminar usuario");
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send("usuario no encontrado");
      return;
    }
    res.send("usuario eliminado");
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.use(express.static("public"));
