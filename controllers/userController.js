const User = require('./../models/userModel');
const factory = require('./factoryUtils');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const filterObj = require('./../utils/filterObject');

// ---------------------- SPECIAL METHODS ---------------------
// -- GET ME --
exports.getMe = (req, res, next) => {
  // Cogemos el ID del user ya logueado
  req.params.id = req.user.id;
  next();
};

// -- UPDATE ME --
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Controlamos que no se pase password data por este método
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword instead',
        400
      )
    );
  }
  // 2) Filtered not allowed fields from request
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3) Update user document
  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser,
    },
  });
});
// ---------------------- CRUD METHODS ------------------------
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
// NOT update password with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup',
  });
};
