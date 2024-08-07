import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv"
dotenv.config();

const cloudinaryConnect = async() =>{

    try{
        // Configuration
        cloudinary.config({ 
            cloud_name: process.env.CLOUD_NAME, 
            api_key:process.env.CLOUDINARY_KEY, 
            api_secret: process.env.CLOUDINARY_SECRET // Click 'View Credentials' below to copy your API secret
        });
    }catch(err){
        console.log(error.message);
    }
   
    
}

export default cloudinaryConnect; 

