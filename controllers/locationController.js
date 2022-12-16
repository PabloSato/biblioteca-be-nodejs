const factory = require('./factoryUtils');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

const Location = require('./../models/locationModel');

// ---------------------- SPECIAL METHODS ----------------------
exports.getBySlug = (req, res, next) => {
  const filter = { slug: req.params.slug };
  req.query.filter = filter;
  next();
};
// ---------------------- BASIC CRUD ---------------------------
exports.getAllLocations = factory.getAll(Location);
exports.getLocation = factory.getOne(Location);
exports.createLocation = factory.createOne(Location);
exports.updateLocation = factory.updateOne(Location);
exports.deleteLocation = factory.deleteOne(Location);
