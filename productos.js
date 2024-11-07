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

// Crear la tabla 'productos' si no existe----------------
db.query(
  `CREATE TABLE IF NOT EXISTS productos (
  id int(11) AUTO_INCREMENT PRIMARY KEY,
  nombre_producto varchar(255) NOT NULL,
  descrip_producto varchar(255) NOT NULL,
  valor int(100) NOT NULL,
  marca varchar(255) NOT NULL
);`,
  (err) => {
    if (err) throw err;
    console.log("Tabla 'productos' creada o verificada");
  }
);

// Crear una instancia de Express
const app = express();
const PORT = 3000;
app.use(express.json());

// Ruta para crear un nuevo registro de PRODUCTO-----------
app.post("/productos", (req, res) => {
  const { nombre_producto, descrip_producto, valor, marca} = req.body;
  const sql =
    "INSERT INTO productos (nombre_producto, descrip_producto, valor, marca) VALUES (?, ?, ?, ?)";
  db.query(
    sql,
    [nombre_producto, descrip_producto, valor, marca],
    (err, result) => {
      if (err) {
        res.status(500).send("Error al crear producto");
        return;
      }
      res.status(201).json({id: result.insertId, nombre_producto, descrip_producto, valor, marca,});
    }
  );
});

// Ruta para obtener todas los PRODUCTO-------------------------
app.get("/productos", (req, res) => {
  db.query("SELECT * FROM productos", (err, results) => {
    if (err) {
      res.status(500).send("Error al obtener producto");
      return;
    }
    res.json(results);
  });
});

// Ruta para obtener PRODUCTO por ID-----------------------------
app.get("/productos/:id", (req, res) => {
  const sql = "SELECT * FROM productos WHERE id = ?";
  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      res.status(500).send("Error al obtener producto");
      return;
    }
    if (results.length === 0) {
      res.status(404).send("producto no encontrado");
      return;
    }
    res.json(results[0]);
  });
});


// Ruta para modificar un PRODUCTO----------------------
app.put("/productos/:id", (req, res) => {
  const { nombre_producto, descrip_producto, valor, marca } = req.body;
  const sql =
    "UPDATE productos SET nombre_producto = ?, descrip_producto = ?, valor = ?, marca = ? WHERE id = ?";
  db.query(
    sql,
    [nombre_producto, descrip_producto, valor, marca, req.params.id],
    (err, result) => {
      if (err) {
        res.status(500).send("Error al actualizar producto");
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).send("producto no encontrado");
        return;
      }
      res.json({id: req.params.id,nombre_producto, descrip_producto, valor, marca,});
    }
  );
});

// Ruta para eliminar un PRODUCTO--------------------------
app.delete("/productos/:id", (req, res) => {
  const sql = "DELETE FROM productos WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      res.status(500).send("Error al eliminar producto");
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send("Producto no encontrado");
      return;
    }
    res.send("Producto eliminado");
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.use(express.static("public"));
