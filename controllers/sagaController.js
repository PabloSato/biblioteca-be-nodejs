const factory = require('./factoryUtils');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

const Saga = require('./../models/sagaModel');

// ---------------------- SPECIAL METHODS ---------------------
exports.getBySlug = (req, res, next) => {
  const filter = { slug: req.params.slug };
  req.query.filter = filter;
  next();
};
// ---------------------- CRUD METHODS ------------------------
exports.getAllSagas = factory.getAll(Saga);
exports.getSaga = factory.getOne(Saga);
exports.createSaga = factory.createOne(Saga);
exports.updateSaga = factory.updateOne(Saga);
exports.deleteSaga = factory.deleteOne(Saga);
