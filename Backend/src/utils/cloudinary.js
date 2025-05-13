import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// Configuration for cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload an image
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("Image Uplaod Done");
    //console.log("Uploaded image:", response.secure_url);
    //console.log("Public ID:", response.public_id);
    // once file is uploaded, delete the file from the local storage
    fs.unlinkSync(localFilePath); // delete the file
    return response;
  } catch (error) {
    console.log(error);
    fs.unlinkSync(localFilePath); // delete the file
    return null;
  }
};

// Optimize delivery by resizing and applying auto-format and auto-quality
const optimizeUrl = cloudinary.url("images", {
  fetch_format: "auto",
  quality: "auto",
});
//console.log(optimizeUrl);

// Transform the image: auto-crop to square aspect_ratio
const autoCropUrl = cloudinary.url("images", {
  crop: "auto",
  gravity: "auto",
  width: 500,
  height: 500,
});
//console.log(autoCropUrl);

const deleteFromCloudinary = async (publicId) => {
  try {
    const response = await cloudinary.uploader.destroy(publicId);
    //    console.log("Deleted image:", response.result);
    return response;
  } catch (error) {
    console.log("Error deleting image:", error);
    return null;
  }
};

export { uploadOnCloudinary, optimizeUrl, autoCropUrl, deleteFromCloudinary };
