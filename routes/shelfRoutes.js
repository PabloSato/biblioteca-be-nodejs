const express = require('express');

const shelfController = require('./../controllers/shelfController');

const router = express.Router();

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
