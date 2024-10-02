import { user } from "../models/user.model.js";
import dotenv from "dotenv";
import getDataUri from "../utils/datauri.js";
import cloudinary from "cloudinary";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import { post } from "../models/post.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js"

dotenv.config();

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log(username, email, password);
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Something is missing, please check again!",
                success: false,
            })
        }
        //checking if there was already accound of that email.
        const User = await user.findOne({ email });
        if (User) {
            return res.status(401).json({
                message: "Try different email",
                success: false,
            })
        }

        //creating new account 
        //before creating hassing the password
        const hashedPassword = await bcrypt.hash(password, 10)
        console.log(hashedPassword);
        await user.create({
            username,
            email,
            password: hashedPassword,
        })

        return res.status(200).json({
            message: "Successfully created new account",
            success: true,
        })


    } catch (err) {
        console.log(err.message);
    }
}

export const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Something is missing, please check again!",
                success: false,
            })
        }

        let User = await user.findOne({ email });
        if (!User) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, User.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        }

        const populatedPost = await Promise.all(
            User.posts.map(async (postId) => {
                const Post = await post.findById(postId);
                if (Post.author.equals(User._id)) {
                    return Post;
                }
                return null;
            })
        )
        const UserData = {
            _id: User._id,
            username: User.username,
            email: User.email,
            bio: User.bio,
            followers: User.followers,
            following: User.following,
            posts: populatedPost,
            profilePic: User.profilePic,
        }

        const token = await jwt.sign({ UserId: User._id }, process.env.SECRET_KEY, { expiresIn: "1d" });
        return res.cookie('token', token, { httpOnly: true, sameSite: "strict", maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
            message: `Welcome back ${User.username}`,
            success: true,
            UserData,
        })

    } catch (err) {
        console.log(err.message);
    }

}

export const logout = async (req, res) => {
    try {

        return res.cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully",
            success: true,
        })

    } catch (error) {
        console.log(error.message);
    }
}

export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let User = await user.findById(userId).populate({ path: 'posts', createdAt: -1 }).populate('bookmark');

        return res.status(200).json({
            User,
            success: true,
        })

    } catch (error) {
        console.log(error.message);
    }
}


export const editProfile = async (req, res) => {
    try {
        const UserId = req.userId;
        const { bio, gender } = req.body;
        const profilePic = req.file;

        console.log(bio, gender, profilePic);
        let cloudinaryResponse;


        if (profilePic) {
            const fileUri = getDataUri(profilePic);
            cloudinaryResponse = await cloudinary.uploader.upload(fileUri)
                .catch((error) => {
                    console.log(error);
                });
        }
        const User = await user.findById(UserId);
        if (!User) {
            return res.status(404).json({
                message: "user not found",
                success: false,
            })
        }

        if (bio) User.bio = bio;
        if (gender) User.gender = gender;
        if (profilePic) User.profilePic = cloudinaryResponse.secure_url;

        await User.save();

        return res.status(200).json({
            message: "profile updated",
            success: true,
            user: User,
        })

    } catch (error) {
        console.log(error.message);
    }
}


export const getSuggestedUsers = async (req, res) => {

    try {
        //find will find all user that is not equal to the req.id ,    select will give all the properties except passowrd as we "-" it . 
        const SuggestedUsers = await user.find({ _id: { $ne: req.userId } }).select("-password");

        if (!SuggestedUsers) {
            return res.status(400).json({
                message: "Currently do not have any users",
                success: false,
            })
        }

        return res.status(200).json({
            message: "Successfully found the users",
            success: true,
            users: SuggestedUsers,
        })
    } catch (error) {
        console.log(error.message);
    }
}

export const followOrUnfollow = async (req, res) => {

    try {

        const following = req.userId; // follow garne wala
        const follower = req.params.id; // jasko ma garne ho tesko 

        if (following === follower) {
            return res.status(400).json({
                message: "Can't follow/unfollow yourself ",
                success: false,
            })
        }

        const targetUser = await user.findById(follower);
        const User = await user.findById(following);

        if (!targetUser || !User) {
            return res.status(400).json({
                message: "User not found ",
                success: false,
            })
        }

        const isFollowing = User.following.includes(follower);

        if (isFollowing) {
            // unfollow logic
            await Promise.all([
                user.findByIdAndUpdate(following, { $pull: { following: follower } }),
                user.findByIdAndUpdate(follower, { $pull: { followers: following } }),
            ]);
            return res.status(200).json({
                message: "Unfollowed successfully",
                success: true,
            });
        } else {
            // follow logic
            await Promise.all([
                user.findByIdAndUpdate(following, { $push: { following: follower } }),
                user.findByIdAndUpdate(follower, { $push: { followers: following } }),
            ]);
            return res.status(200).json({
                message: "Followed successfully",
                success: true,
            });
        }
    } catch (error) {
        console.log(error.message);
    }

}