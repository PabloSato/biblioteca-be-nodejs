const express = require('express');

const bookRoutes = require('./bookRoutes');
const tagRoutes = require('./tagRoutes');
const authorRoutes = require('./authorRoutes');
const universeRoutes = require('./universeRoutes');
const sagaRoutes = require('./sagaRoutes');

function apiRoutes(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/books', bookRoutes);
  router.use('/tags', tagRoutes);
  router.use('/authors', authorRoutes);
  router.use('/universes', universeRoutes);
  router.use('/sagas', sagaRoutes);
}

module.exports = { apiRoutes };
