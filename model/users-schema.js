require("dotenv").config();
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Please provide the username"] },

  email: {
    type: String,
    required: [true, "Please provide the email"],
    match: [
      /^("(?:[!#-\[\]-\u{10FFFF}]|\\[\t -\u{10FFFF}])*"|[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}](?:\.?[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}])*)@([!#-'*+\-/-9=?A-Z\^-\u{10FFFF}](?:\.?[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}])*|\[[!-Z\^-\u{10FFFF}]*\])$/u,
      "Please Provide a valid email",
    ],
    unique: true,
  },

  password: { type: String, required: [true, "Please provide the password"], minlength: 6 },

  image: {
    originalname: { type: String, required: [true, "Please provide the original name"] },
    url: { type: String, required: [true, "Please provide the Image"] },
    public_id: { type: String, required: [true, "Please provide the public_id from cloudinary"] },
    signature: { type: String, required: [true, "Please provide signature from cloudinary"] },
  },

  places: [{ type: mongoose.Types.ObjectId, required: [true, "Please provide the places"], ref: "Place" }],
});

userSchema.plugin(uniqueValidator);

userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

userSchema.methods.createJWT = async function () {
  return jwt.sign({ userID: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRES_IN });
};

module.exports = mongoose.model("User", userSchema);
