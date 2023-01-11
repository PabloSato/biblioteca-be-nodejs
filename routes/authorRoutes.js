const express = require('express');
const authorController = require('./../controllers/authorController');
const filter = require('./../controllers/filtersController');
const router = express.Router();
// ---------------------- SPECIAL ROUTES -----------------------------
// -- ABSOLUTE ALL AUTHORS --
router.route('/abs').get(authorController.getAbsAuthors);
// -- CLEAN ALL AUTHORS --
router
  .route('/clean')
  .get(authorController.getAllClean, authorController.getAllAuthors);
// -- BY SLUG --
router.route('/slug/:slug').get(filter.getBySlug, authorController.getAuthor);
// -- BY NAME --
router
  .route('/search/:name')
  .get(filter.getByName, authorController.getAllAuthors);
// ---------------------- CRUD ROUTES --------------------------------
router
  .route('/')
  .get(authorController.getAllAuthors)
  .post(authorController.formData, authorController.createAuthor);

router
  .route('/:id')
  .get(authorController.getAuthor)
  .patch(authorController.updateAuthor)
  .delete(authorController.deleteAuthor);

module.exports = router;
