const factory = require('./factoryUtils');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const { formData } = require('./../middleware/upload');

const Rack = require('./../models/rackModel');

// ---------------------- SPECIAL METHODS ----------------------
// -- BY SLUG --
exports.getBySlug = (req, res, next) => {
  const filter = { slug: req.params.slug };
  req.query.filter = filter;
  next();
};
// -- BY LOCATION --
exports.getByLocation = (req, res, next) => {
  const filter = { location: req.params.locationId };
  req.query.filter = filter;
  next();
};

// ---------------------- BASIC CRUD ---------------------------
exports.getAbsRacks = factory.getAbsolute(Rack);
exports.getAllRacks = factory.getAll(Rack);
exports.getRack = factory.getOne(Rack);
exports.createRack = factory.createOne(Rack);
exports.updateRack = factory.updateOne(Rack);
exports.deleteRack = factory.deleteOne(Rack);
exports.formData = formData();
