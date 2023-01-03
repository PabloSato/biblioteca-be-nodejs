const factory = require('./factoryUtils');
const { formData } = require('./../middleware/upload');

const Tag = require('./../models/tagModel');

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
// ---------------------- BASIC CRUD --------------------------------
exports.getAbsTags = factory.getAbsolute(Tag);
exports.getAllTags = factory.getAll(Tag);
exports.getTag = factory.getOne(Tag);
exports.createTag = factory.createOne(Tag);
exports.updateTag = factory.updateOne(Tag);
exports.deleteTag = factory.deleteOne(Tag);
exports.formData = formData();
