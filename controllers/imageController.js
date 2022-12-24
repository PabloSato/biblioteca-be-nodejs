const uploadFile = require('./../middleware/upload');

exports.uploadImage = async (req, res) => {
  try {
    await uploadFile(req, res);

    if (req.file == 'undefined') {
      return res.status(400).send({ message: 'Please upload an image' });
    }

    res.status(200).send({
      message: `Uploaded the image successfully: ${req.file.originalname}`,
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
