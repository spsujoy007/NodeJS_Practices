import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'
import dotenv from 'dotenv';

// Load environment variables from your .env file
dotenv.config({
    path: "../.env"
});


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloud name:", process.env.CLOUDINARY_CLOUD_NAME)

// Upload an image
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null
        
        // upload the file in cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        
        // file has been uploaded successfuly
        console.log("\nFile is uploaded on cloudinary", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        console.log("Hited error - cloudinary.js:")
        fs.unlinkSync(localFilePath) // remove the locally saved temp file as the upload operation got failed
        return `nai ${null}`
    }
}

export {
    uploadOnCloudinary
}