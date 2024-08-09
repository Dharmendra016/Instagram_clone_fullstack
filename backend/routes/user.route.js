import express, { urlencoded } from "express" ; 
import { editProfile, followOrUnfollow, getProfile, getSuggestedUsers, login, logout, register } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";

const router = express.Router() ; 
router.use(urlencoded({extended:true}))

router.post("/register" , register) ; 
router.post("/login" , login) ; 
router.get("/logout" , logout) ; 
router.get("/:id/profile" , isAuthenticated , getProfile); 
router.post("/profile/edit",isAuthenticated , upload.single('profilePicture'), editProfile)
router.get("/suggested" , isAuthenticated , getSuggestedUsers) ; 
router.post("/followorunfollow/:id" , isAuthenticated , followOrUnfollow) 

export default router ;