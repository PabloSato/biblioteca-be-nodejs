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
      maxLength: [950, 'Un argumento no debe ser mayor a 950 caracteres'],
    },
    compilation: {
      type: Boolean,
      default: false,
    },
    booksInside: {
      type: [String],
      trim: true,
      lowercase: true,
    },
    authors: [{ type: mongoose.Schema.ObjectId, ref: 'Author' }],
    tags: [{ type: mongoose.Schema.ObjectId, ref: 'Tag' }],
    universe: { type: mongoose.Schema.ObjectId, ref: 'Universe' },
    saga: { type: mongoose.Schema.ObjectId, ref: 'Saga' },
    number: Number,
    editions: [{ type: mongoose.Schema.ObjectId, ref: 'Edition' }],
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
  const combinated = this.name.toLowerCase().split(',');

  if (combinated.length > 1) {
    if (articles.includes(combinated[1].trim())) {
      const fix_name = `${combinated[1]} ${combinated[0]}`;
      this.slug = slugify(fix_name, { lower: true });
    }
  } else {
    this.slug = slugify(this.name, { lower: true });
  }
  if (!this.compilation) {
    this.booksInside = [];
  }
  next();
});
// -- INCLUDE --

// --------------------------------------------- 3 - POPULATE -------------------------------
bookSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'tags',
    select: 'name slug',
  })
    .populate({
      path: 'authors',
      select: 'name slug',
    })
    .populate({
      path: 'universe',
      select: 'name slug',
    })
    .populate({
      path: 'saga',
      select: 'name slug',
    })
    .populate({
      path: 'editions',
      select: 'name pages image version',
    });
  // @TODO: Populate
  next();
});
// --------------------------------------------- 0 - UTILS -----------------------------
const articles = [
  'al',
  'el',
  'il',
  'ol',
  'ul',
  'la',
  'le',
  'li',
  'lo',
  'lu',
  'a',
  'an',
  'the',
  'of',
  'de',
  'del',
  'las',
  'les',
  'lis',
  'los',
  'lus',
];
// --------------------------------------------- 0 - EXPORTAMOS -----------------------------
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
