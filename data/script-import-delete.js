const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Book = require('./../models/bookModel');
const Tag = require('./../models/tagModel');
const Author = require('./../models/authorModel');
const Universe = require('./../models/universeModel');
const Saga = require('./../models/sagaModel');

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
  // fs.readFileSync(`${__dirname}/simple-booksv1.json`, 'utf-8') // => Simple Book (all string)
  // fs.readFileSync(`${__dirname}/simple-booksv2.json`, 'utf-8') // => Books with Tags IDs
  // fs.readFileSync(`${__dirname}/simple-booksv3.json`, 'utf-8') // => Books with Tags IDs and Authors IDs
  fs.readFileSync(`${__dirname}/simple-booksv4.json`, 'utf-8') // => Books with Tags IDs and Authors IDs and Universe IDs
);
const tags = JSON.parse(fs.readFileSync(`${__dirname}/tags.json`, 'utf-8'));
const authors = JSON.parse(
  fs.readFileSync(`${__dirname}/authors.json`, 'utf-8')
);
const universes = JSON.parse(fs.readFileSync(`${__dirname}/universes.json`));
const sagas = JSON.parse(fs.readFileSync(`${__dirname}/sagas.json`));
// --------------------------------------------- 2 - IMPORT TO DB ----------------------------------------
const importData = async () => {
  try {
    await Tag.create(tags);
    await Author.create(authors);
    await Universe.create(universes);
    await Saga.create(sagas);
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
    await Saga.deleteMany();
    await Tag.deleteMany();
    await Author.deleteMany();
    await Universe.deleteMany();
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
