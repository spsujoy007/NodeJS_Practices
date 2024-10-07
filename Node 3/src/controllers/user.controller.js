import { asyncHandler } from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import { User } from '../models/user.models.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from "cloudinary";

// security
const options = {
    httpOnly: true,
    secure: true
}

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken

        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } 
    catch (error) {
        throw new ApiError(500, "Something went wrong when generating access and refresh token.")
    }
}

const registerUser = asyncHandler ( async (req, res) => {
    /*  get user details from frontend
        validation - not empty
        check if user already exists: username, email
        check for images, check for avatar
        upload them to cloudinary, avatar
        create a user object - create entry in db
        remove password and refresh token field from response
        check for user creation
        return res
    */
    const {fullName, username, email, password} = req.body

    if (
        [fullName, username, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All field is required.")
    }
    
    const existedUser = await User.findOne({
        $or: [ {email}, {username} ]
    })

    if(existedUser){
        throw new ApiError(409, "User with username or email already exist.")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    let coverImageLocalPath = req.files?.coverImage[0]?.path;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0]?.path
    }

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required - 1")
    }
    
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    
    if (!avatar) {
        throw new ApiError(400, "404 Avatar file is required - 2")
    }

    const user = await User.create({
        fullName,
        avatar: {
            url: avatar.url,
            public_id: avatar?.public_id
        },
        coverImage: coverImage?.url || "",
        username: username.toLowerCase(),
        password,
        email
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser) {
        throw new ApiError(500, "Something went wrong when registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfuly")
    )
})

const loginUser = asyncHandler ( async (req, res) => {
    /* 1. req.body data
    2. username or email, password
    3. find the user
    4. password check
    5. access and refresh-token
    6. send cookies */

    // step 1 - req.body data
    const {email , username, password} = req.body;
    
    // step 2 - username or email, password
    if(!(email || username)){
        throw new ApiError(400, "username or email is required")
    } 

    // step 3 - find the user
    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })

    // validation
    if (!existedUser) {
        throw new ApiError(404, "user dose not exist")
    }

    // step 4 - password check
    const isPasswordValid = await existedUser.isPasswordCorrect(password)

    // validation
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    // step 5 - access and refresh-token
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(existedUser._id)

    const loggedInUser = await User.findById(existedUser._id).select("-password -refreshToken")

    // step 6 - send cookies
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "user logged in successfully"
        )
    )
})

const loggedOutUser =  asyncHandler ( async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    res
    .status( 200 )
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out successfully"))
})

const refreshAccessToken = asyncHandler ( async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if(!incomingRefreshToken){
        throw new ApiError(401, "unauthorized request")
    }
    
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        
        const user = await User.findById(decodedToken?._id);
        if(!user){
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh token is expired or used")
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user?._id)
    
        res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler ( async (req, res) => {
    const {oldPassword, newPassword} = req.body;
    
    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword;
    await user.save({validateBeforeSave: false})

    res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const updateAccountDetails = asyncHandler ( async (req, res) => {
    const {fullName, email} = req.body;

    if(!(fullName || email)){
        throw new ApiError(400, "All fields are required!")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email
            }
        },
        {new: true}
    ).select("-password -refreshToken")

    res
    .status(200)
    .json(new ApiResponse(200, user, "Account details successfully updated"))

})

const updateUserAvatar = asyncHandler ( async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    
    if(!avatar){
        throw new ApiError(400, "Error while uploading avatar")
    }
    const olddata = await User.findById(req.user?._id).select("-password -refreshToken")
    
    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: {
                    url: avatar?.url,
                    public_id: avatar?.public_id
                }
            }
        },
        {
            new: true
        }
    ).select("-password -refreshToken")

    // for removing old avatar when uploading new
    if(olddata.avatar?.public_id !== null){
        cloudinary.uploader.destroy(olddata?.avatar?.public_id, (error, result) => {
            if(error){
                console.log("A problem when deleting image")
            }else{
                console.log('Image deleted successfully', result)
            }
        })
    }

    res
    .status(200)
    .json(new ApiResponse(200, {user: updatedUser}, "Avatar updated successfully"))
})

const updateUserCoverImage = asyncHandler ( async (req, res) => {
    const coverLocalPath = req.file?.path;

    if(!coverLocalPath) throw new ApiError(400, "Cover file is missing")

    const cover = await uploadOnCloudinary(coverLocalPath);
    
    if(!cover)throw new ApiError(400, "Error while uploading cover")
    
    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        { $set: { cover: cover.url } },
        { new: true }
    ).select("-password -refreshToken")

    res
    .status(200)
    .json(new ApiResponse(200, {user: updatedUser}, "Cover image updated successfully"))
})

export {registerUser, loginUser, loggedOutUser, refreshAccessToken, changeCurrentPassword, updateAccountDetails, updateUserAvatar, updateUserCoverImage}