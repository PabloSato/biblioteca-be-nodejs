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
rackSchema.pre('save', async function (next) {
  // ---- SLUG ----
  this.slug = slugify(this.name, { lower: true });
  // --- CONTROL ---
  const location = await Location.findById(this.location);
  const already_racks = location.racks;
  already_racks.forEach((rack) => {
    if (rack.name === this.name) {
      next(new AppError("This rack's name is alredy on location", 409));
    }
  });
  next();
});

// --- ADD RACK TO LOCATIONS.racks ----
rackSchema.post('save', async function (doc, next) {
  const location = await Location.findById(doc.location);
  const already_racks = location.racks;
  already_racks.push(doc);
  const updt = await Location.findByIdAndUpdate(doc.location, location);
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
