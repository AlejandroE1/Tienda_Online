const conexion = require('../database/dataBaseConn');

exports.getAllUsers = (req, res) => {

    conexion.query('SELECT * FROM usuarios', (error, results) => {
        if (error) {
            throw error;
        } else {
            res.json({ users: results });
        }
    })
};

exports.createOneUser = (req, res) => {

    const { nombres, apellidos, email, telefono, nickname } = req.body;
    if (nombres, apellidos, email, telefono, nickname) {

        const sql =
            "INSERT INTO usuarios (nombres, apellidos, email, telefono, nickname) VALUES (?, ?, ?, ?, ?)";
        conexion.query(
            sql,
            [nombres, apellidos, email, telefono, nickname],
            (err, result) => {
                if (err) {
                    res.status(500).send("Error al crear el usuario");
                    return;
                }
                res.status(201).json({ id: result.insertId, nombre_producto, descrip_producto, valor, marca, });
            }
        );

    } else {
        res.json({ message: "Campos incompletos" })
    }

};

exports.getOneUser = (req, res) => {

    const { id } = req.params;

    const sql = "SELECT * FROM usuarios WHERE id = ?";
    conexion.query(sql, [id], (err, results) => {
        if (err) {
            res.status(500).send("Error al obtener el usuario");
            return;
        }
        if (results.length === 0) {
            res.status(404).send("Usuario no encontrado");
            return;
        }
        res.json(results[0]);
    });

};

exports.updateOneUser = (req, res) => {

    const { id } = req.params;
    const { nombres, apellidos, email, telefono, nickname } = req.body;

    if (nombres, apellidos, email, telefono, nickname) {

        const sql =
            "UPDATE usuarios SET nombres = ?, apellidos = ?, email = ?, telefono = ?, nickname = ? WHERE id = ?";
        conexion.query(
            sql,
            [nombres, apellidos, email, telefono, nickname, id],
            (err, result) => {
                if (err) {
                    res.status(500).send("Error al actualizar el usuario");
                    return;
                }
                if (result.affectedRows === 0) {
                    res.status(404).send("usuario no encontrado");
                    return;
                }
                res.json({ id, nombres, apellidos, email, telefono, nickname });
            }
        );
    } else {
        res.json({ message: "Campos incompletos" })
    }
};

exports.deleteOneUser = (req, res) => {


    const { id } = req.params;

    const sql = "DELETE FROM usuarios WHERE id = ?";
    conexion.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).send("Error al eliminar el usuario");
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).send("Usuario no encontrado");
            return;
        }
        res.send("Usuario eliminado");
    });
};