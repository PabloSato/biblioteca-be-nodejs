const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Book = require('./../models/bookModel');

dotenv.config({ path: './config.env' });
// --------------------------------------------- DB ----------------------------------------
const DB = process.env.DATABASE_LOCAL;
mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('DB Connected!');
  });
// --------------------------------------------- 1 - READ JSON FILES ----------------------------------------
const books = JSON.parse(
  fs.readFileSync(`${__dirname}/simple-booksv1.json`, 'utf-8') // => Simple Book (all string)
);
// --------------------------------------------- 2 - IMPORT TO DB ----------------------------------------
const importData = async () => {
  try {
    await Book.create(books);
    console.log('DATA LOADED!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Book.deleteMany();
    console.log('DATA DELETED!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
// --------------------------------------------- 3 - EJECUTE ----------------------------------------
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
