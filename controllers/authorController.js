//TODO: add and config MULTER

const factory = require('./factoryUtils');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

const Author = require('./../models/authorModel');

// ---------------------- SPECIAL METHODS ---------------------------
// -- ORDER --
exports.setOrder = (req, res, next) => {
  req.query.sort = 'name';
  next();
};
// -- BY SLUG --
exports.getBySlug = (req, res, next) => {
  const filter = { slug: req.params.slug };
  req.query.filter = filter;
  next();
};
// -- BY NAME --
exports.getByName = (req, res, next) => {
  const name = req.params.name;
  const filter = { name: { $regex: name, $options: 'i' } };
  req.query.filter = filter;
  next();
};
// ---------------------- BASIC CRUD --------------------------------
exports.getAllAuthors = factory.getAll(Author);
exports.getAuthor = factory.getOne(Author);
exports.createAuthor = factory.createOne(Author);
exports.updateAuthor = factory.updateOne(Author);
exports.deleteAuthor = factory.deleteOne(Author);
exports.formData = factory.formData();
exports.uploadImage = factory.uploadImage();
exports.resizeImage = factory.resizeImage();
