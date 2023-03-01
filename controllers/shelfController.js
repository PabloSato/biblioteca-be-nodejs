const factory = require('./factoryUtils');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { formData } = require('./../middleware/upload');

const Shelf = require('../models/shelfModel');

// ---------------------- SPECIAL METHODS ----------------------
exports.getBySlug = (req, res, next) => {
  const filter = {
    rack: req.params.rackId,
    location: req.params.locationId,
    slug: req.params.slug,
  };
  req.query.filter = filter;
  next();
};
// ---------------------- BASIC CRUD ---------------------------
exports.getAbsShelfs = factory.getAbsolute(Shelf);
exports.getAllShelfs = factory.getAll(Shelf);
exports.getShelf = factory.getOne(Shelf);
exports.createShelf = factory.createOne(Shelf);
exports.updateShelf = factory.updateOne(Shelf);
exports.deleteShelf = factory.deleteOne(Shelf);
exports.formData = formData();
