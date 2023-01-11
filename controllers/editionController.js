const factory = require('./factoryUtils');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const { formData } = require('./../middleware/upload');

const Edition = require('./../models/editionModel');

// ---------------------- SPECIAL METHODS ----------------------
// --- BY SHELF ---
exports.getByShelf = (req, res, next) => {
  const filter = { shelf: req.params.shelfId };
  req.query.filter = filter;
  next();
};
// --- BY LANGUAGE ---
exports.getByLanguage = (req, res, next) => {
  const filter = { language: req.params.languageId };
  req.query.filter = filter;
  next();
};
// ---------------------- BASIC CRUD ---------------------------
exports.getAbsEditions = factory.getAbsolute(Edition);
exports.getAllEditions = factory.getAll(Edition);
exports.getEdition = factory.getOne(Edition);
exports.createEdition = factory.createOne(Edition);
exports.updateEdition = factory.updateOne(Edition);
exports.deleteEdition = factory.deleteOne(Edition);
exports.formData = formData();
