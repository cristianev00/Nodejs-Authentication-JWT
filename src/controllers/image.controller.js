const upload = require('../middlewares/imageUploadMiddleware');

exports.uploadImage = (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      res.status(400).json({ message: err.message });
    } else {
      const file = req.file;
      if (!file) {
        res.status(400).json({ message: 'No file uploaded' });
      } else {
        res.json({ message: 'File uploaded successfully', file: file });
      }
    }
  });
};
