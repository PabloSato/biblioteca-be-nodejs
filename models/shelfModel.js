const mongoose = require('mongoose');
const slugify = require('slugify');

const Rack = require('./rackModel');
const AppError = require('./../utils/appError');

shelfSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Una balda debe de tener un nombre'],
      trim: true,
      lowercase: true,
      maxlength: [20, 'Una balda debe de tener menos de 20 caracteres'],
      minlength: [1, 'Una balda debe de tener al menos 1 caracter'],
    },
    slug: String,
    rack: { type: mongoose.Schema.ObjectId, ref: 'Rack', required: true },
    location: {
      type: mongoose.Schema.ObjectId,
      ref: 'Location',
      required: true,
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
shelfSchema.pre('save', async function (next) {
  // ---- SLUG -----
  this.slug = slugify(this.name, { lower: true });
  // ---- CONTROL ----
  const already_shelfs = await Shelf.find({ name: this.name, rack: this.rack });
  if (already_shelfs.length > 0) {
    next(new AppError('Duplicated Shelf', 409));
  }
  next();
});

// --- ADD SHELF TO RACK ----
shelfSchema.post('save', async function (doc, next) {
  const rack = await Rack.findById(doc.rack);
  const already_shelfs = rack.shelfs;
  already_shelfs.push(doc);
  const upt = await Rack.findByIdAndUpdate(doc.rack, rack);

  next();
});
// --------------------------------------------- 3 - POPULATE ------------------------------
// shelfSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'rack',
//     select: 'name',
//   });
//   next();
// });
// --------------------------------------------- 0 - EXPORT --------------------------------
const Shelf = mongoose.model('Shelf', shelfSchema);

module.exports = Shelf;
