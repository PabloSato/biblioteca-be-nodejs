const mongoose = require('mongoose');
const slugify = require('slugify');

shelfSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Una balda debe de tener un nombre'],
      trim: true,
      lowercase: true,
      maxlength: [20, 'Una balda debe de tener menos de 100 caracteres'],
      minlength: [1, 'Una balda debe de tener al menos 1 caracter'],
    },
    slug: String,
    rack: { type: mongoose.Schema.ObjectId, ref: 'Shelf' },
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
shelfSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// --------------------------------------------- 3 - POPULATE ------------------------------
// --------------------------------------------- 0 - EXPORT --------------------------------
const Shelf = mongoose.model('Shelf', shelfSchema);

module.exports = Shelf;
