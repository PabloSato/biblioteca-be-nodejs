const mongoose = require('mongoose');
const slugify = require('slugify');

const Universe = require('./universeModel');

const sagaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Una Saga debe de tener un nombre'],
      trim: true,
      lowercase: true,
    },
    slug: String,
    universe: { type: mongoose.Schema.ObjectId, ref: 'Universe' },
    books: [{ type: mongoose.Schema.ObjectId, ref: 'Book' }],
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
  this.slug = slugify(this.name, { lower: true });
  next();
});
// -- INCLUDE --
sagaSchema.post('save', async function () {
  if (this.universe) {
    const universe = await Universe.findById(this.universe);
    universe.sagas.push(this);
    const updated = await Universe.findByIdAndUpdate(this.universe, universe, {
      new: true,
      runValidators: true,
    });
  }
});
// --------------------------------------------- 3 - POPULATE ------------------------------
// --------------------------------------------- 0 - EXPORT --------------------------------
const Saga = mongoose.model('Saga', sagaSchema);

module.exports = Saga;
