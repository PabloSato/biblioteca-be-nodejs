const sharp = require('sharp');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const { uploadImage } = require('./../middleware/upload');

exports.uploadImage = async (req, res) => {
  try {
    await uploadImage(req, res);

    if (req.file == 'undefined') {
      return res.status(400).send({ message: 'Please upload an image' });
    }

    req.file.filename = `${crypto.randomUUID()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(600, 900)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/images/${req.file.filename}`);

    res.status(200).send({
      image: req.file.filename,
      message: `Uploaded the image successfully: ${req.file.filename}`,
    });
  } catch (err) {
    if (err.code == 'LIMIT_FILE_SIZE') {
      return res.status(500).send({
        message: 'Image size cannot be larger than 2MB!',
      });
    }

    res.status(500).send({
      message: `Could not upload the image: ${req.file.originalname}. ${err}`,
    });
  }
};

exports.getImage = (req, res) => {
  const { name } = req.params;
  res.sendFile(`${__basedir}/public/images/${name}`);
};

exports.deleteImage = (req, res) => {
  const { name } = req.params;
  if (!name || name == '' || name.length == 0) {
    return res
      .status(400)
      .send({ message: "Please send an image's name to delete" });
  }
  const image = name.trim();
  if (image.length == 0) {
    return res
      .status(400)
      .send({ message: "Please send an image's name to delete" });
  }
  const del_image = path.join(__basedir, 'public', 'images', image);
  let statusCode = 204;
  let status = 'success';
  let message = 'OK delete image';
  if (fs.existsSync(del_image)) {
    fs.unlink(del_image, (err) => {
      if (err) {
        console.error(err);
        status = 'failed';
        statusCode = err.statusCode || 500;
        message = `Can't delete image ${image}`;
      }
    });
  }
  res.status(statusCode).json({
    status: status,
    data: null,
    message: message,
  });
};
