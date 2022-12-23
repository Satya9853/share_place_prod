const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  title: { type: String, required: [true, "Please provide the title"] },

  description: { type: String, required: [true, "Please provide the description"], minlength: 5 },

  image: {
    originalname: { type: String, required: [true, "Please provide the original name"] },
    url: { type: String, required: [true, "Please provide the Image"] },
    public_id: { type: String, required: [true, "Please provide the public_id from cloudinary"] },
    signature: { type: String, required: [true, "Please provide signature from cloudinary"] },
  },

  address: { type: String, required: [true, "Please provide the address"] },

  location: {
    lat: { type: Number, required: [true, "Please provide the lat of the place"] },
    lng: { type: Number, required: [true, "Please provide the lng of the place"] },
  },

  creator: { type: mongoose.Types.ObjectId, required: [true, "Please provide the creator"], ref: "User" },
});

module.exports = mongoose.model("Place", placeSchema);
