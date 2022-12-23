require("dotenv").config();
const cloudinary = require("cloudinary").v2;
<<<<<<< HEAD
const streamifier = require("streamifier");
const sharp = require("sharp");
=======
>>>>>>> aaeeeb0e5964f7b1c50416c987fe3b7e5e529ec0

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

<<<<<<< HEAD
const cloudinaryUpload = async (buffer, image_type) => {
  const quality_amount = image_type === "avatar" ? 5 : 30;
=======
const { cloudinary } = require("../util/cloudinary");
const streamifier = require("streamifier");
const sharp = require("sharp");

const cloudinaryUpload = async (buffer, image_type) => {
  const quality_amount = image_type === "avatar" ? 10 : 40;
>>>>>>> aaeeeb0e5964f7b1c50416c987fe3b7e5e529ec0
  buffer = await sharp(buffer).webp({ quality: quality_amount }).toBuffer();
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream({ folder: "Images" }, (error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const cloudinaryDelete = async (public_id) => {
  cloudinary.uploader.destroy(public_id).then((error, response) => {
    if (error) return new Error();
    else return response;
  });
};

module.exports = { cloudinaryUpload, cloudinaryDelete };
