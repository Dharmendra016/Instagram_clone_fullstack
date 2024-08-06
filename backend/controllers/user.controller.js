import {user} from "../models/user.model.js";

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

        
    } catch (err) {
        console.log(err.message);
    }

}