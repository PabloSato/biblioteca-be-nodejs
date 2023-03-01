const express = require('express');

const universeController = require('./../controllers/universeController');
const filter = require('./../controllers/filtersController');

const router = express.Router();

// ---------------------- SPECIAL ROUTES ------------------------
// -- ABSOLUTE ALL --
router.route('/abs').get(universeController.getAbsUniverses);
// -- SEARCH BY SLUG --
router
  .route('/slug/:slug')
  .get(filter.getBySlug, universeController.getUniverse);
// ---------------------- CRUD ROUTES ---------------------------
router
  .route('/')
  .get(universeController.getAllUniverses)
  .post(universeController.formData, universeController.createUniverse);

router
  .route('/:id')
  .get(universeController.getUniverse)
  .patch(universeController.updateUniverse)
  .delete(universeController.deleteUniverse);

module.exports = router;
