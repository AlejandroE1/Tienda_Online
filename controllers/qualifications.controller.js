const DBConnection = require('../database/dataBaseConn');
const cookie = require('cookie');

// Función para obtener todas las calificaciones
exports.getAllQualifications = (req, res) => {
    DBConnection.query('SELECT * FROM calificacion', (error, results) => {
        if (error) {
            throw error;
        } else {
            // Enviar las calificaciones como respuesta en formato JSON
            res.json({ qualifications: results });
        }
    });
};

// Función para crear una calificación
exports.createOneQualification = (req, res) => {
    const { ratingValue, quealificationDetails, productId } = req.body;

    // Verificar que todos los campos estén completos
    if (ratingValue && quealificationDetails && productId) {

        const cookies = cookie.parse(req.headers.cookie || '');
        const userId = cookies['Usuario'] || '';
        console.log('valores a insertar: ', {ratingValue, quealificationDetails, productId, userId})

        const sql = "INSERT INTO calificacion (calificacion, detalles, id_producto, id_usuario) VALUES (?, ?, ?, ?)";
        DBConnection.query(sql, [ratingValue, quealificationDetails, productId, userId],
            (error, result) => {
                if (error) {
                    console.log(error);
                    res.status(500).send("No se pudo guardar la calificación correctamente");
                    return;
                }
                // Enviar una respuesta exitosa
                //res.status(200).json('Calificación guardada de manera correcta');
                res.redirect(`/products/${productId}`);
                //return res.status(201).json({ success: true, message: "Calificación guardada de manera correcta", redirectTo: `/products${productId}` });
            });
    } else {
        res.json({ message: "Campos incompletos" });
    }
};

// Función para obtener una calificación por su ID
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
        // Renderizar la vista 'pagina_producto' con las calificaciones
        res.render('pagina_producto', { qualifications: results });
    });
};

// Función para actualizar una calificación
exports.updateOneQualification = (req, res) => {
    const { id } = req.params;
    const { calificacion, detalles, id_producto, id_usuario, fecha } = req.body;

    // Verificar que todos los campos estén completos
    if (calificacion && detalles && id_producto && id_usuario && fecha) {
        const sql = "UPDATE calificacion SET calificacion = ?, detalles = ?, id_producto = ?, id_usuario = ?, fecha = ? WHERE id = ?";
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
                // Enviar la calificación actualizada como respuesta
                res.json({ id, calificacion, detalles, id_producto, id_usuario, fecha });
            }
        );
    } else {
        res.json({ message: "Campos incompletos" });
    }
};

// Función para eliminar una calificación
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
        // Enviar una respuesta indicando que la calificación fue eliminada
        res.send("Calificación eliminada");
    });
};