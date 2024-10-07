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

const removeFromCloudinary = async(public_id) => {
    if(!public_id) return

    // for removing old avatar when uploading new
    cloudinary.uploader.destroy(public_id, (error, result) => {
        if(error){
            console.log("A problem when deleting image")
        }else{
            console.log('Image deleted successfully', result)
        }
    })
}

export {removeFromCloudinary}