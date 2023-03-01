const factory = require('./factoryUtils');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const { formData } = require('./../middleware/upload');

const Rack = require('./../models/rackModel');

// ---------------------- SPECIAL METHODS ----------------------
// ---------------------- BASIC CRUD ---------------------------
exports.getAbsRacks = factory.getAbsolute(Rack);
exports.getAllRacks = factory.getAll(Rack);
exports.getRack = factory.getOne(Rack);
exports.createRack = factory.createOne(Rack);
exports.updateRack = factory.updateOne(Rack);
exports.deleteRack = factory.deleteOne(Rack);
exports.formData = formData();
