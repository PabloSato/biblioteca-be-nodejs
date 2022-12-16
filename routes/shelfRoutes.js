const express = require('express');

const shelfController = require('./../controllers/shelfController');

const router = express.Router();
// ---------------------- SPECIALS ROUTES -----------------------
// -- SEARCH BY SLUG --
router
  .route('/slug/:slug')
  .get(shelfController.getBySlug, shelfController.getShelf);
// ---------------------- CRUD ROUTES ---------------------------
router
  .route('/')
  .get(shelfController.getAllShelfs)
  .post(shelfController.createShelf);

router
  .route('/:id')
  .get(shelfController.getShelf)
  .patch(shelfController.updateShelf)
  .delete(shelfController.deleteShelf);

module.exports = router;
