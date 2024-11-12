const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');

// Página principal de usuarios
router.get('/', usersController.getAllUsers);

// Mover esta ruta antes de la exportación
router.get('/productos', usersController.productsUser);

// Página de creación de usuario
router.post('/register', usersController.createOneUser);

router.post('/login', usersController.login);

router.get('/:id', usersController.getOneUser);

router.put('/:id', usersController.updateOneUser);

router.delete('/:id', usersController.deleteOneUser);


module.exports = router;