const factory = require('./factoryUtils');
const { formData } = require('./../middleware/upload');

const Language = require('./../models/languageModel');
// ---------------------- SPECIAL METHODS ---------------------------
exports.getBySlug = (req, res, next) => {
  const filter = { slug: req.params.slug };
  req.query.filter = filter;
  next();
};
// ---------------------- BASIC CRUD ---------------------------
exports.getAbsLanguages = factory.getAbsolute(Language);
exports.getAllLanguages = factory.getAll(Language);
exports.getLanguage = factory.getOne(Language);
exports.createLanguage = factory.createOne(Language);
exports.updateLanguage = factory.updateOne(Language);
exports.deleteLanguage = factory.deleteOne(Language);
exports.formData = formData();
