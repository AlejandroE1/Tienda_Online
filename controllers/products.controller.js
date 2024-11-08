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

    const { nombre_producto, descrip_producto, valor, marca } = req.body;
    if (nombre_producto, descrip_producto, valor, marca) {

        const sql =
            "INSERT INTO productos (nombre_producto, descrip_producto, valor, marca) VALUES (?, ?, ?, ?)";
        conexion.query(
            sql,
            [nombre_producto, descrip_producto, valor, marca],
            (err, result) => {
                if (err) {
                    res.status(500).send("Error al crear producto");
                    return;
                }
                res.status(201).json({ id: result.insertId, nombre_producto, descrip_producto, valor, marca, });
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
            res.status(500).send("Error al obtener producto");
            return;
        }
        if (results.length === 0) {
            res.status(404).send("producto no encontrado");
            return;
        }
        res.json(results[0]);
    });

};

exports.updateOneProduct = (req, res) => {


    const { nombre_producto, descrip_producto, valor, marca } = req.body;

    if (nombre_producto, descrip_producto, valor, marca) {

        const sql =
            "UPDATE productos SET nombre_producto = ?, descrip_producto = ?, valor = ?, marca = ? WHERE id = ?";
        conexion.query(
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
                res.json({ id: req.params.id, nombre_producto, descrip_producto, valor, marca, });
            }
        );
    } else {
        res.json({ message: "Campos incompletos" })
    }
};

exports.deleteOneProduct = (req, res) => {


    const { id } = req.params;

    const sql = "DELETE FROM productos WHERE id = ?";
    conexion.query(sql, [req.params.id], (err, result) => {
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
};