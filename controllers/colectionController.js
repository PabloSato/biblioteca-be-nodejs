const factory = require('./factoryUtils');

const Colection = require('./../models/colectionModel');

// ---------------------- SPECIAL METHODS ---------------------
exports.getBySlug = (req, res, next) => {
  const filter = { slug: req.params.slug };
  req.query.filter = filter;
  next();
};
// ---------------------- CRUD METHODS ------------------------
exports.getAllColections = factory.getAll(Colection);
exports.getColection = factory.getOne(Colection);
exports.createColection = factory.createOne(Colection);
exports.updateColection = factory.updateOne(Colection);
exports.deleteColection = factory.deleteOne(Colection);
exports.formData = factory.formData();