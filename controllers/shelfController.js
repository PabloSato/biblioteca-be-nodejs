const factory = require('./factoryUtils');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const Shelf = require('../models/shelfModel');

// ---------------------- SPECIAL METHODS ----------------------
// ---------------------- BASIC CRUD ---------------------------
exports.getAllShelfs = factory.getAll(Shelf);
exports.getShelf = factory.getOne(Shelf);
exports.createShelf = factory.createOne(Shelf);
exports.updateShelf = factory.updateOne(Shelf);
exports.deleteShelf = factory.deleteOne(Shelf);
