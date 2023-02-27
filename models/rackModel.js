const mongoose = require('mongoose');
const slugify = require('slugify');

const AppError = require('./../utils/appError');
const Location = require('./locationModel');

const setUpSlug = require('./../utils/setUpSlug');

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
rackSchema.pre('save', async function (next) {
  // ---- SLUG ----
  const tmp_name = setUpSlug(this.name);
  this.slug = slugify(tmp_name, { lower: true });
  // --- CONTROL ---
  const already_racks = await Rack.find({ name: this.name, rack: this.rack });
  if (already_racks.length > 0) {
    next(new AppError('Duplicated Rack', 409));
  }
  next();
});

// --- ADD RACK TO LOCATIONS.racks ----
rackSchema.post('save', async function (doc, next) {
  const location = await Location.findById(doc.location);
  location.racks.push(doc);
  const updt = await Location.findByIdAndUpdate(doc.location, location);
});
// --------------------------------------------- 3 - POPULATE ------------------------------
rackSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'shelfs',
  //   select: 'name',
  // }).populate({
  //   path: 'location',
  //   select: 'name slug',
  // });
  next();
});
// --------------------------------------------- 0 - EXPORT --------------------------------
const Rack = mongoose.model('Rack', rackSchema);

module.exports = Rack;
