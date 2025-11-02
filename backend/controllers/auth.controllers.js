import genToken from "../config/token.js";
import User from "../modules/user.model.js";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt"



export const signUp = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    if (await User.findOne({ userName })) return res.status(400).json({ message: "Username exists" });
    if (await User.findOne({ email })) return res.status(400).json({ message: "Email exists" });
    if (password.length < 6) return res.status(400).json({ message: "Password must be 7 charecter" });

    const hashPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ userName, email, password: hashPassword });

    const token = genToken(user._id);

    // cookie options for dev (adjust for production)
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "None", // 'lax' allows cookie on top-level navigations (good for refresh)
      secure: true,   // set true in production (HTTPS)
      path: "/",
    });

    return res.status(201).json({ message: "User created", user });
  } catch (err) {
    console.error("Error in signup:", err);
    return res.status(500).json({ message: `Error in signup: ${err.message}` });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "All fields required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    const token = genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: true,
      path: "/",
    });

    return res.status(200).json({ message: "Login success", user });
  } catch (err) {
    console.error("Error in login:", err);
    return res.status(500).json({ message: `Error in login: ${err.message}` });
  }
};

export const logOut = async (req,res)=>{
    try {
        res.clearCookie("token")
        return res.status(200).json({message:"user is logOut"})
    } catch (error) {
        return res.status(500).json({message:`error in logout ${error}`})
        
    }
}
