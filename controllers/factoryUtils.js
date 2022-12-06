const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

// ----------------------------------------------- GET ALL -------------------------------------------------------
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // @TODO: Nested
    let filter = null;
    if (req.query.filter) {
      filter = req.query.filter;
    }
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const data = await features.query;

    let totalDocs = 0;
    let actualPage = 0;
    const limit = features.query.options.limit;
    if (!filter) {
      totalDocs = await Model.estimatedDocumentCount();
    } else {
      totalDocs = data.length;
    }
    const totalPages = Math.ceil(totalDocs / limit);
    actualPage = totalPages > 1 ? features.query.options.skip + 1 : 1;
    const docsPage = totalDocs > limit ? limit : totalDocs;

    res.status(200).json({
      status: 'success',
      size: data.length,
      data: {
        data: data,
        pagination: {
          totalDocs: totalDocs, // => Count of ALL elements in the DB
          totalPages: totalPages, // => Total pages available
          page: actualPage, // => Current page number
          size: docsPage, // => size of elements per page
        },
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
