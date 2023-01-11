const factory = require('./factoryUtils');
const { formData } = require('./../middleware/upload');

const Saga = require('./../models/sagaModel');

// ---------------------- SPECIAL METHODS ---------------------
// ---------------------- CRUD METHODS ------------------------
exports.getAbsSagas = factory.getAbsolute(Saga);
exports.getAllSagas = factory.getAll(Saga);
exports.getSaga = factory.getOne(Saga);
exports.createSaga = factory.createOne(Saga);
exports.updateSaga = factory.updateOne(Saga);
exports.deleteSaga = factory.deleteOne(Saga);
exports.formData = formData();
