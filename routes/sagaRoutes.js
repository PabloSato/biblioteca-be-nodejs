const express = require('express');

const sagaController = require('./../controllers/sagaController');

const router = express.Router();

// ---------------------- SPECIAL ROUTES ------------------------
// -- ABSOLUTE ALL --
router.route('/abs').get(sagaController.getAbsSagas);
// -- SEARCH BY SLUG --
router
  .route('/slug/:slug')
  .get(sagaController.getBySlug, sagaController.getSaga);

// ---------------------- CRUD ROUTES ---------------------------
router
  .route('/')
  .get(sagaController.getAllSagas)
  .post(sagaController.formData, sagaController.createSaga);

router
  .route('/:id')
  .get(sagaController.getSaga)
  .patch(sagaController.updateSaga)
  .delete(sagaController.deleteSaga);

module.exports = router;
