const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const { validationResult } = require("express-validator");
const { cloudinaryUpload, cloudinaryDelete } = require("../util/cloudinary");

const { BadRequestError, NotFoundError, CustomApiError } = require("../errors/index");
const getCoordsForAddress = require("../util/location");
const PlaceModel = require("../model/places-schema");
const UserModel = require("../model/users-schema");

exports.getPlaceByID = async (req, res, next) => {
  const placeID = req.params.placeID;

  const place = await PlaceModel.findById(placeID);

  if (!place) throw new NotFoundError(`No place was found with placeID ${placeID}`);

  res.status(StatusCodes.OK).json({ place: place.toObject({ getters: true }) });
};

exports.getPlacesByUserID = async (req, res, next) => {
  const userID = req.params.userID;

  const user = await UserModel.findById(userID);

  if (!user) throw new NotFoundError(`No user was found with userID ${userID}`);

  let places = await PlaceModel.find({ creator: userID });

  places = places.map((place) => place.toObject({ getters: true }));
  res.status(StatusCodes.OK).json({ places: places });
};

exports.createPlace = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) throw new BadRequestError("Invalid inputs passed, please check your data");

  const { address } = req.body;

  const userID = req.user._id;

  // sending image sto cloudinary
  const result = await cloudinaryUpload((buffer = req.file.buffer), (image_type = "places"));

  if (!result) throw new Error();

  // updating images in body
  req.body.image = {
    originalname: req.file.originalname,
    url: result.secure_url,
    public_id: result.public_id,
    signature: result.signature,
  };

  const user = await UserModel.findById(userID);
  if (!user) throw new NotFoundError("User Not Found ");

  // if we dont get any result for location coordinates recieves a badrequest object
  const coordinates = await getCoordsForAddress(address);
  if (coordinates instanceof BadRequestError) throw coordinates;

  const newPlace = {
    ...req.body,
    location: coordinates,
    creator: userID,
  };

  ///  setting a transaction session which will roll back if any of the task fails
  const transaction_session = await mongoose.startSession();
  transaction_session.startTransaction();
  const createdPlace = await PlaceModel.create([newPlace], { session: transaction_session });
  await user.updateOne({ $push: { places: createdPlace } }, { session: transaction_session });
  transaction_session.commitTransaction(); /// here transaction ends

  if (!createdPlace) {
    // delete the image created in cloudinary
    response = await cloudinaryDelete(result.public_id);
    if (response instanceof Error) throw response;
    throw new Error();
  }

  res.status(StatusCodes.CREATED).json({ place: createdPlace });
};

exports.updatePlaceByID = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) throw new BadRequestError("Invalid inputs passed, please check your data");

  const { title, description } = req.body;
  const placeID = req.params.placeID;
  const userID = req.user._id;
  const updatedPlace = await PlaceModel.findOneAndUpdate(
    { _id: placeID, creator: userID },
    { title: title, description: description },
    { new: true, runValidators: true }
  );

  if (!updatedPlace) throw new NotFoundError(`No place was found with placeID :${placeID}`);

  res.status(StatusCodes.OK).json({ place: updatedPlace.toObject({ getters: true }) });
};

exports.deletePlaceByID = async (req, res, next) => {
  const placeID = req.params.placeID;
  const userID = req.user._id;

  //  setting a transaction session which will roll back is any of the task fails
  const transaction_session = await mongoose.startSession();
  transaction_session.startTransaction();
  const deletedPlace = await PlaceModel.findOneAndRemove({ _id: placeID, creator: userID }, { session: transaction_session }).populate("creator");
  if (!deletedPlace) throw new NotFoundError(`No place was found with placeID :${placeID}`);
  // deleting image from upload folder
  response = await cloudinaryDelete(deletedPlace.image.public_id);
  if (response instanceof Error) throw response;
  await deletedPlace.creator.places.pull(deletedPlace);
  await deletedPlace.creator.save({ session: transaction_session });
  await transaction_session.commitTransaction();

  res.status(StatusCodes.OK).json({ message: "Place Delete Successfully" });
};
