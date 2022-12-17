const multer = require('multer');
const sharp = require('sharp');
const crypto = require('crypto');

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

// ----------------------------------------------- GET ALL -------------------------------------------------------
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // @TODO: Nested
    let filter = null;
    if (req.query.filter) {
      filter = req.query.filter;
    }
    let total_docs = 0;
    if (!filter) {
      const count = await Model.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
          },
        },
      ]);
      total_docs = count[0] ? count[0].total : 0;
    } else {
      total_docs = await Model.countDocuments(filter);
    }
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const data = await features.query;
    res.status(200).json({
      status: 'success',
      size: total_docs,
      data: {
        data: data,
      },
    });
  });
// ----------------------------------------------- GET ONE -------------------------------------------------------
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (popOptions) query = Model.findById(req.params.id).populate(popOptions);

    if (req.query.filter) {
      const filter = req.query.filter;
      query = Model.findOne(filter);
    }
    const data = await query;

    if (!data) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: data,
      },
    });
  });
// ----------------------------------------------- CREATE --------------------------------------------------------
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (req.file) req.body.image = req.file.filename;
    const data = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: data,
      },
    });
  });
// ----------------------------------------------- UPDATE --------------------------------------------------------
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (req.file) req.body.img = req.file.filename;
    const data = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!data) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: data,
      },
    });
  });
// ----------------------------------------------- DELETE --------------------------------------------------------
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const data = await Model.findByIdAndDelete(req.params.id);

    if (!data) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
// ----------------------------------------------- MULTER --------------------------------------------------------
// -- CONFIGURATION --
//Controlamos que lo que nos suban son IMAGENES y nada más
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false);
  }
};

const storage = multer.memoryStorage();
const upload = multer({ storage, fileFilter: multerFilter });
// --------------------- FORM DATA -----------------------------
exports.formData = () => upload.none();
// --------------------- UPLOAD IMAGE --------------------------
exports.uploadImage = () => upload.single('image');
// --------------------- RESIZE IMAGE --------------------------
exports.resizeImage = () =>
  catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `${crypto.randomUUID()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(600, 900)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/images/${req.file.filename}`);

    next();
  });
