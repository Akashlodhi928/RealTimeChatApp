import jwt from "jsonwebtoken";

const genToken = (userId) => {
  // NOTE: use `userId` as the payload property and be consistent
  return jwt.sign( { id: userId }, process.env.SECRET_KEY, { expiresIn: "7d" });
};

export default genToken; 
