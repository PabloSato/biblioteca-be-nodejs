const AppError = require('./../utils/appError');

// Handler correct ID
const handlerCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// Handler prevent duplicate attempts in unique fields
const handlerDuplicateFieldsDB = (err) => {
  const value = err.keyValue.name;
  const message = `Duplicate field value: "${value}". Please use another value`;
  return new AppError(message, 400);
};

// Handler mongoose validation error
const handlerValidationErrorDB = (err) => {
  // Loop over the object
  const errors = Object.values(err.errors).map((ele) => ele.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// Error to Dev
const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    return res.status(err.statusCode).json({
      title: 'Something went wrong',
      message: err.message,
    });
  }
};

// Error to Prod
const sendErrorProd = (err, req, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  console.error('ERROR 💥', err);
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
  });
};
// ---------------------- EXPORTS ---------------------------
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handlerCastErrorDB(error);
    if (error.code === 1100) error = handlerDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handlerValidationErrorDB(error);

    sendErrorProd(error, req, res);
  }
};