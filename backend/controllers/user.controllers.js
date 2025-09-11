import upLoadOnCloudinary from "../config/cloudinary.js";
import User from "../modules/user.model.js"


export const getCurrentUser = async(req, res)=>{
   try {
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(user);
  } catch (err) {
    console.error("Error in getCurrentUser:", err);
    return res.status(500).json({ message: "Server error" });
  }
}


export const editProfile = async (req, res)=>{
  try {
    let {name} = req.body;
    let image
    if(req.file){
      image = await upLoadOnCloudinary(req.file.path)
    }

    let user = await User.findByIdAndUpdate(req.userId, {
      name,
      image
    },{new:true})

    if(!user){
      return res.status(400).json({message:"user not found"})
    }

    return res.status(200).json(user)
  } catch (error) {
    return res.status(500).json({message:`error in editProfile ${err}`})
  }
}


export const getOtherUsers = async(req, res)=>{
  try {
    let users = await User.find({
      _id:{$ne:req.userId}
    }).select("-password")

    return res.status(200).json(users)
  } catch (error) {
    return res.status(500).json({message:`get other user error" ${err}`})
  }
}

export const search = async (req,res)=>{
  try {
    let { query } = req.query
    if(!query){
      return res.status(400).json({message:"queary is required"})
    }

    let users = await User.find({
      $or:[
        {name:{$regex:query,$options:"i"}},
        {userName:{$regex:query,$options:"i"}}

      ]
    })
    return res.status(200).json(users)
  } catch (error) {
      return res.status(400).json({message:`error in seach user ${error}`})
  }
}

