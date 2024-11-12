const conexion = require('../database/dataBaseConn');
const crypto = require('crypto');
const cookie = require('cookie');

// Función para obtener todos los usuarios
exports.getAllUsers = (req, res) => {
    conexion.query('SELECT * FROM usuarios', (error, results) => {
        if (error) {
            throw error;
        } else {
            // Cambiar 'product' a 'usuarios' para mayor claridad
            res.json({ usuarios: results });
        }
    });
};

// Función para crear un usuario
exports.createOneUser = (req, res) => {
    const { nombres, apellidos, email, telefono, nickname, password } = req.body;

    //Encriptación de contraseña, viene de chatGPT, NO TOCAR
    const iv = Buffer.from('4a4a74fe1a41968fdc222a58f37ef611', 'hex'); 
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(crypto.createHash('sha256').update(String('dQG2fgXRGTkDxUCv^$v3E9')).digest('base64').substr(0, 32)), iv);
    let encrypted = cipher.update(password);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    let pass =  iv.toString('hex') + ':' + encrypted.toString('hex');
    
    let id = 0;
    // Verificar que todos los campos estén completos
    if (nombres && apellidos && email && telefono && nickname && pass) {
        const sql = 'INSERT INTO usuarios (nombres, apellidos, email, telefono, nickname, password) VALUES (?, ?, ?, ?, ?, ?)';
        conexion.query(
            sql,
            [nombres, apellidos, email, telefono, nickname, pass],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ success: false, message: "Error al crear el usuario: " + err });
                }                
                return conexion.query(
                    'select max(id) as id from  usuarios',
                    (err, userResult) => {
                       if (err)  {
                        return 0
                       }
                       res.setHeader('Set-Cookie', `Usuario=${userResult[0].id};path=/`);              
                       return res.status(201).json({ success: true, message: "Usuario registrado con éxito", redirectTo: '/products' });
                    })
            }
        );
    } else {
        return res.json({ success: false, message: "Campos incompletos usuarios" });
    }
};

// Función para loguearse
exports.login = (req, res) => {
    const { nickname, password } = req.body;

    //Encriptación de contraseña, viene de chatGPT, NO TOCAR
    const iv = Buffer.from('4a4a74fe1a41968fdc222a58f37ef611', 'hex');
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(crypto.createHash('sha256').update(String('dQG2fgXRGTkDxUCv^$v3E9')).digest('base64').substr(0, 32)), iv);
    let encrypted = cipher.update(password);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    let pass =  iv.toString('hex') + ':' + encrypted.toString('hex');

    let id = 0;
    // Verificar que todos los campos estén completos
    if (nickname && password ) {
            conexion.query(
            'select id from usuarios where nickname = ? and password = ?',
            [nickname, pass],
            (err, userResult) => {
                if (err)  {
                    return res.status(500).json({ success: false, message: "Error interno: " + err });
                }
                    if(userResult.length > 0){
                        res.setHeader('Set-Cookie', `Usuario=${userResult[0].id};path=/`);              
                        return res.status(201).json({ success: true, message: "Usuario logueado con éxito", redirectTo: '/products' });
                    }else{
                        return res.status(200).json({ success: false, message: "Datos incorrectos" });
                    }
            })           
        
    } else {
        return res.json({ success: false, message: "Campos incompletos usuarios" });
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
        res.json({ success: false, message: "Campos incompletos" });
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
    const cookies = cookie.parse(req.headers.cookie || '');
    const userId = cookies['Usuario'] || '';    
    const sql = "SELECT * FROM productos WHERE id_usuario = ?";
    
    conexion.query(sql, [userId], (err, result) => {
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