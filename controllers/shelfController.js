const factory = require('./factoryUtils');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const Shelf = require('../models/shelfModel');

// ---------------------- SPECIAL METHODS ----------------------
// -- BY SLUG --
exports.getBySlug = (req, res, next) => {
  const filter = { slug: req.params.slug };
  req.query.filter = filter;
  next();
};
// -- BY RACK --
exports.getByRack = (req, res, next) => {
  const filter = { rack: req.params.rackId };
  req.query.filter = filter;
  next();
};
// ---------------------- BASIC CRUD ---------------------------
exports.getAllShelfs = factory.getAll(Shelf);
exports.getShelf = factory.getOne(Shelf);
exports.createShelf = factory.createOne(Shelf);
exports.updateShelf = factory.updateOne(Shelf);
exports.deleteShelf = factory.deleteOne(Shelf);
exports.formData = factory.formData();
