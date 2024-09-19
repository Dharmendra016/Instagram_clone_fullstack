import express, { urlencoded } from "express" ; 
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getMessage, sendMessage } from "../controllers/message.controller.js";

const router = express.Router() ; 
router.use(urlencoded({extended:true}))


router.post("/send/:id" , isAuthenticated , sendMessage )
router.get('/all/:id' , isAuthenticated , getMessage);

export default router ;