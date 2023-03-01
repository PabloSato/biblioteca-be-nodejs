const express = require('express');

const rackController = require('./../controllers/rackController');
const filter = require('./../controllers/filtersController');

const router = express.Router();
// ---------------------- SPECIALS ROUTES -----------------------
// -- ABSOLUTE ALL --
router.route('/abs').get(rackController.getAbsRacks);
// -- SEARCH BY SLUG --
router
  .route('/location/:locationId/slug/:slug')
  .get(rackController.getBySlug, rackController.getRack);
// -- SEARCH BY LOCATION
router
  .route('/location/:locationId')
  .get(filter.getByLocation, rackController.getAllRacks);
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
