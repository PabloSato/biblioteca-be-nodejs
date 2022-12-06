const express = require('express');

const bookController = require('./../controllers/bookController');

const router = express.Router();

// @TODO: Add Nested Routes

// ---------------------- SPECIALS ROUTES ----------------------------
// @TODO: Add Specials Routes
router.route('/search/:name').get(bookController.getBookByName);
// ---------------------- CRUD ROUTES --------------------------------
router
  .route('/')
  .get(bookController.getAllBooks)
  .post(bookController.createBook);

router
  .route('/:id')
  .get(bookController.getBook)
  .patch(bookController.updateBook)
  .delete(bookController.deleteBook);

module.exports = router;
