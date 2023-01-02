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
    rack: { type: mongoose.Schema.ObjectId, ref: 'Rack' },
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
// ---- CONTROL ----
shelfSchema.pre('save', async function (next) {
  const rack = await Rack.findById(this.rack);
  const already_shelfs = rack.shelfs;
  already_shelfs.forEach((shelf) => {
    if (shelf.name === this.name) {
      next(new AppError("This shelf's name is already in rack", 409));
    }
  });
  next();
});
// ---- SLUG ----
shelfSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// --- ADD RACK TO LOCATIONS.racks ----
shelfSchema.post('save', async function (doc, next) {
  const rack = await Rack.findById(doc.rack);
  const already_shelfs = rack.shelfs;
  already_shelfs.push(doc);
  const upt = await Rack.findByIdAndUpdate(doc.rack, rack);
  next();
});
// --------------------------------------------- 3 - POPULATE ------------------------------
shelfSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'rack',
    select: 'name',
  });
  next();
});
// --------------------------------------------- 0 - EXPORT --------------------------------
const Shelf = mongoose.model('Shelf', shelfSchema);

module.exports = Shelf;
