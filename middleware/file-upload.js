const multer = require("multer");
const uuid = require("uuid").v1;

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

const fileNameFunction = (req, file, callback) => {
  const extension = MIME_TYPE_MAP[file.mimetype];
  callback(null, `${uuid()}.${extension}`); // creating filename dynamically
};

const destinationFunction = (req, file, callback) => {
  callback(null, `uploads/images`);
};

const fileFilterFunction = (req, file, callback) => {
  const isValid = !!MIME_TYPE_MAP[file.mimetype];
  let error = isValid ? null : new Error("Invalid mime type");
  callback(error, isValid);
};

const fileUpload = multer({
  limits: 500000,
  storage: multer.diskStorage({
    destination: destinationFunction,
    filename: fileNameFunction,
  }),
  fileFilter: fileFilterFunction,
});

module.exports = fileUpload;
