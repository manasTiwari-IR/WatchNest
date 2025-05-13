import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      // array of strings
      type:[String],
      required: true,
      default: [],
    },
    coverimage: {
      // array of strings
      type:[String],
      required: true,
      default: [],
    },
    password: {
      type: String,
      required: [true, "Password is required"], // custom error message sent to frontend/client
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    refreshToken: {
      type: String,
    },
    // createdAt:{
    //     type: Date,
    //     default: Date.now
    // },
    // updatedAt:{
    //     type: Date,
    //     default: Date.now
    // }
    // OR
  },
  { timestamps: true } // createdAt and updatedAt fields will be added automatically
);

//pre - before saving the user to the database
userSchema.pre("save", async function (next) {
  //hash the password before saving the user to the database
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateRefreshToken = function () {
  // long lived token
  // data , secret, expiry
  return jwt.sign(
    { //payload
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateAccessToken = function () {
  // short lived token
  // data , secret, expiry
  return jwt.sign(
    { //payload
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
