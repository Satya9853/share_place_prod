const { StatusCodes } = require("http-status-codes");

const UserModel = require("../model/users-schema");
const { BadRequestError, NotFoundError, CustomApiError, UnauthenticatedError } = require("../errors/index");

exports.getUsers = async (req, res, next) => {
  let users = await UserModel.find({}).select("-password");

  if (!users) throw new NotFoundError("Currently there are no users");

  users = users.map((user) => user.toObject({ getters: true }));

  res.status(StatusCodes.OK).json({ users });
};

exports.userSignup = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name) throw new BadRequestError("Please Provide the name");
  if (!email) throw new BadRequestError("Please Provide the email");
  if (!password) throw new BadRequestError("Please Provide the password");

  // modifying the image file
  req.body.image = req.file.path;
  const user = await UserModel.create({ ...req.body });

  const token = await user.createJWT();

  res.status(StatusCodes.CREATED).json({ user: { name: user.name, email: user.email, id: user._id }, token });
};

exports.userLogin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) throw new BadRequestError("Please provide email and password");

  const user = await UserModel.findOne({ email });

  if (!user) throw new UnauthenticatedError(`No user was fond with email: ${email}`);

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) throw new UnauthenticatedError("Incorrect Password");

  const token = await user.createJWT();

  res.status(StatusCodes.OK).json({ user: { name: user.name, email: user.email, id: user._id }, token });
};
