import mongoose from "mongoose";

 export const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI,);
        console.log("MONGODB connected");
        
    }catch(error){
        console.log(error.message);
        
    }
}