const conexion = require('../database/dataBaseConn');

// Función para obtener todos los usuarios
exports.getAllUsers = (req, res) => {
    conexion.query('SELECT * FROM usuarios', (error, results) => {
        if (error) {
            throw error;
        } else {
            // Enviar los usuarios como respuesta en formato JSON
            res.response({ product: results });
        }
    });
};

// Función para crear un usuario
exports.createOneUser = (req, res) => {
    const { nombres, apellidos, email, telefono, nickname } = req.body;

    // Verificar que todos los campos estén completos
    if (nombres && apellidos && email && telefono && nickname) {
        const sql = "INSERT INTO usuarios (nombres, apellidos, email, telefono, nickname) VALUES (?, ?, ?, ?, ?)";
        conexion.query(
            sql,
            [nombres, apellidos, email, telefono, nickname],
            (err, result) => {
                if (err) {
                    res.status(500).send("Error al crear el usuario" + err);
                    return;
                }
                // Enviar el usuario creado como respuesta en formato JSON
                res.status(201).json({ id: result.insertId, nombres, apellidos, email, telefono, nickname });
            }
        );
    } else {
        res.json({ message: "Campos incompletos" });
    }
};

// Función para obtener un usuario por su ID
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
        // Enviar el usuario como respuesta en formato JSON
        res.json(results[0]);
    });
};

// Función para actualizar un usuario
exports.updateOneUser = (req, res) => {
    const { id } = req.params;
    const { nombres, apellidos, email, telefono, nickname } = req.body;

    // Verificar que todos los campos estén completos
    if (nombres && apellidos && email && telefono && nickname) {
        const sql = "UPDATE usuarios SET nombres = ?, apellidos = ?, email = ?, telefono = ?, nickname = ? WHERE id = ?";
        conexion.query(
            sql,
            [nombres, apellidos, email, telefono, nickname, id],
            (err, result) => {
                if (err) {
                    res.status(500).send("Error al actualizar el usuario");
                    return;
                }
                if (result.affectedRows === 0) {
                    res.status(404).send("Usuario no encontrado");
                    return;
                }
                // Enviar el usuario actualizado como respuesta en formato JSON
                res.json({ id, nombres, apellidos, email, telefono, nickname });
            }
        );
    } else {
        res.json({ message: "Campos incompletos" });
    }
};

// Función para eliminar un usuario
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
        // Enviar una respuesta indicando que el usuario fue eliminado
        res.send("Usuario eliminado");
    });
};

// Función para obtener los productos de un usuario
exports.productsUser = (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM productos WHERE id_usuario = ?";
    conexion.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).send("Error al encontrar producto");
            return;
        }

        // Convertir BLOB a base64
        result = result.map(product => {
            if (product.imagen) {
                product.imagenBase64 = `data:image/jpeg;base64,${product.imagen.toString('base64')}`;
            }
            return product;
        });

        // Renderizar la vista 'user_products' con los productos del usuario
        res.render('user_products', { products: result });
    });
};