const express = require('express');
const tagController = require('./../controllers/tagController');
const router = express.Router();
// ---------------------- SPECIAL ROUTES -----------------------------
router.route('/slug/:slug').get(tagController.getBySlug, tagController.getTag);
// ---------------------- CRUD ROUTES --------------------------------
router
  .route('/')
  .get(tagController.setOrder, tagController.getAllTags)
  .post(tagController.createTag);

router
  .route('/:id')
  .get(tagController.getTag)
  .patch(tagController.updateTag)
  .delete(tagController.deleteTag);

module.exports = router;
