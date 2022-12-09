const mongoose = erquire('mongoose');
const slugify = require('slugify');

const universeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Un Universo debe de tener un nombre'],
      trim: true,
      lowercase: true,
    },
    slug: String,
    //TODO: sagas
    books: [{ type: mongoose.Schema.ObjectId, ref: 'Book' }],
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
  this.slug = slugify(this.name, { lower: true });
  next();
});
// --------------------------------------------- 3 - POPULATE ------------------------------
// --------------------------------------------- 0 - EXPORT --------------------------------
const Universe = mongoose.model('Universe', universeSchema);

module.exports = Universe;
