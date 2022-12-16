const express = require('express');

const rackController = require('./../controllers/rackController');

const router = express.Router();

// ---------------------- CRUD ROUTES ---------------------------
router
  .route('/')
  .get(rackController.getAllRacks)
  .post(rackController.createRack);

router
  .route('/:id')
  .get(rackController.getRack)
  .patch(rackController.updateRack)
  .delete(rackController.deleteRack);

module.exports = router;
