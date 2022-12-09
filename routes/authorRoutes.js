const express = require('express');
const authorController = require('./../controllers/authorController');
const router = express.Router();
// ---------------------- SPECIAL ROUTES -----------------------------
router
  .route('/slug/:slug')
  .get(authorController.getBySlug, authorController.getAuthor);
// ---------------------- CRUD ROUTES --------------------------------
router
  .route('/')
  .get(authorController.getAllAuthors)
  .post(authorController.createAuthor);

router
  .route('/:id')
  .get(authorController.getAuthor)
  .patch(authorController.updateAuthor)
  .delete(authorController.deleteAuthor);

module.exports = router;
