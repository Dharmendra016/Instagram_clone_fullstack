import {post} from "../models/post.model.js"
import { user } from "../models/user.model.js";
import {comment} from "../models/comment.model.js"
import sharp from "sharp"
import cloudinary from "cloudinary"

export const addNewPost = async (req , res) => {
    try {
        const { caption } = req.body; 
        const image = req.file;
        const authorId = req.userId;

        console.log(caption , image , authorId);
        if( !image){
            return res.status(401).json({
                message:"image required",
            })
        }

        //image upload 
        const optimizedImage = await sharp(image.buffer).resize({width:800 , height:800 , fit:'inside'})
        .toFormat('jpeg',{quality:80})
        .toBuffer();


        const fileUri = `data:image/jpeg;base64,${optimizedImage.toString('base64')}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri);

        const Post = await post.create({
            caption, 
            image:cloudResponse.secure_url,
            author:authorId, 
        })

        const User =await user.findById(authorId);

        if( !User ){
            return res.status(402).json({
                message:"User not found",
            })
        }

        User.posts.push(Post._id);
        await User.save();

        await Post.populate({path:'author' , select:'-password'});

        return res.status(201).json({
            message:"new post added",
            post,
            success:true,
        })

    } catch (error) {
        console.log(error);
    }
}

export const getAllPost = async (req , res )=>{
   try {

    const Post = await post.find().sort({createdAt:-1})
    .populate({path:'author' , select:'username , profilePic'})
    .populate({
        path:'comments' , 
        sort:{createdAt:-1},
        populate:{
            path:'author',
            select:'username , profilePic',
        }
    })

    return res.status(200).json({
        Post , 
        success:true,
    })

   } catch (error) {
    console.log(error);
   }
}

export const getUserPosts =  async (req , res) => {
    try {
        
        const authorId = req.userId; 
        const Posts = await post.find({author:authorId}).sort({createdAt:-1}).populate({
            path:'author',
            select:'username, profilePic',
        }).populate({
            path:'comments',
            sort:{createdAt:-1},
            populate:{
                path:'author',
                select:'username, profilePic',
            }
        });

        return res.status(200).json({
            Posts,
            success:true,
        })

    } catch (error) {
        console.log(error);
    }

}

export const likePost = async (req, res) => {

    try {
        const liker = req.userId; 
        const postId = req.params.id;
        const Post = await post.findById(postId); 

        if( !Post ){
            return res.status(401).json({
                message:'post not found',
            })
        }

        await post.updateOne({$addToSet:{likes:liker}});
        await post.save(); 

        //implement socket io for real time notification 

        return res.status(200).json({
            message:'Post liked',
            success:true
        })

    } catch (error) {
        console.log(error);
    }

}

export const disLikePost = async (req, res) => {

    try {
        const disLiker = req.userId; 
        const postId = req.params.id;
        const Post = await post.findById(postId); 

        if( !Post ){
            return res.status(401).json({
                message:'post not found',
            })
        }

        await post.updateOne({$pull:{likes:liker}});
        await post.save(); 

        //implement socket io for real time notification 

        return res.status(200).json({
            message:'Post disliked',
            success:true
        })

    } catch (error) {
        console.log(error);
    }

}

export const addCommnet = async(req,res) => {

    try {
        
        const {text} = req.body; 
        const postId = req.params.id; 
        const authorId = req.userId; 
        
        const Post = await post.findById(postId) ; 

        if( !Post ){
            return res.status(400).json({
                message:'post not found', 
                success:false,
            })
        }

        if( !text ){
            return res.status(401).json({
                message:'comment not written',
                success:false,
            })
        } 

        const Comment = await comment.create({
            text , 
            author:authorId,
            post:Post,
        }).populate({
            path:'author',
            select:"username, profilePic",
        })

        Post.comments.push(Comment._id);
        await Post.save();

        return res.status(200).json({
            success:ture,
            message:"comment successfully Added",
        })

    } catch (error) {
        console.log(error);
    }
}


export const getAllComments = async (req, res) => {

    try {
        
        const postId = req.params.id; 

        const comments = await comment.find({postId}).populate('author' , 'username , profilePic');

        if( !comments ) {
            return res.status(404).json({
                message:"no comment is found for this post",
                success:false,
            })
        }

        return res.status(200).josn({
            comments,
            succes:true,
            message:'get all the message',
        });

    } catch (error) {
        console.log(error);
    }

}

export const deletePost = async (req, res) => {

    try {
        const postId = req.params.id;
        const authorId = req.userId; 

        const Post = await post.findById(postId) ; 

        if( !Post ) return res.status(400).json({
            message:'Post not found',
            success:false,
        })

        //check if the auther is the post author

        if( Post.author.toString() !== authorId ) {
            return res.status(401).json({
                message:"You are the wrong the user",
                success:false,
            })
        }

        await post.findOneAndDelete({postId});

        let User = await user.findById({authorId})
        User.posts = User.posts.fileter(id =>id.toString()!==postId);
        await User.save();

        //delete all comments 
        await comment.deleteMany({post:postId});

        return res.status(200).json({
            success:true,
            message:"post deleted",
        })


    } catch (error) {
        console.log(error);
    }
}


export const bookmarkPost = async (req, res) => {
    try {
        
        const postId = req.params.id; 
        const authorId = req.userId ;

        const Post = await post.findById(postId);
        if(!Post ){
            return res.status(400).json({
                message:'post not found',
                success:false,
            })
        }

        const User = await user.findById(authorId); 

        if( User.bookmark.includes(postId)){
            //already in the bookmark --> remove it 
            await User.updateOne({$pull:{bookmark:post._id}});
            await User.save();
            return res.status(200).json({
                message:'Unbookmark',
                success:true,
            })
        }else{
            await User.updatOne({$addToSet:{bookmark:post._id}});
            await User.save();
            return res.status(200).json({
                message:'bookmarked',
                success:true,
            })
        }

    } catch (error) {
        console.log(error);
    }
}