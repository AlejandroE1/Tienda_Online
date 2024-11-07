const express = require("express");
const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "tienda",
});

db.query(
    `CREATE TABLE IF NOT EXISTS calificacion (
    id int AUTO_INCREMENT PRIMARY KEY,
    califiacion int NOT NULL,
    detalles varchar(500) NOT NULL,
    id_producto int NOT NULL, 
    id_usuario int NOT NULL,
    fecha datetime NOT NULL DEFAULT current_timestamp()
    );`, (error) => {
    if (error) throw error;
    console.log("Ya existe la tabla");
}
);

const app = express();
const PORT = 3000;
app.use(express.json());

app.post("/calificacion", (req, res) => {
    const { } = req.body;
    const insertC = "INSERT INTO calificacion () VALUES ()";
    db.query(insertC, [],
        (error, result) => {
            if (error) {
                console.log(error);
                res.status(500).send("No se pudo guardar la calificacion correctamente");
                return;
            }
            res.status(200).json('Calificacion guardada de manera correcta');
        });
});

app.get("/calificaciones", (req, res) => {
    const { id_producto, id_usuario, califiacion, detalles, fecha } = req.body;
    const insertC = "INSERT INTO calificacion (id_producto, id_usuario, califiacion, detalles, fecha)" +
        +"VALUES (?,?,?,?,?)";
    db.query(insertC, [id_producto, id_usuario, califiacion, detalles, fecha],
        (error, result) => {
            if (error) {
                console.log(error);
                res.status(500).send("No se pudo guardar la calificacion correctamente");
                return;
            }
            res.status(200).json('Calificacion guardada de manera correcta');
        });
});

app.get("/calificaciones", (req, res) => {
    db.query("SELECT * FROM calificacion",
        (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).send("No se pudo obtener los registros");
                return;
            }
            res.json(results);
        });
});

app.get("/calificaciones/:idUsuario", (req, res) => {
    db.query("SELECT * FROM calificacion WHERE id_usuario = ?", [id_usuario],
        (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).send("No se pudo obtener el registro");
                return;
            }
            res.json(results);
        });
});

app.get("/calificaciones/:idProducto", (req, res) => {
    db.query("SELECT * FROM calificacion WHERE id_producto = ?", [id_producto],
        (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).send("No se pudo obtener el registro");
                return;
            }
            res.json(results);
        });
});

app.put("/calificaciones/:id", (req, res) => {
    const { calificacion, detalles, fecha } = req.body;
    const sql =
        "UPDATE calificacion SET calificacion = ?, detalles = ?, fecha = ? WHERE id = ?";
    db.query(
        sql,
        [calificacion, detalles, fecha],
        (err, result) => {
            if (err) {
                res.status(500).send("Esta calificacion no se pudo modificar");
                return;
            }
            res.json('Registro actualizado correctamente');
        }
    );
});

app.delete("/calificaciones/:id", (req, res) => {
    const sql = "DELETE FROM calificacion WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            res.status(500).send("Error al eliminar la calificación");
            return;
        }
        res.send("Calificacion eliminada");
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.use(express.static("public"));