const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

// ----------------------------------------------- GET ALL -------------------------------------------------------
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    // @TODO: Nested
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const data = await features.query;

    res.status(200).json({
      status: 'success',
      size: data.length,
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
    if (req.file) req.body.img = req.file.filename;

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
