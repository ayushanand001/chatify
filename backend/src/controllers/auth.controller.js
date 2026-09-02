import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import supabase from "../lib/supabase.js";

export const signup = async (req, res) => {
    try {
        const {fullName, email, password} = req.body;
        if(password.length < 6) {
            return res.status(400).json({message: "Password must be atleast 6 characters"});
        }

        const user = await User.findOne({email});
        if(user) return res.status(400).json({message: "Email already exists"});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword
        });

        if(newUser) {
            generateToken(newUser._id, res);
            const data = await newUser.save();
            const user1 = data.toObject();
            delete user1.password;
            res.status(201).json(user1);
        } else {
            res.status(400).json({message: "Invalid user data"});
        }
    } catch (err) {
        console.log("Error in signUp controller", err.message);
        res.status(500).json({message: "Internal server error"});
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        return res.status(400).json({message: "Email or password can't be empty"});
    }
    try {

        const user = await User.findOne({email});
        if(user) {
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if(!isPasswordCorrect) {
                return res.status(400).json({message: "Invalid credentials"});
            } 
            generateToken(user._id, res);
            const data = user.toObject();
            delete data.password;
            res.status(200).json(data);
        } else {
            return res.status(400).json({message: "Invalid credentials"});
        }
    } catch (err) {
        console.log("Error occured: ", err.message);
        res.status(500).json({message: "Internal server error"});
    }
}

export const logout = (req, res) => {
    try {
       res.cookie("jwt", "", {maxAge: 0});
       res.status(200).json({message: "Logged out successfully"}); 
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const updateProfile = async (req, res) => { 
    
    try { 
    
        const { profilePic } = req.body; // base64 string from frontend 
        const userId = req.user._id; 
    
        if (!profilePic) 
        { 
            return res.status(400).json({ message: "profile pic not provided" }); 
        } 
        
        const base64Data = profilePic.replace(/^data:image\/\w+;base64,/, ''); 
        const buffer = Buffer.from(base64Data, 'base64'); 
        const fileName = `${userId}.png`; 
        
        const { error: uploadError } = await supabase.storage.from('profile-pics').upload(fileName, buffer, { 
            contentType: 'image/png', upsert: true // overwrite if it already exists 
        }); 
        
        if (uploadError) throw uploadError; 
        
        const { data: urlData } = supabase.storage.from('profile-pics').getPublicUrl(fileName); 
        
        const updatedUser = await User.findByIdAndUpdate( userId, { profilePic: `${urlData.publicUrl}?t=${Date.now()}` }, { new: true } ).select("-password"); 
        res.status(200).json(updatedUser); 
    
    } catch (error) { 
        console.log("FULL ERROR:", error); 
        res.status(500).json({ message: "Internal server error" }); 
    } 
};


export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.meesage);
        res.status(500).json({message: "Internal server error"});
    }
}
