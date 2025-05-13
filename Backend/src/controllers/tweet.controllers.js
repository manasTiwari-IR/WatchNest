import mongoose, { isValidObjectId } from "mongoose";
import { ObjectId } from "mongodb";
import { Tweet } from "../models/tweet.models.js";
// import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //create tweet
  const { content } = req.body;

  // error handling
  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }
  const user = req.user;
  try {
    // Create tweet
    const tweet = await Tweet.create({
      content,
      owner: user._id,
    });
    console.log("tweet", tweet);
    // Respond with the created tweet
    return res
      .status(201)
      .json(new ApiResponse(201, tweet, "Tweet created successfully"));
  } catch (error) {
    // Error handling: Handle potential database errors
    console.log("Error occured in Tweet creation : ", error);
    throw new ApiError(500, "Failed to create tweet");
  }
});

const getUserTweets = asyncHandler(async (req, res) => {
  // get user tweets
  try {
    const user = req.user;
    const userId = typeof user._id === 'string' ? new ObjectId(user._id) : user._id;
    if (!user) {
      throw new ApiError(401, "User not authenticated");
    }
    // const tweets = await Tweet.findOne({ owner: req.user._id }).select(
    //   "-owner"
    // );

    const tweets = await Tweet.aggregate([
      {
        $group: {
          _id: "$owner",
          Tweets: {
            $push: "$content",
          },
        },
      },
      {
        $match: {
          _id: userId,
        },
      },
    ]);
    
    console.log("tweets", tweets);
    return res
      .status(200)
      .json(new ApiResponse(200, tweets[0]?.Tweets || [] , "User tweets fetched"));
  } catch (error) {
    console.log("Error occured in fetching user tweets : ", error);
    throw new ApiError(500, "Failed to fetch user tweets");
  }
});

const updateTweet = asyncHandler(async (req, res) => {
  // update tweet
  const { content } = req.body;
  const user = req.user;
  if (!user) {
    throw new ApiError(401, "User not authenticated");
  }

  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  const tweetId = req.params.id;
  // endpoint: /api/tweets/:id
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet id");
  }

  try {
    const tweet = await Tweet.findOneAndUpdate(
      { _id: tweetId, owner: user._id },
      { content },
      { new: true }
    ).select("-owner");

    if (!tweet) {
      throw new ApiError(404, "Tweet not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, tweet, "Tweet updated successfully"));
  } catch (error) {
    console.log("Error occured in updating tweet : ", error);
    throw new ApiError(500, "Failed to update tweet");
  }
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const user = req.user;
  const tweetId = req.params.id;
  if (!user) {
    throw new ApiError(401, "User not authenticated");
  }
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet id");
  }
  try {
    const tweet = await Tweet.findOneAndDelete(
      { _id: tweetId, owner: user._id },
      { select: "-owner" }
    );
    if (!tweet) {
      throw new ApiError(404, "Tweet not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, tweet, "Tweet deleted successfully"));
  } catch (error) {
    console.log("Error occured in deleting tweet : ", error);
    throw new ApiError(500, "Failed to delete tweet");
  }
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
