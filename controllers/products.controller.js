const conexion = require('../database/dataBaseConn');
const cookie = require('cookie');

const fs = require('fs');
const path = require('path');

// Función para obtener todos los productos
exports.getAllproducts = (req, res) => {
    conexion.query('SELECT * FROM productos', (error, results) => {
        if (error) {
            throw error;
        } else {
            // Convertir cada imagen BLOB a Base64
            const products = results.map(product => {
                return {
                    ...product,
                    imagen: `data:image/jpeg;base64,${product.imagen.toString('base64')}`
                };
            });

            // Renderizar la vista 'index' con los productos
            res.render('index', { products });
        }
    });
};

// Función para renderizar la página de creación de producto
exports.renderCreateProductPage = (req, res) => {
    res.render('create_product');
};

// Función para crear un producto
exports.createOneProduct = (req, res) => {
    const { nombre_producto, descrip_producto, valor, marca } = req.body;
    const imagen = req.file;

    // Verificar que todos los campos estén completos
    if (nombre_producto && descrip_producto && valor && marca && imagen ) {
        const imagenPath = path.join(__dirname, '../uploads', imagen.filename);
        const cookies = cookie.parse(req.headers.cookie || '');
        const userId = cookies['Usuario'] || '';
            console.log({userId});
        const sql = "INSERT INTO productos (nombre_producto, descrip_producto, valor, marca, imagen, id_usuario) VALUES (?, ?, ?, ?, ?, ?)";
        conexion.query(
            sql,
            [nombre_producto, descrip_producto, valor, marca, fs.readFileSync(imagenPath), userId],
            (err, result) => {
                if (err) {
                    res.status(500).send("Error al crear el producto");
                    return;
                }
                // Redirigir a la página de productos del usuario
                res.redirect(`/usuarios/productos`);
            }
        );
    } else {
        res.json({ message: "Campos incompletos" });
    }
};

// Función para obtener un producto por su ID
exports.getOneProduct = (req, res) => {
    const { id } = req.params;

    const sqlProduct = "SELECT *, (select ROUND(AVG(calificacion),1) from tienda.calificacion where id_producto = ?) as califProm FROM productos WHERE id = ?";
    const sqlQualifications = `
        SELECT calificacion.*, usuarios.nickname 
        FROM calificacion 
        JOIN usuarios ON calificacion.id_usuario = usuarios.id 
        WHERE calificacion.id_producto = ?`;

    conexion.query(sqlProduct, [id, id], (err, productResults) => {
        if (err) {
            res.status(500).send("Error al obtener el producto");
            return;
        }
        if (productResults.length === 0) {
            res.status(404).send("Producto no encontrado");
            return;
        }

        // Convertir la imagen BLOB a base64 si existe
        const product = productResults[0];
        if (product.imagen) {
            product.imagen = Buffer.from(product.imagen).toString('base64');
        }

        // Obtener las calificaciones del producto
        conexion.query(sqlQualifications, [id], (err, qualificationResults) => {
            if (err) {
                res.status(500).send("Error al obtener las calificaciones");
                return;
            }

            // Renderizar la vista 'pagina_producto' con el producto y sus calificaciones
            res.render('pagina_producto', { product, qualifications: qualificationResults });
        });
    });
};

// Función para renderizar la página de actualización de producto
exports.renderUpdateProductPage = (req, res) => {
    const { id } = req.params;

    const sqlProduct = "SELECT * FROM productos WHERE id = ?";
    conexion.query(sqlProduct, [id], (err, productResults) => {
        if (err) {
            res.status(500).send("Error al obtener el producto");
            return;
        }
        if (productResults.length === 0) {
            res.status(404).send("Producto no encontrado");
            return;
        }

        // Convertir la imagen BLOB a base64 si existe
        const product = productResults[0];
        if (product.imagen) {
            product.imagen = Buffer.from(product.imagen).toString('base64');
        }

        // Renderizar la vista 'update_product' con los detalles del producto
        res.render('update_product', { product });
    });
};

// Función para actualizar un producto
exports.updateOneProduct = (req, res) => {
    const { id } = req.params;
    const { nombre_producto, descrip_producto, valor, marca } = req.body;
    const imagen = req.file;

    // Verificar que todos los campos estén completos
    if (nombre_producto && descrip_producto && valor && marca ) {
        let sql;
        let params;

        // Si hay una nueva imagen, actualizarla
        if (imagen) {
            const imagenPath = path.join(__dirname, '../uploads', imagen.filename);
            sql = "UPDATE productos SET nombre_producto = ?, descrip_producto = ?, valor = ?, marca = ?, imagen = ? WHERE id = ?";
            params = [nombre_producto, descrip_producto, valor, marca, fs.readFileSync(imagenPath), id];
        } else {
            sql = "UPDATE productos SET nombre_producto = ?, descrip_producto = ?, valor = ?, marca = ? WHERE id = ?";
            params = [nombre_producto, descrip_producto, valor, marca, id];
        }

        conexion.query(sql, params, (err, result) => {
            if (err) {
                res.status(500).send("Error al actualizar el producto");
                return;
            }
            if (result.affectedRows === 0) {
                res.status(404).send("Producto no encontrado");
                return;
            }
            // Redirigir a la página de productos del usuario
            res.redirect(`/usuarios/productos`);
        });
    } else {
        res.json({ message: "Campos incompletos" });
    }
};

// Función para eliminar un producto
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