import express, { urlencoded } from "express"
import cookieParser from "cookie-parser";
import cors from "cors"
import dotenv from "dotenv";
import dbconnect from "./utils/dbConnect.js"
import userRoute from "./routes/user.route.js";
import cloudinaryConnect from "./utils/cloudinary.js";
import postRoute from "./routes/post.route.js"
import messageRoute from "./routes/message.route.js"
import { app,httpServer} from "./socket/socket.js"
import path from "path"

dotenv.config();

const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();

//middlewares
app.use(express.json()); 
app.use(urlencoded({extended:false}))
app.use(cookieParser());

const corsOptions = {
    origin:process.env.URL,
    credentials:true
}
app.use(cors(corsOptions))
cloudinaryConnect();

//api routes 
app.use("/api/v1/user" , userRoute)
app.use("/api/v1/post" , postRoute)
app.use("/api/v1/message" , messageRoute)

app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req,res)=>{
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
})

//db connect 
dbconnect();

httpServer.listen(PORT , ()=>{
    console.log(`Server started at port no: ${PORT}`);
})