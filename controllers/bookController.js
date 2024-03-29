const fs = require('fs');
const path = require('path');

const factory = require('./factoryUtils');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const setUpName = require('./../utils/setUpName');
const { formData } = require('./../middleware/upload');

const Book = require('./../models/bookModel');
const Edition = require('./../models/editionModel');
const Author = require('../models/authorModel');

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
  next();
};
// -- BY ABSOLUTE --
exports.getAbsBooks = catchAsync(async (req, res, next) => {
  const data = await Book.aggregate([
    { $project: { name: 1, slug: 1, authors: 1 } },
    { $addFields: { id: '$_id' } },
    { $sort: { name: 1 } },
  ]);

  const opts = [{ path: 'authors', select: 'name' }];
  const result = await Book.populate(data, opts);

  res.status(200).json({
    status: 'success',
    data: {
      data: result,
    },
  });
});

// ---------------------- CRUD METHODS --------------------------------
// ----- DELETE -----
exports.deleteBook = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const book = await Book.findById(id);
  const editions = book.editions;
  const authors = book.authors;
  let message = '';

  editions.forEach(async (item) => {
    const edit = await Edition.findById(item._id);
    const image = edit.image;
    if (image.length > 0) {
      const del_image = path.join(__basedir, 'public', 'images', image);
      if (fs.existsSync(del_image)) {
        fs.unlink(del_image, (err) => {
          if (err) {
            console.error(err);
            message = `Can't delete image from edition: ${edit.version}`;
          }
        });
      }
    }
    await Edition.findByIdAndDelete(item._id);
  });

  book.authors.forEach(async (item) => {
    const author = await Author.findById(item._id);
    const index = author.books.indexOf(id);
    author.books.splice(index, 1);
    const upt = await Author.findByIdAndUpdate(item._id, author);
  });

  const data = await Book.findByIdAndDelete(req.params.id);

  if (!data) {
    return next(new AppError('No book found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
    message: message,
  });
});
// ---------------------- FIX --------------------------------
exports.fixEditions = catchAsync(async (req, res, next) => {
  const books = await Book.find();
  books.forEach(async (book) => {
    const name_book = book.name;
    const slug = book.slug;
    const edition = book.editions[0];
    const id_edit = edition._id;
    edition.name = name_book;
    edition.slug = slug;
    const update = { name: name_book, slug: slug };
    const upt = await Edition.updateOne({ _id: edition._id }, update);
  });
  res.status(200).json({
    status: 'success',
    data: null,
  });
});
// ---------------------- BASIC CRUD --------------------------------
// exports.getAbsBooks = factory.getAbsolute(Book);
exports.getBysAbs = factory.getBysAbs(Book);
exports.getAllBooks = factory.getAll(Book);
exports.getBook = factory.getOne(Book);
exports.createBook = factory.createOne(Book);
exports.updateBook = factory.updateOne(Book);
// exports.deleteBook = factory.deleteOne(Book);
exports.formData = formData();
