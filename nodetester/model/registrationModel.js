const mongoose = require('mongoose');
const {Schema} = mongoose

const registrationSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    pass: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model("User",  registrationSchema)