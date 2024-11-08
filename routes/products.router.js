const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products.controller')

//Pagina principal de productos
router.get('/', productsController.getAllproducts);

//Página de creación de producto
router.post('/', productsController.createOneProduct);

router.get('/:id', productsController.getOneProduct);

router.put('/:id', productsController.updateOneProduct);

router.delete('/:id', productsController.deleteOneProduct);

module.exports = router;