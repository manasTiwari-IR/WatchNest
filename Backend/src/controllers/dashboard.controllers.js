import mongoose from "mongoose";
import { Video } from "../models/video.models.js";
import { Subscription } from "../models/subscription.models.js";
import { Like } from "../models/like.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  try {
    const subscribers = await Subscription.aggregate([
      { $match: { channel: new mongoose.Types.ObjectId(user._id) } },
      { $count: "subscribers" },
    ]);

    const totalSubscribers = subscribers.length > 0 ? subscribers[0].subscribers : 0;

    const views = await Video.aggregate([
      { $match: { owner: new mongoose.Types.ObjectId(user._id) } },
      { $group: { _id: null, views: { $sum: "$views" } } },
    ]);

    const totalViews = views.length > 0 ? views[0].views : 0;

    const likes = await Like.aggregate([
      { $match: { likedBy: new mongoose.Types.ObjectId(user._id) } },
      // count video likes only
      { $match: { video: { $exists: true } } },
      { $count: "likes" },
    ]);

    const totalLikes = likes.length > 0 ? likes[0].likes : 0;

    return res.json(
      new ApiResponse(
        200,
        { totalLikes , totalSubscribers, totalViews },
        "Channel stats fetched successfully"
      )
    );
  } catch (error) {
    console.log("Error in getChannelStats: ", error);
    console.log(error.code);
    throw new ApiError(500, error.message);
  }
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  try {
    const videos = await Video.aggregate([
      {
        $match: { owner: new mongoose.Types.ObjectId(user._id) },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "video",
          as: "likes",
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "channel",
          foreignField: "subscriber",
          as: "subscribers",
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          thumbnail: 1,
          videoFile: 1,
          views: 1,
          createdAt: 1,
          likes: { $size: "$likes" }, // $size - returns the number of elements in the array
          subscribers: { $size: "$subscribers" },
        },
      },
    ]);
    if (!videos) {
      throw new ApiError(404, "No videos found");
    }
    return res.json(
      new ApiResponse(200, videos, "Videos fetched successfully")
    );
  } catch (error) {
    console.log("Error in getChannelVideos: ", error);
    throw new ApiError(500, error.message);
  }
});

export { getChannelStats, getChannelVideos };
