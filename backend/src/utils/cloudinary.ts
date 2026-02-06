import { v2 as cloudinary } from "cloudinary";
import * as fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

export const uploadOnCloudinary = async (localFilePath: string) => {
  if (!localFilePath) {
    return null;
  }
  try {
    const response = await cloudinary.uploader.upload(
      localFilePath,
      {
        resource_type: 'auto'
      }
    );
    fs.unlinkSync(localFilePath);
    return response;
  }
  catch (err) {
    fs.unlinkSync(localFilePath);
    if (err instanceof Error) {
      console.log(err.message);
    }
    else {
      console.log(err);
    }

    return null;
  }
}


export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await (cloudinary.uploader.destroy(publicId));
    console.log(`Deleted from cloudinary: ${result}`);
    return result;
  }
  catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    }
    else {
      console.log(err);
    }
    return null;
  }
}