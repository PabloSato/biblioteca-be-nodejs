const express = require('express');

const editiionController = require('./../controllers/editionController');

const router = express.Router();

// ---------------------- SPECIALS ROUTES -----------------------
// -- BY SHELF --
router
  .route('/shelf/:shelfId')
  .get(editiionController.getByShelf, editiionController.getAllEditions);
// -- BY LANGUAGE --
router
  .route('/language/:languageId')
  .get(editiionController.getByLanguage, editiionController.getAllEditions);
// ---------------------- CRUD ROUTES ---------------------------
router
  .route('/')
  .get(editiionController.getAllEditions)
  .post(editiionController.formData, editiionController.createEdition);

router
  .route('/:id')
  .get(editiionController.getEdition)
  .patch(editiionController.updateEdition)
  .delete(editiionController.deleteEdition);

module.exports = router;
