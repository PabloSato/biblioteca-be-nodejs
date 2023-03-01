const fs = require('fs');
const path = require('path');

const factory = require('./factoryUtils');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const { formData } = require('./../middleware/upload');

const Edition = require('./../models/editionModel');

// ---------------------- SPECIAL METHODS ----------------------
// --- BY SHELF ---
exports.getByShelf = (req, res, next) => {
  const filter = { shelf: req.params.shelfId };
  req.query.filter = filter;
  next();
};
// --- BY LANGUAGE ---
exports.getByLanguage = (req, res, next) => {
  const filter = { language: req.params.languageId };
  req.query.filter = filter;
  next();
};
// --- BY COLLECTION ---
exports.getByCollection = (req, res, next) => {
  const filter = { colection: req.params.collectionId };
  req.query.filter = filter;
  next();
};
// ---------------------- CRUD METHODS --------------------------------
// ----- DELETE -----
exports.deleteEdition = catchAsync(async (req, res, next) => {
  const edit = await Edition.findByIdAndDelete(req.params.id);
  if (!edit) {
    return next(new AppError('No document found with that ID', 404));
  }
  const image = edit.image;
  const message = '';
  if (image && image.length > 0) {
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
  res.status(204).json({
    status: 'success',
    data: null,
    message: message,
  });
});
// ---------------------- BASIC CRUD ---------------------------
exports.getAbsEditions = factory.getAbsolute(Edition);
exports.getAllEditions = factory.getAll(Edition);
exports.getEdition = factory.getOne(Edition);
exports.createEdition = factory.createOne(Edition);
exports.updateEdition = factory.updateOne(Edition);
// exports.deleteEdition = factory.deleteOne(Edition);
exports.formData = formData();
