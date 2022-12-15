//TODO: => add and config MULTER
const multer = require('multer');
const sharp = require('sharp');
const crypto = require('crypto');

const factory = require('./factoryUtils');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

const Book = require('./../models/bookModel');

// ---------------------- SPECIAL METHODS ---------------------------
// -- LAST BOOKS --
exports.getLastBooks = (req, res, next) => {
  req.query.limit = '12';
  req.query.sort = '-createdAt';
  next();
};

// -- STATS BOOKS --
exports.stats = catchAsync(async (req, res, next) => {
  const stats = await Book.aggregate([
    {
      $group: {
        _id: null,
        numBooks: { $sum: 1 },
      },
    },
  ]);
  res.status(201).json({
    status: 'success',
    data: {
      numBooks: stats,
    },
  });
});
// -- BY NAME --
exports.getByName = (req, res, next) => {
  const name = req.params.name;
  const filter = { name: { $regex: name, $options: 'i' } };
  req.query.filter = filter;
  next();
};
// -- BY SLUG --
exports.getBySlug = (req, res, next) => {
  const filter = { slug: req.params.slug };
  req.query.filter = filter;
  next();
};
// -- BY TAG --
exports.getByTag = (req, res, next) => {
  const filter = { tags: req.params.tagId };
  req.query.filter = filter;
  next();
};
// -- BY AUTHOR --
exports.getByAuthor = (req, res, next) => {
  const filter = { authors: req.params.authorId };
  req.query.filter = filter;
  next();
};
// -- BY SAGA --
exports.getBySaga = (req, res, next) => {
  const filter = { saga: req.params.sagaId };
  req.query.filter = filter;
  req.query.sort = 'number';
  next();
};
// -- BY UNIVERSE --
exports.getByUniverse = (req, res, next) => {
  const filter = { universe: req.params.universeId };
  req.query.filter = filter;
  req.query.sort = 'name';
  next();
};
// ---------------------- BASIC CRUD --------------------------------
exports.getAllBooks = factory.getAll(Book);
exports.getBook = factory.getOne(Book);
exports.createBook = factory.createOne(Book);
exports.updateBook = factory.updateOne(Book);
exports.deleteBook = factory.deleteOne(Book);
// ---------------------- IMAGES METHODS ----------------------------
exports.uploadImage = factory.uploadImage();
exports.resizeImages = factory.resizeImage();
