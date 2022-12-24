const util = require('util');
const multer = require('multer');

const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

const maxSize = 2 * 1024 * 1024;

// TODO: If works, change to memory
const storage = multer.memoryStorage();

const config = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false);
  }
};

const upload = multer({
  storage,
  fileFilter: config,
  limits: { fileSize: maxSize },
});

// util.promisify permite usar el middleware con async/await
const uploadImage = util.promisify(upload.single('image'));

const formData = () => upload.none();

module.exports = { uploadImage, formData };
