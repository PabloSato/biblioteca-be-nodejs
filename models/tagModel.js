const mongoose = require('mongoose');
const slugify = require('slugify');
const setUpName = require('./../utils/setUpName');

const Book = require('./bookModel');

const tagSchmea = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Un Tag debe de tener un nombre'],
      trim: true,
      unique: true,
      lowercase: true,
      minlength: [1, 'El nombre debe de tener por lo menos 1 carácter'],
      maxlength: [50, 'El nombre debe de tener menos de 100 caracteres'],
    },
    slug: String,
    image: {
      type: String,
      default: 'default-tag.jpeg',
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// --------------------------------------------- 1 - ORDER ----------------------------------
// --------------------------------------------- 2 - MIDDLEWARE -----------------------------
// -- SLUGIFY --
tagSchmea.pre('save', function (next) {
  const tmp_name = setUpName(this.name);
  this.slug = slugify(tmp_name, { lower: true });
  next();
});
// --------------------------------------------- 3 - POPULATE -------------------------------
// --------------------------------------------- 0 - EXPORT ---------------------------------
const Tag = mongoose.model('Tag', tagSchmea);

module.exports = Tag;
