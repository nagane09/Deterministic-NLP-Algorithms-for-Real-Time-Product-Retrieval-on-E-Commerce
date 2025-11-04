import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing details" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


//Login User

export const login = async (req, res) => {
    try {

        const{email, password}=req.body;
        if(!email || !password){
            return res.json({success:false, message:"Email and Password are required"});
        }

        const user = await User.findOne({email});
        if(!user){
            return res.json({success:false, message:"Invalid Email and Password"});
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.json({success:false, message:"Invalid Email and Password"});
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || "secretkey",
            { expiresIn: "7d" }
        );

        // ✅ Send token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // ✅ Return success response
        return res.status(201).json({
            success: true,
            user: {
                name: user.name,
                email: user.email,
            },
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message });
 
    }
}


export const isAuth=async(req,res)=>{
  try {
    const userId = req.userId;
    const user=await User.findById(userId).select("-password")
    return res.json({success:true, user})
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
 
  }
}

//logout user
export const logout=async(req,res)=>{
  try {
    res.cookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({success:true,message:"Logged Out"})
  } catch (error) {
    console.log(error.message);
    res.json({success:false,message:error.message});
  }
}