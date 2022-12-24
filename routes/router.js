const express = require('express');

const bookRoutes = require('./bookRoutes');
const tagRoutes = require('./tagRoutes');
const authorRoutes = require('./authorRoutes');
const universeRoutes = require('./universeRoutes');
const sagaRoutes = require('./sagaRoutes');
const editionRoutes = require('./editionRoutes');
const locationRoutes = require('./locationRoutes');
const rackRoutes = require('./rackRoutes');
const shelfRoutes = require('./shelfRoutes');
const colectRoutes = require('./colectionRoutes');
const imageRoutes = require('./imageRoutes');

function apiRoutes(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/books', bookRoutes);
  router.use('/tags', tagRoutes);
  router.use('/authors', authorRoutes);
  router.use('/universes', universeRoutes);
  router.use('/sagas', sagaRoutes);
  router.use('/editions', editionRoutes);
  router.use('/locations', locationRoutes);
  router.use('/racks', rackRoutes);
  router.use('/shelfs', shelfRoutes);
  router.use('/colections', colectRoutes);
  router.use('/images', imageRoutes);
}

module.exports = { apiRoutes };
