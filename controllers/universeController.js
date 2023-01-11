const factory = require('./factoryUtils');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const { formData } = require('./../middleware/upload');

const Universe = require('./../models/universeModel');

// ---------------------- SPECIAL METHODS ------------------------
// ---------------------- CRUD METHODS ---------------------------
exports.getAbsUniverses = factory.getAbsolute(Universe);
exports.getAllUniverses = factory.getAll(Universe);
exports.getUniverse = factory.getOne(Universe);
exports.createUniverse = factory.createOne(Universe);
exports.updateUniverse = factory.updateOne(Universe);
exports.deleteUniverse = factory.deleteOne(Universe);
exports.formData = formData();
