//TODO: add and config MULTER

const factory = require('./factoryUtils');
const { formData } = require('./../middleware/upload');

const Author = require('./../models/authorModel');

// ---------------------- SPECIAL METHODS ---------------------------
// -- GET ALL CLEAN --
exports.getAllClean = (req, res, next) => {
  const filter = { name: { $ne: 'vv.aa' }, 'books.1': { $exists: true } };
  req.query.filter = filter;
  next();
};
// ---------------------- BASIC CRUD --------------------------------
exports.getAbsAuthors = factory.getAbsolute(Author);
exports.getAllAuthors = factory.getAll(Author);
exports.getAuthor = factory.getOne(Author);
exports.createAuthor = factory.createOne(Author);
exports.updateAuthor = factory.updateOne(Author);
exports.deleteAuthor = factory.deleteOne(Author);
exports.formData = formData();
