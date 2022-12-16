const factory = require('./factoryUtils');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

const Rack = require('./../models/rackModel');

// ---------------------- SPECIAL METHODS ----------------------
exports.getBySlug = (req, res, next) => {
  const filter = { slug: req.params.slug };
  req.query.filter = filter;
  next();
};
// ---------------------- BASIC CRUD ---------------------------
exports.getAllRacks = factory.getAll(Rack);
exports.getRack = factory.getOne(Rack);
exports.createRack = factory.createOne(Rack);
exports.updateRack = factory.updateOne(Rack);
exports.deleteRack = factory.deleteOne(Rack);