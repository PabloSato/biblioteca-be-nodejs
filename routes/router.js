const express = require('express');

const bookRoutes = require('./bookRoutes');

function apiRoutes(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/books', bookRoutes);
}

module.exports = { apiRoutes };
