const express = require('express');

const bookRoutes = require('./bookRoutes');
const tagRoutes = require('./tagRoutes');

function apiRoutes(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/books', bookRoutes);
  router.use('/tags', tagRoutes);
}

module.exports = { apiRoutes };
