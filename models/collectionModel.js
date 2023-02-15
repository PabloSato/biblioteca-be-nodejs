const mongoose = require('mongoose');
const slugify = require('slugify');
const setUpName = require('../utils/setUpName');

const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Una Colección debe de tener un nombre'],
      trim: true,
      unique: true,
      lowercase: true,
      maxlength: [250, 'Un nombre no puede tener más de 250 caracteres'],
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
collectionSchema.pre('save', function (next) {
  const tmp_name = setUpName(this.name);
  this.slug = slugify(tmp_name, { lower: true });
  next();
});
// --------------------------------------------- 3 - POPULATE ------------------------------
// --------------------------------------------- 0 - EXPORT --------------------------------
const Colection = mongoose.model('Collection', collectionSchema);
module.exports = Colection;
