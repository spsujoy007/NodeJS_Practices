import { Router } from "express";
import { 
    loggedOutUser, 
    loginUser, 
    registerUser, 
    refreshAccessToken, 
    updateAccountDetails, 
    changeCurrentPassword, 
    updateUserAvatar, 
    updateUserCoverImage, 
    getUserChannelProfile, 
    getUserWatchHistory } from '../controllers/user.controller.js'

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()
router.route("/register").post(upload.fields([
    {
        name: 'avatar',
        maxCount: 1
    },
    {
        name: 'coverImage',
        maxCount: 1
    }
]), registerUser)

router.route('/login').post(loginUser)

// secure routes
router.route('/logout').post( verifyJWT, loggedOutUser )
router.route('/refresh-token').post( refreshAccessToken )
router.route('/update-account').post( verifyJWT, updateAccountDetails )
router.route('/change-password').post( verifyJWT, changeCurrentPassword )
router.route('/update-avatar').patch(verifyJWT, upload.single('avatar'), updateUserAvatar)
router.route('/update-coverimage').patch(verifyJWT, upload.single('coverImage'), updateUserCoverImage)
router.route('/channel/:username').get(verifyJWT, getUserChannelProfile)
router.route('/watch-history').get(verifyJWT, getUserWatchHistory)

export default router