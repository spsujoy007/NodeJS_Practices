import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler( async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        // console.log("token: ", token || 'token nai')
    
        if (!token){
            throw new ApiError(401, "unauthorized request")
        }
    
        const decodedInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedInfo?._id).select("-password -refreshToken")
        if(!user){
            throw new ApiError(401, "Invalid access token")
        }
    
        req.user = user
        next()
        
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})