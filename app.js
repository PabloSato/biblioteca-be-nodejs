const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// UTILIDADES
const AppError = require('./utils/appError');

// ERROR HANDLER
const globalError = require('./controllers/errorController');

// ROUTES
const { apiRoutes } = require('./routes/router');

// dirname
global.__basedir = __dirname; // => Apunta a la carpeta root del proyecto

// Creamos la App
const app = express();

// --------------------------------------------- 2 - GLOBAL MIDDLEWARE ----------------------------------------
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000, // => 1 hour in miliseconds
//   message: 'Too many request from this IP, please try again later',
// });
// app.use('/api', limiter);

app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //Para recibir data de un formulario, con extends es para recibir data compleja

app.use(mongoSanitize());

app.use(xss());

app.use(hpp()); // => prevent parameter polution (duplicate fields in query)
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
// app.use('/images/:name', (req, res) => {
//   const { name } = req.params;
//   res.sendFile(`${__dirname}/public/images/${name}`);
// });
// --------------------------------------------- 6 - GLOBAL ROUTES ----------------------------------------
apiRoutes(app);
// --------------------------------------------- 7 - GLOBAL ERRORS ----------------------------------------
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalError);
// --------------------------------------------- EXPORT ----------------------------------------
module.exports = app;
