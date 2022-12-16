const mongoose = require('mongoose');
const slugify = require('slugify');

const AppError = require('./../utils/appError');
const Location = require('./locationModel');

rackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Una estantería debe de tener un nombre'],
      trim: true,
      lowercase: true,
      maxlength: [20, 'Una estantería  debe de tener menos de 100 caracteres'],
      minlength: [1, 'Una estantería  debe de tener al menos 1 caracter'],
    },
    slug: String,
    shelfs: [{ type: mongoose.Schema.ObjectId, ref: 'Shelf' }],
    location: { type: mongoose.Schema.ObjectId, ref: 'Location' },
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
// --- CONTROL ---
rackSchema.pre('save', async function (next) {
  const location = await Location.findById(this.location);
  const already_racks = location.racks;

  if (already_racks.includes(this.name)) {
    next(new AppError("This rack's name is alredy on location", 409));
  }
  next();
});
// ---- SLUG ----
rackSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// --------------------------------------------- 3 - POPULATE ------------------------------
rackSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'shelfs',
    select: 'name',
  });
  next();
});
// --------------------------------------------- 0 - EXPORT --------------------------------
const Rack = mongoose.model('Rack', rackSchema);

module.exports = Rack;
