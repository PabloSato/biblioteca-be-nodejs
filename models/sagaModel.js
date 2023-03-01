const mongoose = require('mongoose');
const slugify = require('slugify');
const setUpSlug = require('./../utils/setUpSlug');

const Universe = require('./universeModel');

const sagaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Una Saga debe de tener un nombre'],
      trim: true,
      lowercase: true,
      unique: true,
      maxlength: [100, 'Una saga debe de tener menos de 100 caracteres'],
      minlength: [1, 'Una saga debe de tener al menos 1 caracter'],
    },
    slug: String,
    universe: { type: mongoose.Schema.ObjectId, ref: 'Universe' },
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
// --------------------------------------------- 1 - ORDER ---------------------------------
// --------------------------------------------- 2 - MIDDLEWARE ----------------------------
// -- SLUG --
sagaSchema.pre('save', function (next) {
  const tmp_name = setUpSlug(this.name);
  this.slug = slugify(tmp_name, { lower: true });
  next();
});
// -- INCLUDE --

// --------------------------------------------- 3 - POPULATE ------------------------------
// --------------------------------------------- 0 - EXPORT --------------------------------
const Saga = mongoose.model('Saga', sagaSchema);

module.exports = Saga;
