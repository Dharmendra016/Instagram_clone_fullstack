import express, { urlencoded } from "express"
import cookieParser from "cookie-parser";
import cors from "cors"
import dotenv from "dotenv";
import dbconnect from "./utils/dbConnect.js"
import userRoute from "./routes/user.route.js";
dotenv.config();

const app = express(); 

const PORT = process.env.PORT || 3000;

//middlewares
app.use(express.json()); 
app.use(urlencoded({extended:true}))
app.use(cookieParser());

const corsOptions = {
    origin:"http://localhost:5173",
    credentials:true
}
app.use(cors(corsOptions))

//api routes 
app.use("/api/v1/user" , userRoute)

app.get("/" , (req, res) => {
    res.send("Hello world");
})

//db connect 
dbconnect();

app.listen(PORT , ()=>{
    console.log(`Server started at port no: ${PORT}`);
})