const conexion = require('../database/dataBaseConn');

exports.getAllproducts = (req, res) => {

    conexion.query('SELECT * FROM productos', (error, results) => {
        if (error) {
            throw error;
        } else {
            res.render('index', { products: results });
        }
    })
};

exports.createOneProduct = (req, res) => {

    const { nombre_producto, descrip_producto, valor, marca, imagen, id_usuario } = req.body;
    if (nombre_producto, descrip_producto, valor, marca, imagen, id_usuario) {

        const sql =
            "INSERT INTO productos (nombre_producto, descrip_producto, valor, marca, imagen, id_usuario) VALUES (?, ?, ?, ?)";
        conexion.query(
            sql,
            [nombre_producto, descrip_producto, valor, marca, imagen, id_usuario],
            (err, result) => {
                if (err) {
                    res.status(500).send("Error al crear el producto");
                    return;
                }
                res.status(201).json({ id: result.insertId, nombre_producto, descrip_producto, valor, marca, imagen, id_usuario, });
            }
        );

    } else {
        res.json({ message: "Campos incompletos" })
    }

};

exports.getOneProduct = (req, res) => {

    const { id } = req.params;

    const sql = "SELECT * FROM productos WHERE id = ?";
    conexion.query(sql, [id], (err, results) => {
        if (err) {
            res.status(500).send("Error al obtener el producto");
            return;
        }
        if (results.length === 0) {
            res.status(404).send("Producto no encontrado");
            return;
        }
        res.json(results[0]);
    });

};

exports.updateOneProduct = (req, res) => {

    const { id } = req.params;
    const { nombre_producto, descrip_producto, valor, marca, imagen, id_usuario } = req.body;

    if (nombre_producto, descrip_producto, valor, marca, imagen, id_usuario) {

        const sql =
            "UPDATE productos SET nombre_producto = ?, descrip_producto = ?, valor = ?, marca = ? imagen = ?, id_usuario = ? WHERE id = ?";
        conexion.query(
            sql,
            [nombre_producto, descrip_producto, valor, marca, imagen, id_usuario, id],
            (err, result) => {
                if (err) {
                    res.status(500).send("Error al actualizar el producto");
                    return;
                }
                if (result.affectedRows === 0) {
                    res.status(404).send("Producto no encontrado");
                    return;
                }
                res.json({ id, nombre_producto, descrip_producto, valor, marca, imagen, id_usuario, });
            }
        );
    } else {
        res.json({ message: "Campos incompletos" })
    }
};

exports.deleteOneProduct = (req, res) => {


    const { id } = req.params;

    const sql = "DELETE FROM productos WHERE id = ?";
    conexion.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).send("Error al eliminar el producto");
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).send("Producto no encontrado");
            return;
        }
        res.send("Producto eliminado");
    });
};