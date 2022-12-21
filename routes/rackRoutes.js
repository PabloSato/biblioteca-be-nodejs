const express = require('express');

const rackController = require('./../controllers/rackController');

const router = express.Router();
// ---------------------- SPECIALS ROUTES -----------------------
// -- SEARCH BY SLUG --
router
  .route('/slug/:slug')
  .get(rackController.getBySlug, rackController.getRack);
// -- SEARCH BY LOCATION
router
  .route('/location/:locationId')
  .get(rackController.getByLocation, rackController.getAllRacks);
// ---------------------- CRUD ROUTES ---------------------------
router
  .route('/')
  .get(rackController.getAllRacks)
  .post(rackController.formData, rackController.createRack);

router
  .route('/:id')
  .get(rackController.getRack)
  .patch(rackController.updateRack)
  .delete(rackController.deleteRack);

module.exports = router;
