import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.models.js";
import { Subscription } from "../models/subscription.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  try {
    let { channelId } = req.params;
    // TODO: toggle subscription
    if (!isValidObjectId(channelId)) {
      throw new ApiError(400, "Invalid channelId");
    }
    channelId = new mongoose.Types.ObjectId(channelId);

    const user = req.user;
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    const subscriber = await User.findById(user._id).select(
      "-password -refreshToken -watchHistory"
    );
    if (!subscriber) {
      throw new ApiError(404, "Subscriber not found");
    }
    const channel = await User.findById(channelId).select(
      "-password -refreshToken -watchHistory"
    );
    if (!channel) {
      throw new ApiError(404, "Channel not found");
    }
    const subscription = await Subscription.findOne({
      subscriber: subscriber._id,
      channel: channel._id,
    });

    if (subscription) {
      await Subscription.findByIdAndDelete(subscription._id);
      return res.json(new ApiResponse(200, null, "Successfully unsubscribed"));
    } else {
      const newSubscription = new Subscription({
        subscriber: subscriber._id,
        channel: channel._id,
      });
      await newSubscription.save();
      res.json(
        new ApiResponse(200, newSubscription, "Successfully subscribed")
      );
    }
  } catch (error) {
    console.error("Error in toggleSubscription: ", error);
    throw new ApiError(500, "Could not toggle subscription",error);
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channelId");
  }
  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  if (user._id.toString() !== channelId.toString()) {
    throw new ApiError(403, "Forbidden");
  }

  try {
    const channel = await User.findById(channelId).select(
      "-password -refreshToken -watchHistory"
    );
    if (!channel) {
      throw new ApiError(404, "Channel not found");
    }
    // const subscribers = await Subscription.find({ channel: channel._id })
    //   .populate("subscriber", "fullname username email avatar")
    //   .select("subscriber");

    const SubscribersCount = await Subscription.countDocuments({
      channel: channel._id,
    });
    // if (!subscribers) {
    //   throw new ApiError(404, "No subscribers found");
    // }
    return res.json(
      new ApiResponse(
        200,
        { SubscribersCount },
        {
          message: "Subscribers found",
          success: true,
        }
      )
    );
  } catch (error) {
    console.error("Error in getUserChannelSubscribers: ", error);
    throw new ApiError(500, "Could not get subscribers");
  }
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid subscriberId");
  }
  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }
  if (user._id.toString() !== subscriberId.toString()) {
    throw new ApiError(403, "Forbidden");
  }
  try {
    const subscriber = await User.findById(subscriberId).select(
      "-password -refreshToken -watchHistory"
    );
    if (!subscriber) {
      throw new ApiError(404, "Subscriber not found");
    }
    const subscribedChannels = await Subscription.find({
      subscriber: subscriber._id,
    })
      .populate("channel", "fullname username avatar _id")
      .select("channel");

    // If no channels are subscribed, return an empty array
    return res.json(
      new ApiResponse(
        200,
        { subscribedChannels },
        {
          message: "Subscribed channels found",
          success: true,
        }
      )
    );
  } catch (error) {
    console.error("Error in getSubscribedChannels: ", error);
    throw new ApiError(500, "Could not get subscribed channels");
  }
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
