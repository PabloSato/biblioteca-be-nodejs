const fs = require('fs');
const path = require('path');

const factory = require('./factoryUtils');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const setUpName = require('./../utils/setUpName');
const { formData } = require('./../middleware/upload');

const Book = require('./../models/bookModel');
const Edition = require('./../models/editionModel');

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
// ---------------------- CRUD METHODS --------------------------------
// ----- DELETE -----
exports.deleteBook = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  const editions = book.editions;
  const editions_id = [];
  let message = '';
  // editions.forEach((item) => editions_id.push(item._id));
  // const edit_remove = await Edition.deleteMany({ _id: { $in: editions_id } });

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
// ---------------------- BASIC CRUD --------------------------------
exports.getAbsBooks = factory.getAbsolute(Book);
exports.getAllBooks = factory.getAll(Book);
exports.getBook = factory.getOne(Book);
exports.createBook = factory.createOne(Book);
exports.updateBook = factory.updateOne(Book);
// exports.deleteBook = factory.deleteOne(Book);
exports.formData = formData();
