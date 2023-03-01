const express = require('express');
const imageController = require('./../controllers/imageController');

const router = express.Router();

router.route('/').post(imageController.uploadImage);

router.route('/:name').get(imageController.getImage);

module.exports = router;
