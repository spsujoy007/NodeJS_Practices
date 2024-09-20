import mongoose from 'mongoose';
const { DB_NAME } = '../contants.js'

const connectDB = async() => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        // console.log(connectionInstance)
        console.log(`MONGODB CONNECTED!! DB HOST: ${connectionInstance.connection.host}`);
    }
    catch(error){
        console.log("MONGODB CONNECTION ERROR: ", error)
        process.exit(1)
    }
}

export default connectDB