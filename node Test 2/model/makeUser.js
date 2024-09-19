const mongoose = require('mongoose');
const {Schema} = mongoose

const CreateUser = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    phone: {
        type: Number,
        // unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cars: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Car'
        }
    ]
})

const User = mongoose.model("User", CreateUser)

const createPost = new Schema({
    title: {
        type: String,
        required: true
    },
    details:{
        type: String
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Post = mongoose.model("Post", createPost)

module.exports = {
    User,
    Post
}