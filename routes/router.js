const express = require('express');

const bookRoutes = require('./bookRoutes');
const tagRoutes = require('./tagRoutes');
const authorRoutes = require('./authorRoutes');
const universeRoutes = require('./universeRoutes');

function apiRoutes(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/books', bookRoutes);
  router.use('/tags', tagRoutes);
  router.use('/authors', authorRoutes);
  router.use('/universes', universeRoutes);
}

module.exports = { apiRoutes };
