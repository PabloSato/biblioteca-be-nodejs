const express = require('express');

const editionController = require('./../controllers/editionController');
const filter = require('./../controllers/filtersController');

const router = express.Router();

// ---------------------- SPECIALS ROUTES -----------------------
// -- ABSOLUTE ALL --
router.route('/abs').get(editionController.getAbsEditions);
// -- BY LOCATION --
router
  .route('/location/:locationId')
  .get(filter.getByLocation, editionController.getAllEditions);
// -- BY RACK --
router
  .route('/rack/:rackId')
  .get(filter.getByRack, editionController.getAllEditions);
// -- BY SHELF --
router
  .route('/shelf/:shelfId')
  .get(editionController.getByShelf, editionController.getAllEditions);
// -- BY LANGUAGE --
router
  .route('/language/:languageId')
  .get(editionController.getByLanguage, editionController.getAllEditions);
// -- BY COLLECTION --
router
  .route('/collection/:collectionId')
  .get(editionController.getByCollection, editionController.getAllEditions);
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
