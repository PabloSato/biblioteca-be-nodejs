const mongoose = require('mongoose');
const slugify = require('slugify');

const bookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Un libro debe de tener un Título'],
      trim: true,
      lowercase: true,
      minlength: [1, 'Un título debe de tener por lo menos 1 carácter'],
    },
    subtitle: {
      type: String,
      trim: true,
    },
    slug: String,
    argument: {
      type: String,
      default: this.slug,
      trim: true,
    },
    authors: [{ type: mongoose.Schema.ObjectId, ref: 'Author' }],
    tags: [{ type: mongoose.Schema.ObjectId, ref: 'Tag' }],
    image: String,
    pages: Number,
    universe: String,
    saga: String,
    number: Number,
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// --------------------------------------------- 1 - ORDER ---------------------------------
bookSchema.index({ slug: 1 });
bookSchema.index({ name: 1 });
bookSchema.index({ tags: 1 });
// --------------------------------------------- 2 - MIDDLEWARE -----------------------------
// -- SLUG --
bookSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// -- INCLUDE --
// bookSchema.post('save', async function () {
//   // @TODO: solo metemos libros sin saga a un universo
//   // @TODO: metemos en sagas sus libros
// });
// --------------------------------------------- 3 - POPULATE -------------------------------
bookSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'tags',
    select: 'name slug',
  }).populate({
    path: 'authors',
    select: 'name slug',
  });
  // @TODO: Populate
  next();
});
// --------------------------------------------- 0 - EXPORTAMOS -----------------------------
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
