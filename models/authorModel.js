const mongoose = require('mongoose');
const slugify = require('slugify');

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Un Autor debe de tener un nombre'],
      trim: true,
      unique: true,
      lowercase: true,
      minlength: [1, 'Un nombre debe de tener al menor un caracter'],
      maxlength: [100, 'Un nombre no puede tener más de 100 caracteres'],
    },
    alias: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: [50, 'Un alias no puede tener más de 50 caracteres'],
    },
    slug: String,
    bio: {
      type: String,
      default: this.slug,
      trim: true,
    },
    image: {
      type: String,
      default: 'default-author.jpeg',
    },
    books: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Book',
      },
    ],
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
authorSchema.index({ name: 'text' }, { default_language: 'none' });
// --------------------------------------------- 2 - MIDDLEWARE ----------------------------
authorSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// --------------------------------------------- 3 - POPULATE ------------------------------
// --------------------------------------------- 0 - EXPORT --------------------------------
const Author = mongoose.model('Author', authorSchema);

module.exports = Author;
