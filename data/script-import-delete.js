const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Book = require('./../models/bookModel');
const Tag = require('./../models/tagModel');
const Author = require('./../models/authorModel');
const Universe = require('./../models/universeModel');
const Saga = require('./../models/sagaModel');
const Edition = require('./../models/editionModel');
const Shelf = require('./../models/shelfModel');
const Rack = require('./../models/rackModel');
const Location = require('./../models/locationModel');

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
  // fs.readFileSync(`${__dirname}/simple-booksv4.json`, 'utf-8') // => Books with Tags IDs and Authors IDs and Universe IDs
  // fs.readFileSync(`${__dirname}/simple-booksv5.json`, 'utf-8') // => Books with Tags IDs and Authors IDs and Universe IDs and Editions
  fs.readFileSync(`${__dirname}/simple-booksv6.json`, 'utf-8') // => Books with all bur image and pages
);
const tags = JSON.parse(fs.readFileSync(`${__dirname}/tags.json`, 'utf-8'));
const authors = JSON.parse(
  fs.readFileSync(`${__dirname}/authorsv2.json`, 'utf-8') // => Change Name
);
// const authors = JSON.parse(
//   fs.readFileSync(`${__dirname}/authors.json`, 'utf-8')
// );
const universes = JSON.parse(
  fs.readFileSync(`${__dirname}/universes.json`, 'utf-8')
);
const sagas = JSON.parse(fs.readFileSync(`${__dirname}/sagas.json`, 'utf-8'));
const editions = JSON.parse(
  // fs.readFileSync(`${__dirname}/editions.json`, 'utf-8')
  fs.readFileSync(`${__dirname}/editionsv2.json`, 'utf-8') // => with shelf
);
const shelfs = JSON.parse(
  fs.readFileSync(`${__dirname}/shelves.json`, 'utf-8')
);
const racks = JSON.parse(fs.readFileSync(`${__dirname}/racks.json`, 'utf-8'));
const locations = JSON.parse(
  fs.readFileSync(`${__dirname}/locations.json`, 'utf-8')
);

// --------------------------------------------- 2 - IMPORT TO DB ----------------------------------------
const importData = async () => {
  try {
    await Location.create(locations);
    await Rack.create(racks);
    await Shelf.create(shelfs);
    await Tag.create(tags);
    await Author.create(authors);
    await Universe.create(universes);
    await Saga.create(sagas);
    await Edition.create(editions);
    await Book.create(books);
    console.log('DATA LOADED!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Edition.deleteMany();
    await Book.deleteMany();
    await Saga.deleteMany();
    await Tag.deleteMany();
    await Author.deleteMany();
    await Universe.deleteMany();
    await Location.deleteMany();
    await Rack.deleteMany();
    await Shelf.deleteMany();
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
