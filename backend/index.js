import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/connectDB.js";
import authRouter from "./routes/auth.routes.js";
import userRoute from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import messageRoute from "./routes/message.route.js";
import {app, server} from "./socket/socket.js"

dotenv.config();

let PORT = process.env.PORT || 3000


app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin:"https://realtimechatapp-28vr.onrender.com",
    credentials:true
}))

app.use("/api/auth", authRouter)
app.use("/api/user", userRoute)
app.use("/api/message", messageRoute)



server.listen(PORT, ()=>{
    connectDB()
    console.log(`server is running is ${PORT} port`)
})
