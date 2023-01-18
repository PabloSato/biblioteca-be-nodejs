const mongoose = require('mongoose');
const slugify = require('slugify');
const setUpName = require('./../utils/setUpName');

const AppError = require('./../utils/appError');
const Book = require('./bookModel');

const editionSchema = new mongoose.Schema(
  {
    version: {
      type: String,
      required: [true, 'Una Edición debe de tener una version'],
      lowercase: true,
      trim: true,
      maxlength: [
        50,
        'La version de la edición no debe ser mayor a 50 caracteres',
      ],
      minlength: [
        1,
        'La version de la edición debe de tener al menos 1 caracter',
      ],
    },
    name: {
      type: String,
      maxlength: [
        50,
        'El nombre de la edición no debe ser mayor a 50 caracteres',
      ],
    },
    slug: String,
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    shelf: { type: mongoose.Schema.ObjectId, ref: 'Shelf' },
    location: { type: mongoose.Schema.ObjectId, ref: 'Location' },
    rack: { type: mongoose.Schema.ObjectId, ref: 'Rack' },
    image: {
      type: String,
      default: 'default.jpeg',
    },
    pages: Number,
    colection: { type: mongoose.Schema.ObjectId, ref: 'Collection' },
    numberOnColection: Number,
    isbn: {
      type: Number,
      validate: {
        validator: function (val) {
          return val.toString().length === 13;
        },
        message: (val) => `${val.value} debe ser de 13 dígitos`,
      },
    },
    language: [{ type: mongoose.Schema.ObjectId, ref: 'Language' }],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// --------------------------------------------- 1 - ORDER ---------------------------------
// --------------------------------------------- 2 - MIDDLEWARE ----------------------------
editionSchema.pre('save', function (next) {
  const tmp_name = setUpName(this.version);
  this.slug = slugify(tmp_name, { lower: true });
  next();
});
// --- CONTROL ---
editionSchema.pre('save', async function (next) {
  const book = await Book.findById(this.book);
  if (book) {
    const already_editions = book.editions;
    already_editions.forEach((edit) => {
      if (edit.version === this.version) {
        next(new AppError("This edition's name is already on books", 409));
      }
    });

    if (!this.name) {
      const tmp_name = setUpName(book.name);
      this.name = tmp_name.trim();
    }
  }
  next();
});
// --- INCLUDE ---
editionSchema.post('save', async function (doc, next) {
  const book = await Book.findById(doc.book);
  if (book) {
    book.editions.push(doc);
    const updt = await Book.findByIdAndUpdate(doc.book, book);
  }
});
// --------------------------------------------- 3 - POPULATE ------------------------------
editionSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'shelf',
    select: 'name slug',
  })
    .populate({
      path: 'language',
      select: 'name slug',
    })
    .populate({
      path: 'rack',
      select: 'name slug',
    })
    .populate({
      path: 'location',
      select: 'name slug',
    })
    .populate({
      path: 'colection',
      select: 'name slug',
    });
  next();
});
// --------------------------------------------- 0 - EXPORT --------------------------------
const Edition = mongoose.model('Edition', editionSchema);

module.exports = Edition;
