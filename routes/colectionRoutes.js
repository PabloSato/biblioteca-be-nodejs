const express = require('express');

const colectionController = require('./../controllers/colectionController');

const router = express.Router();

// ---------------------- SPECIAL ROUTES ------------------------
// -- ABSOLUTE ALL --
router.route('/abs').get(colectionController.getAbsColections);
// -- SEARCH BY SLUG --
router
  .route('/slug/:slug')
  .get(colectionController.getBySlug, colectionController.getColection);

// ---------------------- CRUD ROUTES ---------------------------
router
  .route('/')
  .get(colectionController.getAllColections)
  .post(colectionController.formData, colectionController.createColection);

router
  .route('/:id')
  .get(colectionController.getColection)
  .patch(colectionController.updateColection)
  .delete(colectionController.deleteColection);

module.exports = router;
