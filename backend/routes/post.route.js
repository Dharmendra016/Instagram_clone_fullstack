import express from "express" ; 
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import { addCommnet, addNewPost, bookmarkPost, deletePost, disLikePost, getAllComments, getAllPost, getUserPosts, likePost } from "../controllers/post.controller.js";

const router = express.Router() ; 

router.post('/addpost',isAuthenticated, upload.single('image') , addNewPost); 
router.get('/allpost',isAuthenticated,getAllPost); 
router.get('/userpost/all',isAuthenticated, getUserPosts); 
router.get('/:id/like',isAuthenticated, likePost); 
router.get('/:id/dislike',isAuthenticated, disLikePost); 
router.post('/:id/comment',isAuthenticated, addCommnet); 
router.get('/:id/comment/all',isAuthenticated, getAllComments); 
router.post('/delete/all',isAuthenticated, deletePost); 
router.post('/:id/bookmark',isAuthenticated, bookmarkPost); 

export default router ;