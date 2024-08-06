import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();

const dbconnect = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongodb connected successfully.");
    }catch(err){
        console.log(err.message);
        return 
    }
  
}

export default dbconnect; 