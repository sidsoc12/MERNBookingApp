import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";
import cookieParser from "cookie-parser";
import cors from 'cors';
const app = express()
//Using "module" 

dotenv.config();

//middlewares
 
app.use(cors()) //Allows for client to request resources from this server


app.use(cookieParser());

app.use(express.json())
const connect = async () => {
    try {
      await mongoose.connect(process.env.MONGO);
      console.log("Connected to mongoDB.");
    } catch (error) {
      throw error;
    }
  };


app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);

//Error Handling Middleware
app.use((err,req,res,next)=> {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went Wrong";
  return res.status(errorStatus).json({success: false, status: errorStatus, message: errorMessage, stack: err.stack})
})

app.listen(8800, ()=> {
    connect()
    console.log("Starting Server")
})