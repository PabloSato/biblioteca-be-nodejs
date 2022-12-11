const mongoose = require('mongoose');
const AppError = require('./../utils/appError');

const Book = require('./bookModel');

const editionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Una Edición debe de tener un nombre'],
    lowercase: true,
    trim: true,
    maxlength: [
      50,
      'El nombre de la edición no debe ser mayor a 50 caracteres',
    ],
    minlength: [1, 'El nombre de la edición debe de tener al menos 1 caracter'],
  },
  book: { type: mongoose.Schema.ObjectId, ref: 'Book' },
  image: {
    type: String,
    default: 'default.jpeg',
  },
  pages: Number,
  coleccion: String,
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

// --------------------------------------------- 1 - ORDER ---------------------------------
// --------------------------------------------- 2 - MIDDLEWARE ----------------------------
editionSchema.pre('save', async function (next) {
  const book = await Book.findById(this.book);
  const editions = book.editions;

  editions.forEach((edit) => {
    if (edit.name === this.name) {
      next(new AppError('Ya existe esta edición para este Libro', 409));
    }
  });
  next();
});

editionSchema.post('save', async function () {
  const book = await Book.findById(this.book);
  book.editions.push(this);
  const updtd = await Book.findByIdAndUpdate(this.book, book, {
    new: true,
    runValidators: true,
  });
});
// --------------------------------------------- 3 - POPULATE ------------------------------
// --------------------------------------------- 0 - EXPORT --------------------------------
const Edition = new mongoose.model('Edition', editionSchema);

module.exports = Edition;