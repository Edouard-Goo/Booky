import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

export const isLogged = (req, res, next) => {
  let authToken = req.headers.authorization;
  let token = authToken && authToken.split(" ")[1];

  

  if (!token) {
    return res.json({ message: "you're disconnected" });
  }
  

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        } else {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    req.userId = decoded.id;
    next();
});

};
export const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.userId);

  if (!user) {
    return res.json({ message: "no user found by that ID" });
  }
  if (user.role !== "Admin") {
    return res.json({
      message: " you have to be admin to do that ",
    });
  }
  next();
  return(res.json({message: "you are ADMIN !"}));
};
