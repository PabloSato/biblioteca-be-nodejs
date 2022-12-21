const express = require('express');
const authorController = require('./../controllers/authorController');
const router = express.Router();
// ---------------------- SPECIAL ROUTES -----------------------------
// -- BY SLUG --
router
  .route('/slug/:slug')
  .get(authorController.getBySlug, authorController.getAuthor);
// -- BY NAME --
router
  .route('/search/:name')
  .get(authorController.getByName, authorController.getAllAuthors);
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
