const factory = require('./factoryUtils');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

const Rack = require('./../models/rackModel');

// ---------------------- SPECIAL METHODS ----------------------
// ---------------------- BASIC CRUD ---------------------------
exports.getAllRacks = factory.getAll(Rack);
exports.getRack = factory.getOne(Rack);
exports.createRack = factory.createOne(Rack);
exports.updateRack = factory.updateOne(Rack);
exports.deleteRack = factory.deleteOne(Rack);
