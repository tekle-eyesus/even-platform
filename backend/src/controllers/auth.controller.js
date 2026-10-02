const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const User = require("../models/UserModel");
const { OAuth2Client } = require("google-auth-library");
const crypto = require("crypto");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateAccessAndRefreshTokens = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

// @desc    Register a new user
// @route   POST /api/v1/auth/register
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password, role } = req.body;

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const user = await User.create({
    fullName,
    email,
    password,
    username: username.toLowerCase(),
    role: role || "reader",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

// @desc    Login user
// @route   POST /api/v1/auth/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "Username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged In Successfully",
      ),
    );
});

const createGoogleUsername = async (email) => {
  const base =
    email
      .split("@")[0]
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "_")
      .replace(/^\d+/, "user")
      .slice(0, 24) || "user";

  let username = base;
  let suffix = 1;
  while (await User.exists({ username })) {
    username = `${base.slice(0, 24 - String(suffix).length)}${suffix}`;
    suffix += 1;
  }
  return username;
};

// @desc    Login or register with Google
// @route   POST /api/v1/auth/google
const googleLogin = asyncHandler(async (req, res) => {
  const { credential } = req.body;

  if (!credential || !process.env.GOOGLE_CLIENT_ID) {
    throw new ApiError(400, "Google authentication is not configured");
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch (error) {
    throw new ApiError(401, "Invalid Google credential");
  }

  if (!payload?.sub || !payload.email || payload.email_verified !== true) {
    throw new ApiError(401, "Google account email is not verified");
  }

  let user = await User.findOne({
    $or: [{ googleId: payload.sub }, { email: payload.email.toLowerCase() }],
  });

  if (!user) {
    user = await User.create({
      googleId: payload.sub,
      fullName: payload.name || payload.email.split("@")[0],
      email: payload.email.toLowerCase(),
      username: await createGoogleUsername(payload.email),
      password: crypto.randomBytes(32).toString("hex"),
      avatar: payload.picture || undefined,
      role: "reader",
    });
  } else if (!user.googleId) {
    user.googleId = payload.sub;
    if (payload.picture && user.avatar?.includes("stock.adobe.com")) {
      user.avatar = payload.picture;
    }
    await user.save({ validateBeforeSave: false });
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "Google login successful",
      ),
    );
});

// @desc    Logout user
// @route   POST /api/v1/auth/logout
const logoutUser = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

module.exports = { registerUser, loginUser, googleLogin, logoutUser };
