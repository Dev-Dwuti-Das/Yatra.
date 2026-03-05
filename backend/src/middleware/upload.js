const multer = require('multer');
const ApiError = require('../utils/apiError');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

function singleImage(fieldName = 'image') {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (!err) {
        return next();
      }
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new ApiError(400, 'Image size must be <= 5MB'));
      }
      return next(new ApiError(400, err.message));
    });
  };
}

module.exports = { singleImage };
