const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const User = require("../models/UserModel");

// @desc    Get current user profile
// @route   GET /api/v1/users/me
// @access  Protected
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken",
  );

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Current user fetched successfully"));
});

// @desc    Get any user profile by username (Public Profile)
// @route   GET /api/v1/users/p/:username
// @access  Public
const getUserProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username }).select(
    "-password -refreshToken",
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User profile fetched successfully"));
});

// @desc    Update account details (Bio, Name)
// @route   PATCH /api/v1/users/update-account
// @access  Protected
const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, bio, avatar } = req.body;

  if (!fullName && !bio && !avatar) {
    throw new ApiError(
      400,
      "At least one field (fullName, bio, or avatar) is required",
    );
  }

  const updateData = {};
  if (fullName) updateData.fullName = fullName;
  if (bio) updateData.bio = bio;
  if (avatar) updateData.avatar = avatar;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updateData },
    { new: true }, // Return updated doc
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

module.exports = { getCurrentUser, getUserProfile, updateAccountDetails };
