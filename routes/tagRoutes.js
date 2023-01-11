const express = require('express');
const tagController = require('./../controllers/tagController');
const filter = require('./../controllers/filtersController');
const router = express.Router();
// ---------------------- SPECIAL ROUTES -----------------------------
// -- ABSOLUTE ALL --
router.route('/abs').get(tagController.getAbsTags);
// -- BY SLUG --
router.route('/slug/:slug').get(filter.getBySlug, tagController.getTag);
// ---------------------- CRUD ROUTES --------------------------------
router
  .route('/')
  .get(filter.setOrderName, tagController.getAllTags)
  .post(tagController.formData, tagController.createTag);

router
  .route('/:id')
  .get(tagController.getTag)
  .patch(tagController.updateTag)
  .delete(tagController.deleteTag);

module.exports = router;
