const mongoose = require('mongoose');
const slugify = require('slugify');

const AppError = require('./../utils/appError');
const Book = require('./bookModel');

const editionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Una Edición debe de tener un nombre'],
      lowercase: true,
      trim: true,
      maxlength: [
        50,
        'El nombre de la edición no debe ser mayor a 50 caracteres',
      ],
      minlength: [
        1,
        'El nombre de la edición debe de tener al menos 1 caracter',
      ],
    },
    slug: String,
    book: { type: mongoose.Schema.ObjectId, ref: 'Book' },
    shelf: { type: mongoose.Schema.ObjectId, ref: 'Shelf' },
    image: {
      type: String,
      default: 'default.jpeg',
    },
    pages: Number,
    coleccion: String,
    numberOnColeccion: Number,
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
  this.slug = slugify(this.name, { lower: true });
  next();
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
const Edition = new mongoose.model('Edition', editionSchema);

module.exports = Edition;
