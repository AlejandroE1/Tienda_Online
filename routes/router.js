const express = require('express');
const router = express.Router();
const productsRouter = require('./products.router')
const calificacionesRouter = require('./calificaciones.router')

router.get('/', (req, res) => {

    res.json({ message: 'Working!' });

});

router.use('/products', productsRouter);
//router.use('/calificaciones', calificacionesRouter);
//router.use('/usuarios', usuariosRouter);


module.exports = router;