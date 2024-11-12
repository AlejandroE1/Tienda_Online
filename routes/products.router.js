const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products.controller');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Página principal de productos
router.get('/', productsController.getAllproducts);

// Página de creación de producto
router.get('/crearproducto', productsController.renderCreateProductPage);

router.post('/crearproducto', upload.single('imagen'), productsController.createOneProduct);

// Página de edición de producto
router.get('/editarproducto/:id', productsController.renderUpdateProductPage);
router.post('/editarproducto/:id', upload.single('imagen'), productsController.updateOneProduct);

router.get('/:id', productsController.getOneProduct);

router.delete('/:id', productsController.deleteOneProduct);

module.exports = router;