const express = require('express');
const router = express.Router();
const productsRouter = require('./products.router')
const qualificationsRouter = require('./qualifications.router')

router.get('/', (req, res) => {

    res.json({ message: 'Working!' });

});

router.use('/products', productsRouter);
router.use('/qualifications', qualificationsRouter);
//router.use('/usuarios', usuariosRouter);


module.exports = router;