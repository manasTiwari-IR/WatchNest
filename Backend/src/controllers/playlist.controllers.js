import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.models.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description, isPublic } = req.body;
  //TODO: create playlist
  if (!name || !description) {
    throw new ApiError(400, "Name and description are required");
  }
  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }
  try {
    const playlist = await Playlist.create({
      name,
      description,
      owner: user._id,
      isPublic: isPublic || false, // Default to false if not provided
    });
    console.log("Playlist created", playlist);
    return res.json(new ApiResponse(201, playlist, "Playlist created"));
  } catch (error) {
    console.log("Error creating playlist", error);
    throw new ApiError(500, "Error creating playlist");
  }
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //TODO: get user playlists
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }
  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }
  // some another user is trying to get another user's playlist
  // show only public playlists
  if (user._id.toString() !== userId) {
    try {
      const playlists = await Playlist.aggregate([
        {
          $match: {
            owner: new mongoose.Types.ObjectId(userId),
            isPublic: true, // Only public playlists
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            createdAt: 1,
            videoCount: { $size: "$videos" }, // Count of videos in the playlist
            isPublic: 1, // Include isPublic field
          },
        },
      ]);
      if (playlists.length == 0) {
        throw new ApiError(404, "No playlists found");
      }
      return res.json(new ApiResponse(200, playlists, "User playlists found"));
    } catch (error) {
      console.error("Error getting user playlists", error);
      throw new ApiError(500, error.message || "Error getting user playlists");
    }
  } else {
    try {
      const playlists = await Playlist.aggregate([
        {
          $match: {
            owner: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            createdAt: 1,
            videoCount: { $size: "$videos" }, // Count of videos in the playlist
            isPublic: 1, // Include isPublic field
          },
        },
      ]);

      if (playlists.length == 0) {
        throw new ApiError(404, "No playlists found");
      }
      return res.json(new ApiResponse(200, playlists, "User playlists found"));
    } catch (error) {
      console.error("Error getting user playlists", error);
      throw new ApiError(500, error.message || "Error getting user playlists");
    }
  }
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
  try {
    if (!isValidObjectId(playlistId)) {
      throw new ApiError(400, "Invalid playlist ID");
    }
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }
    if (
      playlist.isPublic === false &&
      playlist.owner.toString() !== user._id.toString()
    ) {
      throw new ApiError(403, "Forbidden: Playlist is private");
    }
    const data = await Playlist.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(playlistId),
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "videos",
          foreignField: "_id",
          as: "videos",
          pipeline: [
            {
              $project: {
                _id: 1,
                // videoFile: 0,
                thumbnail: 1,
                title: 1,
                // description: 0,
                duration: 1,
                views: 1,
                owner: 1,
                createdAt: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          videosId: 1,
          videos: 1,
        },
      },
    ]);
    // console.log("Playlist found", data);
    return res.json(new ApiResponse(200, data[0], "Playlist found"));
  } catch (error) {
    console.error("Error getting playlist by ID", error);
    throw new ApiError(500, error.message || "Error getting playlist by ID");
  }
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid playlist or video ID");
  }
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  try {
    const video = await Video.findById(videoId).select("-keys");
    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user._id.toString())
      throw new ApiError(403, "Forbidden");

    if (playlist.videos.includes(videoId))
      throw new ApiError(400, "Video already in playlist");

    playlist.videos.push(videoId); // Add video to playlist
    await playlist.save(); // Save updated playlist

    return res.json(new ApiResponse(200, playlist, "Video added to playlist"));
  } catch (error) {
    console.error("Error adding video to playlist", error);
    throw new ApiError(500, "Error adding video to playlist");
  }
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist
  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid playlist or video ID");
  }
  if (!req.user) throw new ApiError(401, "Unauthorized");

  try {
    const video = await Video.findById(videoId).select("-keys");
    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Forbidden");
    }

    if (!playlist.videos.includes(videoId)) {
      throw new ApiError(400, "Video not in playlist");
    }
    playlist.videos = playlist.videos.filter((v) => v.toString() !== videoId);
    await playlist.save();
    return res.json(
      new ApiResponse(200, playlist, "Video removed from playlist")
    );
  } catch (error) {
    console.error("Error removing video from playlist", error);
    throw new ApiError(500, "Error removing video from playlist");
  }
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist ID");
  }
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }
  try {
    const playlist = await Playlist.findById(playlistId).select("-videos");
    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }
    if (playlist.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Forbidden");
    }
    await Playlist.findByIdAndDelete(playlistId);
    return res.json(
      new ApiResponse(200, null, { message: "Playlist deleted", success: true })
    );
  } catch (error) {
    console.error("Error deleting playlist", error);
    throw new ApiError(500, "Error deleting playlist");
  }
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description, isPublic = false } = req.body;
  //TODO: update playlist
  try {
    if (!isValidObjectId(playlistId)) {
      throw new ApiError(400, "Invalid playlist ID");
    }
    // BIG BUG : isPublic is boolean, so it can be false and can cause error
    if (!name || !description) {
      throw new ApiError(400, "Name, description are required");
    }
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }
    if (typeof isPublic !== "boolean") {
      throw new ApiError(400, "isPublic must be a boolean");
    }
  } catch (error) {
    console.error("Error validating request", error);
    throw new ApiError(400, "Invalid request data", error);
  }
  try {
    const playlist = await Playlist.findById(playlistId).select("-videos");
    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }
    if (playlist.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Forbidden");
    }
    playlist.name = name;
    playlist.description = description;
    if (playlist.isPublic !== isPublic) {
      playlist.isPublic = isPublic; // Update visibility
    }
    await playlist.save(); // Save updated playlist
    return res.json(
      new ApiResponse(200, playlist, {
        message: "Playlist updated",
        success: true,
      })
    );
  } catch (error) {
    console.error("Error updating playlist", error);
    throw new ApiError(500, "Error updating playlist", error);
  }
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
