const mongoose = require('mongoose')

const Schema = mongoose.Schema

const addNewCar = new Schema({
    name: String,
    brand: String,
    details: String,
    price: Number,
    car_model: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
})

const Car = mongoose.model("Car", addNewCar)

module.exports = Car