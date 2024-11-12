const express = require('express');
const router = express.Router();
const qualificationsController = require('../controllers/qualifications.controller');

// Página principal de calificaciones
router.get('/', qualificationsController.getAllQualifications);

// Página de creación de calificaciones
router.post('/', qualificationsController.createOneQualification);

router.get('/:id', qualificationsController.getOneQualification);

router.put('/:id', qualificationsController.updateOneQualification);

router.delete('/:id', qualificationsController.deleteOneQualification);

module.exports = router;