import jwt from "jsonwebtoken";
import User from "../models/user.model.js"

export const protectRoute = async (req, res, next) => {
    try {
        console.log("cookies recieved: ",req.cookies)
        const token = req.cookies.jwt;

        console.log("JWT received:", token ? "YES" : "NO");
        if(!token) {
            return res.status(401).json({message: "Unauthorized - No Token Provided"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if(!decoded) {
            return res.status(401).json({message: "Unauthorized - No Token Provided"});
        }
        console.log("Decoded JWT:", decoded);
        
        const user = await User.findById(decoded.userId).select("-password");

        if(!user) {
            return res.status(404).json({message: "user not found"});
        }

        req.user = user;
        next();

    } catch (error) {
        console.log("Error in protectRoute middelware: ", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}