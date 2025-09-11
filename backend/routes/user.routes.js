import express from "express"
import { editProfile, getCurrentUser, getOtherUsers, search } from "../controllers/user.controllers.js";
import isAuth from "../midllerware/isAuth.js";
import { upload } from "../midllerware/multer.js";


const userRoute = express.Router();

userRoute.get("/current",isAuth, getCurrentUser)
userRoute.get("/others", isAuth ,getOtherUsers)
userRoute.put("/profile", isAuth, upload.single("image") ,editProfile)
userRoute.get("/search", isAuth ,search)



export default userRoute