const mongoose = require('mongoose');
const slugify = require('slugify');

const setUpName = require('./../utils/setUpName');
const Author = require('./authorModel');

const bookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Un libro debe de tener un Título'],
      trim: true,
      lowercase: true,
      minlength: [1, 'Un título debe de tener por lo menos 1 carácter'],
    },
    subtitle: {
      type: String,
      trim: true,
    },
    slug: String,
    argument: {
      type: String,
      default: this.slug,
      trim: true,
      maxLength: [950, 'Un argumento no debe ser mayor a 950 caracteres'],
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
        required: [true, 'A Book must have a author'],
      },
    ],
    tags: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Tag',
        required: [true, ' A book must have a tag'],
      },
    ],
    universe: { type: mongoose.Schema.ObjectId, ref: 'Universe' },
    saga: { type: mongoose.Schema.ObjectId, ref: 'Saga' },
    number: Number,
    editions: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Edition',
        required: [true, 'A book must have a edition'],
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
// -- SLUG --
bookSchema.pre('save', async function (next) {
  let tmp_name = setUpName(this.name);
  const already_books = await Book.find({ name: tmp_name });
  already_books.forEach((book) => {
    if (book.name === this.name) {
      tmp_name = `${tmp_name}-${this.id}`;
    }
  });
  this.slug = slugify(tmp_name, { lower: true });

  if (!this.compilation) {
    this.booksInside = [];
  }
  next();
});
// -- INCLUDE --
bookSchema.post('save', async function (doc, next) {
  // const authors = doc.authors;
  // authors.forEach(async function (item) {
  //   const author = await Author.findById(item);
  //   if (author) {
  //     author.books.push(this);
  //     const updt = await Author.findByIdAndUpdate(item, author);
  //   }
  // });
});

// --------------------------------------------- 3 - POPULATE -------------------------------
bookSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'tags',
    select: 'name slug',
  })
    .populate({
      path: 'authors',
      select: 'name slug',
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
      select: 'name pages image version',
    });
  // @TODO: Populate
  next();
});

// --------------------------------------------- 0 - EXPORTAMOS -----------------------------
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
