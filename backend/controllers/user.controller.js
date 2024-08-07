import {user} from "../models/user.model.js";
import dotenv from "dotenv"; 
dotenv.config();

export const register = async(req,res) =>{
    try {
        const {username , email , password} = req.body ; 

        if( !username || !email || !password){
            return res.status(400).json({
                message:"Something is missing, please check again!",
                success:false,
            })
        }
        //checking if there was already accound of that email.
        const User = await userModel.user.findOne({email});
        if(User){
            return res.status(401).json({
                message:"Try different email",
                success:false,
            })
        }

        //creating new account 
            //before creating hassing the password
        const hashedPassword = await bcrypt.hash(password , 10)
        await user.create({
            username , 
            email , 
            passowrd:hashedPassword,
        })

        return res.status(200).json({
            message:"Successfully created new account",
            success:true,
        })


    } catch (err) {
        console.log(err.message);
    }
}

export const login = async (req, res) => {

    try {

        const {email , password} = req.body; 

        if( !email || !password) {
            return res.status(400).json({
                message:"Something is missing, please check again!",
                success:false,
            })
        }

        let User = await user.findOne({email});
        if( !User ){
            return res.status(401).json({
                message:"Incorrect email or password",
                success:false,
            })
        }
        
        const isPasswordMatch = await bcrypt.compare(password , User.password);
        if( !isPasswordMatch ){
            return res.status(401).json({
                message:"Incorrect email or password",
                success:false,
            });
        }

        const UserData = {
            _id:User._id,
            username:User.username , 
            email:User.email,
            profilePic:User.profilePic , 
            bio:User.bio, 
            followers:User.followers,
            following:User.following, 
            posts:User.posts,
        }

        const token = await jwt.sign({UserId:User_id} , process.env.SECRET_KEY , {expireIn:"1d"}); 
        return res.cookie ('token' , token , {httpOnly:true, sameSite:"strict", maxAge:1*24*60*60*1000}).json({
            message:`Welcome back ${User.username}`,
            success:true,
            UserData,
        })       

    } catch (err) {
        console.log(err.message);
    }

}

export const logout = async (req , res)=>{
    try {
        
        return res.cookie("token" , "" , {maxAge:0}).json({
            message:"Logged out successfully",
            success:true,
        })

    } catch (error) {
        console.log(error.message);
    }
}

export const getProfile = async (req , res) => {
    try {
        const userId = req.params.id; 
        let User =  await user.findById(userId); 

        return res.status(200).json({
            User, 
            success:true,
        })
        
    } catch (error) {
        console.log(error.message);
    }
}


export const exitProfile = async (req ,res) => {
    try {
        const UserId = req.userId; 
        const {bio , gender} = req.body ; 
        const profilePic = req.file; 

        let cloudinaryResponse ; 

        if( profilePic ){
            
        }
        
    } catch (error) {
        console.log(error.message);
    }
}