const util = require('util');
const multer = require('multer');
const maxSize = 2 * 1024 * 1024;

// TODO: If works, change to memory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + '/public/images/');
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, file.originalname);
  },
});

const uploadFile = multer({
  storage,
  limits: { fileSize: maxSize },
}).single('image');

// util.promisify permite usar el middleware con async/await
const uploadMiddleware = util.promisify(uploadFile);

module.exports = uploadMiddleware;
