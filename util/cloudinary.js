require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const sharp = require("sharp");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

const cloudinaryUpload = async (buffer, image_type) => {
  const quality_amount = image_type === "avatar" ? 10 : 40;
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
