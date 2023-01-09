const mongoose = require('mongoose');
const slugify = require('slugify');

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Un lugar debe de tener un nombre'],
      trim: true,
      unique: true,
      lowercase: true,
      maxlength: [100, 'Un lugar debe de tener menos de 100 caracteres'],
      minlength: [1, 'Un lugar debe de tener al menos 1 caracter'],
    },
    slug: String,
    racks: [{ type: mongoose.Schema.ObjectId, ref: 'Rack' }],
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
locationSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// --------------------------------------------- 3 - POPULATE ------------------------------
locationSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'racks',
  //   select: '-shelfs name',
  // });
  next();
});
// --------------------------------------------- 0 - EXPORT --------------------------------
const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
