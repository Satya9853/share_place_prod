const multer = require("multer");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

const fileFilterFunction = (req, file, callback) => {
  const isValid = !!MIME_TYPE_MAP[file.mimetype];
  let error = isValid ? null : new Error("Invalid mime type");
  callback(error, isValid);
};

const fileUpload = multer({
  limits: 500000,
  storage: multer.memoryStorage(),
  fileFilter: fileFilterFunction,
});

module.exports = fileUpload;
