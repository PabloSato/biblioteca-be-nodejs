const express = require('express');
const languageController = require('./../controllers/languageController');
const router = express.Router();

// ---------------------- SPECIAL ROUTES -----------------------------
// -- ABSOLUTE ALL --
router.route('/abs').get(languageController.getAbsLanguages);
// -- BY SLUG --
router
  .route('/slug/:slug')
  .get(languageController.getBySlug, languageController.getLanguage);
// ---------------------- CRUD ROUTES --------------------------------
router
  .route('/')
  .get(languageController.getAllLanguages)
  .post(languageController.formData, languageController.createLanguage);

router
  .route('/:id')
  .get(languageController.getLanguage)
  .patch(languageController.updateLanguage)
  .delete(languageController.deleteLanguage);

module.exports = router;
