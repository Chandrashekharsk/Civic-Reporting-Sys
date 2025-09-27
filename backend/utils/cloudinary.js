import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";

// configure with your env vars
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
}); 

export const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "civic-reports", // organize uploads
    });
    return result.secure_url;
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    throw new Error("Image upload failed");
  }
};
