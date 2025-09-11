import express from "express"
import isAuth from "../midllerware/isAuth.js";
import { upload } from "../midllerware/multer.js";
import { getMessage, sendMessage } from "../controllers/message.controllers.js";


const messageRoute = express.Router();

messageRoute.post("/send/:receiver",isAuth, upload.single("image"),sendMessage)
messageRoute.get("/get/:receiver",isAuth, getMessage)

export default messageRoute