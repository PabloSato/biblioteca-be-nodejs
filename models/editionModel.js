const mongoose = require('mongoose');
const slugify = require('slugify');

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
    name: String,
    slug: String,
    book: { type: mongoose.Schema.ObjectId, ref: 'Book' },
    shelf: { type: mongoose.Schema.ObjectId, ref: 'Shelf' },
    image: {
      type: String,
      default: 'default.jpeg',
    },
    pages: Number,
    colection: { type: mongoose.Schema.ObjectId, ref: 'Colection' },
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
  this.slug = slugify(this.version, { lower: true });
  next();
});
// --- CONTROL ---
editionSchema.pre('save', async function (next) {
  const book = await Book.findById(this.book);
  const already_editions = book.editions;
  already_editions.forEach((edit) => {
    if (edit.version === this.version) {
      next(new AppError("This edition's name is already on books", 409));
    }
  });
  this.book_name = book.name;
  next();
});
// --- INCLUDE ---
editionSchema.post('save', async function (doc, next) {
  const book = await Book.findById(doc.book);
  const already_editions = book.editions;
  already_editions.push(doc);
  const updt = await Book.findByIdAndUpdate(doc.book, book);
});
// --------------------------------------------- 3 - POPULATE ------------------------------
editionSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'shelf',
    select: 'name',
  });
  next();
});
// --------------------------------------------- 0 - EXPORT --------------------------------
const Edition = mongoose.model('Edition', editionSchema);

module.exports = Edition;
