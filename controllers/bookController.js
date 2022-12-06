//@TODO => add and config MULTER

const factory = require('./factoryUtils');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

const Book = require('./../models/bookModel');

// ---------------------- SPECIAL METHODS ---------------------------
// -- LAST BOOKS --
exports.getLastBooks = (req, res, next) => {
  req.query.limit = '10';
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
  filter = { name: { $regex: name, $options: 'i' } };
  req.query.filter = filter;
  next();
};
// ---------------------- BASIC CRUD --------------------------------
exports.getAllBooks = factory.getAll(Book);
// exports.getBookByName = factory.getByName(Book);
exports.getBook = factory.getOne(Book);
exports.createBook = factory.createOne(Book);
exports.updateBook = factory.updateOne(Book);
exports.deleteBook = factory.deleteOne(Book);
