const mongoose = require('mongoose');
const slugify = require('slugify');

languageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Un lenguaje debe de tener un nombre'],
      trim: true,
      lowercase: true,
      unique: true,
      maxlength: [20, 'Un lenguage debe tener menos de 20 caracteres'],
      minlength: [3, 'Un lenguage debe de tener al menos 3 caracteres'],
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
// --------------------------------------------- 2 - MIDDLEWARE ---------------------------------
languageSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lowercase: true });
  next();
});
// --------------------------------------------- 3 - POPULATE ---------------------------------
// --------------------------------------------- 0 - EXPORT ---------------------------------
const Language = mongoose.model('Language', languageSchema);

module.exports = Language;
