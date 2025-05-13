import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import {ObjectId} from 'mongodb';

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    // small check for user exixted
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Generate access token
    const accessToken = user.generateAccessToken();
    // Generate refresh token
    const refreshToken = user.generateRefreshToken();
    // Save refresh token to database for long run
    User.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.error("Error while generating access and refresh token", error);
    throw new ApiError(500, "Error while generating access and refresh token");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;

  // Validation
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  //console.log("Email and Username", email, username);

  // $or is a mongodb operator
  // that performs a logical OR operation on an array of two or more <expressions> and selects the documents that satisfy at least one of the <expressions>.
  User.findOne({
    $or: [{ email }, { username }],
  }).then((user) => {
    if (user) {
      throw new ApiError(409, "User with email or username already exists");
    }
  });

  console.log("Data", req.body);
  console.warn("Files", req.files);
  // images are stored in req.files.avatar and req.files.coverImage
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath || !coverLocalPath) {
    throw new ApiError(400, "Avatar and cover image are required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverLocalPath);
  console.log("Avatar and CoverImage response", avatar, coverImage);

  try {
    const user = await User.create({
      fullname,
      email,
      username: username.toLowerCase(),
      password,
      avatar: [avatar?.secure_url, avatar?.public_id ] || [],
      coverimage: [coverImage?.secure_url, coverImage?.public_id] || [],
    });
    // Remove password and refreshToken fields from response
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(
        500,
        "Something went wrong while registering the user"
      );
    }

    console.log("User created successfully", createdUser);
    
    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User created successfully"));
  } catch (error) {
    console.log("User Creation failed", error);

    if (avatar) {
      await deleteFromCloudinary(avatar.public_id);
    }
    if (coverImage) {
      await deleteFromCloudinary(coverImage.public_id);
    }

    throw new ApiError(500, "Something went wrong, User not created");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  // Get email and password from request body
  const { username, email, password } = req.body;

  // Validation
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // Find user by email or username
  const user = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check if password is correct
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Generate access and refresh token
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  // Remove password and refreshToken fields from response
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // Send response with access token and user
  const options = {
    httpOnly: true, // cookie is not accessible via client side script
    secure: process.env.NODE_ENV === "production", // cookie will only be set on secure connections
    // sameSite: "none", // cookie will be sent in cross-origin
    // maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(new ApiResponse(200, loggedInUser, "User logged in successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incommeRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!incommeRefreshToken) {
    throw new ApiError(400, "Refresh token is required");
  }

  try {
    const decodedToken = jwt.verify(
      incommeRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    if (user?.refreshToken !== incommeRefreshToken) {
      throw new ApiError(401, "Invalid refresh token / expired refresh token");
    }

    const options = {
      httpOnly: true, // cookie is not accessible via client side script
      secure: process.env.NODE_ENV === "production", // cookie will only be set on secure connections
    };

    // Generate access token
    const { accessToken, NewRefreshToken } =
      user.generateAccessToken(user._id);

    return res
      .status(200)
      .cookie("refreshToken", NewRefreshToken, options)
      .cookie("accessToken", accessToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: NewRefreshToken,
          },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(
      401,
      error.message ||
      "Something went wrong while refreshing access token"
    );
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true, // return the updated document
    }
  );
  // $pull is a mongodb operator
  // that removes from an existing array all instances of a value or values that match a specified condition.
  // other operator in mongodb are $push, $addToSet, $pop, $pullAll, $each, $position, $slice, $sort, $bit, $isolated
  const options = {
    httpOnly: true, // cookie is not accessible via client side script
    secure: process.env.NODE_ENV === "production", // cookie will only be set on secure connections
  };

  return res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// CRUD operations
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  const isPasswordValid = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) {
    throw new ApiError(400, "Old password is incorrect");
  }

  user.password = newPassword;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user details"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullname, email } = req.body;

  if (!fullname) {
    throw new ApiError(400, "Fullname are required");
  }
  if (!email) {
    throw new ApiError(400, "Email are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullname,
        email: email,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  //console.log("Avatar Local Path", avatarLocalPath);

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const user1 = await User.findById(req.user._id).select("-password -refreshToken");
  //console.log("User1", user1);

  //console.log("Avatar id : ", user1?.avatar[1]);
  // delete the old avatar from cloudinary
  if (user1?.avatar[1]) {
    console.log("Deleting old avatar from cloudinary");
    await deleteFromCloudinary(user1?.avatar[1]);
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(500, "Something went wrong while uploading avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: [avatar?.secure_url, avatar.public_id],
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }
  
  const user1 = await User.findById(req.user._id).select("-password -refreshToken");

  // delete the old avatar from cloudinary
  if (user1?.coverimage[1]) {
    console.log("Deleting old cover Image from cloudinary");
    await deleteFromCloudinary(user1?.coverimage[1]);
  }


  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!coverImage) {
    throw new ApiError(500, "Something went wrong while uploading Cover Image");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        coverimage: [coverImage?.secure_url, coverImage.public_id],
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "CoverImage updated successfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username?.trim()) {
    throw new ApiError(400, "Username is required");
  }
// find by username
  const user = await User.aggregate([
    {
      $match: {
        username: String(username?.toLowerCase()),
      },
    },
    {
      $project: {
        username: 1,
        fullname: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ])
  // Aggregation pipeline
  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: { $size: "$subscribers" },
        channelsSubscribedToCount: { $size: "$subscribedTo" },
        isSubscribed: {
          $cond: {
            if: {
              $in: [req.user?._id, "$subscribers.subscriber"],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      // Project only the necessary data
      $project: {
        _id: 1,
        fullname: 1,
        username: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 1,
      },
    },
  ]);
  
  if(!user) {
    throw new ApiError(404, "User not found");
  }
  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }

  console.log("Channel", channel);
  console.log("User", user);

  return res
    .status(200)
    .json(new ApiResponse(200, {user}, "Channel profile details"));
});

 const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        // new mongoose.Types.ObjectId(req.user._id) is used to convert string to ObjectId
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory.video",
        foreignField: "_id",
        as: "watchHistory",
        // pipeline is used to project only the necessary fields
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "uploader",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullname: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: { $arrayElemAt: ["$owner", 0] },
            },
          },
        ],
      },
    },
  ]);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0]?.watchHistory,
        "Watch history fetched successfully"
      )
    );
});

export {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getCurrentUser,
  changeCurrentPassword,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
};
