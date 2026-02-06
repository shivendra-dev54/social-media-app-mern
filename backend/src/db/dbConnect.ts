import mongoose from "mongoose";
import "dotenv/config"

const dbConnect = async () => {
    try{
        const connect = await mongoose.connect(process.env.DB_CONNECT_STRING || "");
        console.log("Connected to DB successfully");
    }
    catch(error){
        console.log("Unable to connect...");
        console.log(error);
    }
};

export default dbConnect;