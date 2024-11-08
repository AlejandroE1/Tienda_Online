const DBConnection = require('../database/dataBaseConn');

exports.getAllQualifications = (req, res) => {

    DBConnection.query('SELECT * FROM calificacion', (error, results) => {
        if (error) {
            throw error;
        } else {
            res.json({ qualifications: results });
        }
    })
};

exports.createOneQualification = (req, res) => {

    const { calificacion, detalles, id_producto, id_usuario, fecha } = req.body;
    if (calificacion, detalles, id_producto, id_usuario, fecha) {
        const sql = "INSERT INTO calificacion (calificacion, detalles, id_producto, id_usuario, fecha) VALUES (?, ?, ?, ?, ?)";
        DBConnection.query(sql, [calificacion, detalles, id_producto, id_usuario, fecha],
            (error, result) => {
                if (error) {
                    console.log(error);
                    res.status(500).send("No se pudo guardar la calificación correctamente");
                    return;
                }
                res.status(200).json('Calificación guardada de manera correcta');
            });
    } else {
        res.json({ message: "Campos incompletos" })
    }

};

exports.getOneQualification = (req, res) => {

    const { id } = req.params;

    const sql = "SELECT * FROM calificacion WHERE id = ?";
    DBConnection.query(sql, [id], (err, results) => {
        if (err) {
            res.status(500).send("Error al obtener la calificación");
            return;
        }
        if (results.length === 0) {
            res.status(404).send("Calificación no encontrada");
            return;
        }
        res.json(results[0]);
    });

};

exports.updateOneQualification = (req, res) => {

    const { id } = req.params;
    const { calificacion, detalles, id_producto, id_usuario, fecha } = req.body;

    if (calificacion, detalles, id_producto, id_usuario, fecha) {

        const sql =
            "UPDATE calificacion SET calificacion = ?, detalles = ?, id_producto = ?, id_usuario = ?, fecha = ? WHERE id = ?";
        DBConnection.query(
            sql,
            [calificacion, detalles, id_producto, id_usuario, fecha, id],
            (err, result) => {
                if (err) {
                    res.status(500).send("Error al actualizar la calificación");
                    return;
                }
                if (result.affectedRows === 0) {
                    res.status(404).send("Calificación no encontrada");
                    return;
                }
                res.json({ id, calificacion, detalles, id_producto, id_usuario, fecha, });
            }
        );
    } else {
        res.json({ message: "Campos incompletos" })
    }
};

exports.deleteOneQualification = (req, res) => {


    const { id } = req.params;

    const sql = "DELETE FROM calificacion WHERE id = ?";
    DBConnection.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).send("Error al eliminar la calificación");
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).send("Calificación no encontrada");
            return;
        }
        res.send("Calificación eliminada");
    });
};