const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
// --------------------------------------------- DB ----------------------------------------
const DB = process.env.DATABASE_LOCAL;
mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('DB Connected!');
  });

const importData = async () => {
  const books = ['63da6ff96782eee7bd4df9d6', '63d3d62a7f9394901a12de55'];

  for (const book of books) {
  }
};
// --------------------------------------------- 3 - EJECUTE ----------------------------------------

if (process.argv[2] === '--import') {
  importData();
}
