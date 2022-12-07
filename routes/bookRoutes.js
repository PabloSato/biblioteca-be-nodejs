const express = require('express');

const bookController = require('./../controllers/bookController');

const router = express.Router();

// @TODO: Add Nested Routes

// ---------------------- SPECIALS ROUTES ----------------------------
// @TODO: Add Specials Routes
// -- LAST BOOKS --
router.route('/stats').get(bookController.stats);
router
  .route('/last-books')
  .get(bookController.getLastBooks, bookController.getAllBooks);
// -- SEARCH BY NAME --
router
  .route('/search/:name')
  .get(bookController.getByName, bookController.getAllBooks);
// -- SEARCH BY SLUG --
router
  .route('/slug/:slug')
  .get(bookController.getBySlug, bookController.getBook);
// -- SEARCH BY TAG --
router
  .route('/tag/:tagId')
  .get(bookController.getByTag, bookController.getAllBooks);
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
