const mongoose = require('mongoose');
const slugify = require('slugify');

const setUpName = require('./../utils/setUpName');
const AppError = require('./../utils/appError');
const { notEmptyArray } = require('./../middleware/validators');
const Author = require('./authorModel');

const bookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Un libro debe de tener un Título'],
      trim: true,
      lowercase: true,
      minlength: [1, 'Un título debe de tener por lo menos 1 carácter'],
      maxlength: [150, 'Un título no puede tener más de 150 caracteres'],
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: [200, 'Un subtítulo no puede tener más de 200 caracteres'],
    },
    slug: String,
    argument: {
      type: String,
      default: this.slug,
      trim: true,
      maxlength: [950, 'Un argumento no debe ser mayor a 950 caracteres'],
    },
    compilation: {
      type: Boolean,
      default: false,
    },
    booksInside: {
      type: [String],
      trim: true,
      lowercase: true,
    },
    authors: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Author',
        validate: [notEmptyArray, 'A book must have an author'],
      },
    ],
    tags: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Tag',
        validate: [notEmptyArray, 'A book must have a tag'],
      },
    ],
    universe: { type: mongoose.Schema.ObjectId, ref: 'Universe' },
    saga: { type: mongoose.Schema.ObjectId, ref: 'Saga' },
    number: String,
    editions: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Edition',
        validate: [notEmptyArray, 'A book must have an edition'],
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// --------------------------------------------- 1 - ORDER ---------------------------------
bookSchema.index({ slug: 1 });
bookSchema.index({ name: 'text' }, { default_language: 'none' });
bookSchema.index({ tags: 1 });
// --------------------------------------------- 2 - MIDDLEWARE -----------------------------
bookSchema.pre('save', async function (next) {
  let tmp_name = setUpName(this.name);
  // -- SAME NAME <> AUTHOR --
  const already_books = await Book.find({
    name: this.name,
    authors: this.authors,
  });
  if (already_books.length > 0) {
    next(new AppError('Duplicated Book', 409));
  }
  // -- SAME NAME eq AUTHOR --
  const already_books_with_name = await Book.find({ name: tmp_name });
  if (already_books_with_name.length > 0) {
    const author = await Author.findById(this.authors[0]);
    tmp_name = `${tmp_name} by ${author.name.split(',')[0]}`;
  }

  // -- SLUG --
  this.slug = slugify(tmp_name, { lower: true });
  // -- COMPILATION --
  if (!this.compilation) {
    this.booksInside = [];
  }
  next();
});
// -- INCLUDE --
bookSchema.post('save', async function (doc, next) {
  const authors = doc.authors;
  authors.forEach(async (item) => {
    const author = await Author.findById(item);
    author.books.push(doc);
    const updt = await Author.findByIdAndUpdate(item, author);
  });
});

// --------------------------------------------- 3 - POPULATE -------------------------------
bookSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'tags',
    select: 'name slug',
  })
    .populate({
      path: 'authors',
      select: 'name slug alias',
    })
    .populate({
      path: 'universe',
      select: 'name slug',
    })
    .populate({
      path: 'saga',
      select: 'name slug',
    })
    .populate({
      path: 'editions',
      select: 'name pages image version colection numberOnColection',
    });
  // @TODO: Populate
  next();
});

// --------------------------------------------- 0 - EXPORTAMOS -----------------------------
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
