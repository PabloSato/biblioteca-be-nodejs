const factory = require('./factoryUtils');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

const Edition = require('./../models/editionModel');

// ---------------------- SPECIAL METHODS ----------------------
// --- BY SHELF ---
exports.getByShelf = (req, res, next) => {
  const filter = { shelf: req.params.shelfId };
  req.query.filter = filter;
  next();
};
// ---------------------- BASIC CRUD ---------------------------
exports.getAllEditions = factory.getAll(Edition);
exports.getEdition = factory.getOne(Edition);
exports.createEdition = factory.createOne(Edition);
exports.updateEdition = factory.updateOne(Edition);
exports.deleteEdition = factory.deleteOne(Edition);
exports.formData = factory.formData();
