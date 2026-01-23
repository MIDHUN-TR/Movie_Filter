import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const MongoDb = async () => {
    try{
        mongoose.connect(MONGODB_URI as string)
        console.log("Connected to MongoDB")
    }
    catch(error){
        console.error(error)
    }
}

export default MongoDb;