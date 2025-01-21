import express from 'express';
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from 'cookie-parser';
import { connectDB } from './db/connect.db.js';
import userRoute from './routes/user.route.js';
import postRoute from './routes/post.route.js';
import messageRoute from './routes/message.route.js';
const app = express();

dotenv.config({});
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const corsOptions = {
    origin: "http://localhost:5157",
    credentials: true,
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));


const PORT = process.env.PORT || 4000
app.get("/",(req,res)=>{
    res.status(200).json({
        message:"The server is working"
    })
})

app.use("/api/v1/user",userRoute);
app.use("/api/v1/post",postRoute);
app.use("/api/v1/message",messageRoute);




connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is Running on Port ${PORT}`);
        
    })
})

