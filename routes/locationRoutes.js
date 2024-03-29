const express = require('express');

const locationController = require('./../controllers/locationController');
const filter = require('./../controllers/filtersController');

const router = express.Router();
// ---------------------- SPECIALS ROUTES -----------------------
// -- ABSOLUTE ALL --
router.route('/abs').get(locationController.getAbsLocations);
// -- SEARCH BY SLUG --
router
  .route('/slug/:slug')
  .get(filter.getBySlug, locationController.getLocation);
// ---------------------- CRUD ROUTES ---------------------------
router
  .route('/')
  .get(locationController.getAllLocations)
  .post(locationController.formData, locationController.createLocation);

router
  .route('/:id')
  .get(locationController.getLocation)
  .patch(locationController.updateLocation)
  .delete(locationController.deleteLocation);

module.exports = router;
