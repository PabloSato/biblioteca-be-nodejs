const express = require('express');

const shelfController = require('./../controllers/shelfController');
const filter = require('./../controllers/filtersController');

const router = express.Router();
// ---------------------- SPECIALS ROUTES -----------------------
// -- ABSOLUTE ALL --
router.route('/abs').get(shelfController.getAbsShelfs);
// -- SEARCH BY SLUG --
router.route('/slug/:slug').get(filter.getBySlug, shelfController.getShelf);
// -- SEARCH BY RACK --
router
  .route('/rack/:rackId')
  .get(filter.getByRack, shelfController.getAllShelfs);
// ---------------------- CRUD ROUTES ---------------------------
router
  .route('/')
  .get(shelfController.getAllShelfs)
  .post(shelfController.formData, shelfController.createShelf);

router
  .route('/:id')
  .get(shelfController.getShelf)
  .patch(shelfController.updateShelf)
  .delete(shelfController.deleteShelf);

module.exports = router;
