const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller')

//Pagina principal de productos
router.get('/', usersController.getAllUsers);

//Página de creación de producto
router.post('/', usersController.createOneUser);

router.get('/:id', usersController.getOneUser);

router.put('/:id', usersController.updateOneUser);

router.delete('/:id', usersController.deleteOneUser);

module.exports = router;