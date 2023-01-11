const factory = require('./factoryUtils');
const { formData } = require('./../middleware/upload');

const Colection = require('./../models/colectionModel');

// ---------------------- SPECIAL METHODS ---------------------
// ---------------------- CRUD METHODS ------------------------
exports.getAbsColections = factory.getAbsolute(Colection);
exports.getAllColections = factory.getAll(Colection);
exports.getColection = factory.getOne(Colection);
exports.createColection = factory.createOne(Colection);
exports.updateColection = factory.updateOne(Colection);
exports.deleteColection = factory.deleteOne(Colection);
exports.formData = formData();
