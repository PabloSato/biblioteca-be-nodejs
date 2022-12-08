const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// UTILIDADES
const AppError = require('./utils/appError');

// ROUTES
const { apiRoutes } = require('./routes/router');

// Creamos la App
const app = express();

// --------------------------------------------- 2 - GLOBAL MIDDLEWARE ----------------------------------------
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
// --------------------------------------------- 4 - GLOBAL SECURITY ----------------------------------------
const whitelist = ['http://localhost:4200'];
const options = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Forbidden'));
    }
  },
};
app.use(cors(options));
// --------------------------------------------- 5 - MIDDLEWARE ----------------------------------------
app.use('/images/:name', (req, res) => {
  const { name } = req.params;
  res.sendFile(`${__dirname}/public/images/${name}`);
});
// --------------------------------------------- 6 - GLOBAL ROUTES ----------------------------------------
apiRoutes(app);
// --------------------------------------------- 7 - GLOBAL ERRORS ----------------------------------------
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
// --------------------------------------------- EXPORT ----------------------------------------
module.exports = app;
