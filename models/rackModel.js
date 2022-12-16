const mongoose = require('mongoose');
const slugify = require('slugify');

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
rackSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// --------------------------------------------- 3 - POPULATE ------------------------------
// --------------------------------------------- 0 - EXPORT --------------------------------
const Rack = mongoose.model('Rack', rackSchema);

module.exports = Rack;
