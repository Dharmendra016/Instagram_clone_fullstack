import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config();

const isAuthenticated = async (req , res , next) =>{
    try {

        const token = req.cookies.token; 
        console.log(token);
        if(!token){
            return res.status(401).json({
                message:"User not authenticated",
                success:false,
            })
        }
        const decode = await jwt.verify(token , process.env.SECRET_KEY);

        console.log(decode);
        if( !decode ){
            return res.status(401).json({
                message:"Invalid Token",
                success:false,
            })
        }

        req.userId = decode.UserId;
        console.log(req.userId);
        next();
    } catch (error) {
        console.log(error.message);
    }
}

export default isAuthenticated; 