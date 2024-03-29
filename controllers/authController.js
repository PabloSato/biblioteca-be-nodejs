const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const catchAsync = require('./../utils/catchAsync');

const User = require('./../models/userModel');
const AppError = require('../utils/appError');
const filterObj = require('./../utils/filterObject');

// ---------------------- JWT FUNCTIONS ---------------------
// función para crear un jwt
const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure: false,
    httpOnly: true, // La cookie no puede ser modificable ni accesible por el browser
  };
  // Marcamos que la cookie solo se mandará con una conexión https (segura)
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Quitamos el password del output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    user,
  });
};

// ---------------------- SIGN UP METHOD ---------------------
exports.signup = catchAsync(async (req, res, next) => {
  // TODO: Hay que añadir lo del filterObj,
  // Ahora mismo podemos crear usuarios como nos salga de los huevos
  // Y ESO NO!
  const filteredBody = filterObj(
    req.body,
    'name',
    'email',
    'password',
    'passwordConfirm'
  );
  const newUser = await User.create(filteredBody);

  createSendToken(newUser, 201, res);
});
// ---------------------- LOGIN METHOD ---------------------
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // 2) Check if user exist and check if password is correct
  // - 2.1 => Check if user exist
  const user = await User.findOne({ email: email }).select('+password'); // => con + añadimos el campo password a la respuesta
  // - 2.2 => Comprobamos si el password que nos pasan y el password que tenemos son iguales
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything is ok, send token to the client
  createSendToken(user, 200, res);
});
// ---------------------- LOGOUT METHOD ---------------------
// Al parecer hay que hacer un poco rodeo para esto
// mandamos una nueva cookie pero sin jwt y con un ttl muy corto (sustituimos uno por otro)
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

// ---------------------- PROTECT ROUTES METHOD ---------------------
exports.protect = catchAsync(async (req, res, next) => {
  //1) Getting token and check if it's there (type Bearer)
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    // Check if token come in a cookie
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }
  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this tojen does no longer exists',
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    // => iat = ttl
    return next(
      new AppError('User recently changed password! Please log in again', 401)
    );
  }

  // Grant Access to protect route
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

// ---------------------- RESTRICT ACCESS ROUTES METHOD ---------------------
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403) // => forbidden
      );
    }
    next();
  };
};
