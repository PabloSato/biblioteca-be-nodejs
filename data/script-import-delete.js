const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Author = require('./../models/authorModel');
const Book = require('./../models/bookModel');
const Collection = require('./../models/collectionModel');
const Edition = require('./../models/editionModel');
const Language = require('./../models/languageModel');
const Location = require('./../models/locationModel');
const Rack = require('./../models/rackModel');
const Saga = require('./../models/sagaModel');
const Shelf = require('./../models/shelfModel');
const Tag = require('./../models/tagModel');
const Universe = require('./../models/universeModel');

dotenv.config({ path: './config.env' });
// --------------------------------------------- DB ----------------------------------------
const DB = process.env.DATABASE_LOCAL;
mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('DB Connected!');
  });
// --------------------------------------------- 1 - READ JSON FILES ----------------------------------------
const authors = JSON.parse(
  fs.readFileSync(`${__dirname}/all_data/authors.json`, 'utf-8')
);
const books = JSON.parse(
  fs.readFileSync(`${__dirname}/all_data/books.json`, 'utf-8')
);
const collections = JSON.parse(
  fs.readFileSync(`${__dirname}/all_data/collections.json`, 'utf-8')
);
const editions = JSON.parse(
  fs.readFileSync(`${__dirname}/all_data/editions.json`, 'utf-8')
);
const languages = JSON.parse(
  fs.readFileSync(`${__dirname}/all_data/languages.json`, 'utf-8')
);
const locations = JSON.parse(
  fs.readFileSync(`${__dirname}/all_data/locations.json`, 'utf-8')
);
const racks = JSON.parse(
  fs.readFileSync(`${__dirname}/all_data/racks.json`, 'utf-8')
);
const sagas = JSON.parse(
  fs.readFileSync(`${__dirname}/all_data/sagas.json`, 'utf-8')
);
const shelves = JSON.parse(
  fs.readFileSync(`${__dirname}/all_data/shelves.json`, 'utf-8')
);
const tags = JSON.parse(
  fs.readFileSync(`${__dirname}/all_data/tags.json`, 'utf-8')
);
const universes = JSON.parse(
  fs.readFileSync(`${__dirname}/all_data/universes.json`, 'utf-8')
);

// --------------------------------------------- 2 - IMPORT TO DB ----------------------------------------
const importData = async () => {
  try {
    await Location.create(locations);
    await Rack.create(racks);
    await Shelf.create(shelves);
    await Tag.create(tags);
    await Author.create(authors);
    await Universe.create(universes);
    await Saga.create(sagas);
    await Language.create(languages);
    await Book.create(books);
    await Edition.create(editions);
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
    await Language.deleteMany();
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
