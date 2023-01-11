const factory = require('./factoryUtils');
const { formData } = require('./../middleware/upload');

const Language = require('./../models/languageModel');
// ---------------------- SPECIAL METHODS ---------------------------
// ---------------------- BASIC CRUD ---------------------------
exports.getAbsLanguages = factory.getAbsolute(Language);
exports.getAllLanguages = factory.getAll(Language);
exports.getLanguage = factory.getOne(Language);
exports.createLanguage = factory.createOne(Language);
exports.updateLanguage = factory.updateOne(Language);
exports.deleteLanguage = factory.deleteOne(Language);
exports.formData = formData();
