//@TODO => add and config MULTER

const factory = require('./factoryUtils');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

const Book = require('./../models/bookModel');

// ---------------------- SPECIAL METHODS ---------------------------
exports.getLastBooks = (req, res, next) => {
  req.query.limit = '10';
  req.query.sort = '-createdAt';
  next();
};
// ---------------------- BASIC CRUD --------------------------------
exports.getAllBooks = factory.getAll(Book);
exports.getBookByName = factory.getByName(Book);
exports.getBook = factory.getOne(Book);
exports.createBook = factory.createOne(Book);
exports.updateBook = factory.updateOne(Book);
exports.deleteBook = factory.deleteOne(Book);
