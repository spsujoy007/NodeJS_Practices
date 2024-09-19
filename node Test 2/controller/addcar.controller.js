const Cars = require('../model/addcar.model')
const {User} = require('../model/makeUser')

const AddCarController = async(req, res) =>{
    const cardata = req.body;
    const newCar = new Cars(cardata)
    await User.updateOne({_id: newCar.author}, {$push: {cars: newCar._id}})
    await newCar.save()
    res.send(newCar)
}

const getCarsController = async(req, res) => {
    const query = req.query;
    const page = Number(query.page)
    const limit = Number(query.limit)
    const skip = (page - 1) * limit // to skip privious
    // console.log(page, limit);
    
    const searchText = req.params.search || ""
    const result = await Cars.find({
        $or: [
            {"name": {$regex: searchText, $options: 'i'}},
            {"brand": {$regex: searchText, $options: 'i'}},
            {"details": {$regex: searchText, $options: 'i'}}
        ]
    }).populate("author", "email -_id").skip(skip).limit(limit)

    res.send(result)
}

module.exports = {AddCarController, getCarsController}