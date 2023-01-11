const factory = require('./factoryUtils');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const setUpName = require('./../utils/setUpName');
const { formData } = require('./../middleware/upload');

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
exports.createBook = catchAsync(async (req, res, next) => {
  const try_name = setUpName(req.body.name).toLowerCase();
  const try_authors = req.body.authors;
  const already_books = await Book.find({
    name: try_name,
    authors: try_authors,
  });
  if (already_books.length > 0) {
    res.status(409).json({
      status: 'failed',
      message: 'Duplicated book',
    });
  } else {
    try {
      const data = await Book.create(req.body);

      res.status(201).json({
        status: 'success',
        data: {
          data: data,
        },
      });
    } catch (err) {
      const status = err.statusCode ? err.statusCode : 500;
      res.status(status).json({
        status: 'failed',
        message: err.message,
      });
    }
  }
});
// ---------------------- BASIC CRUD --------------------------------
exports.getAbsBooks = factory.getAbsolute(Book);
exports.getAllBooks = factory.getAll(Book);
exports.getBook = factory.getOne(Book);
// exports.createBook = factory.createOne(Book);
exports.updateBook = factory.updateOne(Book);
exports.deleteBook = factory.deleteOne(Book);
exports.formData = formData();
