const express = require('express');
const router = express.Router();
const qualificationsController = require('../controllers/qualifications.controller')

//Pagina principal de Qualifications
router.get('/', qualificationsController.getAllQualifications);

//Página de creación de Qualifications
router.post('/', qualificationsController.createOneQualification);

router.get('/:id', qualificationsController.getOneQualification);

router.put('/:id', qualificationsController.updateOneQualification);

router.delete('/:id', qualificationsController.deleteOneQualification);

module.exports = router;