const mongoose = require('mongoose');
const slugify = require('slugify');
const setUpSlug = require('./../utils/setUpSlug');

const universeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Un Universo debe de tener un nombre'],
      trim: true,
      lowercase: true,
      unique: true,
      maxlength: [100, 'Un universo debe de tener menos de 100 caracteres'],
      minlength: [1, 'Un universo debe de tener al menos 1 caracter'],
    },
    slug: String,
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
universeSchema.pre('save', function (next) {
  const tmp_name = setUpSlug(this.name);
  this.slug = slugify(tmp_name, { lower: true });
  next();
});
// --------------------------------------------- 3 - POPULATE ------------------------------
// --------------------------------------------- 0 - EXPORT --------------------------------
const Universe = mongoose.model('Universe', universeSchema);

module.exports = Universe;
