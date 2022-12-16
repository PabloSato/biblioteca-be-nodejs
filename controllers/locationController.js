const factory = require('./factoryUtils');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

const Location = require('./../models/locationModel');

// ---------------------- SPECIAL METHODS ----------------------
// ---------------------- BASIC CRUD ---------------------------
exports.getAllLocations = factory.getAll(Location);
exports.getLocation = factory.getOne(Location);
exports.createLocation = factory.createOne(Location);
exports.updateLocation = factory.updateOne(Location);
exports.deleteLocation = factory.deleteOne(Location);
