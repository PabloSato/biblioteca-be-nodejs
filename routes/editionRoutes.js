const express = require('express');

const editionController = require('./../controllers/editionController');

const router = express.Router();

// ---------------------- SPECIALS ROUTES -----------------------
// -- ABSOLUTE ALL --
router.route('/abs').get(editionController.getAbsEditions);
// -- BY SHELF --
router
  .route('/shelf/:shelfId')
  .get(editionController.getByShelf, editionController.getAllEditions);
// -- BY LANGUAGE --
router
  .route('/language/:languageId')
  .get(editionController.getByLanguage, editionController.getAllEditions);
// ---------------------- CRUD ROUTES ---------------------------
router
  .route('/')
  .get(editionController.getAllEditions)
  .post(editionController.formData, editionController.createEdition);

router
  .route('/:id')
  .get(editionController.getEdition)
  .patch(editionController.updateEdition)
  .delete(editionController.deleteEdition);

module.exports = router;
