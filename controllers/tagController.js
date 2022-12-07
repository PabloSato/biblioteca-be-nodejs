//@TODO => add and config MULTER

const factory = require('./factoryUtils');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

const Tag = require('./../models/tagModel');

// ---------------------- SPECIAL METHODS ---------------------------
// -- ORDER --
exports.setOrder = (req, res, next) => {
  req.query.sort = 'name';
  next();
};
// ---------------------- BASIC CRUD --------------------------------
exports.getAllTags = factory.getAll(Tag);
exports.getTag = factory.getOne(Tag);
exports.createTag = factory.createOne(Tag);
exports.updateTag = factory.updateOne(Tag);
exports.deleteTag = factory.deleteOne(Tag);
