import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {
  deleteFromCloudinary,
  deleteFromCloudinary_Video,
} from "../utils/cloudinary.js";

// FUTURE IMPROVEMENT: encrypt video file and thumbnail URL and key before saving to database and decrypt when fetching

const getAllUserVideos = asyncHandler(async (req, res) => {
  // Get query parameters
  // /videos/:username/:userid
  let { username, userId } = req.params;

  if (userId && !isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid userId value");
  } else {
    userId =
      userId instanceof mongoose.Types.ObjectId
        ? userId
        : new mongoose.Types.ObjectId(userId);

    const checkuser = await User.findById(userId);
    if (!checkuser) {
      throw new ApiError(404, "User not found");
    }
  }

  try {
    const videos = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "_id",
          foreignField: "owner",
          pipeline: [
            {
              $project: {
                _id: 1,
                title: 1,
                thumbnail: 1,
                duration: 1,
                createdAt: 1,
                views: 1,
              },
            },
          ],
          as: "videosdata",
        },
      },
      {
        $project: {
          videosdata: 1,
        },
      },
    ]);

    return res.json(
      new ApiResponse(200, { videos }, "Fetched videos successfully")
    );
  } catch (error) {
    console.error("Error in getAllVideos: ", error);
    throw new ApiError(500, "An error occurred while fetching videos");
  }
});

const getAllVideos = asyncHandler(async (req, res) => {
  // Get query parameters
  // http://localhost:8001/api/v1/videos?page=1&limit=10&sortBy=title&sortType=asc
  let { page = 1, limit = 10, sortBy, sortType } = req.query;

  if (page < 1 || limit < 1) {
    throw new ApiError(400, "Invalid page or limit value");
  }
  if (sortBy && !["title", "views", "createdAt"].includes(sortBy)) {
    throw new ApiError(400, "Invalid sortBy value");
  }
  if (sortType && !["asc", "desc"].includes(sortType)) {
    throw new ApiError(400, "Invalid sortType value");
  }
  // if (userId && !isValidObjectId(userId)) {
  //   throw new ApiError(400, "Invalid userId value");
  // } else {
  //   userId =
  //     userId instanceof mongoose.Types.ObjectId
  //       ? userId
  //       : new mongoose.Types.ObjectId(userId);

  //   const checkuser = await User.findById(userId);
  //   if (!checkuser) {
  //     throw new ApiError(404, "User not found");
  //   }
  // }

  // if (query && typeof query !== "string") {
  //   throw new ApiError(400, "Invalid query value");
  // }
  try {
    const skip = (page - 1) * limit;
    const videos = await Video.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          pipeline: [{ $project: { _id: 1, fullname: 1, avatar: 1 } }],
          as: "channel",
        },
      },
      {
        $unwind: { path: "$channel", preserveNullAndEmptyArrays: true },
      },
      {
        $sort: { [sortBy]: sortType === "desc" ? -1 : 1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit ? parseInt(limit) : 10,
      },
      {
        $group: {
          _id: null,
          totalVideos: { $sum: 1 },
          videos: {
            $push: {
              _id: "$_id",
              title: "$title",
              duration: "$duration",
              thumbnail: "$thumbnail",
              keys: "$keys",
              createdAt: "$createdAt",
              views: "$views",
              channel: "$channel",
            },
          },
        },
      },
      {
        $project: { videos: 1, totalVideos: 1, _id: 0 },
      },
    ]);

    return res.json(
      new ApiResponse(200, videos, "Fetched videos successfully")
    );
  } catch (error) {
    console.error("Error in getAllVideos: ", error);
    throw new ApiError(500, "An error occurred while fetching videos");
  }
});

const publishAVideo = asyncHandler(async (req, res) => {
  console.log("publishAVideo called");
  const { title, description } = req.body;
  // title = title?.trim();
  // description = description?.trim();
  console.log("Title:", title, "Description:", description);
  console.log("Files:", req.files);
  // TODO: get video, upload to cloudinary, create video
  const videoFile = req.files?.videoFile[0]?.path;
  const thumbnail = req.files?.thumbnail[0]?.path;

  if (!videoFile || !thumbnail) {
    throw new ApiError(400, "Video file and thumbnail are required");
  }

  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  const videoFileUrl = await uploadOnCloudinary(videoFile, "video");
  const thumbnailUrl = await uploadOnCloudinary(thumbnail, "image");

  if (!videoFileUrl || !thumbnailUrl) {
    throw new ApiError(500, "An error occurred while uploading video");
  }

  // console.log(videoFileUrl?.duration);
  //get duration
  const newVideo = new Video({
    title,
    description,
    videoFile: videoFileUrl?.secure_url,
    thumbnail: thumbnailUrl?.secure_url,
    keys: [videoFileUrl?.public_id, thumbnailUrl?.public_id] || [],
    owner: user._id,
    isPublished: true,
    duration: videoFileUrl?.duration || 0,
    views: 0,
  });
  console.log(newVideo);

  try {
    const savedVideo = await newVideo.save();
    if (!savedVideo) {
      throw new ApiError(500, "An error occurred while saving video");
    }

    return res.json(
      new ApiResponse(201, savedVideo, "Video published successfully")
    );
  } catch (error) {
    console.error("Error in publishAVideo: ", error);

    if (videoFileUrl) {
      await deleteFromCloudinary(videoFileUrl.public_id);
    }
    if (thumbnailUrl) {
      await deleteFromCloudinary(thumbnailUrl.public_id);
    }
    throw new ApiError(500, "An error occurred while publishing video");
  }
});

const getVideoById = asyncHandler(async (req, res) => {
  let { videoId } = req.params;

  // Validate videoId
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  // Convert videoId to ObjectId if necessary
  videoId =
    videoId instanceof mongoose.Types.ObjectId
      ? videoId
      : new mongoose.Types.ObjectId(videoId);

  try {
    // Find the video by ID
    const video = await Video.findById(videoId);
    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    // Aggregate to get video details along with owner information
    const data = await Video.aggregate([
      {
        $match: {
          _id: video._id,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        },
      },
      {
        $project: {
          _id: 0,
          "owner.username": 1,
          "owner.fullname": 1,
          "owner.createdAt": 1,
          "owner.updatedAt": 1,
          description: 1,
          videoFile: 1,
          title: 1,
        },
      },
    ]);

    // Check if data is found
    if (!data || data.length === 0) {
      throw new ApiError(404, "Video details not found");
    }

    // Return the video details
    return res.json(
      new ApiResponse(200, data[0], "Fetched video successfully")
    );
  } catch (error) {
    console.error("Error in getVideoById: ", error);
    throw new ApiError(500, "An error occurred while fetching the video");
  }
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
  try {
    if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid video id");
    }
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    const video = await Video.findById(videoId);
    if (!video) {
      throw new ApiError(404, "Video not found");
    }
    const { title, description } = req.body;
    const thumbnail = req.file?.path || undefined;
    if (thumbnail && (thumbnail !== "" || thumbnail !== null || thumbnail !== undefined)) {
      const thumbnailUrl = await uploadOnCloudinary(thumbnail, "image");
      if (!thumbnailUrl) {
        throw new ApiError(500, "An error occurred while uploading thumbnail");
      }

      // delete old thumbnail from cloudinary
      const deletethumbnail = await deleteFromCloudinary(video?.keys[1]);
      if (!deletethumbnail) {
        throw new ApiError(500, "An error occurred while deleting thumbnail");
      } else {
        console.log("Thumbnail deleted successfully from cloudinary");
      }

      // update thumbnail
      video.thumbnail = thumbnailUrl?.secure_url;
      video.keys[1] = thumbnailUrl?.public_id;
    }
    if (title) {
      video.title = title;
    }
    if (description) {
      video.description = description;
    }
    const updatedVideo = await video.save();
    if (!updatedVideo) {
      throw new ApiError(500, "An error occurred while updating video");
    }
    return res.json(
      new ApiResponse(200, updatedVideo, "Video updated successfully")
    );
  } catch (error) {
    console.error("Error in updateVideo: ", error);
    if (thumbnailUrl) {
      await deleteFromCloudinary(thumbnailUrl?.public_id);
    }
    throw new ApiError(500, "An error occurred while updating video", error);
  }
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }
  try {
    const video = await Video.findById(new mongoose.Types.ObjectId(videoId));
    if (!video) {
      throw new ApiError(404, "Video not found");
    }
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }
    // Check if the user is authorized to delete the video
    if (video.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You are not authorized to delete this video");
    }
    // delete video from cloudinary
    console.log("Deleting video from cloudinary");
    console.log("Video keys:", video?.keys);
    const deleteVideo = await deleteFromCloudinary_Video(video?.keys[0]);
    const deletethumbnail = await deleteFromCloudinary(video?.keys[1]);

    console.log("Delete Video Response:", deleteVideo);
    console.log("Delete Thumbnail Response:", deletethumbnail);

    if (
      !deleteVideo ||
      !deletethumbnail ||
      deleteVideo?.result !== "ok" ||
      deletethumbnail?.result !== "ok"
    ) {
      throw new ApiError(500, "An error occurred while deleting video");
    } else {
      console.log("Video deleted successfully from cloudinary");
    }

    await Video.deleteOne({ _id: video._id });

    return res.json(new ApiResponse(200, null, "Video deleted successfully"));
  } catch (error) {
    console.error("Error in deleteVideo: ", error);
    throw new ApiError(500, "An error occurred while deleting the video");
  }
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  try {
    const video = await Video.findById(videoId);
    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    video.isPublished = !video.isPublished;
    const updatedVideo = await video.save();

    return res.json(
      new ApiResponse(
        200,
        { isPublished: updatedVideo.isPublished },
        "Publish status updated successfully"
      )
    );
  } catch (error) {
    console.error("Error in togglePublishStatus: ", error);
    throw new ApiError(500, "An error occurred while updating publish status");
  }
});

export {
  getAllVideos,
  getAllUserVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
