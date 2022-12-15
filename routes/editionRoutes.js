const express = require('express');

const editiionController = require('./../controllers/editionController');

const router = express.Router();

// ---------------------- CRUD ROUTES ---------------------------
router
  .route('/')
  .get(editiionController.getAllEditions)
  .post(editiionController.createEdition);

router
  .route('/:id')
  .get(editiionController.getEdition)
  .patch(editiionController.updateEdition)
  .delete(editiionController.deleteEdition);

module.exports = router;
