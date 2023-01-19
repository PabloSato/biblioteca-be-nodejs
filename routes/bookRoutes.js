const express = require('express');

const bookController = require('./../controllers/bookController');
const filter = require('./../controllers/filtersController');

const router = express.Router();

// TODO: Add Nested Routes

// ---------------------- SPECIALS ROUTES ----------------------------
// TODO: Add Specials Routes
// -- ABSOLUTE ALL BOOKS --
router.route('/abs').get(bookController.getAbsBooks);
// -- LAST BOOKS --
router.route('/stats').get(bookController.stats);
router
  .route('/last-books')
  .get(bookController.getLastBooks, bookController.getAllBooks);
// -- SEARCH BY NAME --
router.route('/search/:name').get(filter.getByName, bookController.getAllBooks);
// -- SEARCH BY SLUG --
router.route('/slug/:slug').get(filter.getBySlug, bookController.getBook);
// -- SEARCH BY TAG --
router
  .route('/tag/:tagId')
  .get(bookController.getByTag, bookController.getAllBooks);
// -- SEARCH BY AUTHOR --
router
  .route('/author/:authorId')
  .get(bookController.getByAuthor, bookController.getAllBooks);
// -- SEARCH BY SAGA --
router
  .route('/saga/:sagaId')
  .get(bookController.getBySaga, bookController.getAllBooks);
// -- SEARCH BY UNIVERSE --
router
  .route('/universe/:universeId')
  .get(bookController.getByUniverse, bookController.getAllBooks);
// ---------------------- CRUD ROUTES --------------------------------
router
  .route('/')
  .get(bookController.getAllBooks)
  .post(bookController.formData, bookController.createBook);

router
  .route('/:id')
  .get(bookController.getBook)
  .patch(bookController.updateBook)
  .delete(bookController.deleteBook);

module.exports = router;
