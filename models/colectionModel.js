const mongoose = require('mongoose');
const slugify = require('slugify');

const colectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Una Colección debe de tener un nombre'],
      trim: true,
      unique: true,
      lowercase: true,
    },
    slug: String,
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
colectionSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// --------------------------------------------- 3 - POPULATE ------------------------------
// --------------------------------------------- 0 - EXPORT --------------------------------
const Colection = mongoose.model('Colection', colectionSchema);
module.exports = Colection;
