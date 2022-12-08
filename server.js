const mongoose = require('mongoose');
const dotenv = require('dotenv');

// --------------------------------------------- ERRORS ----------------------------------------
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION ⛔️💥, Cerrando aplicación...');
  console.log(err.name, err.message);
  process.exit();
});
// --------------------------------------------- CONFIG ----------------------------------------
dotenv.config({ path: './config.env' });
const app = require('./app');
// --------------------------------------------- DB ----------------------------------------
const DB = process.env.DATABASE_LOCAL;
mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('DB Connected!!');
  });
// --------------------------------------------- SERVER ----------------------------------------
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}....`);
}); // Controlamos errores tras la conexión. Si hay alguno jodido, cerramos la aplicación
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION ⛔️⛔️. Cerrando aplicación....');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
