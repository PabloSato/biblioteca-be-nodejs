const express = require('express');

const locationController = require('./../controllers/locationController');

const router = express.Router();
// ---------------------- SPECIALS ROUTES -----------------------
// -- SEARCH BY SLUG --
router
  .route('/slug/:slug')
  .get(locationController.getBySlug, locationController.getLocation);
// ---------------------- CRUD ROUTES ---------------------------
router
  .route('/')
  .get(locationController.getAllLocations)
  .post(locationController.createLocation);

router
  .route('/:id')
  .get(locationController.getLocation)
  .patch(locationController.updateLocation)
  .delete(locationController.deleteLocation);

module.exports = router;
