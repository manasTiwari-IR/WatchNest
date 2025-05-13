import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  // Check if videoId is a valid ObjectId
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const user = req.user;

  // Check if user is authenticated
  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  try {
    // Find if the like already exists
    const like = await Like.findOne({ video: videoId, likedBy: user._id });

    if (like) {
      // If like exists, remove it
      await Like.findByIdAndDelete(like._id);
      return res.json(
        new ApiResponse(200, null, "Like from video removed successfully")
      );
    } else {
      // If like does not exist, create it
      await Like.create({ video: videoId, likedBy: user._id });
      return res.json(new ApiResponse(200, null, "Video liked successfully"));
    }
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error toggling video like:", error);

    // Return a generic error message to the client
    throw new ApiError(500, "An error occurred while toggling the like");
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment id");
  }

  const user = req.user;

  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  const comment = await Like.findOne({ comment: commentId, likedBy: user._id });

  try {
    if (comment) {
      await Like.findByIdAndDelete(comment._id);
      return res.json(
        new ApiResponse(200, null, "Like from Comment removed successfully")
      );
    } else {
      await Like.create({ comment: commentId, likedBy: user._id });
      return res.json(new ApiResponse(200, null, "Comment liked successfully"));
    }
  } catch (error) {
    console.error("Error toggling comment like:", error);
    throw new ApiError(500, "An error occurred while toggling the like");
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet id");
  }

  const user = req.user;

  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  const tweet = await Like.findOne({ tweet: tweetId, likedBy: user._id });

  try {
    if (tweet) {
      await Like.findByIdAndDelete(tweet._id);
      return res.json(
        new ApiResponse(200, null, "Like from Tweet removed successfully")
      );
    } else {
      await Like.create({ tweet: tweetId, likedBy: user._id });
      return res.json(new ApiResponse(200, null, "Tweet liked successfully"));
    }
  } catch (error) {
    console.error("Error toggling tweet like:", error);
    throw new ApiError(500, "An error occurred while toggling the like");
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  try {
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    const likedVideos = await Like.aggregate([
      {
        $match: {
          likedBy: user._id,
          video: { $exists: true },
        },
      },
      {
        $group: {
          _id: null,
          videoIds: { $addToSet: "$video" },

          //  $addToSet is used to avoid duplicate videoIds
          // $push can also be used but it will add duplicate videoIds
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "videoIds",
          foreignField: "_id",
          as: "videos",
        },
      },
      {
        $project: {
          _id: 0,
          videoIds: 1,
          videos: {
            title: 1,
            description: 1,
            thumbnail: 1,
            createdAt: 1,
          },
        },
      },
    ]);

    if (!likedVideos || likedVideos.length === 0) {
      return res.json(new ApiResponse(200, [], "No liked videos found"));
    }
    console.log(likedVideos);
    return res.json(
      new ApiResponse(200, likedVideos, "Liked videos retrieved successfully")
    );
  } catch (error) {
    console.error("Error retrieving liked videos:", error);
    throw new ApiError(500, "An error occurred while retrieving liked videos");
  }
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
