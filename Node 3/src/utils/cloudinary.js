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
const uploadOnCloudinary = async (localFilePath, replaceURL) => {
    try {
        if(!localFilePath) return null
        
        // upload the file in cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            folder: "Node 3",
            resource_type: "auto"
        })
        
        console.log("\nFile is uploaded on cloudinary", response.url);
        fs.unlinkSync(localFilePath)

        if(replaceURL){
            cloudinary.uploader.destroy(`Node 203/${replaceURL.split("Node%203/")[1].split(".")[0]}`, (error, result) => {
                if(error){
                    console.log("A problem when deleting image")
                }else{
                    console.log('Image deleted successfully', result)
                }
            })
        }
        // console.log(`Node 203/${replaceURL.split("Node%203/")[1].split(".")[0]}`)

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