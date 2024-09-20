import mongoose, {Schema} from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String, // Cloudinary URL
        required: true
    },
    coverImage: {
        type: String, // Cloudinary URL
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Video'
        }
    ],
    password: {
        type: String,
        requiredPaths: [true, "Password is required"]
    },
    refreshToken: {
        type: String
    }
}, 
{
    timestamps: true //createdAt and updatedAt
})

export const User = mongoose.model("User", userSchema)