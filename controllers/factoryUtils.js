const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
const setUpName = require('./../utils/setUpName');
const setUpAuthorName = require('./../utils/setUpAuthorsName');

// ----------------------------------------------- GET ABSOLUTE --------------------------------------------------
exports.getAbsolute = (Model) =>
  catchAsync(async (req, res, next) => {
    // const data = await Model.find(); // => All Data

    const data = await Model.aggregate([
      { $project: { name: 1, slug: 1 } },
      { $addFields: { id: '$_id' } },
      { $sort: { name: 1 } },
    ]); // => Only names

    res.status(200).json({
      status: 'success',
      data: {
        data: data,
      },
    });
  });
// ----------------------------------------------- GET BYs ABSOLUTE ----------------------------------------------
exports.getBysAbs = (Model) =>
  catchAsync(async (req, res, next) => {
    const filter = req.query.filter;
    const total_docs = await Model.countDocuments(filter);
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields();
    const data = await features.query;

    res.status(200).json({
      status: 'success',
      size: total_docs,
      data: {
        data: data,
      },
    });
  });
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

    const data = await features.query.collation({
      locale: 'es',
      numericOrdering: true,
    });
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

    // Vamos a Maquear el nombre como queremos tenerlo ("nombre, el" o "last_name, first_name")
    const name = req.body.name;
    // Cogemos el nombr del Model (Language, Book, Edition, Author...)
    const modelName = Model.prototype.collection.modelName;
    if (modelName == 'Author') {
      req.body.name = setUpAuthorName(name);
    } else {
      req.body.name = setUpName(name);
    }
    // Realizamos la llamada
    const data = await Model.create(req.body);
    /* 
    - Los errores que se produzcan al crear, los controlamos principalmente con el validator del Model
      y con el errorController.
    - Si se produce un error, en el create no se continua este código. 
    - Aparentemente no necesitamos un try/catch
    */

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
