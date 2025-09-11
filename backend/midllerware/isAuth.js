import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: "No token provided" });

    // verify with same secret
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // since your token has "id"
    req.userId = decoded.id;

    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default isAuth;
