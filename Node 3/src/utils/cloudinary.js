import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'
import dotenv from 'dotenv';

// Load environment variables from your .env file
dotenv.config({
    path: '../.env'
});


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload an image
const uploadOnCloudinary = async (localFilePath, replace_id) => {
    console.log(replace_id || 'nai')
    try {
        if(!localFilePath) return null
        
        // upload the file in cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            folder: "Node 3",
            resource_type: "auto"
        })
        
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