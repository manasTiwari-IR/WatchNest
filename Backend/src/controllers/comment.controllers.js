import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { Comment } from "../models/comment.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  try {
    const { videoId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      throw new ApiError(400, "Invalid video id");
    }
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }
    // pagination - page and limit
    // /api/videos/:videoId/comments?page=1&limit=10
    // const { page = 1, limit = 5 } = req.query;
    //   const skip = (page - 1) * limit;

    // using aggregate pipeline
    const comments = await Comment.aggregate([
      { $match: { video: new ObjectId(videoId) } },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        },
      },
      {
        $lookup: {
          from: "likes",
          let: { commentId: "$_id", userId: user._id }, // let operator to define variables
          pipeline: [
            {
              $match: {
                $expr: {
                  // use $expr to compare fields
                  $and: [
                    // use $and to combine conditions
                    { $eq: ["$comment", "$$commentId"] }, // match comment id
                    { $eq: ["$likedBy", "$$userId"] }, // match user id
                  ],
                },
              },
            },
            { $project: { _id: 1 } }, // only return the _id field
          ],
          as: "likesData", // alias for the result
        },
      },
      {
        $project: {
          _id: 1,
          content: 1,
          createdAt: 1,
          isLiked: { $gt: [{ $size: "$likesData" }, 0] }, // check if likesData array has any elements
          owner: {
            _id: 1,
            username: 1,
            fullname: 1,
            avatar: 1,
          },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    return res.json(
      new ApiResponse(200, comments, "Comments retrieved successfully")
    );
  } catch (error) {
    console.error("Error getting comments:", error);
    return new ApiError(500, "An error occurred while getting the comments");
  }
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  try {
    const { videoId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      throw new ApiError(400, "Invalid video id");
    }
    const { content } = req.body;
    if (!content) {
      throw new ApiError(400, "Comment content is required");
    }
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    const comment = await Comment.create({
      video: videoId,
      owner: user._id,
      content,
    });
    comment.save();
    return res.json(
      new ApiResponse(201, { comment }, "Comment added successfully")
    );
  } catch (error) {
    console.error("Error adding comment:", error);
    return new ApiError(500, "An error occurred while adding the comment");
  }
});
const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  let { commentId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, "Invalid comment id");
  }
  commentId =
    commentId instanceof ObjectId ? commentId : new ObjectId(commentId);

  const { content } = req.body;
  if (!content) {
    throw new ApiError(400, "Comment content is required");
  }
  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }
  try {
    await Comment.updateOne({ _id: commentId, owner: user._id }, { content });
    return res.json(new ApiResponse(200, null, "Comment updated successfully"));
  } catch (error) {
    console.error("Error updating comment:", error);
    return new ApiError(500, "An error occurred while updating the comment");
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  let { commentId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, "Invalid comment id");
  }
  commentId =
    commentId instanceof ObjectId ? commentId : new ObjectId(commentId);

  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  try {
    const cc = await Comment.deleteOne({ _id: commentId, owner: user._id });
    return res.json(new ApiResponse(200, cc, "Comment deleted successfully"));
  } catch (error) {
    console.error("Error deleting comment:", error);
    return new ApiError(500, "An error occurred while deleting the comment");
  }
});

export { getVideoComments, addComment, updateComment, deleteComment };
